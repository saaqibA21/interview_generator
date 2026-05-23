import mongoose, { Schema, Document } from 'mongoose';

export interface ICandidate extends Document {
  userId: mongoose.Types.ObjectId;
  name: string;
  email: string;
  resumeText: string;
  extractedProfile?: {
    skills: string[];
    projects: any[];
    experience: any[];
    education: string[];
  };
  createdAt: Date;
  updatedAt: Date;
}

const CandidateSchema: Schema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  resumeText: { type: String, required: true },
  extractedProfile: {
    skills: [String],
    projects: [Schema.Types.Mixed],
    experience: [Schema.Types.Mixed],
    education: [String],
  },
}, { timestamps: true });

export default mongoose.models.Candidate || mongoose.model<ICandidate>('Candidate', CandidateSchema);
