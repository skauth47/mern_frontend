import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const [users, setUsers] = useState([]);
  const [name, setName] = useState("");
  const [editId, setEditId] = useState(null);

  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  // FETCH USERS
  const fetchUsers = async () => {
    try {
      const res = await fetch(
        "https://mern-backend-x2li.onrender.com/api/users",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      console.log(data);

      setUsers(data);

    } catch (error) {
      console.log(error);
    }
  };

  // LOAD USERS ON PAGE LOAD
  useEffect(() => {
    fetchUsers();
  }, []);

  // LOGOUT
  const logout = () => {
    localStorage.removeItem("token");

    navigate("/login");
  };

  // ADD OR UPDATE USER
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) return;

    try {
      if (editId) {
        // UPDATE USER
        await fetch(
          `https://mern-backend-x2li.onrender.com/api/users/${editId}`,
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
          "https://mern-backend-x2li.onrender.com/api/users",
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

      fetchUsers();

    } catch (error) {
      console.log(error);
    }
  };

  // DELETE USER
  const handleDelete = async (id) => {
    try {
      await fetch(
        `https://mern-backend-x2li.onrender.com/api/users/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      fetchUsers();

    } catch (error) {
      console.log(error);
    }
  };

  // EDIT USER
  const handleEdit = (user) => {
    setName(user.name);
    setEditId(user._id);
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h1>User Dashboard</h1>

        <button onClick={logout}>
          Logout
        </button>
      </div>

      <h3>Total Users: {users.length}</h3>

      {/* ADD / UPDATE FORM */}
      <form
        onSubmit={handleSubmit}
        style={{ marginBottom: "20px" }}
      >
        <input
          type="text"
          placeholder="Enter name"
          value={name}
          onChange={(e) =>
            setName(e.target.value)
          }
          style={{
            padding: "8px",
            marginRight: "10px",
          }}
        />

        <button type="submit">
          {editId ? "Update User" : "Add User"}
        </button>
      </form>

      <table
        border="1"
        cellPadding="10"
        cellSpacing="0"
        style={{ width: "100%" }}
      >
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {users.map((user, index) => (
            <tr key={user._id}>
              <td>{index + 1}</td>

              <td>{user.name}</td>

              <td>
                <button
                  onClick={() => handleEdit(user)}
                  style={{
                    marginRight: "10px",
                  }}
                >
                  Edit
                </button>

                <button
                  onClick={() =>
                    handleDelete(user._id)
                  }
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Dashboard;