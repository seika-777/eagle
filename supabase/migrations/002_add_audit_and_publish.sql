-- ============================================================
-- Reset: 全データ削除 + シーケンスリセット（001のseedデータをクリア）
-- ============================================================
TRUNCATE TABLE
  item_regulations,
  regulation_items,
  house_rule_items,
  prohibition_items,
  original_items,
  supplement_items,
  school_items,
  god_items,
  race_items
RESTART IDENTITY CASCADE;

-- ============================================================
-- Fix id columns: add auto-increment sequences (SERIAL相当)
-- ============================================================
CREATE SEQUENCE IF NOT EXISTS race_items_id_seq OWNED BY race_items.id;
ALTER TABLE race_items ALTER COLUMN id SET DEFAULT nextval('race_items_id_seq');

CREATE SEQUENCE IF NOT EXISTS god_items_id_seq OWNED BY god_items.id;
ALTER TABLE god_items ALTER COLUMN id SET DEFAULT nextval('god_items_id_seq');

CREATE SEQUENCE IF NOT EXISTS school_items_id_seq OWNED BY school_items.id;
ALTER TABLE school_items ALTER COLUMN id SET DEFAULT nextval('school_items_id_seq');

CREATE SEQUENCE IF NOT EXISTS supplement_items_id_seq OWNED BY supplement_items.id;
ALTER TABLE supplement_items ALTER COLUMN id SET DEFAULT nextval('supplement_items_id_seq');

CREATE SEQUENCE IF NOT EXISTS house_rule_items_id_seq OWNED BY house_rule_items.id;
ALTER TABLE house_rule_items ALTER COLUMN id SET DEFAULT nextval('house_rule_items_id_seq');

CREATE SEQUENCE IF NOT EXISTS prohibition_items_id_seq OWNED BY prohibition_items.id;
ALTER TABLE prohibition_items ALTER COLUMN id SET DEFAULT nextval('prohibition_items_id_seq');

CREATE SEQUENCE IF NOT EXISTS original_items_id_seq OWNED BY original_items.id;
ALTER TABLE original_items ALTER COLUMN id SET DEFAULT nextval('original_items_id_seq');

CREATE SEQUENCE IF NOT EXISTS regulation_items_id_seq OWNED BY regulation_items.id;
ALTER TABLE regulation_items ALTER COLUMN id SET DEFAULT nextval('regulation_items_id_seq');

-- ============================================================
-- user_meta table
-- ============================================================
CREATE TABLE user_meta (
  id           uuid        PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  user_id      text        UNIQUE NOT NULL,
  display_name text        NOT NULL,
  role         text        NOT NULL DEFAULT 'common',
  is_editable  boolean     NOT NULL DEFAULT false,
  created_at   timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT user_meta_role_check CHECK (role IN ('common', 'admin'))
);

ALTER TABLE user_meta ENABLE ROW LEVEL SECURITY;

-- 本人のみ参照可（Service Role はRLSバイパスのため INSERT/UPDATE ポリシー不要）
CREATE POLICY "user_meta_select" ON user_meta
  FOR SELECT USING (auth.uid() = id);

-- ============================================================
-- item_regulations: FK constraints + item_type CHECK
-- ============================================================
-- regulation_id → regulation_items（削除時に関連レコードを CASCADE DELETE）
ALTER TABLE item_regulations
  ADD CONSTRAINT fk_item_regulations_regulation
    FOREIGN KEY (regulation_id) REFERENCES regulation_items(id) ON DELETE CASCADE;

-- item_type の値を制限
ALTER TABLE item_regulations
  ADD CONSTRAINT item_regulations_item_type_check
    CHECK (item_type IN ('god', 'school', 'race', 'supplement'));

-- item_id の参照整合性（ポリモーフィックFKはSQLで直接表現不可のため、
-- 各親テーブル削除時に item_regulations を削除するトリガーで担保する）
CREATE OR REPLACE FUNCTION delete_item_regulations_on_item_delete()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  DELETE FROM item_regulations
    WHERE item_type = TG_ARGV[0] AND item_id = OLD.id;
  RETURN OLD;
END;
$$;

CREATE TRIGGER trg_god_items_delete
  AFTER DELETE ON god_items FOR EACH ROW
  EXECUTE FUNCTION delete_item_regulations_on_item_delete('god');

CREATE TRIGGER trg_school_items_delete
  AFTER DELETE ON school_items FOR EACH ROW
  EXECUTE FUNCTION delete_item_regulations_on_item_delete('school');

CREATE TRIGGER trg_race_items_delete
  AFTER DELETE ON race_items FOR EACH ROW
  EXECUTE FUNCTION delete_item_regulations_on_item_delete('race');

CREATE TRIGGER trg_supplement_items_delete
  AFTER DELETE ON supplement_items FOR EACH ROW
  EXECUTE FUNCTION delete_item_regulations_on_item_delete('supplement');

-- ============================================================
-- Add audit columns (updated_by, updated_at) to all item tables
-- ============================================================
ALTER TABLE race_items
  ADD COLUMN updated_by uuid REFERENCES auth.users(id),
  ADD COLUMN updated_at timestamptz;

ALTER TABLE god_items
  ADD COLUMN updated_by uuid REFERENCES auth.users(id),
  ADD COLUMN updated_at timestamptz;

ALTER TABLE school_items
  ADD COLUMN updated_by uuid REFERENCES auth.users(id),
  ADD COLUMN updated_at timestamptz;

ALTER TABLE supplement_items
  ADD COLUMN updated_by uuid REFERENCES auth.users(id),
  ADD COLUMN updated_at timestamptz;

ALTER TABLE house_rule_items
  ADD COLUMN updated_by uuid REFERENCES auth.users(id),
  ADD COLUMN updated_at timestamptz;

