-- ============================================================
-- 010_add_mypage.sql
-- マイページ機能（client）の DB 変更をまとめて適用する。
--   1. level_cap に exp_diff（直前レベルの min_exp との差分）を追加
--   2. user_regulation_sheets（ユーザー別ゆとシート設定）を新規作成 + RLS
-- ============================================================

-- ============================================================
-- 1. level_cap への差分カラム追加
--    目的: 成長指示の経験点条件で使用する「直前レベルの min_exp との差分」を
--          カラム exp_diff として保持する。
--          各 belt_type の先頭行（sort_order 最小）は直前レベルが無いため NULL（案 C）。
-- ============================================================
ALTER TABLE level_cap
  ADD COLUMN IF NOT EXISTS exp_diff integer;

-- 既存行の再計算
--   belt_type ごと sort_order 昇順の直前行との差を算出。
--   LAG は先頭行で NULL を返すため、COALESCE を付けず先頭行は NULL のまま残す（案 C）。
UPDATE level_cap AS lc
SET exp_diff = sub.diff
FROM (
  SELECT id,
         min_exp - LAG(min_exp) OVER (PARTITION BY belt_type ORDER BY sort_order)
           AS diff
  FROM level_cap
) AS sub
WHERE lc.id = sub.id;

-- ============================================================
-- 2. user_regulation_sheets テーブル作成
--    目的: ユーザーがレギュレーションごとに自分のゆとシート URL と備考を保存する。
--          1 ユーザー × 1 レギュレーションで 1 レコード（UNIQUE で upsert キー）。
--          RLS で本人（auth.uid() = user_id）のみ参照/編集可とする。
-- ============================================================
CREATE TABLE user_regulation_sheets (
  id             bigint generated always as identity PRIMARY KEY,
  user_id        uuid    NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  regulation_id  integer NOT NULL REFERENCES regulation_items(id) ON DELETE CASCADE,
  yutosheet_url  text    NOT NULL DEFAULT '',
  note           text    NOT NULL DEFAULT '',
  updated_by     uuid    REFERENCES auth.users(id),
  updated_at     timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, regulation_id)
);

-- 検索用インデックス（本人の全レコード取得が多いため）
CREATE INDEX idx_user_regulation_sheets_user ON user_regulation_sheets(user_id);

ALTER TABLE user_regulation_sheets ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- RLS ポリシー（本人のみ参照/編集可）
--   DELETE は本 Issue のスコープ外（URL 空更新で代替）。
-- ============================================================
-- SELECT: 本人のみ
CREATE POLICY "urs_select_own" ON user_regulation_sheets
  FOR SELECT USING (auth.uid() = user_id);

-- INSERT: 本人のみ（user_id = 自分）
CREATE POLICY "urs_insert_own" ON user_regulation_sheets
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- UPDATE: 本人のみ
CREATE POLICY "urs_update_own" ON user_regulation_sheets
  FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
