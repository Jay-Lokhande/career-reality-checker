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
 * Career scenario definitions.
 *
 * These scenarios represent realistic career paths with explicit assumptions.
 * Each scenario can be used to evaluate a user's profile against known requirements.
 */
export const scenarios = [
    {
        id: 'faang-sde',
        name: 'FAANG Software Development Engineer',
        description: 'Software Development Engineer role at a FAANG company (Facebook/Meta, Amazon, Apple, Netflix, Google) or similar top-tier tech company. These roles are highly competitive and require strong technical skills, problem-solving ability, and system design knowledge.',
        targetRole: 'Software Development Engineer',
        targetIndustry: 'Technology',
        minExperienceYears: 2,
        preferredEducation: 'bachelors',
        skillRequirements: [
            {
                skillName: 'Data Structures and Algorithms',
                minProficiency: 4,
                isCritical: true,
                monthsToLearn: 6,
            },
            {
                skillName: 'System Design',
                minProficiency: 3,
                isCritical: true,
                monthsToLearn: 4,
            },
            {
                skillName: 'At least one programming language (Java, Python, C++, etc.)',
                minProficiency: 4,
                isCritical: true,
                monthsToLearn: 12,
            },
            {
                skillName: 'Problem Solving',
                minProficiency: 4,
                isCritical: true,
                monthsToLearn: 6,
            },
            {
                skillName: 'Computer Science Fundamentals',
                minProficiency: 3,
                isCritical: false,
                monthsToLearn: 12,
            },
        ],
        timelineRanges: {
            bestCaseMonths: 6,
            averageCaseMonths: 12,
            worstCaseMonths: 24,
        },
        timeRequirements: {
            skillBuildingHours: 3,
            jobSearchHours: 1,
            interviewPrepHours: 2,
            isOnTopOfFullTimeJob: true,
        },
        commonFailureReasons: [
            {
                category: 'competition',
                description: 'Extremely high competition - thousands of qualified candidates apply for each position',
                frequency: 40,
            },
            {
                category: 'skill_gap',
                description: 'Insufficient preparation for technical interviews, especially system design and algorithms',
                frequency: 35,
            },
            {
                category: 'preparation',
                description: 'Not solving enough LeetCode problems or practicing system design',
                frequency: 30,
            },
            {
                category: 'expectations',
                description: 'Unrealistic timeline - expecting to land a FAANG job in 3-6 months without sufficient background',
                frequency: 25,
            },
            {
                category: 'skill_gap',
                description: 'Lack of strong computer science fundamentals or relevant work experience',
                frequency: 20,
            },
        ],
        notes: 'FAANG companies have rigorous interview processes with multiple rounds. Success typically requires 200+ LeetCode problems solved and strong system design knowledge. Many candidates apply multiple times before succeeding.',
        typicalSalaryRange: {
            min: 150000,
            max: 300000,
            currency: 'USD',
        },
    },
    {
        id: 'ml-engineer',
        name: 'Machine Learning Engineer',
        description: 'Machine Learning Engineer role focused on building, deploying, and maintaining ML systems in production. Requires strong background in ML algorithms, software engineering, and often deep learning frameworks.',
        targetRole: 'Machine Learning Engineer',
        targetIndustry: 'Technology',
        minExperienceYears: 1,
        preferredEducation: 'masters',
        skillRequirements: [
            {
                skillName: 'Machine Learning Fundamentals',
                minProficiency: 4,
                isCritical: true,
                monthsToLearn: 12,
            },
            {
                skillName: 'Python',
                minProficiency: 4,
                isCritical: true,
                monthsToLearn: 6,
            },
            {
                skillName: 'Deep Learning (TensorFlow/PyTorch)',
                minProficiency: 3,
                isCritical: true,
                monthsToLearn: 6,
            },
            {
                skillName: 'Statistics and Mathematics',
                minProficiency: 3,
                isCritical: true,
                monthsToLearn: 12,
            },
            {
                skillName: 'Software Engineering',
                minProficiency: 3,
                isCritical: true,
                monthsToLearn: 12,
            },
            {
                skillName: 'MLOps / Model Deployment',
                minProficiency: 2,
                isCritical: false,
                monthsToLearn: 4,
            },
        ],
        timelineRanges: {
            bestCaseMonths: 9,
            averageCaseMonths: 18,
            worstCaseMonths: 36,
        },
        timeRequirements: {
            skillBuildingHours: 4,
            jobSearchHours: 1,
            interviewPrepHours: 2,
            isOnTopOfFullTimeJob: true,
        },
        commonFailureReasons: [
            {
                category: 'skill_gap',
                description: 'Insufficient mathematical foundation (linear algebra, calculus, statistics)',
                frequency: 35,
            },
            {
                category: 'skill_gap',
                description: 'Lack of hands-on ML project experience - only theoretical knowledge',
                frequency: 40,
            },
            {
                category: 'preparation',
                description: 'Not building a portfolio of ML projects demonstrating practical skills',
                frequency: 30,
            },
            {
                category: 'expectations',
                description: 'Underestimating the time needed to learn ML fundamentals and build real projects',
                frequency: 25,
            },
            {
                category: 'market',
                description: 'Market saturation - many candidates with similar backgrounds competing for limited roles',
                frequency: 20,
            },
            {
                category: 'skill_gap',
                description: 'Weak software engineering skills - ML engineers need to write production code, not just notebooks',
                frequency: 25,
            },
        ],
        notes: 'ML Engineer roles often require a strong portfolio of projects. Many successful candidates have published research, contributed to open source, or built production ML systems. The field is rapidly evolving, so continuous learning is essential.',
        typicalSalaryRange: {
            min: 120000,
            max: 250000,
            currency: 'USD',
        },
    },
    {
        id: 'masters-research-path',
        name: 'Masters Degree → Research Path',
        description: 'Pursuing a Masters degree (typically in a technical field) as a stepping stone to research-oriented roles, PhD programs, or research positions in industry. This path emphasizes academic achievement and research experience.',
        targetRole: 'Research Scientist / PhD Student / Research Engineer',
        targetIndustry: 'Academia / Research',
        minExperienceYears: 0,
        preferredEducation: 'masters',
        skillRequirements: [
            {
                skillName: 'Research Methodology',
                minProficiency: 3,
                isCritical: true,
                monthsToLearn: 12,
            },
            {
                skillName: 'Academic Writing',
                minProficiency: 3,
                isCritical: true,
                monthsToLearn: 6,
            },
            {
                skillName: 'Domain-specific expertise (varies by field)',
                minProficiency: 4,
                isCritical: true,
                monthsToLearn: 24,
            },
            {
                skillName: 'Statistical Analysis',
                minProficiency: 3,
                isCritical: false,
                monthsToLearn: 6,
            },
            {
                skillName: 'Literature Review',
                minProficiency: 3,
                isCritical: false,
                monthsToLearn: 4,
            },
        ],
        timelineRanges: {
            bestCaseMonths: 24, // 2-year Masters program
            averageCaseMonths: 30, // Including application and transition time
            worstCaseMonths: 48, // If need to strengthen profile first
        },
        timeRequirements: {
            skillBuildingHours: 6, // Full-time student workload
            jobSearchHours: 0, // Not applicable during Masters
            interviewPrepHours: 0, // Not applicable during Masters
            isOnTopOfFullTimeJob: false, // Typically full-time study
        },
        commonFailureReasons: [
            {
                category: 'expectations',
                description: 'Underestimating the time commitment - Masters programs are typically 2 years of full-time study',
                frequency: 30,
            },
            {
                category: 'skill_gap',
                description: 'Insufficient academic preparation - weak undergraduate GPA or missing prerequisites',
                frequency: 25,
            },
            {
                category: 'resource_constraint',
                description: 'Financial constraints - Masters programs can be expensive, funding may be limited',
                frequency: 35,
            },
            {
                category: 'preparation',
                description: 'Weak application materials - poor statement of purpose, lack of research experience, weak recommendations',
                frequency: 30,
            },
            {
                category: 'competition',
                description: 'High competition for top programs and research positions',
                frequency: 25,
            },
            {
                category: 'timeline',
                description: 'Not accounting for application timeline - need to apply 6-12 months before program start',
                frequency: 20,
            },
            {
                category: 'expectations',
                description: 'Unclear research goals - difficulty articulating research interests and finding advisor match',
                frequency: 20,
            },
        ],
        notes: 'Masters programs typically require strong undergraduate performance (GPA 3.5+), research experience, and clear research interests. Many successful applicants have prior research experience, publications, or strong recommendation letters. The path to research often requires 2+ years of Masters followed by potential PhD (4-6 more years).',
        typicalSalaryRange: {
            min: 0, // Often stipend during PhD, varies widely
            max: 150000, // Research scientist roles
            currency: 'USD',
        },
    },
];
//# sourceMappingURL=index.js.map