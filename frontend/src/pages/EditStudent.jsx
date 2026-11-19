import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Edit3,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Save,
  RotateCcw,
  Plus,
  X,
  Loader2
} from 'lucide-react';
import { getStudentById, updateStudent } from '../services/api';

const AVAILABLE_DEPARTMENTS = [
  'Computer Science and Engineering (CSE)',
  'Information Technology (IT)',
  'Electronics and Communication Engineering (ECE)',
  'Electrical and Electronics Engineering (EEE)',
  'Mechanical Engineering (MECH)',
  'Artificial Intelligence & Data Science (AI & DS)',
  'Civil Engineering (CIVIL)'
];

const PRESET_SKILLS = ['Java', 'Python', 'React', 'Node.js', 'SQL'];

const EditStudent = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    studentName: '',
    registerNumber: '',
    department: '',
    yearOfStudy: '3rd Year',
    email: '',
    technicalSkills: [],
    aptitudeScore: 0,
    communicationSkills: 'Intermediate',
    placementReadiness: 'In Progress'
  });

  const [initialData, setInitialData] = useState(null);
  const [customSkillInput, setCustomSkillInput] = useState('');
  const [fetching, setFetching] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [serverError, setServerError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  // Load existing student data by ID
  useEffect(() => {
    const fetchStudent = async () => {
      try {
        setFetching(true);
        setServerError(null);
        const res = await getStudentById(id);
        if (res.data) {
          const student = res.data;
          const prefill = {
            studentName: student.studentName || '',
            registerNumber: student.registerNumber || '',
            department: student.department || '',
            yearOfStudy: student.yearOfStudy || '3rd Year',
            email: student.email || '',
            technicalSkills: Array.isArray(student.technicalSkills) ? student.technicalSkills : [],
            aptitudeScore: student.aptitudeScore !== undefined ? student.aptitudeScore : 0,
            communicationSkills: student.communicationSkills || 'Intermediate',
            placementReadiness: student.placementReadiness || 'In Progress'
          };
          setFormData(prefill);
          setInitialData(prefill);
        }
      } catch (err) {
        setServerError(err.message || 'Failed to retrieve student details from database');
      } finally {
        setFetching(false);
      }
    };

    if (id) {
      fetchStudent();
    }
  }, [id]);

  // Handle standard input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'registerNumber' ? value.toUpperCase() : value
    }));

    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  // Toggle skills
  const handleSkillToggle = (skill) => {
    setFormData((prev) => {
      const exists = prev.technicalSkills.includes(skill);
      const updatedSkills = exists
        ? prev.technicalSkills.filter((s) => s !== skill)
        : [...prev.technicalSkills, skill];
      return { ...prev, technicalSkills: updatedSkills };
    });

    if (formErrors.technicalSkills) {
      setFormErrors((prev) => ({ ...prev, technicalSkills: null }));
    }
  };

  // Add custom skill tag
  const handleAddCustomSkill = (e) => {
    e.preventDefault();
    const trimmed = customSkillInput.trim();
    if (!trimmed) return;

    if (!formData.technicalSkills.includes(trimmed)) {
      setFormData((prev) => ({
        ...prev,
        technicalSkills: [...prev.technicalSkills, trimmed]
      }));
    }
    setCustomSkillInput('');

    if (formErrors.technicalSkills) {
      setFormErrors((prev) => ({ ...prev, technicalSkills: null }));
    }
  };

  // Remove skill tag
  const handleRemoveSkill = (skillToRemove) => {
    setFormData((prev) => ({
      ...prev,
      technicalSkills: prev.technicalSkills.filter((s) => s !== skillToRemove)
    }));
  };

  // Form validation
  const validateForm = () => {
    const errors = {};

    if (!formData.studentName.trim()) {
      errors.studentName = 'Student name is required';
    } else if (formData.studentName.trim().length < 2) {
      errors.studentName = 'Name must be at least 2 characters';
    }

    if (!formData.registerNumber.trim()) {
      errors.registerNumber = 'Register number is required';
    }

    if (!formData.department) {
      errors.department = 'Please select a department';
    }

    if (!formData.yearOfStudy) {
      errors.yearOfStudy = 'Please select a year of study';
    }

    if (!formData.email.trim()) {
      errors.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      errors.email = 'Please enter a valid email address';
    }

    if (!formData.technicalSkills || formData.technicalSkills.length === 0) {
      errors.technicalSkills = 'Please select at least one technical skill';
    }

    const aptitude = Number(formData.aptitudeScore);
    if (isNaN(aptitude) || aptitude < 0 || aptitude > 100) {
      errors.aptitudeScore = 'Aptitude score must be between 0 and 100';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle Form Submission with PUT API
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage(null);
    setServerError(null);

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        studentName: formData.studentName.trim(),
        registerNumber: formData.registerNumber.trim().toUpperCase(),
        department: formData.department,
        yearOfStudy: formData.yearOfStudy,
        email: formData.email.trim().toLowerCase(),
        technicalSkills: formData.technicalSkills,
        aptitudeScore: Number(formData.aptitudeScore),
        communicationSkills: formData.communicationSkills,
        placementReadiness: formData.placementReadiness
      };

      await updateStudent(id, payload);

      setSuccessMessage('Student skill details updated successfully! Redirecting...');

      // Redirect back to student list after short notification
      setTimeout(() => {
        navigate('/students');
      }, 1200);
    } catch (err) {
      setServerError(err.message || 'Failed to update student record');
      setIsSubmitting(false);
    }
  };

  // Revert to initial loaded data
  const handleReset = () => {
    if (initialData) {
      setFormData(initialData);
      setFormErrors({});
      setServerError(null);
      setSuccessMessage(null);
    }
  };

  if (fetching) {
    return (
      <div className="page-container">
        <div className="loading-state-box">
          <div className="spinner"></div>
          <p className="loading-text">Loading student information from MongoDB...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      {/* Header */}
      <div className="page-header-row">
        <div>
          <Link to="/students" className="back-link">
            <ArrowLeft size={16} />
            <span>Back to Student List</span>
          </Link>
          <h1 className="page-title">Edit Student Skill Record</h1>
          <p className="page-subtitle">
            Update technical skills, aptitude results, or placement readiness for{' '}
            <strong>{formData.studentName || 'Student'}</strong>.
          </p>
        </div>
      </div>

      {/* Success Notification Banner */}
      {successMessage && (
        <div className="alert-banner alert-success">
          <CheckCircle2 size={22} />
          <div className="alert-content">
            <strong>Update Success:</strong> {successMessage}
          </div>
        </div>
      )}

      {/* Error Notification Banner */}
      {serverError && (
        <div className="alert-banner alert-error">
          <AlertCircle size={22} />
          <div className="alert-content">
            <strong>Error:</strong> {serverError}
          </div>
          <button
            type="button"
            className="alert-close-btn"
            onClick={() => setServerError(null)}
          >
            <X size={18} />
          </button>
        </div>
      )}

      {/* Main Edit Form Card */}
      <div className="form-card card-surface">
        <form onSubmit={handleSubmit} noValidate>
          <div className="form-grid">
            {/* 1. Student Name */}
            <div className="form-group">
              <label htmlFor="studentName" className="form-label">
                1. Student Name <span className="required-star">*</span>
              </label>
              <input
                type="text"
                id="studentName"
                name="studentName"
                value={formData.studentName}
                onChange={handleChange}
                className={`form-input ${formErrors.studentName ? 'input-error' : ''}`}
                required
              />
              {formErrors.studentName && (
                <span className="error-text">{formErrors.studentName}</span>
              )}
            </div>

            {/* 2. Register Number */}
            <div className="form-group">
              <label htmlFor="registerNumber" className="form-label">
                2. Register Number <span className="required-star">* (Unique)</span>
              </label>
              <input
                type="text"
                id="registerNumber"
                name="registerNumber"
                value={formData.registerNumber}
                onChange={handleChange}
                className={`form-input uppercase-input ${formErrors.registerNumber ? 'input-error' : ''}`}
                required
              />
              {formErrors.registerNumber && (
                <span className="error-text">{formErrors.registerNumber}</span>
              )}
            </div>

            {/* 3. Department */}
            <div className="form-group">
              <label htmlFor="department" className="form-label">
                3. Department <span className="required-star">*</span>
              </label>
              <select
                id="department"
                name="department"
                value={formData.department}
                onChange={handleChange}
                className={`form-select ${formErrors.department ? 'input-error' : ''}`}
                required
              >
                <option value="">-- Select Department --</option>
                {AVAILABLE_DEPARTMENTS.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
              {formErrors.department && (
                <span className="error-text">{formErrors.department}</span>
              )}
            </div>

            {/* 4. Year of Study */}
            <div className="form-group">
              <label htmlFor="yearOfStudy" className="form-label">
                4. Year of Study <span className="required-star">*</span>
              </label>
              <select
                id="yearOfStudy"
                name="yearOfStudy"
                value={formData.yearOfStudy}
                onChange={handleChange}
                className={`form-select ${formErrors.yearOfStudy ? 'input-error' : ''}`}
                required
              >
                <option value="1st Year">1st Year</option>
                <option value="2nd Year">2nd Year</option>
                <option value="3rd Year">3rd Year</option>
                <option value="4th Year">4th Year</option>
              </select>
            </div>

            {/* 5. Email */}
            <div className="form-group form-group-full">
              <label htmlFor="email" className="form-label">
                5. Email Address <span className="required-star">*</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`form-input ${formErrors.email ? 'input-error' : ''}`}
                required
              />
              {formErrors.email && <span className="error-text">{formErrors.email}</span>}
            </div>

            {/* 6. Technical Skills */}
            <div className="form-group form-group-full">
              <label className="form-label">
                6. Technical Skills <span className="required-star">* (Select or add skills)</span>
              </label>
              <div className="preset-skills-wrap">
                {PRESET_SKILLS.map((skill) => {
                  const isChecked = formData.technicalSkills.includes(skill);
                  return (
                    <button
                      type="button"
                      key={skill}
                      onClick={() => handleSkillToggle(skill)}
                      className={`skill-chip-btn ${isChecked ? 'skill-chip-active' : ''}`}
                    >
                      <span>{skill}</span>
                      {isChecked && <CheckCircle2 size={16} />}
                    </button>
                  );
                })}
              </div>

              {/* Add custom skill input */}
              <div className="custom-skill-input-row">
                <input
                  type="text"
                  value={customSkillInput}
                  onChange={(e) => setCustomSkillInput(e.target.value)}
                  placeholder="Add another skill..."
                  className="form-input custom-input"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddCustomSkill(e);
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={handleAddCustomSkill}
                  className="btn btn-outline btn-add-tag"
                >
                  <Plus size={16} /> Add Tag
                </button>
              </div>

              {/* Selected skills */}
              <div className="selected-skills-preview">
                <span className="preview-label">Selected Skills ({formData.technicalSkills.length}):</span>
                {formData.technicalSkills.map((s) => (
                  <span key={s} className="selected-skill-pill">
                    {s}
                    <button
                      type="button"
                      onClick={() => handleRemoveSkill(s)}
                      className="remove-skill-btn"
                      title={`Remove ${s}`}
                    >
                      <X size={13} />
                    </button>
                  </span>
                ))}
              </div>
              {formErrors.technicalSkills && (
                <span className="error-text">{formErrors.technicalSkills}</span>
              )}
            </div>

            {/* 7. Aptitude Score */}
            <div className="form-group">
              <div className="aptitude-label-row">
                <label htmlFor="aptitudeScore" className="form-label">
                  7. Aptitude Score (0–100) <span className="required-star">*</span>
                </label>
                <span className="aptitude-score-display">{formData.aptitudeScore} / 100</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                step="1"
                value={formData.aptitudeScore}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, aptitudeScore: Number(e.target.value) }))
                }
                className="score-range-slider"
              />
              <input
                type="number"
                min="0"
                max="100"
                id="aptitudeScore"
                name="aptitudeScore"
                value={formData.aptitudeScore}
                onChange={handleChange}
                className={`form-input mt-2 ${formErrors.aptitudeScore ? 'input-error' : ''}`}
                required
              />
              {formErrors.aptitudeScore && (
                <span className="error-text">{formErrors.aptitudeScore}</span>
              )}
            </div>

            {/* 8. Communication Skills */}
            <div className="form-group">
              <label htmlFor="communicationSkills" className="form-label">
                8. Communication Skills <span className="required-star">*</span>
              </label>
              <select
                id="communicationSkills"
                name="communicationSkills"
                value={formData.communicationSkills}
                onChange={handleChange}
                className="form-select"
                required
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>

            {/* 9. Placement Readiness */}
            <div className="form-group form-group-full">
              <label className="form-label">
                9. Placement Readiness <span className="required-star">*</span>
              </label>
              <div className="readiness-radio-cards">
                <label
                  className={`readiness-option option-ready ${
                    formData.placementReadiness === 'Ready' ? 'active-ready' : ''
                  }`}
                >
                  <input
                    type="radio"
                    name="placementReadiness"
                    value="Ready"
                    checked={formData.placementReadiness === 'Ready'}
                    onChange={handleChange}
                  />
                  <div className="option-content">
                    <span className="option-title">Ready</span>
                    <span className="option-desc">Candidate meets all placement criteria</span>
                  </div>
                </label>

                <label
                  className={`readiness-option option-inprogress ${
                    formData.placementReadiness === 'In Progress' ? 'active-inprogress' : ''
                  }`}
                >
                  <input
                    type="radio"
                    name="placementReadiness"
                    value="In Progress"
                    checked={formData.placementReadiness === 'In Progress'}
                    onChange={handleChange}
                  />
                  <div className="option-content">
                    <span className="option-title">In Progress</span>
                    <span className="option-desc">Skill training / practice underway</span>
                  </div>
                </label>

                <label
                  className={`readiness-option option-notready ${
                    formData.placementReadiness === 'Not Ready' ? 'active-notready' : ''
                  }`}
                >
                  <input
                    type="radio"
                    name="placementReadiness"
                    value="Not Ready"
                    checked={formData.placementReadiness === 'Not Ready'}
                    onChange={handleChange}
                  />
                  <div className="option-content">
                    <span className="option-title">Not Ready</span>
                    <span className="option-desc">Needs foundational coaching</span>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Form Action Buttons */}
          <div className="form-actions-bar">
            <div className="left-actions">
              <Link to="/students" className="btn btn-outline">
                Cancel
              </Link>
              <button
                type="button"
                onClick={handleReset}
                className="btn btn-secondary"
                disabled={isSubmitting}
                title="Revert changes to last saved state"
              >
                <RotateCcw size={17} />
                <span>Revert</span>
              </button>
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-submit"
              disabled={isSubmitting}
            >
              <Save size={18} />
              <span>{isSubmitting ? 'Updating MongoDB...' : 'Update Student Details'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditStudent;
