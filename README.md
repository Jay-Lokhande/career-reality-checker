# Career Reality Checker

A transparent, rule-based tool that gives you an honest assessment of your career goals.

## What This Is

Career Reality Checker evaluates how realistic your career goals are based on your current profile. It uses explicit, auditable rules—no AI, no black boxes, no marketing speak.

You input:
- Your current skills, experience, and education
- Your career goal (role, industry, timeline)
- Your constraints (time available, location, etc.)

You get:
- An overall score (0-100) showing alignment with your goal
- Three probability bands (best/average/worst case scenarios)
- Specific warnings when expectations don't match reality
- Clear explanations of why each result was assigned
- Explicit assumptions that influenced the evaluation

## What This Is NOT

- **Not a career coach**: It doesn't tell you what you should do with your life
- **Not a job board**: It doesn't find you jobs or connect you with employers
- **Not motivational**: It won't tell you "you can do anything if you believe"
- **Not a prediction**: The probability bands are scenarios, not forecasts
- **Not personalized advice**: The rules are general; your situation may be unique
- **Not a guarantee**: Even "best case" scenarios can fail; even "worst case" can succeed

## Philosophy

### Transparency Over Accuracy

We prioritize being transparent about our assumptions over being "right." Every score, warning, and probability band comes with an explanation of why it appeared. You can disagree with the result, but you'll understand it.

### Deterministic, Not Random

The same inputs always produce the same outputs. There's no randomness, no "AI magic," no hidden variables. If you want to know why you got a certain score, you can trace it through the code.

### Honest, Not Harsh

We don't sugarcoat, but we're not trying to discourage you. The goal is to help you set realistic expectations so you can plan effectively. Sometimes that means telling you your timeline is optimistic. Sometimes it means showing you what you'd need to sacrifice.

### Explainable, Not Mysterious

Every warning explains what triggered it. Every probability band shows its contributing factors. Every assumption is documented. If you don't like the result, you should at least understand it.

## Example Output

Here's what a typical result looks like:

```
Overall Assessment: 65/100
Moderate alignment. Some gaps to address, but achievable with effort.

Realistic Timeline: 18 months (average case)
- Best case: 12 months (20% likelihood)
- Average case: 18 months (50% likelihood)  
- Worst case: 30 months (30% likelihood)

Time Commitment: 4 hours per day

Warnings:
⚠️ High Priority: Timeline Unrealistic
Your target timeline of 6 months is 67% shorter than the average 18 months 
for Software Engineer roles. Based on industry data, 67% of people with 
similar profiles take longer than your target.

Why this warning appeared:
- User timeline: 6 months
- Average timeline: 18 months
- Months shortfall: 12 months

Assumptions:
- Learning a new skill to proficiency level 3: 3-6 months
- Gaining 1 year of experience: 12 months (cannot be accelerated)
- Career change penalty: +6 months
```

## How It Works

The evaluation engine:

1. **Scores your profile** against typical requirements for your target role
   - Experience match (30% weight)
   - Skill match (30% weight)
   - Education match (20% weight)
   - Timeline feasibility (20% weight)

2. **Calculates probability bands** based on your scores
   - Best case: Everything goes well
   - Average case: Normal progress with typical challenges
   - Worst case: Significant obstacles

3. **Identifies mismatches** between your expectations and reality
   - Time availability vs. required hours
   - Your timeline vs. statistical averages
   - Your skills vs. role requirements

4. **Explains everything** so you understand why you got this result

All logic is in `engine/src/evaluator.ts`. You can read it, audit it, and understand it.

## Important Disclaimers

### About Probabilities

The "probability bands" are not predictions. They're scenarios based on:
- How well your profile matches typical requirements
- Industry averages for similar transitions
- General assumptions about skill acquisition timelines

**Reality is messier.** You might beat the "best case" timeline. You might face unexpected challenges that push you into "worst case" territory. The bands are tools for planning, not guarantees.

### About Assumptions

We make explicit assumptions:
- Most roles need 2-5 years of relevant experience
- Learning a skill to proficiency 3 takes 3-6 months
- Career changes add 6-12 months
- Bachelor's degree is standard for professional roles

These assumptions are based on general patterns, not your specific situation. If you're exceptional, or if your industry is different, the results may not apply.

### About Limitations

This tool:
- Doesn't know your personal circumstances
- Doesn't account for economic conditions
- Doesn't consider your network or connections
- Doesn't factor in luck or timing
- Doesn't know if you're exceptionally talented or motivated

Use it as a starting point for planning, not as the final word on your career.

## Getting Started

### Prerequisites

- Node.js >= 18.0.0
- npm >= 9.0.0

### Installation

```bash
git clone https://github.com/Jay-Lokhande/career-reality-checker.git
cd career-reality-checker
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
│   ├── src/
│   │   ├── evaluator.ts    # Core evaluation logic
│   │   ├── models.ts       # Type definitions
│   │   ├── scenarios/      # Predefined career scenarios
│   │   └── rules/          # Rule definitions
│   └── dist/               # Compiled output
├── frontend/        # Next.js application
│   ├── app/
│   │   ├── page.tsx        # Main form and results
│   │   └── api/
│   │       └── evaluate/   # Evaluation API endpoint
│   └── package.json
├── docs/            # Additional documentation
├── CONTRIBUTING.md  # Contribution guidelines
└── README.md        # This file
```

## Contributing

We welcome contributions that improve transparency, accuracy, or usability. See [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

When contributing:
- Keep explanations clear and honest
- Document assumptions explicitly
- Avoid adding "motivational" language
- Focus on transparency over "smart" algorithms

## License

MIT License - See [LICENSE](./LICENSE) for details.

## Why This Exists

Career advice is often either too vague ("follow your passion") or too specific ("here's exactly what to do"). This tool tries to fill a middle ground: giving you structured, transparent feedback based on explicit rules you can understand and challenge.

It won't tell you what to do. It will help you understand what you're up against.

## Questions?

- Found a bug? [Open an issue](https://github.com/Jay-Lokhande/career-reality-checker/issues)
- Want to contribute? Read [CONTRIBUTING.md](./CONTRIBUTING.md)
- Disagree with an assumption? That's fine. The code is open—you can see exactly what we're assuming and why.

---

**Remember**: This is a tool, not a truth. Use it to inform your planning, not to limit your ambitions.
