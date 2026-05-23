import mongoose, { Schema, Document } from 'mongoose';

export interface IInterviewReport extends Document {
  userId: mongoose.Types.ObjectId;
  jobId: mongoose.Types.ObjectId;
  candidateId: mongoose.Types.ObjectId;
  candidateName: string;
  jobTitle: string;
  matchScore: number;
  roleSummary: string;
  realRoleRequirements: string[];
  candidateSummary: string;
  strengths: string[];
  gaps: string[];
  resumeClaimsToVerify: string[];
  redFlags: string[];
  riskLevel: string;
  interviewStrategy: string;
  questions: any[];
  scorecard: {
    technicalDepth: number;
    projectOwnership: number;
    problemSolving: number;
    communication: number;
    roleFit: number;
    productionReadiness: number;
  };
  finalRecommendation: string;
  createdAt: Date;
  updatedAt: Date;
}

const InterviewReportSchema: Schema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  jobId: { type: Schema.Types.ObjectId, ref: 'Job', required: true },
  candidateId: { type: Schema.Types.ObjectId, ref: 'Candidate', required: true },
  candidateName: { type: String, required: true },
  jobTitle: { type: String, required: true },
  matchScore: { type: Number, required: true },
  roleSummary: { type: String },
  realRoleRequirements: [String],
  candidateSummary: { type: String },
  strengths: [String],
  gaps: [String],
  resumeClaimsToVerify: [String],
  redFlags: [String],
  riskLevel: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Medium' },
  interviewStrategy: { type: String },
  questions: [Schema.Types.Mixed],
  scorecard: {
    technicalDepth: { type: Number, default: 0 },
    projectOwnership: { type: Number, default: 0 },
    problemSolving: { type: Number, default: 0 },
    communication: { type: Number, default: 0 },
    roleFit: { type: Number, default: 0 },
    productionReadiness: { type: Number, default: 0 },
  },
  finalRecommendation: { type: String },
}, { timestamps: true });

export default mongoose.models.InterviewReport || mongoose.model<IInterviewReport>('InterviewReport', InterviewReportSchema);
