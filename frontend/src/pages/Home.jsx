import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  CheckCircle2,
  Clock,
  AlertCircle,
  UserPlus,
  ArrowRight,
  TrendingUp,
  Award,
  Code,
  Building,
  RefreshCw
} from 'lucide-react';
import { getStudents } from '../services/api';

const Home = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await getStudents();
      setStudents(res.data || []);
    } catch (err) {
      setError(err.message || 'Failed to load dashboard statistics from backend API');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Compute live statistics from MongoDB records
  const totalStudents = students.length;
  const readyStudents = students.filter((s) => s.placementReadiness === 'Ready').length;
  const inProgressStudents = students.filter((s) => s.placementReadiness === 'In Progress').length;
  const notReadyStudents = students.filter((s) => s.placementReadiness === 'Not Ready').length;

  const readyPercent = totalStudents > 0 ? Math.round((readyStudents / totalStudents) * 100) : 0;
  const inProgressPercent = totalStudents > 0 ? Math.round((inProgressStudents / totalStudents) * 100) : 0;
  const notReadyPercent = totalStudents > 0 ? Math.round((notReadyStudents / totalStudents) * 100) : 0;

  const averageAptitude =
    totalStudents > 0
      ? Math.round(students.reduce((acc, curr) => acc + (curr.aptitudeScore || 0), 0) / totalStudents)
      : 0;

  // Department counts
  const departmentCounts = students.reduce((acc, curr) => {
    const dept = curr.department || 'Other';
    acc[dept] = (acc[dept] || 0) + 1;
    return acc;
  }, {});

  // Technical skills distribution
  const skillCounts = students.reduce((acc, curr) => {
    if (Array.isArray(curr.technicalSkills)) {
      curr.technicalSkills.forEach((skill) => {
        acc[skill] = (acc[skill] || 0) + 1;
      });
    }
    return acc;
  }, {});

  const topSkills = Object.entries(skillCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6);

  // Recent 5 students
  const recentStudents = students.slice(0, 5);

  return (
    <div className="page-container">
      {/* Welcome & Header Section */}
      <section className="dashboard-hero">
        <div className="hero-content">
          <div className="hero-badge">Placement Skill Monitoring Management System</div>
          <h1 className="hero-title">College Placement Readiness & Skill Tracker</h1>
          <p className="hero-description">
            Comprehensive real-time tracking for student technical proficiencies, aptitude evaluations,
            communication assessments, and campus placement qualification.
          </p>

          <div className="hero-actions">
            <Link to="/add-student" className="btn btn-primary">
              <UserPlus size={18} />
              <span>Add Student Skills</span>
            </Link>
            <Link to="/students" className="btn btn-secondary">
              <Users size={18} />
              <span>View Student List</span>
              <ArrowRight size={18} />
            </Link>
            <button
              onClick={fetchDashboardData}
              className="btn btn-outline"
              title="Refresh MongoDB Data"
              disabled={loading}
            >
              <RefreshCw size={17} className={loading ? 'spin-icon' : ''} />
              <span>Sync</span>
            </button>
          </div>
        </div>
      </section>

      {/* Error Banner */}
      {error && (
        <div className="alert-banner alert-error">
          <AlertCircle size={20} />
          <div className="alert-content">
            <strong>Error connecting to database:</strong> {error}
          </div>
          <button onClick={fetchDashboardData} className="alert-action-btn">
            Retry
          </button>
        </div>
      )}

      {/* Primary Metric Stat Cards */}
      <section className="stats-grid">
        {/* Total Students Card */}
        <div className="stat-card stat-total">
          <div className="stat-icon-wrapper total-icon-bg">
            <Users size={28} />
          </div>
          <div className="stat-details">
            <span className="stat-label">Total Registered Students</span>
            <h2 className="stat-value">{loading ? '...' : totalStudents}</h2>
            <span className="stat-subtext">Active records in MongoDB</span>
          </div>
        </div>

        {/* Placement Ready Card (Green) */}
        <div className="stat-card stat-ready">
          <div className="stat-icon-wrapper ready-icon-bg">
            <CheckCircle2 size={28} />
          </div>
          <div className="stat-details">
            <div className="stat-header-row">
              <span className="stat-label">Placement Ready</span>
              <span className="stat-percent-badge badge-ready">{readyPercent}%</span>
            </div>
            <h2 className="stat-value">{loading ? '...' : readyStudents}</h2>
            <span className="stat-subtext">Eligible for interview rounds</span>
          </div>
        </div>

        {/* In Progress Card (Orange) */}
        <div className="stat-card stat-inprogress">
          <div className="stat-icon-wrapper inprogress-icon-bg">
            <Clock size={28} />
          </div>
          <div className="stat-details">
            <div className="stat-header-row">
              <span className="stat-label">In Progress</span>
              <span className="stat-percent-badge badge-inprogress">{inProgressPercent}%</span>
            </div>
            <h2 className="stat-value">{loading ? '...' : inProgressStudents}</h2>
            <span className="stat-subtext">Under skill enhancement</span>
          </div>
        </div>

        {/* Not Ready Card (Red) */}
        <div className="stat-card stat-notready">
          <div className="stat-icon-wrapper notready-icon-bg">
            <AlertCircle size={28} />
          </div>
          <div className="stat-details">
            <div className="stat-header-row">
              <span className="stat-label">Not Ready</span>
              <span className="stat-percent-badge badge-notready">{notReadyPercent}%</span>
            </div>
            <h2 className="stat-value">{loading ? '...' : notReadyStudents}</h2>
            <span className="stat-subtext">Requires core training</span>
          </div>
        </div>
      </section>

      {/* Secondary Dashboard Analytics */}
      <section className="analytics-grid">
        {/* Average Aptitude Benchmark */}
        <div className="analytics-card">
          <div className="analytics-card-header">
            <div className="analytics-title-group">
              <Award className="analytics-icon" size={20} />
              <h3>Average Aptitude Benchmark</h3>
            </div>
          </div>
          <div className="analytics-card-body">
            <div className="aptitude-big-score">
              <span className="big-number">{averageAptitude}</span>
              <span className="score-denom">/ 100</span>
            </div>
            <div className="score-progress-wrap">
              <div
                className="score-progress-bar"
                style={{
                  width: `${averageAptitude}%`,
                  backgroundColor:
                    averageAptitude >= 70 ? '#10b981' : averageAptitude >= 50 ? '#f59e0b' : '#ef4444'
                }}
              ></div>
            </div>
            <p className="analytics-hint">
              {averageAptitude >= 75
                ? 'High overall batch aptitude standard.'
                : averageAptitude >= 50
                ? 'Moderate aptitude performance with room for training.'
                : 'Intensive aptitude workshops recommended.'}
            </p>
          </div>
        </div>

        {/* Technical Skills Distribution */}
        <div className="analytics-card">
          <div className="analytics-card-header">
            <div className="analytics-title-group">
              <Code className="analytics-icon" size={20} />
              <h3>Popular Technical Skills</h3>
            </div>
          </div>
          <div className="analytics-card-body">
            {topSkills.length > 0 ? (
              <div className="skills-bar-list">
                {topSkills.map(([skill, count]) => {
                  const percent = totalStudents > 0 ? Math.round((count / totalStudents) * 100) : 0;
                  return (
                    <div key={skill} className="skill-distribution-item">
                      <div className="skill-dist-labels">
                        <span className="skill-dist-name">{skill}</span>
                        <span className="skill-dist-count">
                          {count} students ({percent}%)
                        </span>
                      </div>
                      <div className="skill-dist-track">
                        <div className="skill-dist-fill" style={{ width: `${percent}%` }}></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="empty-mini-text">No technical skill data registered yet.</p>
            )}
          </div>
        </div>

        {/* Department Overview */}
        <div className="analytics-card">
          <div className="analytics-card-header">
            <div className="analytics-title-group">
              <Building className="analytics-icon" size={20} />
              <h3>Department Distribution</h3>
            </div>
          </div>
          <div className="analytics-card-body">
            {Object.keys(departmentCounts).length > 0 ? (
              <div className="department-tag-grid">
                {Object.entries(departmentCounts).map(([dept, count]) => (
                  <div key={dept} className="dept-stat-pill">
                    <span className="dept-name">{dept}</span>
                    <span className="dept-count-badge">{count}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="empty-mini-text">No departments recorded yet.</p>
            )}
          </div>
        </div>
      </section>

      {/* Recent Students Table Quick Preview */}
      <section className="recent-section">
        <div className="section-header-row">
          <div>
            <h2 className="section-title">Recently Added Profiles</h2>
            <p className="section-subtitle">Latest student skill entries recorded in the database</p>
          </div>
          <Link to="/students" className="section-link">
            <span>View All ({totalStudents})</span>
            <ArrowRight size={16} />
          </Link>
        </div>

        {recentStudents.length > 0 ? (
          <div className="table-responsive card-surface">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Reg Number</th>
                  <th>Student Name</th>
                  <th>Department</th>
                  <th>Aptitude</th>
                  <th>Readiness</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {recentStudents.map((s) => (
                  <tr key={s._id}>
                    <td>
                      <span className="reg-badge">{s.registerNumber}</span>
                    </td>
                    <td className="font-semibold">{s.studentName}</td>
                    <td>{s.department}</td>
                    <td>
                      <span className="score-pill">{s.aptitudeScore}%</span>
                    </td>
                    <td>
                      <span
                        className={`status-pill ${
                          s.placementReadiness === 'Ready'
                            ? 'badge-ready'
                            : s.placementReadiness === 'In Progress'
                            ? 'badge-inprogress'
                            : 'badge-notready'
                        }`}
                      >
                        {s.placementReadiness}
                      </span>
                    </td>
                    <td>
                      <Link to={`/edit-student/${s._id}`} className="table-action-link">
                        Edit
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : !loading && (
          <div className="empty-state-box">
            <Users size={48} className="empty-icon" />
            <h3>No Students Added Yet</h3>
            <p>Start registering student skills to generate real-time placement monitoring analytics.</p>
            <Link to="/add-student" className="btn btn-primary mt-3">
              <UserPlus size={18} />
              <span>Add First Student</span>
            </Link>
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;