ALTER TABLE prohibition_items
  ADD COLUMN updated_by uuid REFERENCES auth.users(id),
  ADD COLUMN updated_at timestamptz;

ALTER TABLE original_items
  ADD COLUMN updated_by uuid REFERENCES auth.users(id),
  ADD COLUMN updated_at timestamptz;

-- Add audit columns + publish_type to regulation_items
ALTER TABLE regulation_items
  ADD COLUMN updated_by uuid REFERENCES auth.users(id),
  ADD COLUMN updated_at timestamptz,
  ADD COLUMN publish_type text NOT NULL DEFAULT 'draft';

ALTER TABLE regulation_items
  ADD CONSTRAINT regulation_items_publish_type_check
    CHECK (publish_type IN ('public', 'draft'));

-- ============================================================
-- house_rule_items: supplement_id FK
-- ============================================================
ALTER TABLE house_rule_items
  ADD CONSTRAINT fk_house_rule_items_supplement
    FOREIGN KEY (supplement_id) REFERENCES supplement_items(id) ON DELETE SET NULL;

-- ============================================================
-- regulation_items: RLS を publish_type = 'public' のみに限定
-- ============================================================
DROP POLICY "Public read" ON regulation_items;
CREATE POLICY "Published read" ON regulation_items
  FOR SELECT USING (publish_type = 'public');

-- ============================================================
-- item_regulations 同期用 RPC 関数
-- ============================================================
CREATE OR REPLACE FUNCTION sync_item_regulations(
  p_regulation_id  integer,
  p_god_ids        integer[],
  p_school_ids     integer[],
  p_race_ids       integer[],
  p_supplement_ids integer[]
) RETURNS void LANGUAGE plpgsql AS $$
BEGIN
  -- regulation_id に紐づく既存レコードを全削除
  DELETE FROM item_regulations WHERE regulation_id = p_regulation_id;

  -- 各タイプを INSERT（配列が空の場合は何もしない）
  INSERT INTO item_regulations (item_type, item_id, regulation_id)
  SELECT 'god', unnest(p_god_ids), p_regulation_id
  WHERE array_length(p_god_ids, 1) > 0;

  INSERT INTO item_regulations (item_type, item_id, regulation_id)
  SELECT 'school', unnest(p_school_ids), p_regulation_id
  WHERE array_length(p_school_ids, 1) > 0;

  INSERT INTO item_regulations (item_type, item_id, regulation_id)
  SELECT 'race', unnest(p_race_ids), p_regulation_id
  WHERE array_length(p_race_ids, 1) > 0;

  INSERT INTO item_regulations (item_type, item_id, regulation_id)
  SELECT 'supplement', unnest(p_supplement_ids), p_regulation_id
  WHERE array_length(p_supplement_ids, 1) > 0;
END;
$$;

-- ============================================================
-- is_always 変更時の item_regulations 自動クリーンアップトリガー
-- ============================================================
CREATE OR REPLACE FUNCTION cleanup_item_regulations_on_is_always_change()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  IF NEW.is_always = true AND OLD.is_always = false THEN
    DELETE FROM item_regulations
      WHERE item_type = TG_ARGV[0] AND item_id = NEW.id;
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_god_items_is_always
  AFTER UPDATE ON god_items FOR EACH ROW
  EXECUTE FUNCTION cleanup_item_regulations_on_is_always_change('god');

CREATE TRIGGER trg_school_items_is_always
  AFTER UPDATE ON school_items FOR EACH ROW
  EXECUTE FUNCTION cleanup_item_regulations_on_is_always_change('school');

CREATE TRIGGER trg_race_items_is_always
  AFTER UPDATE ON race_items FOR EACH ROW
  EXECUTE FUNCTION cleanup_item_regulations_on_is_always_change('race');

CREATE TRIGGER trg_supplement_items_is_always
  AFTER UPDATE ON supplement_items FOR EACH ROW
  EXECUTE FUNCTION cleanup_item_regulations_on_is_always_change('supplement');

-- ============================================================
-- パフォーマンス改善：インデックス追加
-- ============================================================

-- regulation_items: RLSポリシーで使用するpublish_typeにインデックス
CREATE INDEX IF NOT EXISTS idx_regulation_items_publish_type
  ON regulation_items(publish_type);

-- item_regulations: JOINで頻繁に使用するregulation_idにインデックス
CREATE INDEX IF NOT EXISTS idx_item_regulations_regulation_id
  ON item_regulations(regulation_id);

-- item_regulations: ポリモーフィック参照で使用するitem_type + item_idにインデックス
CREATE INDEX IF NOT EXISTS idx_item_regulations_item_type_id
  ON item_regulations(item_type, item_id);

-- house_rule_items: フィルタリングで使用するrule_typeにインデックス
CREATE INDEX IF NOT EXISTS idx_house_rule_items_rule_type
  ON house_rule_items(rule_type);

-- house_rule_items: supplement_itemsとのJOINで使用するsupplement_idにインデックス
CREATE INDEX IF NOT EXISTS idx_house_rule_items_supplement_id
  ON house_rule_items(supplement_id);

-- ============================================================
-- データ修正：level_cap_belt の空文字レコードを 'B' に更新
-- （CHECK制約追加前に既存の不正データを修正する）
-- ============================================================
UPDATE regulation_items
  SET level_cap_belt = 'B'
  WHERE level_cap_belt = '';

-- ============================================================
-- 制約追加：level_cap_belt は 'B' または 'C' のみ許可
-- ============================================================
ALTER TABLE regulation_items
  ADD CONSTRAINT regulation_items_level_cap_belt_check
    CHECK (level_cap_belt IN ('B', 'C'));
