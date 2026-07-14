-- ============================================================
-- 012_merge_prohibition_into_house_rule.sql
-- prohibition_items を house_rule_items に統合し、並び順カラムを追加する。
--   1. house_rule_items に is_prohibition カラムを追加する。
--      - 禁止事項かどうかは rule_type ではなく独立カラム is_prohibition で
--        持つ（禁止事項にもアイテム等の分類があるため、rule_type には
--        'prohibition' を入れず既存の分類値を使う）
--   2. prohibition_items の全行を house_rule_items へ移送する。
--      - is_prohibition = true
--      - rule_type      = 元 prohibition_items.id = 23（AI 使用禁止の行）
--                         のみ 'common'、それ以外は 'item'
--      - supplement_id  = NULL
--      - about          = prohibition_items.about（カテゴリ）
--      - description    = prohibition_items.name（禁止内容本文）
--      - updated_by / updated_at は元の値を引き継ぐ
--      - id は house_rule_items_id_seq から採番する
--        （002 で id の DEFAULT に nextval('house_rule_items_id_seq') を
--          設定済みのため、id を指定せず SELECT ... ORDER BY id で
--          元の prohibition_items.id 昇順に挿入して採番させる）
--   3. prohibition_items テーブルを DROP する。
--      - prohibition_items_id_seq は 002 で
--        OWNED BY prohibition_items.id として作成されているため、
--        テーブル DROP と同時に自動削除される
--      - RLS ポリシー（001 の "Public read"）もテーブル DROP と同時に
--        自動削除される
--   4. house_rule_items に並び順カラム sort_order を追加する。
--      - 並び順はグループ内で管理する。
--        - is_prohibition = false: rule_type ごとに1グループ
--        - is_prohibition = true : 全体で1グループ
--      - 表示時は各グループ内で sort_order ASC NULLS LAST, id ASC で並べる。
--      - 新規行は NULL のまま（= グループ末尾に表示される）。
--   5. 既存行（2. で移送した旧 prohibition 行を含む）の sort_order を
--      id でバックフィルする。
-- ============================================================

-- ------------------------------------------------------------
-- 1. is_prohibition カラム追加
-- ------------------------------------------------------------
ALTER TABLE house_rule_items ADD COLUMN is_prohibition boolean NOT NULL DEFAULT false;

-- ------------------------------------------------------------
-- 2. prohibition_items → house_rule_items データ移送
-- ------------------------------------------------------------
INSERT INTO house_rule_items (rule_type, supplement_id, about, description, updated_by, updated_at, is_prohibition)
SELECT
  CASE WHEN id = 23 THEN 'common' ELSE 'item' END,
  NULL,
  about,
  name,
  updated_by,
  updated_at,
  true
FROM prohibition_items
ORDER BY id;

-- ------------------------------------------------------------
-- 3. prohibition_items テーブル削除
--    （OWNED BY の prohibition_items_id_seq・RLS ポリシーも同時に削除される）
-- ------------------------------------------------------------
DROP TABLE prohibition_items;

-- ------------------------------------------------------------
-- 4. sort_order カラム追加
-- ------------------------------------------------------------
ALTER TABLE house_rule_items ADD COLUMN sort_order integer;

-- ------------------------------------------------------------
-- 5. 既存行のバックフィル（現状の id 順を初期の並び順とする）
-- ------------------------------------------------------------
UPDATE house_rule_items SET sort_order = id;
