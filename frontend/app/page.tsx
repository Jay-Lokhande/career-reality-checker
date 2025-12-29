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

      <div className="probability-bands-explanation">
        <h2>Why These Probability Bands?</h2>
        <p className="explanation-intro">
          Each probability band represents a different scenario based on how well your current profile
          aligns with your goal. Here's why each band was assigned:
        </p>

        <div className="band-explanation">
          <h3>
            Best Case ({result.probabilityBands.best.estimatedTimelineMonths} months,{' '}
            {result.probabilityBands.best.likelihood}% likelihood)
          </h3>
          <p className="band-description">
            This outcome assumes everything goes well: high motivation, consistent effort, and favorable
            market conditions.
          </p>
          <div className="contributing-factors">
            <strong>Contributing factors:</strong>
            <ul>
              {result.probabilityBands.best.contributingFactors.map((factor, idx) => (
                <li key={idx}>{factor}</li>
              ))}
            </ul>
          </div>
          {result.probabilityBands.best.requiredActions.length > 0 && (
            <div className="required-actions">
              <strong>What you'd need to do:</strong>
              <ul>
                {result.probabilityBands.best.requiredActions.map((action, idx) => (
                  <li key={idx}>{action}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="band-explanation">
          <h3>
            Average Case ({average.estimatedTimelineMonths} months, {average.likelihood}% likelihood)
          </h3>
          <p className="band-description">
            This is the most likely outcome: standard progress with typical challenges along the way.
          </p>
          <div className="contributing-factors">
            <strong>Contributing factors:</strong>
            <ul>
              {average.contributingFactors.map((factor, idx) => (
                <li key={idx}>{factor}</li>
              ))}
            </ul>
          </div>
          {average.requiredActions.length > 0 && (
            <div className="required-actions">
              <strong>What you'd need to do:</strong>
              <ul>
                {average.requiredActions.map((action, idx) => (
                  <li key={idx}>{action}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="band-explanation">
          <h3>
            Worst Case ({result.probabilityBands.worst.estimatedTimelineMonths} months,{' '}
            {result.probabilityBands.worst.likelihood}% likelihood)
          </h3>
          <p className="band-description">
            This outcome accounts for significant obstacles, unexpected challenges, or if preparation
            takes longer than expected.
          </p>
          <div className="contributing-factors">
            <strong>Contributing factors:</strong>
            <ul>
              {result.probabilityBands.worst.contributingFactors.map((factor, idx) => (
                <li key={idx}>{factor}</li>
              ))}
            </ul>
          </div>
          {result.probabilityBands.worst.requiredActions.length > 0 && (
            <div className="required-actions">
              <strong>What you'd need to do:</strong>
              <ul>
                {result.probabilityBands.worst.requiredActions.map((action, idx) => (
                  <li key={idx}>{action}</li>
                ))}
              </ul>
            </div>
          )}
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
          <p className="explanation-intro">
            These warnings appeared because specific conditions in your profile or goal triggered
            our evaluation rules. Each warning explains what was detected and why it matters.
          </p>
          {result.warnings.map((warning, idx) => (
            <div key={idx} className={`warning warning-${warning.severity}`}>
              <div className="warning-header">
                <strong>
                  {warning.severity === 3
                    ? '⚠️ High Priority:'
                    : warning.severity === 2
                    ? '⚡ Medium Priority:'
                    : 'ℹ️ Note:'}
                </strong>
                <span className="warning-flag">Flag: {warning.flag.replace(/_/g, ' ')}</span>
              </div>
              <p className="warning-message">{warning.message}</p>
              {warning.context && Object.keys(warning.context).length > 0 && (
                <div className="warning-context">
                  <strong>Why this warning appeared:</strong>
                  <ul>
                    {Object.entries(warning.context).map(([key, value]) => (
                      <li key={key}>
                        <strong>{key.replace(/([A-Z])/g, ' $1').trim()}:</strong>{' '}
                        {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {warning.suggestedActions && warning.suggestedActions.length > 0 && (
                <div className="warning-actions">
                  <strong>Suggested actions:</strong>
                  <ul>
                    {warning.suggestedActions.map((action, actionIdx) => (
                      <li key={actionIdx}>{action}</li>
                    ))}
                  </ul>
                </div>
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
        <p className="explanation-intro">
          Your overall score is calculated from four components, each weighted differently:
        </p>
        <div className="breakdown-grid">
          <div>
            <strong>Experience:</strong> {result.scoreBreakdown.experienceScore}/100
            <span className="weight"> (30% weight)</span>
          </div>
          <div>
            <strong>Skills:</strong> {result.scoreBreakdown.skillScore}/100
            <span className="weight"> (30% weight)</span>
          </div>
          <div>
            <strong>Education:</strong> {result.scoreBreakdown.educationScore}/100
            <span className="weight"> (20% weight)</span>
          </div>
          <div>
            <strong>Timeline:</strong> {result.scoreBreakdown.timelineScore}/100
            <span className="weight"> (20% weight)</span>
          </div>
        </div>
        <p className="score-calculation">
          Overall score: ({result.scoreBreakdown.experienceScore} × 0.3) + (
          {result.scoreBreakdown.skillScore} × 0.3) + ({result.scoreBreakdown.educationScore} × 0.2) + (
          {result.scoreBreakdown.timelineScore} × 0.2) = <strong>{result.overallScore}/100</strong>
        </p>
      </div>

      <div className="assumptions-section">
        <h2>Assumptions That Influenced This Result</h2>
        <p className="explanation-intro">
          Our evaluation is based on explicit assumptions. Understanding these helps you see why
          the result is what it is, even if you don't agree with it.
        </p>
        <div className="assumptions-list">
          <div className="assumption-item">
            <strong>Experience Requirements:</strong>
            <p>
              We estimate that most roles require 2-5 years of relevant experience. Senior roles
              need 5+ years, entry-level roles need 0-2 years. Your score reflects how your{' '}
              {result.scoreBreakdown.experienceScore < 50
                ? 'limited'
                : result.scoreBreakdown.experienceScore < 80
                ? 'moderate'
                : 'strong'}{' '}
              experience ({result.scoreBreakdown.experienceScore}/100) compares to these benchmarks.
            </p>
          </div>

          <div className="assumption-item">
            <strong>Skill Proficiency:</strong>
            <p>
              Most professional roles require skills at proficiency level 3-4 (intermediate to
              advanced). Your skill score of {result.scoreBreakdown.skillScore}/100 reflects
              how well your current skills match typical requirements for your target role.
            </p>
          </div>

          <div className="assumption-item">
            <strong>Education Standards:</strong>
            <p>
              We assume a bachelor's degree is standard for most professional roles (80 points).
              Higher degrees get full points (100), while lower education levels receive
              proportionally fewer points. Your education score is {result.scoreBreakdown.educationScore}/100.
            </p>
          </div>

          <div className="assumption-item">
            <strong>Timeline Realism:</strong>
            <p>
              We estimate learning a new skill to proficiency level 3 takes 3-6 months. Gaining
              one year of experience requires 12 months (can't be accelerated). Career changes
              add 6-12 months. Your timeline score of {result.scoreBreakdown.timelineScore}/100
              reflects how realistic your target timeline is given these constraints.
            </p>
          </div>

          <div className="assumption-item">
            <strong>Probability Band Likelihood:</strong>
            <p>
              The likelihood percentages are based on your overall score. Higher scores make the
              best case more likely (30% if score ≥80, 20% if 50-80, 10% if &lt;50). Lower scores
              make the worst case more likely (40% if score &lt;50, 30% if 50-80, 20% if ≥80).
              The average case is always the most likely outcome.
            </p>
          </div>

          <div className="assumption-item">
            <strong>Daily Time Requirements:</strong>
            <p>
              We assume you need 2 hours/day minimum, plus 0.5 hours per skill gap, plus 1 hour
              if you have experience gaps. These hours are for skill building, networking, job
              searching, and interview preparation combined.
            </p>
          </div>

          <div className="assumption-item">
            <strong>Market Conditions:</strong>
            <p>
              Our evaluation assumes typical market conditions. We don't account for economic
              downturns, industry-specific booms, or exceptional personal circumstances. These
              factors could significantly change outcomes.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
