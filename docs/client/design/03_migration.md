# DB 変更 設計（マイグレーション）

## 概要

本 Issue では以下 2 つの DB 変更を行う。既存の番号体系（009 が最新）に続けて、`010_add_mypage.sql` の **1 ファイルに統合** して追加する（exp_diff 追加 + user_regulation_sheets 作成）。

| マイグレーション | 内容 |
|------------------|------|
| `010_add_mypage.sql` | （1）`level_cap` に差分カラム `exp_diff` を追加し、既存行を再計算 UPDATE。（2）`user_regulation_sheets` テーブル新規作成 + RLS。exp_diff 追加 + user_regulation_sheets 作成 を 1 ファイルに統合 |

> マイグレーションは必ず番号順・依存順で実行する。1 ファイル内では exp_diff → user_regulation_sheets の順で適用する。

---

## 010_add_mypage.sql（1）: level_cap への差分カラム追加

### 目的

成長指示の経験点条件（`expTotal < min_exp` のとき「経験点 +（差分）点」）で使用する、
**直前レベルの `min_exp` との差分** をカラムとして保持する。

### カラム設計

| 項目 | 値 | 根拠 |
|------|-----|------|
| カラム名（DB） | `exp_diff` | 既存カラムの snake_case 命名（`min_exp` 等）に合わせる。「経験点差分」を表す簡潔名 |
| 型側（TS） | `expDiff: number \| null` | 既存 `LevelCapItemType` の camelCase 命名に合わせる。先頭行は NULL のため nullable（既存 nullable フィールド `minGrowth`/`minHonor` と同パターン） |
| 型 | `integer`（nullable・DEFAULT なし） | `min_exp` が integer のため差分も integer。先頭行は「直前レベルとの差分」が定義できないため NULL とする。既存行は UPDATE で再計算 |

### 差分の定義

同一 `belt_type` 内で `sort_order` 昇順に並べたときの「**直前の行の `min_exp` との差**」。

```
exp_diff(row) = row.min_exp - prev.min_exp   （prev = 同 belt_type で sort_order が 1 つ前の行）
```

### 先頭行の扱い（要確定事項 → 本設計の確定方針）

各 `belt_type` の先頭行（`sort_order` 最小）は「直前の行」が存在しない。
**選択肢**:

| 案 | 先頭行の exp_diff | 長所 | 短所 |
|----|-------------------|------|------|
| A | `min_exp` 自身（前 = 0 とみなす） | 「0 からの差分」として一貫。経験点指示が必ず正の値になる | 先頭レベルで「+（min_exp 全額）」と大きな値が出る |
| B | `0` | 先頭は差分なしを明示 | `expTotal < min_exp` 成立時に「+0 点」となり指示として無意味 |
| C | `NULL` | 「未定義」を明示 | 型が `number` 必須から外れ、計算側で null 分岐が必要 |

> **本設計の確定方針: 案 C（先頭行 = `NULL`）** を採用する。
> 理由: `exp_diff` は「直前レベルとの差分」であり、先頭レベル（直前レベルが存在しない）には
> 差分そのものが **定義できない**。0 や min_exp 自身で埋めるのは意味的に不正確なため、
> 「未定義」を明示する NULL とし、**計算側で評価しない（経験点の成長指示を出さない）** のが意味的に正しい。
> これは既存 nullable フィールド `min_growth`/`min_honor` が NULL のとき評価しないのと同じ扱い。
> カラムは `integer`（nullable・DEFAULT なし）とし、UPDATE では LAG が先頭で NULL を返すことで先頭行が自然に NULL になる。

### マイグレーション内容（擬似 SQL・実装ファイルは作成しない）

```
-- 010_add_mypage.sql（1）（設計上の擬似 SQL）

-- 1. カラム追加（nullable・DEFAULT なし）
ALTER TABLE level_cap
  ADD COLUMN IF NOT EXISTS exp_diff integer;

-- 2. 既存行の再計算（belt_type ごと sort_order 昇順の直前行との差）
--    先頭行は直前行が存在しないため NULL（案 C）。
--    ウィンドウ関数 LAG を用いる想定。LAG は先頭で NULL を返すので差も NULL になる:
--      diff = min_exp - LAG(min_exp) OVER (PARTITION BY belt_type ORDER BY sort_order)
--    （COALESCE を付けないことで先頭行が NULL のまま残る）
UPDATE level_cap AS lc
SET exp_diff = sub.diff
FROM (
  SELECT id,
         min_exp - LAG(min_exp) OVER (PARTITION BY belt_type ORDER BY sort_order)
           AS diff
  FROM level_cap
) AS sub
WHERE lc.id = sub.id;
```

