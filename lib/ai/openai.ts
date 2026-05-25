import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'dummy_key',
});

export async function generateAIResponse(prompt: string, systemPrompt: string = "You are a helpful assistant.") {
  if (!process.env.OPENAI_API_KEY) {
    console.warn("OPENAI_API_KEY is not set. Returning mock data.");
    return getMockData(prompt);
  }

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: prompt },
      ],
      response_format: { type: "json_object" },
    });

    return JSON.parse(response.choices[0].message.content || '{}');
  } catch (error) {
    console.error("Error generating AI response:", error);
    return getMockData(prompt);
  }
}

function getMockData(prompt: string) {
  if (prompt.includes("Generate a structured interview report")) {
    return {
      roleSummary: "Senior Backend Developer focused on scalable microservices and cloud architecture.",
      realRoleRequirements: ["Deep knowledge of Node.js/Go", "Experience with Kubernetes", "Strong system design skills"],
      candidateSummary: "Highly experienced developer with strong background in MERN stack and cloud deployments.",
      matchScore: 88,
      strengths: ["Production experience with AWS", "Built real-time systems", "Strong ownership"],
      gaps: ["Limited experience with Go", "No mention of GraphQL"],
      resumeClaimsToVerify: ["Built a system handling 1M+ requests", "Reduced latency by 40%"],
      redFlags: [],
      riskLevel: "Low",
      interviewStrategy: "Focus on technical depth of their MERN projects and probe into system design knowledge.",
      questions: [
        {
          category: "Resume Specific",
          question: "In your food delivery project, how did you handle concurrent order updates to prevent race conditions?",
          candidateSpecificReason: "Candidate mentioned building a food delivery app with real-time updates.",
          linkedResumeEvidence: "Project: FoodForge Delivery App",
          linkedJobRequirement: "Concurrency management",
          strongAnswerShouldInclude: ["Optimistic locking", "Redis for state", "Atomic operations"],
          followUps: ["What if the database goes down during an update?"],
          scoreWeight: 2
        },
        {
          category: "Technical",
          question: "How would you migrate a monolithic Express app to a serverless architecture on AWS?",
          candidateSpecificReason: "Role requires AWS, and candidate has monolithic experience.",
          linkedResumeEvidence: "Experience at Tech Solutions Corp",
          linkedJobRequirement: "AWS Deployment",
          strongAnswerShouldInclude: ["Lambda", "API Gateway", "Strangler Fig pattern"],
          followUps: ["How do you handle cold starts?"],
          scoreWeight: 1.5
        }
      ],
      scorecard: {
        technicalDepth: 9,
        projectOwnership: 8,
        problemSolving: 9,
        communication: 7,
        roleFit: 8,
        productionReadiness: 9
      },
      psychometrics: [
        { subject: 'Critical Thinking', value: 88 },
        { subject: 'Stress Tolerance', value: 72 },
        { subject: 'Collaboration', value: 85 },
        { subject: 'Growth Mindset', value: 90 },
        { subject: 'Leadership', value: 78 }
      ],
      salaryBenchmark: {
        low: 110000,
        median: 145000,
        high: 180000
      },
      credibilityReport: {
        veracityScore: 84,
        inconsistencyRatio: 12,
        suspicionIndex: 8,
        vagueClaimsCount: 1,
        alerts: ["Lacks explicit evidence for food delivery scale (claims 1M orders)"]
      },
      finalRecommendation: "Strong Hire"
    };
  }

  if (prompt.includes("Analyze the following job description")) {
    return {
      roleSummary: "Backend Engineer for a high-growth fintech startup.",
      hardSkills: ["Node.js", "PostgreSQL", "Redis", "Docker"],
      softSkills: ["Leadership", "Agile", "Communication"],
      hiddenRequirements: ["Ability to work in fast-paced environments", "On-call rotation"],
      realWorldResponsibilities: ["Scaling payment gateway", "Refactoring legacy code"],
      seniorityLevel: "Senior",
      evaluationCriteria: ["System Design", "Code Quality", "Security Awareness"]
    };
  }

  if (prompt.includes("Score the candidate's answer")) {
    return {
      score: 8,
      feedback: "The candidate provides a very solid overview of handling race conditions in concurrent Node.js/Go backend settings. They correctly mentioned using Redis Mutexes (Redlock) for distributed states, transaction queues, and atomic operations. Their explanation of event loop blockages and concurrency bottlenecks is extremely well articulated.",
      missedPoints: [
        "Did not explicitly mention optimistic vs pessimistic locking concepts in SQL database level.",
        "Could have discussed DB transaction isolation levels (e.g., SERIALIZABLE) to guarantee absolute data consistency."
      ],
      suggestedFollowUp: "Ask them: 'How would you test this system under extreme load to ensure that no race condition actually slips through?'"
    };
  }

  if (prompt.includes("Rank the following candidates")) {
    return {
      rankings: [
        {
          candidateId: "1",
          name: "Alex Rivera",
          matchScore: 92,
          strengths: ["Strong AWS experience", "Built highly concurrent messaging queues", "Exceptional system design"],
          weaknesses: ["Lacks production Go experience"],
          riskLevel: "Low",
          recommendedAction: "Proceed to Technical Deep-Dive"
        },
        {
          candidateId: "2",
          name: "Sarah Chen",
          matchScore: 84,
          strengths: ["Excellent product planning", "Technical roadmap ownership", "Agile leadership"],
          weaknesses: ["Needs stronger system design depth"],
          riskLevel: "Low",
          recommendedAction: "Proceed to Technical Round"
        },
        {
          candidateId: "3",
          name: "Michael Scott",
          matchScore: 48,
          strengths: ["Sales and client relationship building"],
          weaknesses: ["No modern software development experience", "Lacks technical fundamentals"],
          riskLevel: "High",
          recommendedAction: "Reject"
        }
      ]
    };
  }

  if (prompt.includes("Analyze the following resume claims")) {
    return {
      veracityScore: 78,
      suspiciousClaims: [
        {
          claim: "Optimized PostgreSQL indexing for 10M+ daily active users, resulting in 99.9% query latency reduction.",
          reason: "A 99.9% query latency reduction is statistically highly improbable using only indexing optimizations unless the queries were severely broken. The scale of 10M+ DAU is also mismatched with the size of the team mentioned.",
          verificationQuestion: "Can you walk me through the specific tools you used to profile the PostgreSQL query planner, and what exact indices (e.g., partial, expression-based) were added to achieve this reduction?"
        },
        {
          claim: "Re-architected monolithic backend into microservices on AWS, handling billions of concurrent requests.",
          reason: "Handling billions of 'concurrent' requests would exceed the capacity of most major global tech systems. It is likely the candidate meant 'total' requests rather than concurrent ones.",
          verificationQuestion: "How did you manage distributed transactions and state consistency across microservices, and how did you load test the system to handle 'billions' of concurrent requests?"
        }
      ],
      strongClaims: [
        {
          claim: "Migrated legacy frontend to Next.js 14, reducing overall initial bundle size by 42%.",
          reason: "This is a highly credible, specific, and standard optimization achievement with Next.js code-splitting and server components."
        }
      ]
    };
  }

  if (prompt.includes("Analyze the following resume")) {
    return {
      candidateName: "John Doe",
      email: "johndoe@gmail.com",
      skills: ["React", "TypeScript", "Node.js", "Express", "MongoDB", "Docker", "AWS"],
      projects: ["FoodForge Delivery App - optimized orders by 50%", "MetricsDashboard - custom data parsing engine"],
      experience: ["Senior Frontend Architect at Tech Solutions Corp (2 years)", "Software Engineer at DevLabs (3 years)"],
      education: ["B.S. in Computer Science from State University"],
      achievements: ["Reduced bundle size by 40%", "Migrated legacy PHP codebase to modern React stack"],
      weakClaims: ["Reduced loading times globally by 90% (lacks explanation of metrics/caching used)"],
      strongEvidence: ["Proven bundle optimization, automated CI/CD pipeline set up"],
      missingEvidence: ["No explicit Go or Postgres experience, which the target job requires"]
    };
  }

  return { message: "Mock data for generic prompt" };
}
