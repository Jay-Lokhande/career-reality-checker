/**
 * Rules module
 * 
 * This module contains all rule definitions for career assessments.
 * Rules should be pure functions that are easy to understand and audit.
 */

export interface Rule {
  id: string
  name: string
  evaluate: (context: unknown) => number
}

/**
 * Placeholder for rule definitions
 * Rules will be implemented here as pure functions
 */
export const rules: Rule[] = []



