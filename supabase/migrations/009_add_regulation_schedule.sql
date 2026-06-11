ALTER TABLE regulation_items
  ADD COLUMN IF NOT EXISTS char_creation_start_date date,
  ADD COLUMN IF NOT EXISTS level_cap_start_date     date,
  ADD COLUMN IF NOT EXISTS epilogue_start_date      date,
  ADD COLUMN IF NOT EXISTS epilogue_end_date        date,
  ADD COLUMN IF NOT EXISTS level_cap_schedule       jsonb NOT NULL DEFAULT '[]';
