const express = require('express');
const mongoose = require('mongoose');
const StudentSkill = require('../models/StudentSkill');

const router = express.Router();

/**
 * @route   GET /api/students
 * @desc    Retrieve all student skill records (supports optional search and filter queries)
 * @access  Public
 */
router.get('/', async (req, res) => {
  try {
    const { search, department, readiness } = req.query;
    const filter = {};

    // Search by student name or register number
    if (search && search.trim() !== '') {
      const searchRegex = new RegExp(search.trim(), 'i');
      filter.$or = [
        { studentName: searchRegex },
        { registerNumber: searchRegex }
      ];
    }

    // Filter by department
    if (department && department !== 'All') {
      filter.department = department;
    }

    // Filter by placement readiness
    if (readiness && readiness !== 'All') {
      filter.placementReadiness = readiness;
    }

    // Sort by latest created first
    const students = await StudentSkill.find(filter).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: students.length,
      data: students
    });
  } catch (error) {
    console.error('Error fetching students:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve student records',
      error: error.message
    });
  }
});

/**
 * @route   GET /api/students/:id
 * @desc    Retrieve a single student record by ID
 * @access  Public
 */
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Validate MongoDB ObjectId format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid Student ID format'
      });
    }

    const student = await StudentSkill.findById(id);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student skill record not found'
      });
    }

    res.status(200).json({
      success: true,
      data: student
    });
  } catch (error) {
    console.error('Error fetching student by ID:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve student record',
      error: error.message
    });
  }
});

/**
 * @route   POST /api/students
 * @desc    Add a new student skill record
 * @access  Public
 */
router.post('/', async (req, res) => {
  try {
    const {
      studentName,
      registerNumber,
      department,
      yearOfStudy,
      email,
      technicalSkills,
      aptitudeScore,
      communicationSkills,
      placementReadiness
    } = req.body;

    // Basic check for required fields before saving
    if (
      !studentName ||
      !registerNumber ||
      !department ||
      !yearOfStudy ||
      !email ||
      aptitudeScore === undefined ||
      aptitudeScore === null ||
      !communicationSkills ||
      !placementReadiness
    ) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      });
    }

    // Check if register number already exists (case-insensitive check)
    const normalizedRegNo = registerNumber.trim().toUpperCase();
    const existingStudent = await StudentSkill.findOne({ registerNumber: normalizedRegNo });
    if (existingStudent) {
      return res.status(409).json({
        success: false,
        message: `Student with Register Number "${normalizedRegNo}" already exists.`
      });
    }

    // Ensure aptitude score is within 0-100 range
    const parsedAptitude = Number(aptitudeScore);
    if (isNaN(parsedAptitude) || parsedAptitude < 0 || parsedAptitude > 100) {
      return res.status(400).json({
        success: false,
        message: 'Aptitude score must be a number between 0 and 100'
      });
    }

    // Ensure technical skills is a non-empty array
    const skillsArray = Array.isArray(technicalSkills)
      ? technicalSkills
      : typeof technicalSkills === 'string'
      ? technicalSkills.split(',').map((s) => s.trim()).filter(Boolean)
      : [];

    if (skillsArray.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please select or provide at least one technical skill'
      });
    }

    const newStudent = new StudentSkill({
      studentName: studentName.trim(),
      registerNumber: normalizedRegNo,
      department: department.trim(),
      yearOfStudy,
      email: email.trim().toLowerCase(),
      technicalSkills: skillsArray,
      aptitudeScore: parsedAptitude,
      communicationSkills,
      placementReadiness
    });

    const savedStudent = await newStudent.save();

    res.status(201).json({
      success: true,
      message: 'Student skill record created successfully',
      data: savedStudent
    });
  } catch (error) {
    console.error('Error creating student:', error.message);

    // Handle MongoDB duplicate key error (code 11000)
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: 'Register Number already exists in the system.'
      });
    }

    // Handle Mongoose validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({
        success: false,
        message: messages.join(', ')
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error while saving student record',
      error: error.message
    });
  }
});

/**
 * @route   PUT /api/students/:id
 * @desc    Update an existing student record
 * @access  Public
 */
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Validate MongoDB ObjectId format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid Student ID format'
      });
    }

    const {
      studentName,
      registerNumber,
      department,
      yearOfStudy,
      email,
      technicalSkills,
      aptitudeScore,
      communicationSkills,
      placementReadiness
    } = req.body;

    // Validate score if provided
    if (aptitudeScore !== undefined && aptitudeScore !== null) {
      const score = Number(aptitudeScore);
      if (isNaN(score) || score < 0 || score > 100) {
        return res.status(400).json({
          success: false,
          message: 'Aptitude score must be a number between 0 and 100'
        });
      }
    }

    // Check if new register number conflicts with another student's record
    if (registerNumber) {
      const normalizedRegNo = registerNumber.trim().toUpperCase();
      const duplicateStudent = await StudentSkill.findOne({
        registerNumber: normalizedRegNo,
        _id: { $ne: id }
      });

      if (duplicateStudent) {
        return res.status(409).json({
          success: false,
          message: `Another student with Register Number "${normalizedRegNo}" already exists.`
        });
      }
    }

    // Prepare update payload
    const updateData = {};
    if (studentName) updateData.studentName = studentName.trim();
    if (registerNumber) updateData.registerNumber = registerNumber.trim().toUpperCase();
    if (department) updateData.department = department.trim();
    if (yearOfStudy) updateData.yearOfStudy = yearOfStudy;
    if (email) updateData.email = email.trim().toLowerCase();
    if (technicalSkills) {
      updateData.technicalSkills = Array.isArray(technicalSkills)
        ? technicalSkills
        : typeof technicalSkills === 'string'
        ? technicalSkills.split(',').map((s) => s.trim()).filter(Boolean)
        : [];
    }
    if (aptitudeScore !== undefined && aptitudeScore !== null) {
      updateData.aptitudeScore = Number(aptitudeScore);
    }
    if (communicationSkills) updateData.communicationSkills = communicationSkills;
    if (placementReadiness) updateData.placementReadiness = placementReadiness;

    const updatedStudent = await StudentSkill.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!updatedStudent) {
      return res.status(404).json({
        success: false,
        message: 'Student skill record not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Student skill record updated successfully',
      data: updatedStudent
    });
  } catch (error) {
    console.error('Error updating student:', error.message);

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: 'Register Number already exists in the system.'
      });
    }

    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({
        success: false,
        message: messages.join(', ')
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error while updating student record',
      error: error.message
    });
  }
});

/**
 * @route   DELETE /api/students/:id
 * @desc    Delete a student record
 * @access  Public
 */
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Validate MongoDB ObjectId format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid Student ID format'
      });
    }

    const deletedStudent = await StudentSkill.findByIdAndDelete(id);

    if (!deletedStudent) {
      return res.status(404).json({
        success: false,
        message: 'Student skill record not found'
      });
    }

    res.status(200).json({
      success: true,
      message: `Record for student "${deletedStudent.studentName}" deleted successfully`,
      data: { id: deletedStudent._id }
    });
  } catch (error) {
    console.error('Error deleting student:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting student record',
      error: error.message
    });
  }
});

module.exports = router;
