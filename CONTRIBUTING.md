# Contributing to Career Reality Checker

Thank you for considering contributing to Career Reality Checker. This guide will help you make meaningful contributions that improve the tool's accuracy and usefulness.

## Our Philosophy

We value:
- **Transparency**: Every assumption should be explicit and documented
- **Data over opinions**: When possible, back assumptions with research or data
- **Respectful discussion**: Disagreements are opportunities to improve, not arguments to win
- **Thoughtful contributions**: Quality over quantity. One well-researched scenario is better than ten quick additions.

## What We're Looking For

### High-Value Contributions

1. **New Career Scenarios**: Well-researched career paths with explicit assumptions
2. **Improved Assumptions**: Data-backed updates to existing assumptions
3. **Better Explanations**: Clearer documentation of why rules work the way they do
4. **Bug Fixes**: Issues that affect accuracy or transparency
5. **Accessibility Improvements**: Making the tool more usable for everyone

### What We're Not Looking For

- Quick additions without research
- Changes that reduce transparency
- "Motivational" language or hype
- Assumptions without sources or justification
- PRs that don't follow the contribution process

## How to Contribute

### 1. Discuss First (For Major Changes)

For significant changes—new scenarios, major assumption updates, or architectural changes—please open an issue first to discuss your approach. This helps ensure:
- Your contribution aligns with project goals
- We can provide guidance before you invest time
- We can coordinate if others are working on similar changes

For small fixes (typos, documentation clarifications, minor bug fixes), feel free to open a PR directly.

### 2. Fork and Clone

```bash
git clone https://github.com/your-username/career-reality-checker.git
cd career-reality-checker
npm install
```

### 3. Create a Branch

```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/description-of-fix
```

Use descriptive branch names that indicate what you're working on.

### 4. Make Your Changes

Follow the guidelines below for code style, scenarios, and assumptions.

### 5. Test Your Changes

```bash
# Type check
npm run type-check

# Lint
npm run lint

# Build
npm run build

# Test the frontend (if applicable)
npm run dev
```

### 6. Submit a Pull Request

Include:
- Clear description of what you changed and why
- References to any related issues
- Data sources for new assumptions (if applicable)
- Any concerns or questions you have about the change

## Adding New Career Scenarios

Career scenarios are one of the most valuable contributions. Here's how to add one properly.

### Step 1: Research

Before writing code, research:
- **Job postings**: What do employers actually require?
- **Career transition stories**: How long do transitions typically take?
- **Skill requirements**: What skills are actually needed vs. nice-to-have?
- **Failure patterns**: Why do people fail to achieve this goal?

Good sources:
- Job posting aggregators (LinkedIn, Indeed, etc.)
- Industry reports and surveys
- Career transition forums and communities
- Salary data (Glassdoor, Levels.fyi, etc.)

### Step 2: Document Your Assumptions

Before coding, write down:
- Minimum experience requirements (with justification)
- Required skills and proficiency levels (with sources)
- Realistic timeline ranges (with data)
- Common failure reasons (with frequency estimates if possible)
- Time requirements (with justification)

### Step 3: Create the Scenario

Add your scenario to `engine/src/scenarios/index.ts` following the `CareerScenario` interface:

```typescript
{
  id: 'unique-scenario-id',
  name: 'Human-Readable Scenario Name',
  description: 'Detailed description of the career path...',
  targetRole: 'Target Job Title',
  targetIndustry: 'Industry Name',
  minExperienceYears: 2, // Based on job posting analysis
  preferredEducation: 'bachelors',
  skillRequirements: [
    {
      skillName: 'Required Skill Name',
      minProficiency: 3,
      isCritical: true,
      monthsToLearn: 6, // Based on typical learning curves
    },
    // ... more skills
  ],
  timelineRanges: {
    bestCaseMonths: 12, // Based on fastest transitions observed
    averageCaseMonths: 18, // Based on median transition time
    worstCaseMonths: 36, // Based on slower transitions
  },
  timeRequirements: {
    skillBuildingHours: 3,
    jobSearchHours: 1,
    interviewPrepHours: 2,
    isOnTopOfFullTimeJob: true,
  },
  commonFailureReasons: [
    {
      category: 'skill_gap',
      description: 'Specific reason people fail...',
      frequency: 35, // Percentage estimate
    },
    // ... more failure reasons
  ],
  notes: 'Additional context, data sources, or caveats',
  typicalSalaryRange: {
    min: 80000,
    max: 150000,
    currency: 'USD',
  },
}
```

### Step 4: Document Your Sources

In the `notes` field or in your PR description, include:
- Where you got your data
- Sample size (if applicable)
- Any limitations or caveats
- Why you made specific choices

### Step 5: Test Your Scenario

Verify that:
- The scenario appears in the evaluation when appropriate
- Warnings are generated correctly
- Timeline calculations make sense
- The scenario matches real-world patterns

### Example: Good Scenario PR

**Title**: Add Data Engineer career scenario

