/**
 * Career Reality Checker Engine
 * 
 * Main entry point for the rule-based evaluation engine.
 */

export { Evaluator } from './evaluator'
export { scenarios } from './scenarios'
export type {
  // Core types
  RealityCheckInput,
  RealityCheckResult,
  // User profile types
  UserProfile,
  Education,
  Experience,
  Skill,
  // Career goal types
  CareerGoal,
  Timeline,
  SalaryExpectation,
  // Result types
  ProbabilityBand,
  ProbabilityBandResult,
  SacrificeIndicators,
  WarningFlag,
  Warning,
  SkillGap,
} from './models'
export type {
  CareerScenario,
  SkillRequirement,
  TimelineRange,
  TimeRequirements,
  CommonFailureReason,
} from './scenarios'

