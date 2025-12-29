/**
 * Core evaluation engine for career assessments.
 * 
 * This module provides a transparent, rule-based evaluation system
 * that can be easily audited and understood.
 * 
 * All logic is deterministic - the same inputs always produce the same outputs.
 * No randomness is used anywhere in the evaluation process.
 */

import type {
  RealityCheckInput,
  RealityCheckResult,
  UserProfile,
  CareerGoal,
  ProbabilityBandResult,
  Warning,
  SkillGap,
  SacrificeIndicators,
} from './models'
import { scenarios } from './scenarios'

/**
 * Evaluator class for processing career assessment scenarios
 */
export class Evaluator {
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
  evaluate(input: RealityCheckInput): RealityCheckResult {
    const { profile, goal } = input

    // Step 1: Calculate individual component scores
    // Each score is 0-100, where 100 means perfect match
    const experienceScore = this.calculateExperienceScore(profile, goal)
    const skillScore = this.calculateSkillScore(profile, goal)
    const educationScore = this.calculateEducationScore(profile, goal)
    const timelineScore = this.calculateTimelineScore(profile, goal)

    // Step 2: Calculate overall score (weighted average)
    // Experience and skills are most important (30% each)
    // Education and timeline are also important (20% each)
    const overallScore = Math.round(
      experienceScore * 0.3 +
      skillScore * 0.3 +
      educationScore * 0.2 +
      timelineScore * 0.2
    )

    // Step 3: Determine probability bands
    // Best case: Everything goes well, user is highly motivated
    // Average case: Normal progress with some challenges
    // Worst case: Significant obstacles or unrealistic expectations
    const probabilityBands = this.calculateProbabilityBands(
      profile,
      goal,
      experienceScore,
      skillScore,
      educationScore,
      timelineScore,
      overallScore
    )

    // Step 4: Generate warnings for unrealistic expectations
    const warnings = this.generateWarnings(
      profile,
      goal,
      {
        experienceScore,
        skillScore,
        educationScore,
        timelineScore,
      },
      probabilityBands
    )

    // Step 5: Identify skill gaps
    const skillGaps = this.identifySkillGaps(profile, goal)

    // Step 6: Generate recommendations
    const recommendations = this.generateRecommendations(
      profile,
      goal,
      experienceScore,
      skillScore,
      educationScore,
      timelineScore,
      skillGaps
    )

    // Step 7: Build final result
    const now = new Date().toISOString()

    return {
      overallScore,
      probabilityBands,
      warnings,
      skillGaps,
      recommendations,
      scoreBreakdown: {
        experienceScore,
        skillScore,
        educationScore,
        timelineScore,
      },
      metadata: {
        evaluatedAt: now,
        engineVersion: '0.1.0',
      },
    }
  }

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
  private calculateExperienceScore(profile: UserProfile, goal: CareerGoal): number {
    const relevantYears = profile.experience.relevantYears
    const totalYears = profile.experience.totalYears

    // Determine how much experience is typically needed for this role
    // We use simple heuristics based on role title keywords
    const roleTitle = goal.targetRole.toLowerCase()
    let requiredYears = 3 // Default: mid-level role needs 3 years

    // Adjust based on role title keywords
    if (roleTitle.includes('senior') || roleTitle.includes('lead') || roleTitle.includes('principal')) {
      requiredYears = 5 // Senior roles need 5+ years
    } else if (roleTitle.includes('junior') || roleTitle.includes('entry') || roleTitle.includes('associate')) {
      requiredYears = 1 // Entry-level roles need 0-2 years
    } else if (roleTitle.includes('director') || roleTitle.includes('manager') || roleTitle.includes('head')) {
      requiredYears = 7 // Management roles need 7+ years
    }

    // Score calculation: compare user's relevant experience to required experience
    if (relevantYears >= requiredYears) {
      // User has enough or more than enough experience
      // Perfect match gets 100, having more gets slight bonus
      return Math.min(100, 80 + Math.min(20, (relevantYears - requiredYears) * 5))
    } else if (relevantYears >= requiredYears * 0.5) {
      // User has some relevant experience (50%+ of required)
      // Score between 40-80 based on how close they are
      const ratio = relevantYears / requiredYears
      return Math.round(40 + (ratio - 0.5) * 80) // Maps 0.5 to 40, 1.0 to 80
    } else if (relevantYears > 0) {
      // User has a little relevant experience (less than 50% of required)
      // Score between 0-40
      const ratio = relevantYears / (requiredYears * 0.5)
      return Math.round(ratio * 40)
    } else {
      // User has no relevant experience
      // Give some points if they have general work experience (shows work ethic)
      if (totalYears > 0) {
        return Math.min(20, totalYears * 5) // Up to 20 points for general experience
      }
      return 0
    }
  }

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
  private calculateSkillScore(profile: UserProfile, _goal: CareerGoal): number {
    // For this implementation, we use a simple heuristic:
    // If user has skills listed, assume they're somewhat relevant
    // In reality, you'd match specific skills to the role

    if (profile.skills.length === 0) {
      return 0 // No skills = 0 score
    }

    // Calculate average proficiency
    const avgProficiency = profile.skills.reduce((sum, skill) => sum + skill.proficiency, 0) / profile.skills.length

    // Most roles need proficiency level 3-4
    // If user has level 3-4: full points
    // If user has level 5: bonus points
    // If user has level 1-2: partial points
    let proficiencyScore = 0
    if (avgProficiency >= 4) {
      proficiencyScore = 100 // Expert level
    } else if (avgProficiency >= 3) {
      proficiencyScore = 80 // Good level
    } else if (avgProficiency >= 2) {
      proficiencyScore = 50 // Basic level
    } else if (avgProficiency >= 1) {
      proficiencyScore = 25 // Beginner level
    }

    // Having multiple skills is also valuable (shows breadth)
    // But we cap this bonus to avoid over-weighting
    const skillCountBonus = Math.min(20, profile.skills.length * 2)

    return Math.min(100, proficiencyScore + skillCountBonus)
  }

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
  private calculateEducationScore(profile: UserProfile, goal: CareerGoal): number {
    const education = profile.education
    let baseScore = 0

    // Base score based on education level
    switch (education.level) {
      case 'doctorate':
        baseScore = 100
        break
      case 'masters':
        baseScore = 100
        break
      case 'bachelors':
        baseScore = 80 // Standard for most professional roles
        break
      case 'associates':
        baseScore = 60
        break
      case 'high_school':
        baseScore = 40
        break
      case 'none':
        baseScore = 0
        break
    }

    // Bonus for field of study match (if specified)
    // In reality, you'd have a mapping of fields to industries
    let fieldBonus = 0
    if (education.field && goal.targetIndustry) {
      // Simple heuristic: if field contains industry keywords, it's a match
      const fieldLower = education.field.toLowerCase()
      const industryLower = goal.targetIndustry.toLowerCase()

      // Check for common matches (e.g., "computer science" matches "technology")
      if (
        (fieldLower.includes('computer') || fieldLower.includes('software') || fieldLower.includes('tech')) &&
        (industryLower.includes('tech') || industryLower.includes('software') || industryLower.includes('it'))
      ) {
        fieldBonus = 20
      } else if (
        (fieldLower.includes('business') || fieldLower.includes('management') || fieldLower.includes('finance')) &&
        (industryLower.includes('business') || industryLower.includes('finance') || industryLower.includes('consulting'))
      ) {
        fieldBonus = 20
      } else if (fieldLower.includes(industryLower) || industryLower.includes(fieldLower)) {
        fieldBonus = 15 // Partial match
      }
    }

    return Math.min(100, baseScore + fieldBonus)
  }

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
  private calculateTimelineScore(profile: UserProfile, goal: CareerGoal): number {
    const targetMonths = goal.timeline.targetMonths

    // Estimate minimum realistic timeline based on gaps
    let minimumRealisticMonths = 0

    // Time needed to gain experience
    const experienceGap = this.estimateExperienceGap(profile, goal)
    minimumRealisticMonths += experienceGap * 12 // Each year of experience needs 12 months

    // Time needed to learn skills
    const skillGaps = this.identifySkillGaps(profile, goal)
    const totalSkillMonths = skillGaps.reduce((sum, gap) => {
      return sum + (gap.estimatedTimeToAcquireMonths || 3) // Default 3 months per skill
    }, 0)
    minimumRealisticMonths += totalSkillMonths

    // Career change penalty (switching industries takes longer)
    const isCareerChange = profile.experience.relevantYears < 1
    if (isCareerChange) {
      minimumRealisticMonths += 6 // Add 6 months for career change
    }

    // If no gaps, minimum is still 1-2 months (job search time)
    if (minimumRealisticMonths < 2) {
      minimumRealisticMonths = 2
    }

    // Score calculation: compare target timeline to minimum realistic timeline
    if (targetMonths >= minimumRealisticMonths * 1.5) {
      // Very realistic timeline (50%+ buffer)
      return 100
    } else if (targetMonths >= minimumRealisticMonths) {
      // Realistic timeline (meets minimum)
      // Score based on how close to minimum (closer = lower score, but still good)
      const ratio = targetMonths / minimumRealisticMonths
      return Math.round(70 + (ratio - 1) * 20) // Maps 1.0 to 70, 1.5 to 100
    } else if (targetMonths >= minimumRealisticMonths * 0.7) {
      // Tight but possible timeline (70-100% of minimum)
      const ratio = targetMonths / minimumRealisticMonths
      return Math.round(40 + (ratio - 0.7) * 100) // Maps 0.7 to 40, 1.0 to 70
    } else {
      // Unrealistic timeline (less than 70% of minimum)
      const ratio = targetMonths / minimumRealisticMonths
      return Math.round(ratio * 57) // Maps 0 to 0, 0.7 to 40
    }
  }

