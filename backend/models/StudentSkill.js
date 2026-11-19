const mongoose = require('mongoose');

const studentSkillSchema = new mongoose.Schema(
  {
    studentName: {
      type: String,
      required: [true, 'Student Name is required'],
      trim: true,
      minlength: [2, 'Student Name must be at least 2 characters long'],
      maxlength: [100, 'Student Name cannot exceed 100 characters']
    },
    registerNumber: {
      type: String,
      required: [true, 'Register Number is required'],
      unique: true,
      trim: true,
      uppercase: true
    },
    department: {
      type: String,
      required: [true, 'Department is required'],
      trim: true
    },
    yearOfStudy: {
      type: String,
      required: [true, 'Year of Study is required'],
      enum: {
        values: ['1st Year', '2nd Year', '3rd Year', '4th Year'],
        message: '{VALUE} is not a valid year of study'
      }
    },
    email: {
      type: String,
      required: [true, 'Email address is required'],
      trim: true,
      lowercase: true,
      match: [
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        'Please provide a valid email address'
      ]
    },
    technicalSkills: {
      type: [String],
      required: [true, 'Technical skills are required'],
      validate: {
        validator: function (skills) {
          return Array.isArray(skills) && skills.length > 0;
        },
        message: 'Please select or add at least one technical skill'
      }
    },
    aptitudeScore: {
      type: Number,
      required: [true, 'Aptitude score is required'],
      min: [0, 'Aptitude score must be at least 0'],
      max: [100, 'Aptitude score cannot exceed 100']
    },
    communicationSkills: {
      type: String,
      required: [true, 'Communication skills level is required'],
      enum: {
        values: ['Beginner', 'Intermediate', 'Advanced'],
        message: '{VALUE} is not a valid communication skill level'
      }
    },
    placementReadiness: {
      type: String,
      required: [true, 'Placement readiness status is required'],
      enum: {
        values: ['Ready', 'In Progress', 'Not Ready'],
        message: '{VALUE} is not a valid placement readiness status'
      },
      default: 'In Progress'
    }
  },
  {
    timestamps: true, // Automatically manages createdAt and updatedAt
    collection: 'studentskills' // Explicit collection name
  }
);

const StudentSkill = mongoose.model('StudentSkill', studentSkillSchema, 'studentskills');

module.exports = StudentSkill;
