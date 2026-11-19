import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, BookOpen, Calendar, Award, Code2, MessageSquare, Edit3, Trash2, Eye } from 'lucide-react';

const StudentCard = ({ student, onView, onDelete }) => {
  if (!student) return null;

  // Determine readiness badge styling
  const getReadinessBadge = (status) => {
    switch (status) {
      case 'Ready':
        return {
          className: 'badge-ready',
          label: 'Placement Ready'
        };
      case 'In Progress':
        return {
          className: 'badge-inprogress',
          label: 'In Progress'
        };
      case 'Not Ready':
        return {
          className: 'badge-notready',
          label: 'Not Ready'
        };
      default:
        return {
          className: 'badge-default',
          label: status
        };
    }
  };

  // Determine score color
  const getScoreColor = (score) => {
    if (score >= 75) return '#10b981'; // green
    if (score >= 50) return '#f59e0b'; // orange
    return '#ef4444'; // red
  };

  const readiness = getReadinessBadge(student.placementReadiness);

  return (
    <div className="student-card">
      {/* Card Header */}
      <div className="student-card-header">
        <div className="student-identity">
          <div className="student-avatar">
            {student.studentName ? student.studentName.charAt(0).toUpperCase() : 'S'}
          </div>
          <div>
            <h3 className="student-card-name" title={student.studentName}>
              {student.studentName}
            </h3>
            <span className="student-card-reg">{student.registerNumber}</span>
          </div>
        </div>
        <span className={`status-pill ${readiness.className}`}>
          {readiness.label}
        </span>
      </div>

      {/* Card Body Information */}
      <div className="student-card-body">
        <div className="card-info-row">
          <BookOpen size={16} className="info-icon" />
          <span className="info-text">{student.department}</span>
        </div>

        <div className="card-info-row">
          <Calendar size={16} className="info-icon" />
          <span className="info-text">{student.yearOfStudy}</span>
        </div>

        <div className="card-info-row">
          <Mail size={16} className="info-icon" />
          <a href={`mailto:${student.email}`} className="info-link" title={student.email}>
            {student.email}
          </a>
        </div>

        {/* Aptitude Score Progress */}
        <div className="aptitude-progress-section">
          <div className="aptitude-header">
            <span className="aptitude-label">
              <Award size={15} /> Aptitude Score
            </span>
            <span className="aptitude-value" style={{ color: getScoreColor(student.aptitudeScore) }}>
              {student.aptitudeScore} / 100
            </span>
          </div>
          <div className="progress-bar-track">
            <div
              className="progress-bar-fill"
              style={{
                width: `${Math.min(Math.max(student.aptitudeScore, 0), 100)}%`,
                backgroundColor: getScoreColor(student.aptitudeScore)
              }}
            ></div>
          </div>
        </div>

        {/* Communication Skills */}
        <div className="card-info-row communication-row">
          <MessageSquare size={16} className="info-icon" />
          <span className="info-label">Communication:</span>
          <span className={`comm-badge comm-${student.communicationSkills?.toLowerCase()}`}>
            {student.communicationSkills}
          </span>
        </div>

        {/* Technical Skills */}
        <div className="technical-skills-section">
          <div className="skills-header">
            <Code2 size={15} />
            <span>Technical Skills</span>
          </div>
          <div className="skills-tags-wrap">
            {student.technicalSkills && student.technicalSkills.length > 0 ? (
              student.technicalSkills.map((skill, index) => (
                <span key={index} className="skill-tag">
                  {skill}
                </span>
              ))
            ) : (
              <span className="no-skills-text">No skills specified</span>
            )}
          </div>
        </div>
      </div>

      {/* Card Actions Footer */}
      <div className="student-card-footer">
        {onView && (
          <button
            type="button"
            className="card-btn btn-view"
            onClick={() => onView(student)}
            title="View Details"
          >
            <Eye size={16} />
            <span>View</span>
          </button>
        )}

        <Link
          to={`/edit-student/${student._id}`}
          className="card-btn btn-edit"
          title="Edit Student"
        >
          <Edit3 size={16} />
          <span>Edit</span>
        </Link>

        {onDelete && (
          <button
            type="button"
            className="card-btn btn-delete"
            onClick={() => onDelete(student._id, student.studentName)}
            title="Delete Student"
          >
            <Trash2 size={16} />
            <span>Delete</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default StudentCard;