  /**
   * Estimates how many years of experience gap the user has.
   * Returns the number of additional years needed (can be 0 or negative if they have enough).
   */
  private estimateExperienceGap(profile: UserProfile, goal: CareerGoal): number {
    const relevantYears = profile.experience.relevantYears
    const roleTitle = goal.targetRole.toLowerCase()

    // Determine required years (same logic as calculateExperienceScore)
    let requiredYears = 3
    if (roleTitle.includes('senior') || roleTitle.includes('lead') || roleTitle.includes('principal')) {
      requiredYears = 5
    } else if (roleTitle.includes('junior') || roleTitle.includes('entry') || roleTitle.includes('associate')) {
      requiredYears = 1
    } else if (roleTitle.includes('director') || roleTitle.includes('manager') || roleTitle.includes('head')) {
      requiredYears = 7
    }

    const gap = requiredYears - relevantYears
    return Math.max(0, gap) // Return 0 if they have enough or more
  }

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
  private calculateProbabilityBands(
    profile: UserProfile,
    goal: CareerGoal,
    experienceScore: number,
    skillScore: number,
    educationScore: number,
    timelineScore: number,
    overallScore: number
  ): {
    best: ProbabilityBandResult
    average: ProbabilityBandResult
    worst: ProbabilityBandResult
  } {
    // Calculate base timeline (minimum realistic)
    const experienceGap = this.estimateExperienceGap(profile, goal)
    const skillGaps = this.identifySkillGaps(profile, goal)
    const totalSkillMonths = skillGaps.reduce((sum, gap) => sum + (gap.estimatedTimeToAcquireMonths || 3), 0)
    const isCareerChange = profile.experience.relevantYears < 1
    const baseMonths = Math.max(
      2,
      experienceGap * 12 + totalSkillMonths + (isCareerChange ? 6 : 0)
    )

    // BEST CASE: Everything goes well
    // - User is highly motivated and puts in maximum effort
    // - Gets lucky with opportunities
    // - Timeline is 80% of base (optimistic but possible)
    const bestCaseMonths = Math.max(1, Math.round(baseMonths * 0.8))
    const bestCaseLikelihood = this.calculateLikelihood(overallScore, 'best')
    const bestCaseHours = this.calculateRequiredHours(profile, goal, 'best', experienceScore, skillScore)

    // AVERAGE CASE: Normal progress
    // - Standard effort and typical challenges
    // - Timeline is 100% of base (realistic)
    const averageCaseMonths = Math.max(2, Math.round(baseMonths))
    const averageCaseLikelihood = this.calculateLikelihood(overallScore, 'average')
    const averageCaseHours = this.calculateRequiredHours(profile, goal, 'average', experienceScore, skillScore)

    // WORST CASE: Significant obstacles
    // - User faces unexpected challenges
    // - Timeline is 150% of base (pessimistic but realistic)
    const worstCaseMonths = Math.max(3, Math.round(baseMonths * 1.5))
    const worstCaseLikelihood = this.calculateLikelihood(overallScore, 'worst')
    const worstCaseHours = this.calculateRequiredHours(profile, goal, 'worst', experienceScore, skillScore)

    return {
      best: {
        band: 'best',
        likelihood: bestCaseLikelihood,
        estimatedTimelineMonths: bestCaseMonths,
        requiredDailyHours: bestCaseHours,
        sacrifices: this.calculateSacrifices(profile, goal, 'best', bestCaseHours),
        contributingFactors: this.getContributingFactors(overallScore, experienceScore, skillScore, educationScore, 'best'),
        requiredActions: this.getRequiredActions(profile, goal, experienceScore, skillScore, 'best'),
      },
      average: {
        band: 'average',
        likelihood: averageCaseLikelihood,
        estimatedTimelineMonths: averageCaseMonths,
        requiredDailyHours: averageCaseHours,
        sacrifices: this.calculateSacrifices(profile, goal, 'average', averageCaseHours),
        contributingFactors: this.getContributingFactors(overallScore, experienceScore, skillScore, educationScore, 'average'),
        requiredActions: this.getRequiredActions(profile, goal, experienceScore, skillScore, 'average'),
      },
      worst: {
        band: 'worst',
        likelihood: worstCaseLikelihood,
        estimatedTimelineMonths: worstCaseMonths,
        requiredDailyHours: worstCaseHours,
        sacrifices: this.calculateSacrifices(profile, goal, 'worst', worstCaseHours),
        contributingFactors: this.getContributingFactors(overallScore, experienceScore, skillScore, educationScore, 'worst'),
        requiredActions: this.getRequiredActions(profile, goal, experienceScore, skillScore, 'worst'),
      },
    }
  }

