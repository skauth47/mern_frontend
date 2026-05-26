import { useEffect, useState } from "react";

function Dashboard() {
  const [users, setUsers] = useState([]);
  const [name, setName] = useState("");
  const [editId, setEditId] = useState(null);

  // Fetch users
  const fetchUsers = async () => {
    try {
      const res = await fetch("https://mern-backend-x2li.onrender.com/api/users");
      const data = await res.json();
      setUsers(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Add or Update user
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) return;

    try {
      if (editId) {
        // Update user
        await fetch(`https://mern-backend-x2li.onrender.com/api/users/${editId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name }),
        });
      } else {
        // Add user
        await fetch("https://mern-backend-x2li.onrender.com/api/users", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name }),
        });
      }

      setName("");
      setEditId(null);
      fetchUsers();
    } catch (error) {
      console.log(error);
    }
  };

  // Delete user
  const handleDelete = async (id) => {
    try {
      await fetch(`https://mern-backend-x2li.onrender.com/api/users/${id}`, {
        method: "DELETE",
      });

      fetchUsers();
    } catch (error) {
      console.log(error);
    }
  };

  // Edit user
  const handleEdit = (user) => {
    setName(user.name);
    setEditId(user._id);
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h1>User Dashboard</h1>

      <h3>Total Users: {users.length}</h3>

      {/* Add / Update Form */}
      <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Enter name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{ padding: "8px", marginRight: "10px" }}
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
                  style={{ marginRight: "10px" }}
                >
                  Edit
                </button>

                <button onClick={() => handleDelete(user._id)}>
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