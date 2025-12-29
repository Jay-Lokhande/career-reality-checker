# Career Reality Checker

A clean, minimal, rule-based career assessment tool focused on clarity and auditability.

## Overview

Career Reality Checker is an open-source project that provides transparent, rule-based career assessments without relying on LLMs or complex authentication systems. The tool is designed to be:

- **Transparent**: All rules and logic are visible and auditable
- **Simple**: No authentication required
- **Maintainable**: Clear separation between frontend and engine logic

## Architecture

This is a monorepo containing:

- **`engine/`**: Pure TypeScript rule-based evaluation engine
- **`frontend/`**: Next.js application with App Router and TypeScript

## Getting Started

### Prerequisites

- Node.js >= 18.0.0
- npm >= 9.0.0

### Installation

```bash
npm install
```

### Development

```bash
# Start the frontend development server
npm run dev

# Type check all packages
npm run type-check

# Lint all packages
npm run lint
```

### Building

```bash
npm run build
```

## Project Structure

```
career-reality-checker/
├── engine/          # Rule-based evaluation engine
├── frontend/        # Next.js application
├── docs/            # Documentation
├── CONTRIBUTING.md  # Contribution guidelines
└── README.md        # This file
```

## License

MIT

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines on contributing to this project.

