'use client'

import { useState } from 'react'
import type {
  RealityCheckInput,
  RealityCheckResult,
  UserProfile,
  CareerGoal,
  Skill,
} from '@career-reality-checker/engine'

export default function Home() {
  const [result, setResult] = useState<RealityCheckResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setResult(null)

    const formData = new FormData(e.currentTarget)

    // Build skills array
    const skillNames = formData.get('skills')?.toString().split(',').map(s => s.trim()).filter(Boolean) || []
    const skills: Skill[] = skillNames.map(name => ({
      name,
      proficiency: 2, // Default to beginner-intermediate, user can adjust later
    }))

    // Build user profile
    const profile: UserProfile = {
      age: parseInt(formData.get('age')?.toString() || '25'),
      education: {
        level: (formData.get('education')?.toString() || 'bachelors') as UserProfile['education']['level'],
      },
      experience: {
        totalYears: parseFloat(formData.get('totalYears')?.toString() || '0'),
        relevantYears: parseFloat(formData.get('relevantYears')?.toString() || '0'),
      },
      skills,
      employmentStatus: (formData.get('employmentStatus')?.toString() || 'employed') as UserProfile['employmentStatus'],
    }

    // Build career goal
    const goal: CareerGoal = {
      targetRole: formData.get('targetRole')?.toString() || '',
      targetIndustry: formData.get('targetIndustry')?.toString() || '',
      timeline: {
        targetMonths: parseInt(formData.get('targetMonths')?.toString() || '12'),
        isFlexible: formData.get('timelineFlexible') === 'true',
      },
    }

    const input: RealityCheckInput = { profile, goal }

    try {
      const response = await fetch('/api/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Evaluation failed')
      }

      const data = await response.json()
      setResult(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="container">
      <header className="header">
        <h1>Career Reality Checker</h1>
        <p className="subtitle">A calm, honest assessment of your career goals</p>
      </header>

      {!result ? (
        <form onSubmit={handleSubmit} className="form">
          <section className="form-section">
            <h2>Your Profile</h2>
            
            <div className="form-group">
              <label htmlFor="age">Age</label>
              <input
                type="number"
                id="age"
                name="age"
                defaultValue={25}
                min={16}
                max={100}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="education">Education Level</label>
              <select id="education" name="education" defaultValue="bachelors" required>
                <option value="none">No formal education</option>
                <option value="high_school">High school</option>
                <option value="associates">Associate's degree</option>
                <option value="bachelors">Bachelor's degree</option>
                <option value="masters">Master's degree</option>
                <option value="doctorate">Doctorate</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="employmentStatus">Employment Status</label>
              <select id="employmentStatus" name="employmentStatus" required>
                <option value="employed">Employed full-time</option>
                <option value="unemployed">Unemployed</option>
                <option value="self_employed">Self-employed</option>
                <option value="student">Student</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="totalYears">Total Years of Work Experience</label>
              <input
                type="number"
                id="totalYears"
                name="totalYears"
                defaultValue={0}
                min={0}
                step={0.5}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="relevantYears">Years of Relevant Experience</label>
              <input
                type="number"
                id="relevantYears"
                name="relevantYears"
                defaultValue={0}
                min={0}
                step={0.5}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="skills">
                Skills (comma-separated, e.g., "JavaScript, Python, React")
              </label>
              <input
                type="text"
                id="skills"
                name="skills"
                placeholder="JavaScript, Python, React"
              />
            </div>
          </section>

          <section className="form-section">
            <h2>Your Career Goal</h2>

            <div className="form-group">
              <label htmlFor="targetRole">Target Role</label>
              <input
                type="text"
                id="targetRole"
                name="targetRole"
                placeholder="e.g., Software Engineer, Data Scientist"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="targetIndustry">Target Industry</label>
              <input
                type="text"
                id="targetIndustry"
                name="targetIndustry"
                placeholder="e.g., Technology, Healthcare, Finance"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="targetMonths">Target Timeline (months)</label>
              <input
                type="number"
                id="targetMonths"
                name="targetMonths"
                defaultValue={12}
                min={1}
                max={120}
                required
              />
            </div>

            <div className="form-group">
              <label>
                <input
                  type="checkbox"
                  name="timelineFlexible"
                  value="true"
                />
                Timeline is flexible
              </label>
            </div>
          </section>

          {error && <div className="error">{error}</div>}

          <button type="submit" className="submit-button" disabled={loading}>
            {loading ? 'Evaluating...' : 'Get Reality Check'}
          </button>
        </form>
      ) : (
        <div className="results">
          <button
            onClick={() => setResult(null)}
            className="back-button"
          >
            ← Start Over
          </button>

          <ResultsDisplay result={result} />
        </div>
      )}
    </main>
  )
}