**Description**:
```
Adds a new scenario for Data Engineer roles based on:
- Analysis of 200+ job postings from LinkedIn and Indeed
- Survey of 50+ data engineers on transition timelines
- Industry reports from O'Reilly Data Science Salary Survey 2023

Key assumptions:
- Minimum 1 year of relevant experience (based on 80% of postings)
- Python and SQL are critical skills (required in 95% of postings)
- Average transition time: 12-24 months (based on survey data)

Sources:
- LinkedIn job postings (Jan 2024)
- r/datascience transition stories
- O'Reilly Data Science Salary Survey 2023
```

## Improving Assumptions with Data

One of the most valuable contributions is improving existing assumptions with better data.

### How to Propose Assumption Updates

1. **Identify the assumption** you want to improve
2. **Gather data** that supports your proposed change
3. **Open an issue** with:
   - Current assumption
   - Proposed change
   - Data supporting the change
   - Source of data
   - Sample size (if applicable)

4. **Wait for discussion** before implementing

### What Makes Good Data

- **Representative**: Large enough sample size
- **Recent**: Data from the last 2-3 years when possible
- **Transparent**: Clear methodology
- **Replicable**: Others can verify your sources

### Examples of Good Assumption Updates

**Good**: "Based on analysis of 500 job postings, 85% require 3+ years of experience, not 2. Should we update the default?"

**Not Good**: "I think 3 years is better because that's what I needed."

## Resolving Disagreements

Disagreements are normal and valuable. Here's how we handle them:

### 1. Assume Good Faith

Start by assuming the other person has valid reasons for their position. Ask questions to understand their perspective.

### 2. Focus on Data

When possible, resolve disagreements with data:
- "Can you share the source for that assumption?"
- "Here's data that suggests otherwise..."
- "Let's look at what the research says"

### 3. Acknowledge Uncertainty

It's okay to say "we don't have enough data" or "this is a judgment call." Not everything needs to be resolved definitively.

### 4. Document Disagreements

If there's legitimate disagreement about an assumption, document both perspectives in the code or notes. Transparency about uncertainty is valuable.

### 5. Maintainer Decision

If discussion doesn't resolve the disagreement, maintainers will make a decision based on:
- Quality of data provided
- Alignment with project philosophy
- Impact on transparency
- Practical considerations

Decisions will be explained clearly.

## Code Style

### TypeScript

- Use TypeScript for all new code
- Avoid `any` types—use proper types or `unknown`
- Use explicit return types for public functions
- Document complex logic with comments

### Formatting

We use Prettier with these settings (see `.prettierrc.json`):
- No semicolons
- Single quotes
- 2-space indentation
- 100 character line width
- Trailing commas (ES5)

Run `npm run lint` before committing.

### Naming Conventions

- **Files**: `kebab-case.ts`
- **Functions**: `camelCase`
- **Classes**: `PascalCase`
- **Constants**: `UPPER_SNAKE_CASE`
- **Types/Interfaces**: `PascalCase`

### Comments

- Explain **why**, not **what**
- Document assumptions explicitly
- Include sources for data-driven decisions
- Keep comments up-to-date with code

### Example: Well-Styled Code

```typescript
/**
 * Calculates experience score based on role requirements.
 * 
 * Assumption: Most mid-level roles require 3 years of experience.
 * This is based on analysis of 1000 job postings (see issue #42).
 * 
 * @param profile - User's experience profile
 * @param goal - Career goal being evaluated
 * @returns Score from 0-100 indicating experience match
 */
private calculateExperienceScore(
  profile: UserProfile,
  goal: CareerGoal
): number {
  // Implementation...
}
```

## Pull Request Guidelines

### Before Submitting

- [ ] Code passes type checking (`npm run type-check`)
- [ ] Code passes linting (`npm run lint`)
- [ ] Code builds successfully (`npm run build`)
- [ ] Documentation is updated (if needed)
- [ ] Assumptions are documented with sources
- [ ] PR description explains what and why

### PR Description Template

```markdown
## What Changed
Brief description of what you changed.

## Why
Why this change is needed or valuable.

## Data/Sources
If applicable, include:
- Data sources
- Sample sizes
- Research methodology
- Links to sources

## Testing
How you tested the changes.

## Questions/Concerns
Any questions or concerns you have about the change.
```

### Review Process

1. **Automated checks** must pass (type checking, linting, build)
2. **Code review** by maintainers
3. **Discussion** if needed
4. **Approval** and merge

We aim to review PRs within a week. If it's been longer, feel free to ping us.

## Questions?

- **Uncertain about something?** Open an issue to discuss
- **Found a bug?** Open an issue with steps to reproduce
- **Want feedback on an idea?** Open an issue with the "discussion" label
- **Need help getting started?** Check existing issues or open a new one

## Code of Conduct

### Be Respectful

- Critique ideas, not people
- Assume good faith
- Be constructive in feedback
- Acknowledge when you're uncertain

### Be Transparent

- Document your assumptions
- Cite your sources
- Acknowledge limitations
- Explain your reasoning

### Be Thoughtful

- Research before proposing changes
- Consider edge cases
- Think about maintainability
- Quality over speed

## Recognition

Contributors will be:
- Listed in the project (if they want)
- Credited in commit messages
- Acknowledged in release notes

We appreciate all contributions, whether code, documentation, research, or discussion.

---

**Remember**: The goal is to make Career Reality Checker more accurate and transparent. Every contribution that moves us toward that goal is valuable.
