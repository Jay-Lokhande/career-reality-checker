/**
 * Career Reality Checker - Type Definitions
 *
 * This module defines the core data models for the Career Reality Checker engine.
 * All types are designed to be:
 * - Transparent: Clear naming and explicit fields
 * - Explainable: Self-documenting with comments
 * - Extensible: Structured to allow easy extension by contributors
 */
/**
 * Probability band representing the likelihood of achieving a career goal.
 * Used to categorize outcomes into distinct scenarios.
 */
export type ProbabilityBand = 'best' | 'average' | 'worst';
/**
 * Warning flags that can be raised during reality check evaluation.
 * Each flag represents a specific concern or risk factor.
 */
export type WarningFlag = 'insufficient_experience' | 'skill_gap_detected' | 'timeline_unrealistic' | 'market_saturation' | 'education_requirement_mismatch' | 'salary_expectation_mismatch' | 'location_constraint' | 'competition_level_high' | 'career_path_unclear' | 'resource_constraint';
/**
 * Educational background information.
 * Extensible: Add more fields as needed (e.g., certifications, online courses).
 */
export interface Education {
    /** Highest level of education completed */
    level: 'high_school' | 'associates' | 'bachelors' | 'masters' | 'doctorate' | 'none';
    /** Field of study (e.g., "Computer Science", "Business Administration") */
    field?: string;
    /** Year of graduation (if applicable) */
    graduationYear?: number;
    /** Institution name (optional, for privacy) */
    institution?: string;
}
/**
 * Professional experience details.
 * Extensible: Add more granular fields (e.g., industry, company size, team size).
 */
export interface Experience {
    /** Total years of professional experience */
    totalYears: number;
    /** Years of experience in the target field/industry */
    relevantYears: number;
    /** Current job title or role */
    currentRole?: string;
    /** List of previous job titles (most recent first) */
    previousRoles?: string[];
}
/**
 * Skill assessment with proficiency levels.
 * Extensible: Add more skill categories or sub-skills as needed.
 */
export interface Skill {
    /** Name of the skill (e.g., "JavaScript", "Project Management") */
    name: string;
    /** Proficiency level from 0 (none) to 5 (expert) */
    proficiency: 0 | 1 | 2 | 3 | 4 | 5;
    /** Years of experience with this specific skill */
    yearsOfExperience?: number;
}
/**
 * User profile containing all relevant information for career assessment.
 * Extensible: Add optional fields for additional context (e.g., location, salary, industry).
 */
export interface UserProfile {
    /** User's age (for context on career stage) */
    age: number;
    /** Educational background */
    education: Education;
    /** Professional experience */
    experience: Experience;
    /** List of skills with proficiency levels */
    skills: Skill[];
    /** Current employment status */
    employmentStatus: 'employed' | 'unemployed' | 'self_employed' | 'student';
    /** Geographic location (optional, for market analysis) */
    location?: {
        country: string;
        city?: string;
        /** Whether location is flexible for job search */
        isFlexible?: boolean;
    };
    /** Additional context that doesn't fit standard fields */
    additionalContext?: Record<string, unknown>;
}
/**
 * Timeline specification for career goal achievement.
 * Extensible: Add more granular time units if needed.
 */
export interface Timeline {
    /** Target time to achieve the goal in months */
    targetMonths: number;
    /** Whether the timeline is flexible (can be extended) */
    isFlexible: boolean;
    /** Minimum acceptable timeline in months (if flexible) */
    minimumMonths?: number;
    /** Maximum acceptable timeline in months (if flexible) */
    maximumMonths?: number;
}
/**
 * Salary expectations for the career goal.
 * Extensible: Add more fields (e.g., equity, benefits, negotiation range).
 */
export interface SalaryExpectation {
    /** Desired annual salary (in local currency) */
    desired: number;
    /** Minimum acceptable salary (in local currency) */
    minimum: number;
    /** Currency code (ISO 4217, e.g., "USD", "EUR") */
    currency: string;
}
/**
 * Career goal definition specifying what the user wants to achieve.
 * Extensible: Add more fields for specific goal types (e.g., promotion, career change, startup).
 */
export interface CareerGoal {
    /** Target job title or role */
    targetRole: string;
    /** Target industry or sector (e.g., "Technology", "Healthcare", "Finance") */
    targetIndustry: string;
    /** Timeline for achieving this goal */
    timeline: Timeline;
    /** Salary expectations */
    salaryExpectation?: SalaryExpectation;
    /** Specific requirements or constraints (e.g., remote work, specific company) */
    requirements?: {
        /** Must be remote work */
        remoteOnly?: boolean;
        /** Must be at a specific company */
        targetCompany?: string;
        /** Must be in a specific location */
        targetLocation?: string;
        /** Other custom requirements */
        other?: string[];
    };
    /** Motivation or reason for this goal (for context) */
    motivation?: string;
}
/**
 * Sacrifice indicators showing what the user may need to give up or reduce
 * to achieve their career goal. These are boolean flags indicating trade-offs.
 */
