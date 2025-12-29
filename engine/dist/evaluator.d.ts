/**
 * Core evaluation engine for career assessments.
 *
 * This module provides a transparent, rule-based evaluation system
 * that can be easily audited and understood.
 *
 * All logic is deterministic - the same inputs always produce the same outputs.
 * No randomness is used anywhere in the evaluation process.
 */
import type { RealityCheckInput, RealityCheckResult } from './models';
/**
 * Evaluator class for processing career assessment scenarios
 */
export declare class Evaluator {
    /**
     * Evaluates a career goal against a user profile using rule-based logic.
     *
     * This is the main entry point. It breaks down the evaluation into clear steps:
     * 1. Calculate individual scores (experience, skills, education, timeline)
     * 2. Determine probability bands based on scores
     * 3. Calculate required effort (daily hours)
     * 4. Identify necessary sacrifices
     * 5. Generate warnings for unrealistic expectations
     * 6. Identify skill gaps
     * 7. Generate recommendations
     *
     * @param input - The reality check input containing user profile and career goal
     * @returns Comprehensive reality check result with probability bands, warnings, and recommendations
     */
    evaluate(input: RealityCheckInput): RealityCheckResult;
    /**
     * Calculates how well the user's experience matches the career goal.
     *
     * Scoring logic:
     * - If user has MORE than enough experience: 100 points
     * - If user has ENOUGH experience: 80-100 points (based on exact match)
     * - If user has SOME relevant experience: 40-80 points
     * - If user has NO relevant experience: 0-40 points
     *
     * We assume most roles need 2-5 years of relevant experience.
     * Senior roles need 5+ years, entry-level need 0-2 years.
     */
    private calculateExperienceScore;
    /**
     * Calculates how well the user's skills match the career goal.
     *
     * This is a simplified version that assumes:
     * - Most roles need skills at proficiency level 3-4 (intermediate to advanced)
     * - Having the right skills is crucial (50% of skill score)
     * - Skill level matters (50% of skill score)
     *
     * In a real implementation, you would have a database of required skills per role.
     */
    private calculateSkillScore;
    /**
     * Calculates how well the user's education matches the career goal.
     *
     * Scoring logic:
     * - Bachelor's degree is standard for most professional roles: 80 points
     * - Master's degree or higher: 100 points
     * - Associate's degree: 60 points
     * - High school only: 40 points
     * - No education: 0 points
     *
     * Field of study match adds bonus points (up to +20).
     */
    private calculateEducationScore;
    /**
     * Calculates how realistic the timeline is given the user's current situation.
     *
     * Scoring logic:
     * - If user already has most requirements: timeline is very feasible (high score)
     * - If user needs to learn new skills: timeline must account for learning time
     * - If user needs significant experience: timeline must account for gaining experience
     *
     * We estimate:
     * - Learning a new skill to proficiency 3: 3-6 months
     * - Gaining 1 year of experience: 12 months (can't be accelerated)
     * - Career change (new industry): +6-12 months
     */
    private calculateTimelineScore;
    /**
     * Estimates how many years of experience gap the user has.
     * Returns the number of additional years needed (can be 0 or negative if they have enough).
     */
    private estimateExperienceGap;
    /**
     * Calculates probability bands (best, average, worst case scenarios).
     *
     * Each band includes:
     * - Likelihood percentage (how likely this outcome is)
     * - Estimated timeline
     * - Required daily hours
     * - Sacrifice indicators
     * - Contributing factors
     * - Required actions
     */
    private calculateProbabilityBands;
    /**
     * Calculates the likelihood percentage for a probability band.
     *
     * Logic:
     * - Best case: More likely if overall score is high (80+)
     * - Average case: Most likely outcome (always highest)
     * - Worst case: More likely if overall score is low (<50)
     */
    private calculateLikelihood;
    /**
     * Calculates required daily hours of effort needed.
     *
     * This includes:
     * - Learning new skills
     * - Networking
     * - Job searching
     * - Building portfolio/projects
     * - Interview preparation
     *
     * More hours needed if:
     * - User has significant skill gaps
     * - User has experience gaps
     * - Timeline is tight
     * - User is employed (less time available)
     */
    private calculateRequiredHours;
    /**
     * Calculates what sacrifices the user will need to make.
     *
     * These are boolean flags indicating trade-offs.
     * More sacrifices needed if:
     * - Required hours are high
     * - User is employed
     * - Timeline is tight
     * - User needs significant learning
     */
    private calculateSacrifices;
    /**
     * Gets contributing factors for a probability band.
     * These explain why this outcome is likely or unlikely.
     */
    private getContributingFactors;
    /**
     * Gets required actions to achieve the goal in this probability band.
     */
    private getRequiredActions;
    /**
     * Generates warnings when expectations don't match reality.
     *
     * Warnings are raised when:
     * - Timeline is unrealistic
     * - Experience gaps are too large
     * - Skill gaps are critical
     * - Education requirements not met
     * - Time availability doesn't match requirements
     * - Expectations don't match statistical averages
     * - Skill mismatch risks are high
     */
    private generateWarnings;
    /**
     * Identifies skill gaps between user's current skills and what's needed for the goal.
     *
     * This is a simplified implementation. In reality, you would have a database
     * of required skills per role/industry.
     *
     * For now, we assume:
     * - Most roles need skills at proficiency level 3-4
     * - If user has no skills or low proficiency, it's a gap
     */
    private identifySkillGaps;
    /**
     * Generates actionable recommendations based on the evaluation.
     */
    private generateRecommendations;
    /**
     * Checks if user's available time matches required time for the career goal.
     *
     * This warning is triggered when:
     * - User is employed full-time but needs 4+ hours/day
     * - User is unemployed but timeline suggests they're not allocating enough time
     * - Required hours exceed what's realistically sustainable
     *
     * @returns Warning if time availability is insufficient, null otherwise
     */
    private checkTimeAvailabilityWarning;
    /**
     * Compares user's expectations (timeline, salary) against statistical averages from scenarios.
     *
     * This warning is triggered when:
     * - User's timeline is significantly shorter than average for similar roles
     * - User's salary expectations are significantly higher than typical ranges
     * - User's expectations don't align with industry standards
     *
     * @returns Warning if expectations don't match averages, null otherwise
     */
    private checkExpectationVsAveragesWarning;
    /**
     * Checks for specific skill mismatch risks that could derail the career goal.
     *
     * This warning identifies:
     * - Critical skills that are completely missing
     * - Skills where proficiency is far below requirements
     * - Skills that take significant time to learn but are needed soon
     *
     * @returns Array of warnings for skill mismatch risks
     */
    private checkSkillMismatchRisksWarning;
}
//# sourceMappingURL=evaluator.d.ts.map