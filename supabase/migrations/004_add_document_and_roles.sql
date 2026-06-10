-- ============================================================
-- stage_term_items テーブル追加
-- ============================================================
CREATE TABLE stage_term_items (
  id          integer PRIMARY KEY,
  title       text    NOT NULL DEFAULT '',
  continent   text    NOT NULL DEFAULT '',
  description text    NOT NULL DEFAULT ''
);

CREATE SEQUENCE IF NOT EXISTS stage_term_items_id_seq OWNED BY stage_term_items.id;
ALTER TABLE stage_term_items ALTER COLUMN id SET DEFAULT nextval('stage_term_items_id_seq');

ALTER TABLE stage_term_items
  ADD COLUMN updated_by uuid REFERENCES auth.users(id),
  ADD COLUMN updated_at timestamptz;

ALTER TABLE stage_term_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read" ON stage_term_items FOR SELECT USING (true);

-- ============================================================
-- user_meta: general ロール追加 + updated_at カラム追加
-- ============================================================
ALTER TABLE user_meta DROP CONSTRAINT user_meta_role_check;
ALTER TABLE user_meta ADD CONSTRAINT user_meta_role_check
  CHECK (role IN ('common', 'general', 'admin'));

ALTER TABLE user_meta ADD COLUMN IF NOT EXISTS updated_at timestamptz;
