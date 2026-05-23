/**
 * Scoring and Normalization Helpers
 */

export function calculateMatchScore(candidateSkills: string[], jobSkills: string[]): number {
  if (!jobSkills.length) return 0;
  const matches = candidateSkills.filter(skill => 
    jobSkills.some(js => js.toLowerCase() === skill.toLowerCase())
  );
  return Math.round((matches.length / jobSkills.length) * 100);
}

export function determineRiskLevel(redFlags: string[], matchScore: number): 'Low' | 'Medium' | 'High' {
  if (redFlags.length > 2 || matchScore < 40) return 'High';
  if (redFlags.length > 0 || matchScore < 70) return 'Medium';
  return 'Low';
}

export function normalizeScore(score: number, max: number = 100): number {
  return Math.min(Math.max(score, 0), max);
}

export function scoreCategory(answers: { score: number, weight: number }[]): number {
  const totalWeight = answers.reduce((acc, curr) => acc + curr.weight, 0);
  if (totalWeight === 0) return 0;
  const weightedSum = answers.reduce((acc, curr) => acc + (curr.score * curr.weight), 0);
  return Math.round(weightedSum / totalWeight);
}
