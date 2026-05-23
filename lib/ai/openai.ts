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

  return { message: "Mock data for generic prompt" };
}
