---
name: start-issue
description: GitHub Issueの作業開始を自動化。マイルストーン選択 → Issue選択 → 作業ブランチ作成までを対話的に実行します。Use when starting work on a new issue, creating a feature branch, or beginning a task from GitHub milestones.
---

# Start Issue Skill

GitHub の OPEN マイルストーンから Issue を選択し、作業用ブランチを作成するワークフローを自動化します。

## 前提条件

- `gh` CLI がインストール済みで認証済みであること
- Git リポジトリのルートディレクトリで実行すること

## ワークフロー

### Step 1: OPEN マイルストーンの取得と選択

1. 以下のコマンドで OPEN 状態のマイルストーン一覧を取得する:
   ```bash
   gh api repos/:owner/:repo/milestones --jq '.[] | select(.state=="open") | {number, title, open_issues, closed_issues}'
   ```

2. 取得結果を以下の形式でユーザーに表示する:
   ```
   ## OPEN マイルストーン一覧
   | # | タイトル | 未完了 | 完了済 |
   |---|---------|--------|--------|
   | 4 | v0.1.3  | 2      | 0      |
   ```

3. **エッジケース**: マイルストーンが 0 件の場合は「OPEN 状態のマイルストーンがありません。」と表示して終了する。

4. `AskUserQuestion` を使用して、ユーザーにマイルストーンを選択させる。取得したマイルストーンを選択肢として提示する。

### Step 2: 選択マイルストーンの Issue 一覧取得と選択

1. 選択されたマイルストーンの OPEN Issue を取得する:
   ```bash
   gh issue list --milestone "<選択されたマイルストーンタイトル>" --state open --json number,title,labels,state
   ```

2. 取得結果を以下の形式でユーザーに表示する:
   ```
   ## Issue 一覧（マイルストーン: <タイトル>）
   | # | タイトル | ラベル |
   |---|---------|--------|
   | 11 | client画面 レベルキャップ画面実装 | enhancement |
   | 12 | client画面 ハンバーガーメニューにトップを追加 | - |
   ```
   - ラベルがない場合は `-` と表示する
   - ラベルが複数ある場合はカンマ区切りで表示する

3. **エッジケース**: Issue が 0 件の場合は「このマイルストーンに OPEN の Issue がありません。」と表示して終了する。

4. `AskUserQuestion` を使用して、ユーザーに Issue を選択させる。取得した Issue を選択肢として提示する。

### Step 3: 作業ブランチの作成

1. 未コミットの変更がないか `git status` で確認する。ある場合はユーザーに警告する。

2. `main` ブランチの最新状態を取得する:
   ```bash
   git fetch origin main
   ```

3. ブランチ命名規則:
   - **ラベルあり**: `{最初のラベル名}/E-{Issue番号}`（例: `enhancement/E-11`）
   - **ラベル複数**: 最初のラベルを自動使用
   - **ラベルなし**: `feature/E-{Issue番号}`（デフォルト）

4. ブランチを作成してチェックアウトする:
   ```bash
   git checkout -b {ブランチ名} origin/main
   ```

5. リモートブランチを作成し、tracking 先を設定する:
   ```bash
   git push -u origin {ブランチ名}
   ```
   > **重要**: `origin/main` から作成すると tracking が main になるため、必ず `push -u` で正しい tracking 先に変更すること。

6. **エッジケース**: 同名のブランチが既に存在する場合:
   - `AskUserQuestion` で以下の選択肢を提示する:
     - `既存ブランチに切り替える` → `git checkout {ブランチ名}`
     - `別名で作成する` → ユーザーにブランチ名を入力させる
     - `キャンセル` → 処理を中断する

### Step 4: 完了報告

以下の情報をまとめてユーザーに表示する:

```
## 作業開始準備完了

- **マイルストーン**: <タイトル>
- **Issue**: #<番号> <タイトル>
- **ブランチ**: <作成したブランチ名>
- **ベースブランチ**: main

### コミットメッセージ規約
このブランチでのコミットメッセージは以下のプレフィックスを使用してください:
  E-<Issue番号> <変更内容の説明>

例: E-11 レベルキャップ画面の初期実装
```

## 注意事項

- 必ず `main` ブランチの最新状態からブランチを作成すること
- ブランチ作成前に未コミットの変更がないか確認すること
- Issue 番号は必ず GitHub の Issue 番号と一致させること
