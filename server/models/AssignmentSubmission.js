import mongoose from 'mongoose';

const assignmentSubmissionSchema = new mongoose.Schema({
  assignment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Assignment',
    required: true,
  },
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  submissionText: {
    type: String,
    default: '',
  },
  fileUrl: {
    type: String,
    required: true,
  },
  fileName: {
    type: String,
    required: true,
  },
  submittedAt: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ['Submitted', 'Late', 'Graded', 'Resubmission Requested'],
    default: 'Submitted',
  },
  marksObtained: {
    type: Number,
    default: null,
  },
  feedback: {
    type: String,
    default: '',
  },
  gradedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  gradedAt: {
    type: Date,
  },
}, {
  timestamps: true,
});

assignmentSubmissionSchema.index({ assignment: 1, student: 1 }, { unique: true });

export default mongoose.model('AssignmentSubmission', assignmentSubmissionSchema);