  /**
   * Calculates the likelihood percentage for a probability band.
   * 
   * Logic:
   * - Best case: More likely if overall score is high (80+)
   * - Average case: Most likely outcome (always highest)
   * - Worst case: More likely if overall score is low (<50)
   */
  private calculateLikelihood(overallScore: number, band: 'best' | 'average' | 'worst'): number {
    if (band === 'average') {
      // Average case is always the most likely (40-60% of outcomes)
      return 50 // Default to 50%, can be adjusted based on score
    } else if (band === 'best') {
      // Best case is more likely when score is high
      // If score is 80+: 30% chance
      // If score is 50-80: 20% chance
      // If score is <50: 10% chance
      if (overallScore >= 80) {
        return 30
      } else if (overallScore >= 50) {
        return 20
      } else {
        return 10
      }
    } else {
      // Worst case is more likely when score is low
      // If score is <50: 40% chance
      // If score is 50-80: 30% chance
      // If score is 80+: 20% chance
      if (overallScore < 50) {
        return 40
      } else if (overallScore < 80) {
        return 30
      } else {
        return 20
      }
    }
  }

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
  private calculateRequiredHours(
    profile: UserProfile,
    goal: CareerGoal,
    band: 'best' | 'average' | 'worst',
    experienceScore: number,
    _skillScore: number
  ): number {
    // Base hours: everyone needs some effort
    let baseHours = 2 // 2 hours/day minimum

    // Add hours for skill gaps
    const skillGaps = this.identifySkillGaps(profile, goal)
    if (skillGaps.length > 0) {
      baseHours += skillGaps.length * 0.5 // 0.5 hours per skill gap
    }

    // Add hours for experience gaps
    if (experienceScore < 50) {
      baseHours += 1 // Need to gain experience through projects/volunteering
    }

    // Adjust based on probability band
    // Best case: user is efficient, needs less time
    // Worst case: user faces challenges, needs more time
    let multiplier = 1.0
    if (band === 'best') {
      multiplier = 0.8 // 20% less time needed (efficient, lucky)
    } else if (band === 'worst') {
      multiplier = 1.3 // 30% more time needed (challenges, setbacks)
    }

    // If user is employed, they have less time, so hours are more concentrated
    // But total effort is the same, so we don't adjust here
    // (The sacrifice indicators will show they need to reduce job commitment)

    const totalHours = baseHours * multiplier

    // Cap at reasonable maximum (8 hours/day is already very intensive)
    return Math.min(8, Math.round(totalHours * 10) / 10) // Round to 1 decimal
  }

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
  private calculateSacrifices(
    profile: UserProfile,
    goal: CareerGoal,
    band: 'best' | 'average' | 'worst',
    requiredHours: number
  ): SacrificeIndicators {
    const isEmployed = profile.employmentStatus === 'employed'
    const skillGaps = this.identifySkillGaps(profile, goal)
    const hasSignificantGaps = skillGaps.length > 2 || skillGaps.some(gap => gap.priority === 1)
    const timelineTight = goal.timeline.targetMonths < 12

    return {
      // Reduce leisure time if more than 3 hours/day needed
      reduceLeisureTime: requiredHours > 3,

      // Reduce job commitment if employed and need significant time
      reduceCurrentJobCommitment: isEmployed && requiredHours > 4,

      // Financial investment if need education/training
      financialInvestment: hasSignificantGaps || profile.education.level === 'high_school' || profile.education.level === 'none',

      // Location flexibility if goal requires specific location
      locationFlexibility: goal.requirements?.targetLocation !== undefined && !profile.location?.isFlexible,

      // Accept lower salary if switching careers or entry-level
      acceptLowerSalary: profile.experience.relevantYears < 1 || goal.targetRole.toLowerCase().includes('junior') || goal.targetRole.toLowerCase().includes('entry'),

      // Work non-standard hours if timeline is tight
      workNonStandardHours: timelineTight && requiredHours > 4,

      // Delay other goals if significant effort needed
      delayOtherGoals: requiredHours > 5 || hasSignificantGaps,
    }
  }

