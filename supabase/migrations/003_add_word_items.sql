-- ============================================================
-- word_items テーブル追加
-- ============================================================
CREATE TABLE word_items (
  id         integer     PRIMARY KEY,
  title      text        NOT NULL DEFAULT '',
  description text       NOT NULL DEFAULT ''
);

CREATE SEQUENCE IF NOT EXISTS word_items_id_seq OWNED BY word_items.id;
ALTER TABLE word_items ALTER COLUMN id SET DEFAULT nextval('word_items_id_seq');

ALTER TABLE word_items
  ADD COLUMN updated_by uuid REFERENCES auth.users(id),
  ADD COLUMN updated_at timestamptz;

ALTER TABLE word_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read" ON word_items FOR SELECT USING (true);
