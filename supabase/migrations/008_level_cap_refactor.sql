DROP TABLE IF EXISTS level_cap;

CREATE TABLE level_cap (
  id                   serial  PRIMARY KEY,
  belt_type            text    NOT NULL,
  level                text    NOT NULL,
  sort_order           integer NOT NULL,
  UNIQUE (belt_type, level),
  -- レベルキャップ処理
  min_exp              integer NOT NULL DEFAULT 0,
  min_growth           integer,
  min_reward           integer NOT NULL DEFAULT 0,
  min_honor            integer,
  max_adventurer_rank  text    NOT NULL DEFAULT '',
  -- GM報酬
  reward_amount        integer NOT NULL DEFAULT 0,
  off_balance_reward   integer NOT NULL DEFAULT 0,
  honor                integer NOT NULL DEFAULT 0,
  -- セッション報酬
  distribution         integer,
  reward_per_session   text    NOT NULL DEFAULT '',
  sword_fragments      text    NOT NULL DEFAULT '',
  growth_count         integer NOT NULL DEFAULT 0,
  growth_limit         integer NOT NULL DEFAULT 0,
  f_count_limit        integer NOT NULL DEFAULT 0,
  reward_limit         integer NOT NULL DEFAULT 0,
  excess_growth        text    NOT NULL DEFAULT ''
);

ALTER TABLE level_cap ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read" ON level_cap FOR SELECT USING (true);

-- ============================================================
-- INSERT: B (11 行)
-- ============================================================
INSERT INTO level_cap (
  belt_type, level, sort_order,
  min_exp, min_growth, min_reward, min_honor, max_adventurer_rank,
  reward_amount, off_balance_reward, honor,
  distribution, reward_per_session, sword_fragments, growth_count, growth_limit, f_count_limit, reward_limit, excess_growth
) VALUES
  ('B', '2',      1,  3000,  NULL, 1200,   NULL,  'レイピア',       1000,  500,  15,  NULL, '500-1000',    '0-3',   1, 5,   10, 7200,   ''),
  ('B', '3',      2,  7000,  5,    7200,   60,    'レイピア',       2300,  500,  30,  500,  '750-1200',    '0-8',   1, 11,  15, 19200,  ''),
  ('B', '4',      3,  11000, 11,   19200,  100,   'グレートソード', 4000,  500,  50,  500,  '1000-2200',   '4-9',   1, 17,  20, 38200,  ''),
  ('B', '5',      4,  17000, 17,   38200,  200,   'グレートソード', 4500,  1000, 50,  1000, '2500-5000',   '6-9',   1, 22,  25, 61200,  '1/4'),
  ('B', '6',      5,  25000, 22,   61200,  350,   'フランベルジュ', 5250,  1500, 70,  1000, '3000-7200',   '8-12',  1, 29,  30, 98200,  '1/4'),
  ('B', '7',      6,  33500, 29,   98200,  1000,  'フランベルジュ', 6000,  1500, 80,  1500, '6000-7800',   '10-14', 2, 43,  35, 139200, '2/4'),
  ('B', '8',      7,  43500, 43,   139200, 2000,  'センチネル',     8750,  2500, 90,  1500, '7600-10000',  '12-16', 2, 55,  40, 201200, '2/4'),
  ('B', '9',      8,  55500, 55,   201200, 3100,  'センチネル',     10500, 2500, 110, 2500, '8000-11000',  '14-20', 3, 70,  45, 276200, '2/4'),
  ('B', '10',     9,  67500, 70,   276200, 5000,  'ハイペリオン',   15000, 2500, 120, 2500, '11000-15000', '18-22', 3, 85,  50, 331200, '3/4'),
  ('B', '11/12①', 10, 80000, 85,   331200, 7000,  'ハイペリオン',   15000, 3000, 140, 3000, '13000-16000', '20-24', 3, 100, 60, 401200, '3/4'),
  ('B', '11/12②', 11, 92000, 100,  401200, 10000, 'ハイペリオン',   15000, 3000, 140, 3000, '13000-16000', '20-24', 3, 100, 60, 501200, '3/4');

-- ============================================================
-- INSERT: C (9 行)
-- ============================================================
INSERT INTO level_cap (
  belt_type, level, sort_order,
  min_exp, min_growth, min_reward, min_honor, max_adventurer_rank,
  reward_amount, off_balance_reward, honor,
  distribution, reward_per_session, sword_fragments, growth_count, growth_limit, f_count_limit, reward_limit, excess_growth
) VALUES
  ('C', '5',  1, 17000,  17,  38200,  200,   'グレートソード', 4500,  1000, 50,  1000, '2500-5000',   '6-9',   1, 22,  25, 61200,  '1/4'),
  ('C', '6',  2, 25000,  22,  61200,  350,   'フランベルジュ', 5250,  1500, 70,  1000, '3000-7200',   '8-12',  1, 29,  30, 98200,  '1/4'),
  ('C', '7',  3, 33500,  29,  98200,  1000,  'フランベルジュ', 6000,  1500, 80,  1500, '6000-7800',   '10-14', 2, 43,  35, 139200, '2/4'),
  ('C', '8',  4, 43500,  43,  139200, 2000,  'センチネル',     8750,  2500, 90,  1500, '7600-10000',  '12-16', 2, 55,  40, 201200, '2/4'),
  ('C', '9',  5, 55500,  55,  201200, 3100,  'センチネル',     10500, 2500, 110, 2500, '8000-11000',  '14-20', 2, 70,  45, 276200, '2/4'),
  ('C', '10', 6, 67500,  70,  276200, 5000,  'ハイペリオン',   15000, 2500, 120, 2500, '11000-15000', '18-22', 3, 85,  50, 331200, '3/4'),
  ('C', '11', 7, 80000,  85,  331200, 7000,  'ハイペリオン',   15000, 3000, 140, 3000, '13000-16000', '20-24', 3, 100, 60, 401200, '3/4'),
  ('C', '12', 8, 92000,  100, 401200, 10000, 'ハイペリオン',   15000, 3000, 140, 3000, '13000-16000', '20-24', 3, 115, 60, 501200, '3/4'),
  ('C', '13', 9, 112000, 115, 501200, 10000, 'ハイペリオン',   15000, 3000, 140, 3000, '15000-18000', '30-',   3, 130, 60, 501200, '3/4');