### 既存データでの計算結果（参考・migration 008 の値より）

belt_type = `'B'`（sort_order 昇順）。先頭は案 C で NULL。

| level | sort_order | min_exp | 直前 min_exp | exp_diff |
|-------|-----------|---------|--------------|----------|
| 2 | 1 | 3000 | (なし) | NULL |
| 3 | 2 | 7000 | 3000 | 4000 |
| 4 | 3 | 11000 | 7000 | 4000 |
| 5 | 4 | 17000 | 11000 | 6000 |
| 6 | 5 | 25000 | 17000 | 8000 |
| 7 | 6 | 33500 | 25000 | 8500 |
| 8 | 7 | 43500 | 33500 | 10000 |
| 9 | 8 | 55500 | 43500 | 12000 |
| 10 | 9 | 67500 | 55500 | 12000 |
| 11/12① | 10 | 80000 | 67500 | 12500 |
| 11/12② | 11 | 92000 | 80000 | 12000 |

belt_type = `'C'`（sort_order 昇順）。先頭は案 C で NULL。

| level | sort_order | min_exp | 直前 min_exp | exp_diff |
|-------|-----------|---------|--------------|----------|
| 5 | 1 | 17000 | (なし) | NULL |
| 6 | 2 | 25000 | 17000 | 8000 |
| 7 | 3 | 33500 | 25000 | 8500 |
| 8 | 4 | 43500 | 33500 | 10000 |
| 9 | 5 | 55500 | 43500 | 12000 |
| 10 | 6 | 67500 | 55500 | 12000 |
| 11 | 7 | 80000 | 67500 | 12500 |
| 12 | 8 | 92000 | 80000 | 12000 |
| 13 | 9 | 112000 | 92000 | 20000 |

> belt `'C'` 先頭（Lv.5）は案 C で NULL。先頭レベルには「直前レベルとの差分」が定義できないため、計算側で評価せず経験点の成長指示を出さない。

### 型・取得関数への影響

- `application/frontend/client/const/type/levelCap/LevelCapType.ts` に `expDiff: number | null;` を追加（先頭行は NULL のため nullable。既存 nullable フィールド `minGrowth`/`minHonor` と同パターン）。
- `const/function/getLevelCapItems.ts` の map に `expDiff: row.exp_diff !== null ? Number(row.exp_diff) : null,` を追加（既存の nullable フィールド `minGrowth`/`minHonor` と同じパターンに準拠）。
- **成長指示の経験点条件への注意**: 先頭レベルでは `exp_diff` が null のため、`expTotal < min_exp` でも経験点の成長指示は **表示しない**（null は評価しない）。これは `min_growth`/`min_honor` が null のとき評価しないのと同じ扱い。
- admin 側で `level_cap` を編集する場合は `exp_diff` を **自動再計算** する（手入力させない）方針が望ましい（min_exp 変更時に整合が崩れるため）。本 Issue のスコープ外だが、要確認事項として記載。

---

## 010_add_mypage.sql（2）: user_regulation_sheets テーブル新規作成

### 目的

ユーザーがレギュレーションごとに自分の **ゆとシート URL** と **備考** を保存する。

### テーブル定義

| カラム | 型 | 説明 |
|--------|-----|------|
| `id` | `serial` / `bigint generated always as identity` PK | 主キー |
| `user_id` | `uuid NOT NULL`（FK → `auth.users(id)` ON DELETE CASCADE） | 所有ユーザー |
| `regulation_id` | `integer NOT NULL`（FK → `regulation_items(id)` ON DELETE CASCADE） | 対象レギュレーション |
| `yutosheet_url` | `text NOT NULL DEFAULT ''` | ゆとシート（キャラクターシート）URL。**保存時に API 層で URL 検証（https + `yutorize.2-d.jp` 完全一致・最大 2048 字）**。DB は長文を防ぐ最小限の制約のみで、内容検証はアプリ層が責務（[02_mypage.md](./02_mypage.md) S-1/S-4） |
| `note` | `text NOT NULL DEFAULT ''` | 備考 |
| `updated_by` | `uuid`（nullable, FK → `auth.users(id)`） | 最終更新者（admin の監査カラム方針に合わせる。本人更新のため通常 user_id と一致） |
| `updated_at` | `timestamptz NOT NULL DEFAULT now()` | 最終更新日時 |
| 制約 | `UNIQUE(user_id, regulation_id)` | 1 ユーザー × 1 レギュレーションで 1 レコード（upsert キー） |

