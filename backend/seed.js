const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const StudentSkill = require('./models/StudentSkill');

dotenv.config();

const sampleStudents = [
  {
    studentName: 'Dharsan R',
    registerNumber: '717822P101',
    department: 'Computer Science and Engineering (CSE)',
    yearOfStudy: '4th Year',
    email: 'dharsan.cse@college.edu',
    technicalSkills: ['Java', 'Python', 'React', 'Node.js', 'SQL'],
    aptitudeScore: 92,
    communicationSkills: 'Advanced',
    placementReadiness: 'Ready'
  },
  {
    studentName: 'Priya Sundaram',
    registerNumber: '717822P102',
    department: 'Information Technology (IT)',
    yearOfStudy: '4th Year',
    email: 'priya.it@college.edu',
    technicalSkills: ['Python', 'React', 'SQL'],
    aptitudeScore: 78,
    communicationSkills: 'Intermediate',
    placementReadiness: 'Ready'
  },
  {
    studentName: 'Karthik Narayanan',
    registerNumber: '717822P103',
    department: 'Electronics and Communication Engineering (ECE)',
    yearOfStudy: '3rd Year',
    email: 'karthik.ece@college.edu',
    technicalSkills: ['Java', 'Python'],
    aptitudeScore: 64,
    communicationSkills: 'Intermediate',
    placementReadiness: 'In Progress'
  },
  {
    studentName: 'Ananya Murugan',
    registerNumber: '717822P104',
    department: 'Artificial Intelligence & Data Science (AI & DS)',
    yearOfStudy: '4th Year',
    email: 'ananya.aids@college.edu',
    technicalSkills: ['Python', 'SQL', 'React', 'Node.js'],
    aptitudeScore: 89,
    communicationSkills: 'Advanced',
    placementReadiness: 'Ready'
  },
  {
    studentName: 'Vignesh Kumar',
    registerNumber: '717822P105',
    department: 'Mechanical Engineering (MECH)',
    yearOfStudy: '2nd Year',
    email: 'vignesh.mech@college.edu',
    technicalSkills: ['Java', 'SQL'],
    aptitudeScore: 45,
    communicationSkills: 'Beginner',
    placementReadiness: 'Not Ready'
  },
  {
    studentName: 'Sneha Balan',
    registerNumber: '717822P106',
    department: 'Electrical and Electronics Engineering (EEE)',
    yearOfStudy: '3rd Year',
    email: 'sneha.eee@college.edu',
    technicalSkills: ['Python', 'SQL'],
    aptitudeScore: 58,
    communicationSkills: 'Intermediate',
    placementReadiness: 'In Progress'
  }
];

const seedDB = async () => {
  try {
    await connectDB();
    
    // Check existing count
    const count = await StudentSkill.countDocuments();
    if (count === 0) {
      console.log('[Seed] Database is empty. Seeding initial student skill profiles...');
      await StudentSkill.insertMany(sampleStudents);
      console.log(`[Seed] Successfully inserted ${sampleStudents.length} student records into placementDB collection 'studentskills'.`);
    } else {
      console.log(`[Seed] placementDB already contains ${count} records. Skipping automatic reseed.`);
    }
    process.exit(0);
  } catch (error) {
    console.error('[Seed Error]:', error.message);
    process.exit(1);
  }
};

seedDB();