  /**
   * Gets contributing factors for a probability band.
   * These explain why this outcome is likely or unlikely.
   */
  private getContributingFactors(
    overallScore: number,
    experienceScore: number,
    skillScore: number,
    educationScore: number,
    band: 'best' | 'average' | 'worst'
  ): string[] {
    const factors: string[] = []

    if (band === 'best') {
      if (overallScore >= 80) {
        factors.push('Strong alignment between current profile and target role')
      }
      if (experienceScore >= 80) {
        factors.push('Sufficient relevant experience')
      }
      if (skillScore >= 80) {
        factors.push('Strong skill match')
      }
      if (educationScore >= 80) {
        factors.push('Education requirements met')
      }
      factors.push('High motivation and consistent effort')
      factors.push('Favorable market conditions and opportunities')
    } else if (band === 'average') {
      factors.push('Moderate alignment with target role')
      if (experienceScore < 70) {
        factors.push('Some experience gaps to address')
      }
      if (skillScore < 70) {
        factors.push('Some skill development needed')
      }
      factors.push('Standard progress with typical challenges')
    } else {
      if (overallScore < 50) {
        factors.push('Significant gaps between current profile and target role')
      }
      if (experienceScore < 50) {
        factors.push('Insufficient relevant experience')
      }
      if (skillScore < 50) {
        factors.push('Major skill gaps')
      }
      if (educationScore < 50) {
        factors.push('Education requirements not met')
      }
      factors.push('Potential market challenges or competition')
      factors.push('Unrealistic timeline expectations')
    }

    return factors
  }