export interface SacrificeIndicators {
    /** May need to reduce leisure/social activities */
    reduceLeisureTime: boolean;
    /** May need to reduce current job hours or quit job */
    reduceCurrentJobCommitment: boolean;
    /** May need to invest significant money in education/training */
    financialInvestment: boolean;
    /** May need to relocate or travel extensively */
    locationFlexibility: boolean;
    /** May need to accept lower salary initially */
    acceptLowerSalary: boolean;
    /** May need to work nights/weekends */
    workNonStandardHours: boolean;
    /** May need to delay other life goals (family, travel, etc.) */
    delayOtherGoals: boolean;
}
/**
 * Detailed breakdown of evaluation results for a specific probability band.
 * Extensible: Add more metrics or breakdown fields as needed.
 */
export interface ProbabilityBandResult {
    /** The probability band this result represents */
    band: ProbabilityBand;
    /** Likelihood percentage (0-100) of this outcome */
    likelihood: number;
    /** Estimated timeline in months for this outcome */
    estimatedTimelineMonths: number;
    /** Required daily hours of effort (learning, networking, job searching, etc.) */
    requiredDailyHours: number;
    /** Sacrifice indicators showing what trade-offs are needed */
    sacrifices: SacrificeIndicators;
    /** Key factors contributing to this outcome */
    contributingFactors: string[];
    /** Required actions to achieve this outcome */
    requiredActions: string[];
    /** Additional context or notes */
    notes?: string;
}
/**
 * Individual warning with details about a specific concern.
 * Extensible: Add more fields (e.g., severity level, mitigation strategies).
 */
export interface Warning {
    /** Type of warning flag */
    flag: WarningFlag;
    /** Human-readable description of the warning */
    message: string;
    /** Specific data or context that triggered this warning */
    context?: Record<string, unknown>;
    /** Suggested actions to address this warning */
    suggestedActions?: string[];
    /** Severity level (1 = low, 2 = medium, 3 = high) */
    severity: 1 | 2 | 3;
}
/**
 * Skill gap analysis showing what skills are missing or insufficient.
 * Extensible: Add more fields (e.g., learning resources, time to acquire).
 */
export interface SkillGap {
    /** Name of the skill that is missing or insufficient */
    skillName: string;
    /** Current proficiency level (if any) */
    currentProficiency: number;
    /** Required proficiency level for the goal */
    requiredProficiency: number;
    /** Priority level (1 = critical, 2 = important, 3 = nice to have) */
    priority: 1 | 2 | 3;
    /** Estimated time in months to reach required proficiency */
    estimatedTimeToAcquireMonths?: number;
}
/**
 * Comprehensive result of a career reality check evaluation.
 * Extensible: Add more result fields (e.g., market analysis, competitor analysis).
 */
export interface RealityCheckResult {
    /** Overall assessment score (0-100) */
    overallScore: number;
    /** Results for each probability band (best, average, worst) */
    probabilityBands: {
        best: ProbabilityBandResult;
        average: ProbabilityBandResult;
        worst: ProbabilityBandResult;
    };
    /** List of warnings raised during evaluation */
    warnings: Warning[];
    /** Analysis of skill gaps */
    skillGaps: SkillGap[];
    /** Specific recommendations for achieving the goal */
    recommendations: string[];
    /** Detailed breakdown of scoring factors */
    scoreBreakdown: {
        /** Score for experience match (0-100) */
        experienceScore: number;
        /** Score for skill match (0-100) */
        skillScore: number;
        /** Score for education match (0-100) */
        educationScore: number;
        /** Score for timeline feasibility (0-100) */
        timelineScore: number;
        /** Score for market conditions (0-100) */
        marketScore?: number;
    };
    /** Metadata about the evaluation */
    metadata: {
        /** Timestamp when evaluation was performed */
        evaluatedAt: string;
        /** Version of the evaluation engine used */
        engineVersion: string;
        /** Scenario ID used for evaluation (if applicable) */
        scenarioId?: string;
    };
    /** Additional context or notes from the evaluation */
    notes?: string;
}
/**
 * Input data structure for performing a reality check evaluation.
 * Combines user profile and career goal.
 */
export interface RealityCheckInput {
    /** User profile information */
    profile: UserProfile;
    /** Career goal to evaluate */
    goal: CareerGoal;
}
//# sourceMappingURL=models.d.ts.map