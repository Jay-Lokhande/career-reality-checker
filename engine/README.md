# Career Reality Checker Engine

The rule-based evaluation engine for Career Reality Checker.

## Overview

This package contains the core logic for evaluating career assessments. It is designed to be:

- **Pure TypeScript**: No external dependencies for core logic
- **Transparent**: All rules and scenarios are clearly defined
- **Auditable**: Easy to review and understand the evaluation logic

## Structure

```
engine/
├── src/
│   ├── evaluator.ts    # Core evaluation engine
│   ├── rules/          # Rule definitions
│   ├── scenarios/      # Scenario definitions
│   └── index.ts        # Public API
└── README.md
```

## Usage

```typescript
import { Evaluator } from '@career-reality-checker/engine'

const evaluator = new Evaluator()
const result = evaluator.evaluate({
  // Your context data
})
```

## Development

```bash
# Type check
npm run type-check

# Build
npm run build

# Lint
npm run lint
```

## Rules

Rules are pure functions that evaluate specific aspects of a career assessment. Each rule should:

- Be a pure function (no side effects)
- Return a numeric score
- Be clearly documented
- Be easy to test

## Scenarios

Scenarios combine multiple rules to create complete assessment workflows. Each scenario:

- Defines which rules to apply
- Specifies how to combine rule results
- Provides context for the assessment