  /**
   * Gets required actions to achieve the goal in this probability band.
   */
  private getRequiredActions(
    profile: UserProfile,
    goal: CareerGoal,
    experienceScore: number,
    skillScore: number,
    band: 'best' | 'average' | 'worst'
  ): string[] {
    const actions: string[] = []

    // Skill-related actions
    if (skillScore < 80) {
      const skillGaps = this.identifySkillGaps(profile, goal)
      skillGaps.forEach(gap => {
        if (gap.priority === 1) {
          actions.push(`Learn ${gap.skillName} to proficiency level ${gap.requiredProficiency}`)
        }
      })
    }

    // Experience-related actions
    if (experienceScore < 80) {
      actions.push('Gain relevant experience through projects, volunteering, or side work')
    }

    // Networking
    actions.push('Build professional network in target industry')
    actions.push('Attend industry events and meetups')

    // Job search
    if (band === 'best' || band === 'average') {
      actions.push('Apply to relevant positions consistently')
      actions.push('Prepare for technical and behavioral interviews')
    }

    // Portfolio/resume
    actions.push('Build portfolio or update resume to highlight relevant experience')

    // Education (if needed)
    if (profile.education.level === 'high_school' || profile.education.level === 'none') {
      if (band === 'worst') {
        actions.push('Consider additional education or certifications')
      }
    }

    return actions
  }

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
  private generateWarnings(
    profile: UserProfile,
    goal: CareerGoal,
    scores: {
      experienceScore: number
      skillScore: number
      educationScore: number
      timelineScore: number
    },
    probabilityBands: {
      best: ProbabilityBandResult
      average: ProbabilityBandResult
      worst: ProbabilityBandResult
    }
  ): Warning[] {
    const warnings: Warning[] = []

    // Timeline warning
    if (scores.timelineScore < 40) {
      warnings.push({
        flag: 'timeline_unrealistic',
        message: `Your target timeline of ${goal.timeline.targetMonths} months may be unrealistic given your current profile. Consider extending your timeline.`,
        severity: 3, // High severity
        suggestedActions: [
          'Review and adjust your timeline expectations',
          'Break down your goal into smaller milestones',
          'Consider a phased approach to your career transition',
        ],
      })
    }

    // Experience warning
    if (scores.experienceScore < 40) {
      warnings.push({
        flag: 'insufficient_experience',
        message: 'You have insufficient relevant experience for this role. Significant experience building will be required.',
        severity: 3,
        context: {
          relevantYears: profile.experience.relevantYears,
          targetRole: goal.targetRole,
        },
        suggestedActions: [
          'Consider targeting a more junior role first',
          'Focus on gaining relevant experience through projects',
          'Look for opportunities to work in related roles',
        ],
      })
    }

    // Skill gap warning
    if (scores.skillScore < 40) {
      warnings.push({
        flag: 'skill_gap_detected',
        message: 'Significant skill gaps detected. You will need to invest substantial time in skill development.',
        severity: 3,
        suggestedActions: [
          'Identify critical skills needed for the role',
          'Create a learning plan with timelines',
          'Practice skills through real projects',
        ],
      })
    }

    // Education warning
    if (scores.educationScore < 40) {
      warnings.push({
        flag: 'education_requirement_mismatch',
        message: 'Your education level may not meet typical requirements for this role.',
        severity: 2, // Medium severity (some roles are flexible)
        suggestedActions: [
          'Research if the role truly requires higher education',
          'Consider certifications or alternative credentials',
          'Highlight relevant experience to compensate',
        ],
      })
    }

    // Career change warning
    if (profile.experience.relevantYears < 1 && goal.targetIndustry) {
      warnings.push({
        flag: 'career_path_unclear',
        message: 'You are attempting a significant career change. This will require more time and effort than a typical transition.',
        severity: 2,
        suggestedActions: [
          'Research the target industry thoroughly',
          'Network with people already in the field',
          'Consider informational interviews',
          'Build relevant experience gradually',
        ],
      })
    }

    // Location constraint warning
    if (goal.requirements?.targetLocation && !profile.location?.isFlexible) {
      warnings.push({
        flag: 'location_constraint',
        message: 'Your location requirement may limit opportunities. Consider if relocation is possible.',
        severity: 1, // Low severity (personal choice)
        suggestedActions: [
          'Research job market in your target location',
          'Consider remote work options if available',
          'Evaluate if relocation is feasible',
        ],
      })
    }

    // Remote-only constraint warning
    if (goal.requirements?.remoteOnly) {
      warnings.push({
        flag: 'competition_level_high',
        message: 'Remote-only positions are highly competitive. You may face more competition.',
        severity: 2,
        suggestedActions: [
          'Consider hybrid or on-site options to increase opportunities',
          'Strengthen your remote work skills and portfolio',
          'Be prepared for a longer job search',
        ],
      })
    }

    // New warning checks: Time availability, expectations vs averages, skill mismatch risks
    const timeWarning = this.checkTimeAvailabilityWarning(profile, goal, probabilityBands)
    if (timeWarning) warnings.push(timeWarning)

    const expectationWarning = this.checkExpectationVsAveragesWarning(profile, goal, probabilityBands)
    if (expectationWarning) warnings.push(expectationWarning)

    const skillMismatchWarnings = this.checkSkillMismatchRisksWarning(profile, goal, scores.skillScore)
    warnings.push(...skillMismatchWarnings)

    return warnings
  }

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
  private identifySkillGaps(profile: UserProfile, goal: CareerGoal): SkillGap[] {
    const gaps: SkillGap[] = []

    // Simplified: if user has fewer than 3 skills or average proficiency < 3, flag gaps
    if (profile.skills.length < 3) {
      // Assume they need at least 3 relevant skills
      const neededSkills = 3 - profile.skills.length
      for (let i = 0; i < neededSkills; i++) {
        gaps.push({
          skillName: `Required skill ${i + 1} for ${goal.targetRole}`,
          currentProficiency: 0,
          requiredProficiency: 3,
          priority: 1, // Critical
          estimatedTimeToAcquireMonths: 6,
        })
      }
    }

    // Check for low proficiency skills
    profile.skills.forEach(skill => {
      if (skill.proficiency < 3) {
        gaps.push({
          skillName: skill.name,
          currentProficiency: skill.proficiency,
          requiredProficiency: 3,
          priority: skill.proficiency === 0 ? 1 : 2, // Critical if 0, important if 1-2
          estimatedTimeToAcquireMonths: (3 - skill.proficiency) * 2, // 2 months per level
        })
      }
    })

    return gaps
  }

