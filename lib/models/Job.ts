import mongoose, { Schema, Document } from 'mongoose';

export interface IJob extends Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  companyName: string;
  description: string;
  extractedRequirements?: {
    hardSkills: string[];
    softSkills: string[];
    experienceLevel: string;
    responsibilities: string[];
  };
  createdAt: Date;
  updatedAt: Date;
}

const JobSchema: Schema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  companyName: { type: String, required: true },
  description: { type: String, required: true },
  extractedRequirements: {
    hardSkills: [String],
    softSkills: [String],
    experienceLevel: String,
    responsibilities: [String],
  },
}, { timestamps: true });

export default mongoose.models.Job || mongoose.model<IJob>('Job', JobSchema);
