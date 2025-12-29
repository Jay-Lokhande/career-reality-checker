# Career Scenarios

This directory contains predefined career scenarios with explicit assumptions about requirements, timelines, and common challenges.

## Purpose

Scenarios provide realistic templates for evaluating career goals. Each scenario includes:

- **Minimum skill requirements**: What skills are needed and at what proficiency level
- **Time requirements**: Daily hours needed during different phases
- **Timeline ranges**: Realistic timeframes for best/average/worst case outcomes
- **Common failure reasons**: Why people typically fail to achieve this goal

## Available Scenarios

### 1. FAANG Software Development Engineer

**ID**: `faang-sde`

A Software Development Engineer role at a FAANG company (Facebook/Meta, Amazon, Apple, Netflix, Google) or similar top-tier tech company.

**Key Requirements**:
- 2+ years of experience
- Strong data structures and algorithms (proficiency 4+)
- System design knowledge (proficiency 3+)
- 200+ LeetCode problems typically needed

**Timeline**: 6-24 months (best to worst case)

**Daily Hours**: 3 hours skill building + 1 hour job search + 2 hours interview prep

### 2. Machine Learning Engineer

**ID**: `ml-engineer`

A Machine Learning Engineer role focused on building and deploying ML systems in production.

**Key Requirements**:
- 1+ years of experience
- Strong ML fundamentals (proficiency 4+)
- Deep learning frameworks (TensorFlow/PyTorch)
- Strong mathematical foundation

**Timeline**: 9-36 months (best to worst case)

**Daily Hours**: 4 hours skill building + 1 hour job search + 2 hours interview prep

### 3. Masters Degree → Research Path

**ID**: `masters-research-path`

Pursuing a Masters degree as a stepping stone to research-oriented roles or PhD programs.

**Key Requirements**:
- Strong undergraduate GPA (typically 3.5+)
- Research experience
- Clear research interests
- Academic writing skills

**Timeline**: 24-48 months (best to worst case, including application time)

**Daily Hours**: 6 hours (full-time student workload)

## Using Scenarios

Scenarios can be used to:

1. **Evaluate user profiles**: Compare a user's profile against scenario requirements
2. **Set realistic expectations**: Use timeline ranges and failure reasons to inform users
3. **Generate recommendations**: Use skill requirements to suggest learning paths
4. **Identify gaps**: Compare user skills against minimum requirements

## Adding New Scenarios

To add a new scenario:

1. Define the scenario object following the `CareerScenario` interface
2. Include explicit assumptions about:
   - Minimum experience and education
   - Required skills with proficiency levels
   - Realistic timeline ranges
   - Daily time commitments
   - Common failure reasons with frequency estimates
3. Add the scenario to the `scenarios` array in `index.ts`
4. Document the scenario in this README

## Scenario Structure

Each scenario includes:

```typescript
{
  id: string                    // Unique identifier
  name: string                  // Human-readable name
  description: string           // Detailed description
  targetRole: string            // Target job title
  targetIndustry: string        // Industry sector
  minExperienceYears: number    // Minimum experience required
  preferredEducation: string    // Preferred education level
  skillRequirements: [...]      // List of required skills
  timelineRanges: {...}         // Best/average/worst timelines
  timeRequirements: {...}       // Daily hour requirements
  commonFailureReasons: [...]   // Why people fail
  notes?: string                // Additional context
  typicalSalaryRange?: {...}    // Salary reference (optional)
}
```

## Assumptions and Realism

All scenarios are based on:

- **Industry research**: Typical requirements from job postings and career guides
- **Realistic timelines**: Based on actual career transition stories
- **Explicit assumptions**: All requirements are clearly stated
- **Common patterns**: Failure reasons based on observed patterns

Scenarios should be updated as industries evolve and new data becomes available.

