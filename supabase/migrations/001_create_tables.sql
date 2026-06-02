-- race_items
CREATE TABLE race_items (
  id integer PRIMARY KEY,
  name text NOT NULL,
  race_type text[] NOT NULL DEFAULT '{}',
  url text NOT NULL DEFAULT '',
  is_always boolean NOT NULL DEFAULT false
);

-- god_items
CREATE TABLE god_items (
  id integer PRIMARY KEY,
  type integer NOT NULL,
  name text NOT NULL,
  url text NOT NULL DEFAULT '',
  is_always boolean NOT NULL DEFAULT false
);

-- school_items
CREATE TABLE school_items (
  id integer PRIMARY KEY,
  name text NOT NULL,
  url text NOT NULL DEFAULT '',
  is_always boolean NOT NULL DEFAULT false,
  notes text NOT NULL DEFAULT ''
);

-- supplement_items
CREATE TABLE supplement_items (
  id integer PRIMARY KEY,
  name text NOT NULL,
  is_always boolean NOT NULL DEFAULT false,
  notes text NOT NULL DEFAULT ''
);

-- house_rule_items
CREATE TABLE house_rule_items (
  id integer PRIMARY KEY,
  rule_type text NOT NULL,
  supplement_id integer,
  about text NOT NULL,
  description text NOT NULL
);

-- prohibition_items
CREATE TABLE prohibition_items (
  id integer PRIMARY KEY,
  about text NOT NULL,
  name text NOT NULL
);

-- original_items
CREATE TABLE original_items (
  id integer PRIMARY KEY,
  type text NOT NULL,
  name text NOT NULL,
  url text NOT NULL DEFAULT ''
);

-- regulation_items
CREATE TABLE regulation_items (
  id integer PRIMARY KEY,
  name text NOT NULL,
  description text NOT NULL DEFAULT '',
  recruitment text NOT NULL DEFAULT '',
  stage text NOT NULL DEFAULT '',
  race text NOT NULL DEFAULT '',
  supplement text NOT NULL DEFAULT '',
  notes text NOT NULL DEFAULT '',
  level_cap_belt text NOT NULL DEFAULT ''
);

-- item_regulations
CREATE TABLE item_regulations (
  item_type text NOT NULL,
  item_id integer NOT NULL,
  regulation_id integer NOT NULL,
  PRIMARY KEY (item_type, item_id, regulation_id)
);

-- RLS
ALTER TABLE race_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE god_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE school_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE supplement_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE house_rule_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE prohibition_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE original_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE regulation_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE item_regulations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read" ON race_items FOR SELECT USING (true);
CREATE POLICY "Public read" ON god_items FOR SELECT USING (true);
CREATE POLICY "Public read" ON school_items FOR SELECT USING (true);
CREATE POLICY "Public read" ON supplement_items FOR SELECT USING (true);
CREATE POLICY "Public read" ON house_rule_items FOR SELECT USING (true);
CREATE POLICY "Public read" ON prohibition_items FOR SELECT USING (true);
CREATE POLICY "Public read" ON original_items FOR SELECT USING (true);
CREATE POLICY "Public read" ON regulation_items FOR SELECT USING (true);
CREATE POLICY "Public read" ON item_regulations FOR SELECT USING (true);
