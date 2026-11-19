import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  Search,
  Filter,
  Eye,
  Edit3,
  Trash2,
  AlertCircle,
  CheckCircle2,
  UserPlus,
  RefreshCw,
  LayoutGrid,
  Table as TableIcon,
  X,
  Award,
  BookOpen,
  Mail,
  Calendar,
  Code2
} from 'lucide-react';
import { getStudents, deleteStudent } from '../services/api';
import StudentCard from '../components/StudentCard';

const DEPARTMENTS = [
  'All',
  'Computer Science and Engineering (CSE)',
  'Information Technology (IT)',
  'Electronics and Communication Engineering (ECE)',
  'Electrical and Electronics Engineering (EEE)',
  'Mechanical Engineering (MECH)',
  'Artificial Intelligence & Data Science (AI & DS)',
  'Civil Engineering (CIVIL)'
];

const READINESS_OPTIONS = ['All', 'Ready', 'In Progress', 'Not Ready'];

const StudentList = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'grid'

  // Filter and search states
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDept, setSelectedDept] = useState('All');
  const [selectedReadiness, setSelectedReadiness] = useState('All');

  // Modal states
  const [selectedStudentForView, setSelectedStudentForView] = useState(null);
  const [studentToDelete, setStudentToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [actionFeedback, setActionFeedback] = useState(null);

  // Fetch students from MongoDB via backend API
  const fetchStudents = async () => {
    try {
      setLoading(true);
      setError(null);
      const params = {};
      if (searchTerm.trim()) params.search = searchTerm.trim();
      if (selectedDept !== 'All') params.department = selectedDept;
      if (selectedReadiness !== 'All') params.readiness = selectedReadiness;

      const res = await getStudents(params);
      setStudents(res.data || []);
    } catch (err) {
      setError(err.message || 'Error fetching student skill records');
    } finally {
      setLoading(false);
    }
  };

  // Initial load and filter change
  useEffect(() => {
    fetchStudents();
  }, [selectedDept, selectedReadiness]);

  // Handle Search submit
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchStudents();
  };

  // Clear all filters
  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedDept('All');
    setSelectedReadiness('All');
  };

  // Confirm delete handler
  const promptDelete = (id, name) => {
    setStudentToDelete({ id, name });
  };

  const handleConfirmDelete = async () => {
    if (!studentToDelete) return;

    try {
      setDeleteLoading(true);
      await deleteStudent(studentToDelete.id);
      setActionFeedback({
        type: 'success',
        message: `Student "${studentToDelete.name}" deleted successfully.`
      });
      // Remove deleted student from local state
      setStudents((prev) => prev.filter((s) => s._id !== studentToDelete.id));
      setStudentToDelete(null);
    } catch (err) {
      setActionFeedback({
        type: 'error',
        message: err.message || 'Failed to delete student record'
      });
    } finally {
      setDeleteLoading(false);
    }
  };

  // Status badge styling helper
  const renderReadinessBadge = (status) => {
    let className = 'badge-default';
    if (status === 'Ready') className = 'badge-ready';
    if (status === 'In Progress') className = 'badge-inprogress';
    if (status === 'Not Ready') className = 'badge-notready';

    return <span className={`status-pill ${className}`}>{status}</span>;
  };

  // Aptitude score styling
  const renderAptitudeBadge = (score) => {
    let scoreClass = 'score-red';
    if (score >= 75) scoreClass = 'score-green';
    else if (score >= 50) scoreClass = 'score-orange';

    return <span className={`score-badge ${scoreClass}`}>{score} / 100</span>;
  };

  return (
    <div className="page-container">
      {/* Page Header */}
      <div className="section-header-row mb-4">
        <div>
          <h1 className="page-title">Student Skill & Placement Database</h1>
          <p className="page-subtitle">
            Manage, evaluate, filter, and inspect placement-oriented student records.
          </p>
        </div>
        <div className="header-actions">
          <Link to="/add-student" className="btn btn-primary">
            <UserPlus size={18} />
            <span>Add Student</span>
          </Link>
        </div>
      </div>

      {/* Action Feedback Notification */}
      {actionFeedback && (
        <div
          className={`alert-banner ${
            actionFeedback.type === 'success' ? 'alert-success' : 'alert-error'
          }`}
        >
          {actionFeedback.type === 'success' ? (
            <CheckCircle2 size={20} />
          ) : (
            <AlertCircle size={20} />
          )}
          <div className="alert-content">{actionFeedback.message}</div>
          <button
            type="button"
            className="alert-close-btn"
            onClick={() => setActionFeedback(null)}
          >
            <X size={18} />
          </button>
        </div>
      )}

      {/* Search and Filter Controls Toolbar */}
      <div className="filter-toolbar card-surface">
        <form onSubmit={handleSearchSubmit} className="search-form-group">
          <div className="search-input-wrap">
            <Search className="search-icon" size={18} />
            <input
              type="text"
              placeholder="Search by student name or register number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            {searchTerm && (
              <button
                type="button"
                className="clear-search-btn"
                onClick={() => {
                  setSearchTerm('');
                  // trigger search refresh
                }}
              >
                <X size={16} />
              </button>
            )}
          </div>
          <button type="submit" className="btn btn-secondary search-btn">
            Search
          </button>
        </form>

        <div className="filter-selects-group">
          {/* Department Filter */}
          <div className="filter-item">
            <label className="filter-label">Department:</label>
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="filter-select"
            >
              {DEPARTMENTS.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
          </div>

          {/* Readiness Filter */}
          <div className="filter-item">
            <label className="filter-label">Readiness:</label>
            <select
              value={selectedReadiness}
              onChange={(e) => setSelectedReadiness(e.target.value)}
              className="filter-select"
            >
              {READINESS_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>

          {/* Reset Filters */}
          {(searchTerm || selectedDept !== 'All' || selectedReadiness !== 'All') && (
            <button
              type="button"
              onClick={handleClearFilters}
              className="btn btn-outline btn-reset-filters"
              title="Reset all search & filters"
            >
              Reset
            </button>
          )}

          {/* Refresh Data */}
          <button
            type="button"
            onClick={fetchStudents}
            className="btn btn-outline"
            title="Reload from MongoDB"
            disabled={loading}
          >
            <RefreshCw size={16} className={loading ? 'spin-icon' : ''} />
          </button>

          {/* View Toggle */}
          <div className="view-toggle-group">
            <button
              type="button"
              className={`view-toggle-btn ${viewMode === 'table' ? 'active-toggle' : ''}`}
              onClick={() => setViewMode('table')}
              title="Table View"
            >
              <TableIcon size={18} />
            </button>
            <button
              type="button"
              className={`view-toggle-btn ${viewMode === 'grid' ? 'active-toggle' : ''}`}
              onClick={() => setViewMode('grid')}
              title="Card Grid View"
            >
              <LayoutGrid size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      {loading ? (
        <div className="loading-state-box">
          <div className="spinner"></div>
          <p className="loading-text">Fetching records from MongoDB Atlas...</p>
        </div>
      ) : error ? (
        <div className="alert-banner alert-error">
          <AlertCircle size={22} />
          <div className="alert-content">
            <strong>Error:</strong> {error}
          </div>
          <button onClick={fetchStudents} className="alert-action-btn">
            Retry
          </button>
        </div>
      ) : students.length === 0 ? (
        <div className="empty-state-box card-surface">
          <Users size={54} className="empty-icon" />
          <h3>No Student Records Found</h3>
          <p>
            {searchTerm || selectedDept !== 'All' || selectedReadiness !== 'All'
              ? 'No student matches your current filter or search criteria.'
              : 'There are currently no student skill records in the database.'}
          </p>
          <div className="empty-state-actions">
            {searchTerm || selectedDept !== 'All' || selectedReadiness !== 'All' ? (
              <button onClick={handleClearFilters} className="btn btn-secondary">
                Clear Filters
              </button>
            ) : null}
            <Link to="/add-student" className="btn btn-primary">
              <UserPlus size={18} />
              <span>Add New Student</span>
            </Link>
          </div>
        </div>
      ) : viewMode === 'grid' ? (
        /* Card Grid View */
        <div className="students-grid-container">
          {students.map((student) => (
            <StudentCard
              key={student._id}
              student={student}
              onView={(s) => setSelectedStudentForView(s)}
              onDelete={promptDelete}
            />
          ))}
        </div>
      ) : (
        /* Responsive Table View */
        <div className="table-wrapper card-surface">
          <div className="table-responsive">
            <table className="custom-table student-table">
              <thead>
                <tr>
                  <th>Register Number</th>
                  <th>Student Name</th>
                  <th>Department</th>
                  <th>Technical Skills</th>
                  <th>Aptitude Score</th>
                  <th>Communication</th>
                  <th>Placement Readiness</th>
                  <th className="text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student) => (
                  <tr key={student._id}>
                    {/* Register Number */}
                    <td>
                      <span className="reg-badge">{student.registerNumber}</span>
                    </td>

                    {/* Student Name */}
                    <td>
                      <div className="student-name-cell">
                        <span className="font-semibold">{student.studentName}</span>
                        <span className="student-email-hint">{student.email}</span>
                      </div>
                    </td>

                    {/* Department */}
                    <td>
                      <div className="dept-cell">
                        <span>{student.department}</span>
                        <span className="year-pill">{student.yearOfStudy}</span>
                      </div>
                    </td>

                    {/* Technical Skills */}
                    <td>
                      <div className="table-skills-wrap">
                        {student.technicalSkills && student.technicalSkills.slice(0, 3).map((skill, i) => (
                          <span key={i} className="skill-tag">
                            {skill}
                          </span>
                        ))}
                        {student.technicalSkills && student.technicalSkills.length > 3 && (
                          <span className="skill-tag-more" title={student.technicalSkills.slice(3).join(', ')}>
                            +{student.technicalSkills.length - 3}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Aptitude Score */}
                    <td>{renderAptitudeBadge(student.aptitudeScore)}</td>

                    {/* Communication Skills */}
                    <td>
                      <span className={`comm-badge comm-${student.communicationSkills?.toLowerCase()}`}>
                        {student.communicationSkills}
                      </span>
                    </td>

                    {/* Placement Readiness */}
                    <td>{renderReadinessBadge(student.placementReadiness)}</td>

                    {/* Actions */}
                    <td>
                      <div className="table-actions">
                        <button
                          type="button"
                          className="action-icon-btn btn-action-view"
                          onClick={() => setSelectedStudentForView(student)}
                          title="View Details"
                        >
                          <Eye size={17} />
                        </button>

                        <Link
                          to={`/edit-student/${student._id}`}
                          className="action-icon-btn btn-action-edit"
                          title="Edit Student"
                        >
                          <Edit3 size={17} />
                        </Link>

                        <button
                          type="button"
                          className="action-icon-btn btn-action-delete"
                          onClick={() => promptDelete(student._id, student.studentName)}
                          title="Delete Student"
                        >
                          <Trash2 size={17} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="table-footer-bar">
            <span>Showing {students.length} student records</span>
          </div>
        </div>
      )}

      {/* Details View Modal */}
      {selectedStudentForView && (
        <div className="modal-backdrop" onClick={() => setSelectedStudentForView(null)}>
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Student Profile Details</h3>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setSelectedStudentForView(null)}
              >
                <X size={20} />
              </button>
            </div>
            <div className="modal-body">
              <div className="modal-student-top">
                <div className="student-avatar-lg">
                  {selectedStudentForView.studentName?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h2 className="modal-student-name">{selectedStudentForView.studentName}</h2>
                  <span className="reg-badge">{selectedStudentForView.registerNumber}</span>
                </div>
                <div className="ml-auto">
                  {renderReadinessBadge(selectedStudentForView.placementReadiness)}
                </div>
              </div>

              <div className="detail-grid">
                <div className="detail-item">
                  <span className="detail-label">Department</span>
                  <span className="detail-value">{selectedStudentForView.department}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Year of Study</span>
                  <span className="detail-value">{selectedStudentForView.yearOfStudy}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Email</span>
                  <span className="detail-value">{selectedStudentForView.email}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Communication Skills</span>
                  <span className="detail-value">{selectedStudentForView.communicationSkills}</span>
                </div>
                <div className="detail-item detail-full">
                  <span className="detail-label">Aptitude Score</span>
                  <div className="mt-1">
                    {renderAptitudeBadge(selectedStudentForView.aptitudeScore)}
                  </div>
                </div>
                <div className="detail-item detail-full">
                  <span className="detail-label">Technical Skills</span>
                  <div className="skills-tags-wrap mt-1">
                    {selectedStudentForView.technicalSkills?.map((s) => (
                      <span key={s} className="skill-tag">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Registered Date</span>
                  <span className="detail-value text-muted">
                    {new Date(selectedStudentForView.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Last Updated</span>
                  <span className="detail-value text-muted">
                    {new Date(selectedStudentForView.updatedAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <Link
                to={`/edit-student/${selectedStudentForView._id}`}
                className="btn btn-primary"
              >
                <Edit3 size={16} /> Edit Record
              </Link>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setSelectedStudentForView(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {studentToDelete && (
        <div className="modal-backdrop" onClick={() => setStudentToDelete(null)}>
          <div className="modal-dialog delete-modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="delete-modal-content">
              <div className="delete-icon-box">
                <Trash2 size={28} />
              </div>
              <h3 className="delete-modal-title">Confirm Delete</h3>
              <p className="delete-modal-desc">
                Are you sure you want to permanently delete the skill record for{' '}
                <strong>"{studentToDelete.name}"</strong>?
              </p>
              <p className="delete-warning-text">This action cannot be undone in MongoDB.</p>

              <div className="delete-modal-actions">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setStudentToDelete(null)}
                  disabled={deleteLoading}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={handleConfirmDelete}
                  disabled={deleteLoading}
                >
                  {deleteLoading ? 'Deleting...' : 'Yes, Delete Record'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentList;
