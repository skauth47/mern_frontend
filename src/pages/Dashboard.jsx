import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const API_BASE = "https://mern-backend-x2li.onrender.com/api/users";

function Dashboard() {
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [name, setName] = useState("");
  const [editId, setEditId] = useState(null);
  const [status, setStatus] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const isMaster = currentUser?.role === "master";
  const canAdd = isMaster || currentUser?.permissions?.canAdd;
  const canEdit = isMaster || currentUser?.permissions?.canEdit;
  const canDelete = isMaster || currentUser?.permissions?.canDelete;

  // FETCH USERS
  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch(
        API_BASE,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      console.log(data);

      setUsers(Array.isArray(data) ? data : []);

    } catch (error) {
      console.log(error);
      setStatus("Unable to load users. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  const fetchCurrentUser = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status === 401 || res.status === 403) {
        localStorage.removeItem("token");
        localStorage.removeItem("currentUser");
        navigate("/login", { replace: true });
        return;
      }

      const data = await res.json();
      setCurrentUser(data);
      localStorage.setItem("currentUser", JSON.stringify(data));
    } catch (error) {
      console.log(error);
      setStatus("Unable to load your access profile.");
    }
  }, [navigate, token]);

  // LOAD USERS ON PAGE LOAD
  useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect */
    fetchCurrentUser();
    fetchUsers();
    /* eslint-enable react-hooks/set-state-in-effect */
  }, [fetchCurrentUser, fetchUsers]);

  // LOGOUT
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("currentUser");

    navigate("/login");
  };

  // ADD OR UPDATE USER
  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("");

    if (!name.trim()) return;

    try {
      if (editId) {
        // UPDATE USER
        await fetch(
          `${API_BASE}/${editId}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ name }),
          }
        );
      } else {
        // ADD USER
        await fetch(
          API_BASE,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ name }),
          }
        );
      }

      setName("");
      setEditId(null);
      setStatus(editId ? "User updated successfully." : "User added successfully.");

      fetchUsers();

    } catch (error) {
      console.log(error);
      setStatus("Unable to save the user.");
    }
  };

  // DELETE USER
  const handleDelete = async (id) => {
    try {
      await fetch(
        `${API_BASE}/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      fetchUsers();
      setStatus("User deleted successfully.");

    } catch (error) {
      console.log(error);
      setStatus("Unable to delete the user.");
    }
  };

  // EDIT USER
  const handleEdit = (user) => {
    setName(user.name);
    setEditId(user._id);
  };

  const updateAccess = async (user, updates) => {
    setStatus("");

    try {
      const res = await fetch(`${API_BASE}/${user._id}/access`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updates),
      });

      const data = await res.json();

      if (!res.ok) {
        setStatus(data.message || "Unable to update access.");
        return;
      }

      setUsers((items) =>
        items.map((item) => (item._id === user._id ? { ...item, ...data.user } : item))
      );
      setStatus("Access updated successfully.");
    } catch (error) {
      console.log(error);
      setStatus("Unable to update access.");
    }
  };

  return (
    <main className="dashboard-layout">
      <aside className="sidebar">
        <div className="brand compact">
          <span className="brand-badge">MF</span>
          <span>MERN Flow</span>
        </div>
        <nav className="side-nav" aria-label="Dashboard navigation">
          <a className="active" href="/dashboard">Overview</a>
          <a href="/dashboard">Users</a>
          <a href="/dashboard">Activity</a>
          <button type="button" onClick={logout}>Logout</button>
        </nav>
      </aside>

      <section className="dashboard-main">
        <header className="dashboard-header">
          <div>
            <p className="eyebrow">Protected dashboard</p>
            <h1>User Dashboard</h1>
            <p className="muted">
              {isMaster
                ? "Approve registrations and grant user-management permissions."
                : "Manage records according to the access granted by your master agent."}
            </p>
          </div>
          <button className="secondary-button" type="button" onClick={logout}>Logout</button>
        </header>

        <section className="metric-grid" aria-label="Dashboard metrics">
          <article className="metric-card">
            <span>Total users</span>
            <strong>{users.length}</strong>
          </article>
          <article className="metric-card">
            <span>Backend</span>
            <strong>Live</strong>
          </article>
          <article className="metric-card">
            <span>Session</span>
            <strong>{currentUser?.role === "master" ? "Master" : "User"}</strong>
          </article>
        </section>

        <section className="workspace-grid">
          <article className="panel">
            <div className="panel-heading">
              <div>
                <h2>{editId ? "Update user" : "Add user"}</h2>
                <p className="muted">Create or edit a user record in MongoDB.</p>
              </div>
            </div>

            {!canAdd && !canEdit && (
              <p className="muted">You do not currently have add or edit access.</p>
            )}

            <form className="inline-form" onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder="Enter name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={editId ? !canEdit : !canAdd}
              />
              <button className="primary-button" type="submit" disabled={editId ? !canEdit : !canAdd}>
                {editId ? "Update" : "Add"}
              </button>
              {editId && (
                <button
                  className="secondary-button"
                  type="button"
                  onClick={() => {
                    setEditId(null);
                    setName("");
                  }}
                >
                  Cancel
                </button>
              )}
            </form>

            {status && <p className="form-message success">{status}</p>}
          </article>

          <article className="panel table-panel">
            <div className="panel-heading">
              <div>
                <h2>Users</h2>
                <p className="muted">{isLoading ? "Loading users..." : "Current records from the API."}</p>
              </div>
            </div>

            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>Access</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {users.map((user, index) => (
                    <tr key={user._id}>
                      <td>{index + 1}</td>
                      <td>{user.name}</td>
                      <td>
                        <div className="access-stack">
                          <span className={user.isApproved ? "status-pill approved" : "status-pill pending"}>
                            {user.isApproved ? "Approved" : "Pending"}
                          </span>
                          <span className="muted small-copy">{user.role || "user"}</span>
                        </div>
                      </td>
                      <td>
                        <div className="action-row">
                          {canEdit && (
                            <button className="secondary-button" onClick={() => handleEdit(user)}>
                              Edit
                            </button>
                          )}
                          {canDelete && (
                            <button className="danger-button" onClick={() => handleDelete(user._id)}>
                              Delete
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}

                  {!isLoading && users.length === 0 && (
                    <tr>
                      <td colSpan="4" className="empty-state">No users found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </article>

          {isMaster && (
            <article className="panel access-panel">
              <div className="panel-heading">
                <div>
                  <h2>Access control</h2>
                  <p className="muted">Approve users and grant add, edit, or delete access.</p>
                </div>
              </div>

              <div className="access-list">
                {users.map((user) => (
                  <div className="access-item" key={`access-${user._id}`}>
                    <div>
                      <strong>{user.name}</strong>
                      <span>{user.email}</span>
                    </div>
                    <div className="permission-grid">
                      <label>
                        <input
                          type="checkbox"
                          checked={Boolean(user.isApproved)}
                          onChange={(e) => updateAccess(user, { isApproved: e.target.checked })}
                        />
                        Approved
                      </label>
                      <label>
                        <input
                          type="checkbox"
                          checked={user.role === "master"}
                          onChange={(e) =>
                            updateAccess(user, {
                              role: e.target.checked ? "master" : "user",
                            })
                          }
                        />
                        Master
                      </label>
                      <label>
                        <input
                          type="checkbox"
                          checked={Boolean(user.permissions?.canAdd)}
                          disabled={user.role === "master"}
                          onChange={(e) =>
                            updateAccess(user, {
                              permissions: { ...user.permissions, canAdd: e.target.checked },
                            })
                          }
                        />
                        Add
                      </label>
                      <label>
                        <input
                          type="checkbox"
                          checked={Boolean(user.permissions?.canEdit)}
                          disabled={user.role === "master"}
                          onChange={(e) =>
                            updateAccess(user, {
                              permissions: { ...user.permissions, canEdit: e.target.checked },
                            })
                          }
                        />
                        Edit
                      </label>
                      <label>
                        <input
                          type="checkbox"
                          checked={Boolean(user.permissions?.canDelete)}
                          disabled={user.role === "master"}
                          onChange={(e) =>
                            updateAccess(user, {
                              permissions: { ...user.permissions, canDelete: e.target.checked },
                            })
                          }
                        />
                        Delete
                      </label>
                    </div>
                  </div>
                ))}
              </div>
            </article>
          )}
        </section>
      </section>
    </main>
  );
}

export default Dashboard;
