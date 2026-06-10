-- ============================================================
-- options: アプリ全体の設定・状態を key-value で管理するテーブル
-- ============================================================
CREATE TABLE options (
  key   text PRIMARY KEY,
  value text NOT NULL DEFAULT ''
);

ALTER TABLE options ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read" ON options FOR SELECT USING (true);

-- 初期レコード: 最終デプロイ日時
INSERT INTO options (key, value) VALUES ('last_deployed_at', '');
