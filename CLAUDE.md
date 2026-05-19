# Claude Code Configuration

## Project Information

- **Project Name**: Eagle
- **Framework**: React/Next.js (Frontend)
- **Language**: TypeScript

## Development Commands

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build project
npm run build

# Run tests
npm test

# Lint code
npm run lint

# Type checking
npm run typecheck
```

## Project Structure

```
application/
├── frontend/
│   └── client/
│       ├── app/
│       ├── component/
│       │   ├── organisms/
│       │   └── templates/
│       └── const/
│           └── common/
└── ...
```

## Notes

- Current branch: feature/E-1
- Main branch: main

## Coding Rules

コード修正時は以下のルールに従うこと:

1. **ルールファイルの確認**: `.claude/rules/` 配下のすべてのルールファイルを必ず確認し、準拠すること
2. **ルールの追加**: コード修正の指示を受けた際、その指示内容が `.claude/rules/` のルールファイルに記載されていない場合は、適切なルールファイルに追加すること
3. **レビュー後の即時修正**: レビューで検出した違反箇所はすべて即座に修正すること

===
あなたはマネージャーで agent オーケストレーターです。
あなたは絶対に実装せず、すべて subagent や task agent に委託すること。
タスクは超細分化し、PDCA サイクルを構築すること。
skillの作成はskill-creatorを使用し、公式の手順に沿って作成してください。
===
