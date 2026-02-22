---
name: create-pr
description: 作業ブランチからPRを作成。ブランチ名からIssue番号を自動取得し、差分分析・PR作成までを実行します。Use when creating a pull request from the current working branch.
---

# Create PR Skill

現在の作業ブランチから Pull Request を作成するワークフローを自動化します。

## 前提条件

- `gh` CLI がインストール済みで認証済みであること
- 作業ブランチ上で実行すること（main ブランチでは実行不可）

## ワークフロー

### Step 1: 現在のブランチ情報の確認

1. 現在のブランチ名を取得する:
   ```bash
   git branch --show-current
   ```

2. main ブランチの場合はエラーメッセージを表示して終了する:
   「main ブランチ上ではPRを作成できません。作業ブランチに切り替えてください。」

3. ブランチ名から Issue 番号を抽出する:
   - パターン: `*/E-{番号}` から番号部分を取得（例: `feature/E-14` → `14`）
   - 抽出できない場合は `AskUserQuestion` で Issue 番号を手動入力させる

4. 未コミットの変更がないか `git status` で確認する。ある場合はユーザーに警告し、コミットしてから再実行するよう促す。

5. リモートに push されていない変更がないか確認する:
   ```bash
   git status -sb
   ```
   ahead がある場合は `git push` を実行してよいか `AskUserQuestion` で確認する。

### Step 2: 差分の分析

1. main ブランチとの差分を取得する:
   ```bash
   git log main..HEAD --oneline
   git diff main...HEAD --stat
   ```

2. 差分内容をユーザーに表示する:
   ```
   ## ブランチ差分サマリー
   - **コミット数**: X件
   - **変更ファイル数**: X件

   ### コミット一覧
   - xxxxxxx E-14 コミットメッセージ1
   - xxxxxxx E-14 コミットメッセージ2

   ### 変更ファイル
   - file1.ts | 10 +++++
   - file2.ts | 5 +++--
   ```

### Step 3: PR の作成

1. コミットメッセージと差分内容を分析し、PR タイトルとサマリーを自動生成する。

2. PR タイトルの規約:
   - 70文字以内
   - Issue の内容を簡潔に表現する

3. PR を作成する:
   ```bash
   gh pr create --title "<タイトル>" --body "$(cat <<'EOF'
   ## Summary
   <差分分析に基づく1-3行の箇条書き>

   ## Issue
   Close #<Issue番号>

   ## Test plan
   <テスト計画の箇条書き>

   🤖 Generated with [Claude Code](https://claude.com/claude-code)
   EOF
   )"
   ```

4. 作成した PR の URL をユーザーに表示する。

### Step 4: 完了報告

以下の情報をまとめてユーザーに表示する:

```
## PR 作成完了

- **PR**: <PR URL>
- **タイトル**: <タイトル>
- **Issue**: #<番号>
- **ブランチ**: <ブランチ名> → main
```

## 注意事項

- PR 作成前に必ずすべての変更が push 済みであることを確認すること
- main ブランチへの PR として作成すること
- `Close #番号` で Issue との紐付けを行うこと
- PR タイトルは70文字以内に収めること