function ResultsDisplay({ result }: { result: RealityCheckResult }) {
  const average = result.probabilityBands.average

  return (
    <div className="results-content">
      <div className="score-section">
        <h2>Overall Assessment</h2>
        <div className="score-value">{result.overallScore}/100</div>
        <p className="score-description">
          {result.overallScore >= 80
            ? 'Strong alignment with your goal. You have a solid foundation.'
            : result.overallScore >= 60
            ? 'Moderate alignment. Some gaps to address, but achievable with effort.'
            : 'Significant gaps identified. This will require substantial preparation.'}
        </p>
      </div>

      <div className="timeline-section">
        <h2>Realistic Timeline</h2>
        <p className="timeline-main">
          Based on your profile, a realistic timeline is approximately{' '}
          <strong>{average.estimatedTimelineMonths} months</strong>.
        </p>
        <div className="timeline-breakdown">
          <div>
            <strong>Best case:</strong> {result.probabilityBands.best.estimatedTimelineMonths} months
            <span className="likelihood"> ({result.probabilityBands.best.likelihood}% likelihood)</span>
          </div>
          <div>
            <strong>Average case:</strong> {average.estimatedTimelineMonths} months
            <span className="likelihood"> ({average.likelihood}% likelihood)</span>
          </div>
          <div>
            <strong>Worst case:</strong> {result.probabilityBands.worst.estimatedTimelineMonths} months
            <span className="likelihood"> ({result.probabilityBands.worst.likelihood}% likelihood)</span>
          </div>
        </div>
      </div>

      <div className="time-requirement-section">
        <h2>Time Commitment</h2>
        <p>
          To achieve this goal, you'll need to dedicate approximately{' '}
          <strong>{average.requiredDailyHours} hours per day</strong> to skill development,
          networking, and job searching.
        </p>
        {average.sacrifices.reduceCurrentJobCommitment && (
          <p className="sacrifice-note">
            Note: This may require reducing your current job commitment.
          </p>
        )}
      </div>

      {result.warnings.length > 0 && (
        <div className="warnings-section">
          <h2>Important Considerations</h2>
          {result.warnings.map((warning, idx) => (
            <div key={idx} className={`warning warning-${warning.severity}`}>
              <strong>{warning.severity === 3 ? '⚠️ High Priority:' : warning.severity === 2 ? '⚡ Medium Priority:' : 'ℹ️ Note:'}</strong>
              <p>{warning.message}</p>
              {warning.suggestedActions && warning.suggestedActions.length > 0 && (
                <ul>
                  {warning.suggestedActions.map((action, actionIdx) => (
                    <li key={actionIdx}>{action}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}

      {result.skillGaps.length > 0 && (
        <div className="skill-gaps-section">
          <h2>Skill Gaps to Address</h2>
          <ul>
            {result.skillGaps.map((gap, idx) => (
              <li key={idx}>
                <strong>{gap.skillName}</strong>: Currently at level {gap.currentProficiency}/5,
                need level {gap.requiredProficiency}/5
                {gap.estimatedTimeToAcquireMonths && (
                  <span> (estimated {gap.estimatedTimeToAcquireMonths} months to acquire)</span>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="recommendations-section">
        <h2>Recommendations</h2>
        <ul>
          {result.recommendations.map((rec, idx) => (
            <li key={idx}>{rec}</li>
          ))}
        </ul>
      </div>

      <div className="score-breakdown">
        <h2>Score Breakdown</h2>
        <div className="breakdown-grid">
          <div>
            <strong>Experience:</strong> {result.scoreBreakdown.experienceScore}/100
          </div>
          <div>
            <strong>Skills:</strong> {result.scoreBreakdown.skillScore}/100
          </div>
          <div>
            <strong>Education:</strong> {result.scoreBreakdown.educationScore}/100
          </div>
          <div>
            <strong>Timeline:</strong> {result.scoreBreakdown.timelineScore}/100
          </div>
        </div>
      </div>
    </div>
  )
}