> **命名根拠**: テーブル名は「ユーザー × レギュレーション の シート設定」を表す `user_regulation_sheets`（複数形・snake_case、既存テーブル `regulation_items` 等の命名に整合）。
> カラム名はゆとシートのドメイン語に合わせ `yutosheet_url`。`updated_by`/`updated_at` は admin の共通監査カラム方針を踏襲（本人更新のため `updated_by` は基本的に `user_id` と同値だが、将来の管理者代理更新に備えて保持）。

### マイグレーション内容（擬似 SQL・実装ファイルは作成しない）

```
-- 010_add_mypage.sql（2）（設計上の擬似 SQL）

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
```

### RLS ポリシー（本人のみ参照/編集可）

`auth.uid() = user_id` の本人に限定する。

```
-- SELECT: 本人のみ
CREATE POLICY "urs_select_own" ON user_regulation_sheets
  FOR SELECT USING (auth.uid() = user_id);

-- INSERT: 本人のみ（user_id = 自分）
CREATE POLICY "urs_insert_own" ON user_regulation_sheets
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- UPDATE: 本人のみ
CREATE POLICY "urs_update_own" ON user_regulation_sheets
  FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
```

> **書き込み経路**: 実際の保存は API Route `/api/mypage`(PUT)（Service Role Key）経由で行い、
> Route 内で **セッションの user_id のみ** を対象に upsert する（リクエストボディの user_id は信用しない）。
> RLS は多重防御（Service Role Key は RLS をバイパスするため、API 層での本人スコープ確定が一次防御）。
> DELETE は本 Issue のスコープ外（URL を空文字に更新する運用）。必要になれば `urs_delete_own` を追加する。

> **保存時の入力検証（必須）**: upsert 前に API 層で次を検証する（詳細は [02_mypage.md](./02_mypage.md)「## セキュリティ要件」を正本とする）。
> - `yutosheet_url`: 最大長 **2048 字** + S-1 の URL 検証（**https かつ `yutorize.2-d.jp` 完全一致**。`javascript:`/`data:` 等は排除）。不正は **400**。空文字（未登録）は許可。
> - `note`: 最大長 **1000 字**（例）。超過は 400。
> - `regulation_id`: 整数 + 対象レギュレーション集合（`level_cap_schedule` 登録あり）に属することを確認。
> - `user_id` / `updated_by`: **セッション由来でのみセット**し、リクエストボディ指定は無視。

### upsert 仕様

```
-- /api/mypage PUT の処理（擬似）
-- body: { regulationId: number, yutosheetUrl: string, note: string }
-- user_id はセッションから取得
INSERT INTO user_regulation_sheets (user_id, regulation_id, yutosheet_url, note, updated_by, updated_at)
VALUES (:sessionUserId, :regulationId, :yutosheetUrl, :note, :sessionUserId, now())
ON CONFLICT (user_id, regulation_id)
DO UPDATE SET yutosheet_url = EXCLUDED.yutosheet_url,
              note          = EXCLUDED.note,
              updated_by    = EXCLUDED.updated_by,
              updated_at    = now();
```

### 型定義

```typescript
// const/type/mypage/UserRegulationSheetType.ts
export type UserRegulationSheetType = {
  id: number;
  userId: string;
  regulationId: number;
  yutosheetUrl: string;
  note: string;
  updatedAt: string | null;
};
```

---

## マイグレーション実行順序（再掲）

```
... 009_add_regulation_schedule.sql       → 既存（最新）
010_add_mypage.sql                        → （1）ALTER + UPDATE（exp_diff） → （2）CREATE TABLE + RLS（user_regulation_sheets）を 1 ファイルに統合
seed.sql                                   → 既存（必要ならテストユーザーのシート初期データを追記）
```

---

## 未確定・要確認事項

- **差分カラム先頭行の扱い**: **NULL に確定（案 C）**。先頭レベルには「直前レベルとの差分」が定義できないため NULL とし、計算側で評価しない（経験点の成長指示を出さない）。`min_growth`/`min_honor` の null 非評価と同じ扱い。
- admin の `level_cap` 編集時に `exp_diff` を自動再計算するか（本 Issue スコープ外だが整合維持に必要）。
- `user_regulation_sheets` の DELETE ポリシー要否（現状は URL 空更新で代替）。
- `updated_by` を持つか（admin 監査方針に合わせ保持としたが、本人更新のみなら冗長との判断もあり得る）。
