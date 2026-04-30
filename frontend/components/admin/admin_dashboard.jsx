import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  deleteAdminProject,
  deleteAdminUser,
  fetchAdminProjects,
  fetchAdminSummary,
  fetchAdminUsers
} from "../../util/admin_api_util";

const AdminDashboard = () => {
  const [summary, setSummary] = useState(null);
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [projectQuery, setProjectQuery] = useState("");
  const [projectTypeFilter, setProjectTypeFilter] = useState("all");
  const [userQuery, setUserQuery] = useState("");
  const [userRoleFilter, setUserRoleFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busyKey, setBusyKey] = useState("");

  const refresh = async () => {
    setLoading(true);
    setError("");

    try {
      const [summaryData, projectData, userData] = await Promise.all([
        fetchAdminSummary(),
        fetchAdminProjects(),
        fetchAdminUsers()
      ]);

      setSummary(summaryData);
      setProjects(projectData);
      setUsers(userData);
    } catch (err) {
      setError(err?.responseJSON?.[0] || "Unable to load admin dashboard data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  const filteredProjects = useMemo(() => {
    const normalizedQuery = projectQuery.trim().toLowerCase();

    return projects.filter(project => {
      const matchesQuery =
        !normalizedQuery ||
        project.title.toLowerCase().includes(normalizedQuery) ||
        project.ownerName.toLowerCase().includes(normalizedQuery);

      const matchesType =
        projectTypeFilter === "all" ||
        (projectTypeFilter === "loved" && project.loved) ||
        (projectTypeFilter === "regular" && !project.loved);

      return matchesQuery && matchesType;
    });
  }, [projects, projectQuery, projectTypeFilter]);

  const filteredUsers = useMemo(() => {
    const normalizedQuery = userQuery.trim().toLowerCase();

    return [...users]
      .sort((a, b) => Number(b.isAdmin) - Number(a.isAdmin))
      .filter(user => {
        const matchesQuery =
          !normalizedQuery ||
          user.name.toLowerCase().includes(normalizedQuery) ||
          user.email.toLowerCase().includes(normalizedQuery);

        const matchesRole =
          userRoleFilter === "all" ||
          (userRoleFilter === "admin" && user.isAdmin) ||
          (userRoleFilter === "member" && !user.isAdmin);

        return matchesQuery && matchesRole;
      });
  }, [users, userQuery, userRoleFilter]);

  const clearFilters = () => {
    setProjectQuery("");
    setProjectTypeFilter("all");
    setUserQuery("");
    setUserRoleFilter("all");
  };

  const onDeleteProject = async project => {
    const confirmed = window.confirm(
      `Delete project "${project.title}" and all of its rewards/backings?`
    );
    if (!confirmed) return;

    setBusyKey(`project-${project.id}`);
    setError("");
    try {
      await deleteAdminProject(project.id);
      await refresh();
    } catch (err) {
      setError(err?.responseJSON?.[0] || "Could not delete project.");
    } finally {
      setBusyKey("");
    }
  };

  const onDeleteUser = async user => {
    const confirmed = window.confirm(
      `Delete user "${user.name}" and all of their projects?`
    );
    if (!confirmed) return;

    setBusyKey(`user-${user.id}`);
    setError("");
    try {
      await deleteAdminUser(user.id);
      await refresh();
    } catch (err) {
      setError(err?.responseJSON?.[0] || "Could not delete user.");
    } finally {
      setBusyKey("");
    }
  };

  return (
    <div className="admin-page">
      <div className="admin-header-row">
        <div>
          <h1 className="admin-title">Admin Dashboard</h1>
          <p className="admin-subtitle">
            Moderate campaigns, remove problematic posts, and manage users.
          </p>
        </div>
        <button className="admin-refresh-btn" onClick={refresh} disabled={loading}>
          {loading ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      {error ? <div className="admin-error-banner">{error}</div> : null}

      <div className="admin-summary-grid">
        <article className="admin-card">
          <h2>Total Users</h2>
          <p>{summary?.totalUsers ?? "-"}</p>
        </article>
        <article className="admin-card">
          <h2>Total Projects</h2>
          <p>{summary?.totalProjects ?? "-"}</p>
        </article>
        <article className="admin-card">
          <h2>Total Rewards</h2>
          <p>{summary?.totalRewards ?? "-"}</p>
        </article>
        <article className="admin-card">
          <h2>Total Backings</h2>
          <p>{summary?.totalBackings ?? "-"}</p>
        </article>
      </div>

      <section className="admin-filter-panel">
        <div className="admin-filter-grid">
          <div className="admin-filter-group">
            <label htmlFor="project-search">Filter projects</label>
            <input
              id="project-search"
              type="text"
              value={projectQuery}
              onChange={event => setProjectQuery(event.target.value)}
              placeholder="Search by title or owner"
            />
          </div>
          <div className="admin-filter-group">
            <label htmlFor="project-type">Project type</label>
            <select
              id="project-type"
              value={projectTypeFilter}
              onChange={event => setProjectTypeFilter(event.target.value)}
            >
              <option value="all">All</option>
              <option value="loved">Projects We Love</option>
              <option value="regular">Regular Projects</option>
            </select>
          </div>
          <div className="admin-filter-group">
            <label htmlFor="user-search">Filter users</label>
            <input
              id="user-search"
              type="text"
              value={userQuery}
              onChange={event => setUserQuery(event.target.value)}
              placeholder="Search by name or email"
            />
          </div>
          <div className="admin-filter-group">
            <label htmlFor="user-role">User role</label>
            <select
              id="user-role"
              value={userRoleFilter}
              onChange={event => setUserRoleFilter(event.target.value)}
            >
              <option value="all">All</option>
              <option value="admin">Admins</option>
              <option value="member">Members</option>
            </select>
          </div>
        </div>
        <button className="admin-clear-btn" onClick={clearFilters}>
          Clear Filters
        </button>
      </section>

      <section className="admin-section">
        <div className="admin-section-head">
          <h2>Projects</h2>
          <span>
            {filteredProjects.length} shown / {projects.length} total
          </span>
        </div>

        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Owner</th>
                <th>Rewards</th>
                <th>Backings</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProjects.map(project => (
                <tr key={project.id}>
                  <td>
                    <Link to={`/projects/${project.id}`} className="admin-inline-link">
                      {project.title}
                    </Link>
                  </td>
                  <td>{project.ownerName}</td>
                  <td>{project.rewardCount}</td>
                  <td>{project.backingCount}</td>
                  <td>
                    <button
                      className="admin-danger-btn"
                      onClick={() => onDeleteProject(project)}
                      disabled={busyKey === `project-${project.id}`}
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
              {!filteredProjects.length ? (
                <tr>
                  <td colSpan="5" className="admin-empty-state">
                    No projects match the current filters.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </section>

      <section className="admin-section">
        <div className="admin-section-head">
          <h2>Users</h2>
          <span>
            {filteredUsers.length} shown / {users.length} total
          </span>
        </div>

        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Projects</th>
                <th>Backings</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map(user => (
                <tr key={user.id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.isAdmin ? "Admin" : "Member"}</td>
                  <td>{user.projectCount}</td>
                  <td>{user.backingCount}</td>
                  <td>
                    {!user.isAdmin ? (
                      <button
                        className="admin-danger-btn"
                        onClick={() => onDeleteUser(user)}
                        disabled={busyKey === `user-${user.id}`}
                      >
                        Remove
                      </button>
                    ) : (
                      <span className="admin-muted-label">Protected</span>
                    )}
                  </td>
                </tr>
              ))}
              {!filteredUsers.length ? (
                <tr>
                  <td colSpan="6" className="admin-empty-state">
                    No users match the current filters.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default AdminDashboard;