  /**
   * Generates actionable recommendations based on the evaluation.
   */
  private generateRecommendations(
    profile: UserProfile,
    goal: CareerGoal,
    experienceScore: number,
    skillScore: number,
    educationScore: number,
    timelineScore: number,
    skillGaps: SkillGap[]
  ): string[] {
    const recommendations: string[] = []

    // Experience recommendations
    if (experienceScore < 70) {
      recommendations.push('Focus on gaining relevant experience through side projects, freelancing, or volunteering')
      if (profile.experience.relevantYears === 0) {
        recommendations.push('Consider targeting an entry-level or junior role first to build experience')
      }
    }

    // Skill recommendations
    if (skillScore < 70) {
      const criticalGaps = skillGaps.filter(gap => gap.priority === 1)
      if (criticalGaps.length > 0) {
        recommendations.push(`Prioritize learning: ${criticalGaps.map(gap => gap.skillName).join(', ')}`)
      }
      recommendations.push('Build a portfolio showcasing your skills through real projects')
    }

    // Education recommendations
    if (educationScore < 70) {
      if (profile.education.level === 'high_school' || profile.education.level === 'none') {
        recommendations.push('Consider pursuing relevant certifications or online courses')
        recommendations.push('Research if the role truly requires a degree, or if experience can substitute')
      }
    }

    // Timeline recommendations
    if (timelineScore < 50) {
      recommendations.push('Consider extending your timeline to make the goal more achievable')
      recommendations.push('Break your goal into smaller milestones with intermediate targets')
    }

    // General recommendations
    recommendations.push('Network actively in your target industry through LinkedIn, meetups, and events')
    recommendations.push('Research the job market and salary ranges for your target role')
    recommendations.push('Prepare a strong resume and cover letter tailored to your target role')
    recommendations.push('Practice interview skills, especially for technical roles')

    // Career change specific
    if (profile.experience.relevantYears < 1) {
      recommendations.push('Conduct informational interviews with people in your target field')
      recommendations.push('Consider shadowing or internships to gain industry exposure')
    }

    return recommendations
  }

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
  private checkTimeAvailabilityWarning(
    profile: UserProfile,
    goal: CareerGoal,
    probabilityBands: {
      best: ProbabilityBandResult
      average: ProbabilityBandResult
      worst: ProbabilityBandResult
    }
  ): Warning | null {
    const requiredHours = probabilityBands.average.requiredDailyHours
    const isEmployed = profile.employmentStatus === 'employed'

    // Estimate available hours based on employment status
    let availableHours = 0
    if (isEmployed) {
      // Full-time employed: typically 2-4 hours available after work
      // Assuming 8h work + 1h commute + 1h meals = 10h, leaving 2-4h for career development
      availableHours = 3 // Conservative estimate
    } else if (profile.employmentStatus === 'unemployed') {
      // Unemployed: can dedicate full day, but realistic is 6-8 hours
      availableHours = 7
    } else if (profile.employmentStatus === 'student') {
      // Student: depends on course load, estimate 4-5 hours
      availableHours = 4
    } else {
      // Self-employed: variable, estimate 3-4 hours
      availableHours = 3.5
    }

    // Check if required hours exceed available hours
    if (requiredHours > availableHours * 1.2) {
      // More than 20% over available time is a warning
      const hoursOver = Math.round((requiredHours - availableHours) * 10) / 10

      let message = ''
      let severity: 1 | 2 | 3 = 2

      if (isEmployed && requiredHours > 5) {
        message = `You need ${requiredHours} hours per day, but as a full-time employee, you likely only have ${availableHours} hours available. This is ${hoursOver} hours more than realistic. You may need to reduce your current job commitment or extend your timeline.`
        severity = 3 // High severity - very difficult to sustain
      } else if (requiredHours > 8) {
        message = `You need ${requiredHours} hours per day, which exceeds a sustainable 8-hour workday. This level of commitment is difficult to maintain long-term and may lead to burnout. Consider extending your timeline to reduce daily requirements.`
        severity = 3
      } else {
        message = `You need ${requiredHours} hours per day, but based on your current situation (${profile.employmentStatus}), you likely have approximately ${availableHours} hours available. You're ${hoursOver} hours short per day, which could significantly impact your progress.`
        severity = requiredHours > availableHours * 1.5 ? 3 : 2
      }

      return {
        flag: 'resource_constraint',
        message,
        severity,
        context: {
          requiredHours,
          availableHours,
          employmentStatus: profile.employmentStatus,
          hoursShortfall: hoursOver,
        },
        suggestedActions: [
          isEmployed
            ? 'Consider reducing work hours or taking a sabbatical if financially feasible'
            : 'Review your daily schedule to identify time blocks for career development',
          'Break down learning into smaller, more manageable daily chunks',
          'Consider extending your timeline to reduce daily time pressure',
          'Use time-blocking techniques to maximize productivity during available hours',
        ],
      }
    }

    return null
  }

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
  private checkExpectationVsAveragesWarning(
    profile: UserProfile,
    goal: CareerGoal,
    _probabilityBands: {
      best: ProbabilityBandResult
      average: ProbabilityBandResult
      worst: ProbabilityBandResult
    }
  ): Warning | null {
    // Try to find a matching scenario
    const matchingScenario = scenarios.find(
      scenario =>
        scenario.targetRole.toLowerCase().includes(goal.targetRole.toLowerCase()) ||
        goal.targetRole.toLowerCase().includes(scenario.targetRole.toLowerCase()) ||
        (scenario.targetIndustry.toLowerCase() === goal.targetIndustry.toLowerCase() &&
          scenario.minExperienceYears <= profile.experience.relevantYears + 2)
    )

    if (!matchingScenario) {
      // No matching scenario found, can't compare
      return null
    }

    const userTimeline = goal.timeline.targetMonths
    const averageTimeline = matchingScenario.timelineRanges.averageCaseMonths

    // Check timeline expectations
    if (userTimeline < averageTimeline * 0.7) {
      // User expects timeline 30%+ shorter than average
      const monthsShort = Math.round((averageTimeline - userTimeline) * 10) / 10
      const percentageFaster = Math.round(((averageTimeline - userTimeline) / averageTimeline) * 100)

      return {
        flag: 'timeline_unrealistic',
        message: `Your target timeline of ${userTimeline} months is ${percentageFaster}% shorter than the average ${averageTimeline} months for ${matchingScenario.name}. Based on industry data, ${percentageFaster}% of people with similar profiles take longer than your target. This suggests your expectations may be optimistic.`,
        severity: 3,
        context: {
          userTimeline,
          averageTimeline,
          monthsShort,
          percentageFaster,
          scenarioName: matchingScenario.name,
        },
        suggestedActions: [
          `Consider extending your timeline to ${averageTimeline} months to align with typical outcomes`,
          'Review common failure reasons for this path to understand typical challenges',
          'Break your goal into phases with intermediate milestones',
          'Set a more aggressive "best case" timeline while planning for the average case',
        ],
      }
    }

    // Check salary expectations if provided
    if (goal.salaryExpectation && matchingScenario.typicalSalaryRange) {
      const userDesired = goal.salaryExpectation.desired
      const typicalMax = matchingScenario.typicalSalaryRange.max
      const typicalMin = matchingScenario.typicalSalaryRange.min

      if (userDesired > typicalMax * 1.2) {
        // User expects 20%+ more than typical maximum
        const percentageOver = Math.round(((userDesired - typicalMax) / typicalMax) * 100)

        return {
          flag: 'salary_expectation_mismatch',
          message: `Your desired salary of ${userDesired.toLocaleString()} ${goal.salaryExpectation.currency} is ${percentageOver}% higher than the typical maximum (${typicalMax.toLocaleString()} ${goal.salaryExpectation.currency}) for ${matchingScenario.name}. Only top performers at top companies typically reach this level. Your expectations may be unrealistic unless you have exceptional qualifications.`,
          severity: 2,
          context: {
            userDesired,
            typicalMin,
            typicalMax,
            percentageOver,
            scenarioName: matchingScenario.name,
          },
          suggestedActions: [
            'Research salary ranges for your specific location and experience level',
            'Consider that salary expectations may need adjustment based on your actual qualifications',
            'Focus on building skills and experience first, salary will follow',
            'Be open to accepting a lower initial salary to get your foot in the door',
          ],
        }
      }
    }

    return null
  }

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
  private checkSkillMismatchRisksWarning(
    profile: UserProfile,
    goal: CareerGoal,
    skillScore: number
  ): Warning[] {
    const warnings: Warning[] = []

    // Find matching scenario to get skill requirements
    const matchingScenario = scenarios.find(
      scenario =>
        scenario.targetRole.toLowerCase().includes(goal.targetRole.toLowerCase()) ||
        goal.targetRole.toLowerCase().includes(scenario.targetRole.toLowerCase()) ||
        (scenario.targetIndustry.toLowerCase() === goal.targetIndustry.toLowerCase() &&
          scenario.minExperienceYears <= profile.experience.relevantYears + 2)
    )

    if (!matchingScenario) {
      // No scenario match, use general skill gap warning if score is low
      if (skillScore < 40) {
        warnings.push({
          flag: 'skill_gap_detected',
          message: 'Significant skill gaps detected. Without specific role requirements, we recommend researching the exact skills needed for this position and comparing them to your current skill set.',
          severity: 3,
          suggestedActions: [
            'Research job postings for your target role to identify required skills',
            'Compare your current skills against typical requirements',
            'Create a learning plan to address skill gaps',
            'Consider informational interviews with people in the role',
          ],
        })
      }
      return warnings
    }

    // Check each required skill against user's skills
    const criticalMissingSkills: string[] = []
    const lowProficiencySkills: Array<{ name: string; current: number; required: number }> = []

    for (const requirement of matchingScenario.skillRequirements) {
      if (!requirement.isCritical) continue // Only check critical skills

      // Find matching skill in user's profile
      const userSkill = profile.skills.find(
        skill =>
          skill.name.toLowerCase().includes(requirement.skillName.toLowerCase()) ||
          requirement.skillName.toLowerCase().includes(skill.name.toLowerCase())
      )

      if (!userSkill) {
        // Skill completely missing
        criticalMissingSkills.push(requirement.skillName)
      } else if (userSkill.proficiency < requirement.minProficiency) {
        // Skill exists but proficiency is too low
        const gap = requirement.minProficiency - userSkill.proficiency
        if (gap >= 2) {
          // Gap of 2+ levels is significant
          lowProficiencySkills.push({
            name: requirement.skillName,
            current: userSkill.proficiency,
            required: requirement.minProficiency,
          })
        }
      }
    }

    // Generate warnings for missing critical skills
    if (criticalMissingSkills.length > 0) {
      const monthsToLearn = criticalMissingSkills
        .map(skillName => {
          const req = matchingScenario.skillRequirements.find(r => r.skillName === skillName)
          return req?.monthsToLearn || 6
        })
        .reduce((sum, months) => sum + months, 0)

      warnings.push({
        flag: 'skill_gap_detected',
        message: `You are missing ${criticalMissingSkills.length} critical skill${criticalMissingSkills.length > 1 ? 's' : ''} required for ${matchingScenario.name}: ${criticalMissingSkills.join(', ')}. Based on typical learning curves, acquiring these skills could take approximately ${monthsToLearn} months. This is a significant gap that must be addressed before you can realistically achieve this goal.`,
        severity: 3,
        context: {
          missingSkills: criticalMissingSkills,
          estimatedMonthsToLearn: monthsToLearn,
          scenarioName: matchingScenario.name,
        },
        suggestedActions: [
          `Prioritize learning: ${criticalMissingSkills[0]} (most critical)`,
          'Create a structured learning plan with milestones',
          'Build projects that demonstrate these skills',
          'Consider taking courses or finding a mentor',
          `Adjust your timeline to account for ${monthsToLearn} months of skill development`,
        ],
      })
    }

    // Generate warnings for low proficiency skills
    if (lowProficiencySkills.length > 0) {
      const skillDetails = lowProficiencySkills
        .map(s => `${s.name} (current: ${s.current}/5, needed: ${s.required}/5)`)
        .join('; ')

      warnings.push({
        flag: 'skill_gap_detected',
        message: `Your proficiency in ${lowProficiencySkills.length} critical skill${lowProficiencySkills.length > 1 ? 's is' : ' is'} below the required level: ${skillDetails}. You'll need to significantly improve these skills, which typically requires ${lowProficiencySkills.length * 2}-${lowProficiencySkills.length * 4} months of focused practice.`,
        severity: 2,
        context: {
          lowProficiencySkills,
          scenarioName: matchingScenario.name,
        },
        suggestedActions: [
          'Focus on deliberate practice in these specific skill areas',
          'Build projects that require these skills at the target proficiency level',
          'Seek feedback from experts or mentors',
          'Consider taking advanced courses or workshops',
        ],
      })
    }

    return warnings
  }
}
