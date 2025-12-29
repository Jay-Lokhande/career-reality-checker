/**
 * Scenarios module
 *
 * This module contains scenario definitions that combine
 * multiple rules to create complete assessment scenarios.
 *
 * Each scenario represents a realistic career path with explicit assumptions
 * about requirements, timelines, and common challenges.
 */
/**
 * Minimum skill requirements for a scenario.
 * Each skill must be at this proficiency level (0-5) or higher.
 */
export interface SkillRequirement {
    /** Name of the skill */
    skillName: string;
    /** Minimum required proficiency level (0-5) */
    minProficiency: 0 | 1 | 2 | 3 | 4 | 5;
    /** Whether this skill is critical (must have) or nice to have */
    isCritical: boolean;
    /** Estimated months to learn this skill from scratch to minProficiency */
    monthsToLearn?: number;
}
/**
 * Timeline range for a scenario.
 * Represents realistic timeframes for different probability bands.
 */
export interface TimelineRange {
    /** Best case scenario timeline in months */
    bestCaseMonths: number;
    /** Average case scenario timeline in months */
    averageCaseMonths: number;
    /** Worst case scenario timeline in months */
    worstCaseMonths: number;
}
/**
 * Daily time requirements for different phases of the career path.
 */
export interface TimeRequirements {
    /** Daily hours needed during skill-building phase */
    skillBuildingHours: number;
    /** Daily hours needed during job search phase */
    jobSearchHours: number;
    /** Daily hours needed during interview preparation phase */
    interviewPrepHours: number;
    /** Whether these hours are in addition to a full-time job */
    isOnTopOfFullTimeJob: boolean;
}
/**
 * Common reasons why people fail to achieve this career goal.
 * Used to generate warnings and set realistic expectations.
 */
export interface CommonFailureReason {
    /** Category of failure reason */
    category: 'skill_gap' | 'timeline' | 'competition' | 'preparation' | 'expectations' | 'market' | 'resource_constraint';
    /** Description of the failure reason */
    description: string;
    /** How common this failure reason is (percentage, 0-100) */
    frequency: number;
}
/**
 * Career scenario definition with explicit assumptions and requirements.
 */
export interface CareerScenario {
    /** Unique identifier for the scenario */
    id: string;
    /** Human-readable name of the scenario */
    name: string;
    /** Detailed description of the career path */
    description: string;
    /** Target role title */
    targetRole: string;
    /** Target industry */
    targetIndustry: string;
    /** Minimum years of relevant experience typically required */
    minExperienceYears: number;
    /** Preferred education level (not always strict requirement) */
    preferredEducation: 'high_school' | 'associates' | 'bachelors' | 'masters' | 'doctorate';
    /** Minimum skill requirements */
    skillRequirements: SkillRequirement[];
    /** Typical timeline ranges for different outcomes */
    timelineRanges: TimelineRange;
    /** Daily time requirements */
    timeRequirements: TimeRequirements;
    /** Common reasons people fail to achieve this goal */
    commonFailureReasons: CommonFailureReason[];
    /** Additional context or notes about this scenario */
    notes?: string;
    /** Typical salary range (optional, for reference) */
    typicalSalaryRange?: {
        min: number;
        max: number;
        currency: string;
    };
}
/**
 * Career scenario definitions.
 *
 * These scenarios represent realistic career paths with explicit assumptions.
 * Each scenario can be used to evaluate a user's profile against known requirements.
 */
export declare const scenarios: CareerScenario[];
//# sourceMappingURL=index.d.ts.map