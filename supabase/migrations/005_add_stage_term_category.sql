-- ============================================================
-- stage_term_items: category カラム追加
-- ============================================================
ALTER TABLE stage_term_items
  ADD COLUMN IF NOT EXISTS category text NOT NULL DEFAULT '';

-- ============================================================
-- item_regulations: item_type_check に 'stage-term' を追加
-- ============================================================
ALTER TABLE item_regulations
  DROP CONSTRAINT IF EXISTS item_regulations_item_type_check;

ALTER TABLE item_regulations
  ADD CONSTRAINT item_regulations_item_type_check
    CHECK (item_type IN ('god', 'school', 'race', 'supplement', 'stage-term'));

-- stage_term_items 削除時に item_regulations を CASCADE 削除するトリガー
DROP TRIGGER IF EXISTS trg_stage_term_items_delete ON stage_term_items;

CREATE TRIGGER trg_stage_term_items_delete
  AFTER DELETE ON stage_term_items FOR EACH ROW
  EXECUTE FUNCTION delete_item_regulations_on_item_delete('stage-term');
