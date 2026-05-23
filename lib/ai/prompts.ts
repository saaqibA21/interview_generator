export const SYSTEM_PROMPT = `You are an expert recruiter, technical interviewer, hiring manager, and role-fit evaluator.
Your task is to generate a UNIQUE interview question set for one specific candidate.
You must analyze the job description, candidate resume, and the gap between them.
Important rule: Do NOT generate generic questions. At least 70% of the questions must be personalized to the candidate's specific background.`;

export const GENERATE_INTERVIEW_PROMPT = `
Generate a structured interview report for the following:

Job Description:
{{JOB_DESCRIPTION}}

Candidate Resume:
{{RESUME_TEXT}}

Interview Type:
{{INTERVIEW_TYPE}}

Difficulty:
{{DIFFICULTY}}

Return the response in the following JSON structure:
{
  "roleSummary": "Short summary of the role",
  "realRoleRequirements": ["Req 1", "Req 2"],
  "candidateSummary": "Short summary of the candidate's fit",
  "matchScore": 85,
  "strengths": ["Strength 1", "Strength 2"],
  "gaps": ["Gap 1", "Gap 2"],
  "resumeClaimsToVerify": ["Claim 1", "Claim 2"],
  "redFlags": ["Flag 1"],
  "riskLevel": "Low | Medium | High",
  "interviewStrategy": "How to approach the interview",
  "questions": [
    {
      "category": "Resume/Technical/Behavioral",
      "question": "The question text",
      "candidateSpecificReason": "Why this question is asked for THIS candidate",
      "linkedResumeEvidence": "What part of the resume triggered this",
      "linkedJobRequirement": "What job requirement this tests",
      "strongAnswerShouldInclude": ["Point 1", "Point 2"],
      "followUps": ["Follow up 1"],
      "scoreWeight": 1
    }
  ],
  "scorecard": {
    "technicalDepth": 0,
    "projectOwnership": 0,
    "problemSolving": 0,
    "communication": 0,
    "roleFit": 0,
    "productionReadiness": 0
  },
  "finalRecommendation": "Hire/No Hire/Next Round"
}

Question Requirements:
- 6 resume-specific questions
- 5 job-fit technical questions personalized to this candidate
- 4 gap-based questions
- 4 scenario questions connected to this candidate's background
- 3 behavioral questions based on this candidate's experience level
- 5 follow-up questions
`;

export const JOB_ANALYSIS_PROMPT = `
Analyze the following job description and extract key requirements, hidden expectations, and evaluation criteria.
Job Description:
{{JOB_DESCRIPTION}}

Return JSON:
{
  "roleSummary": "",
  "hardSkills": [],
  "softSkills": [],
  "hiddenRequirements": [],
  "realWorldResponsibilities": [],
  "seniorityLevel": "",
  "evaluationCriteria": []
}
`;

export const RESUME_ANALYSIS_PROMPT = `
Analyze the following resume and extract candidate profile, strengths, and evidence.
Resume:
{{RESUME_TEXT}}

Return JSON:
{
  "candidateName": "",
  "email": "",
  "skills": [],
  "projects": [],
  "experience": [],
  "education": [],
  "achievements": [],
  "weakClaims": [],
  "strongEvidence": [],
  "missingEvidence": []
}
`;

export const BULK_RANK_PROMPT = `
Rank the following candidates against the job description.
Job Description:
{{JOB_DESCRIPTION}}

Candidates:
{{CANDIDATES_DATA}}

Return JSON:
{
  "rankings": [
    {
      "candidateId": "",
      "name": "",
      "matchScore": 0,
      "strengths": [],
      "weaknesses": [],
      "riskLevel": "",
      "recommendedAction": ""
    }
  ]
}
`;

export const SCORE_ANSWER_PROMPT = `
Score the candidate's answer based on the question and expected points.
Question: {{QUESTION}}
Expected Points: {{EXPECTED}}
Candidate Answer: {{ANSWER}}

Return JSON:
{
  "score": 0,
  "feedback": "",
  "missedPoints": [],
  "suggestedFollowUp": ""
}
`;
