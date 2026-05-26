const API = import.meta.env.VITE_API_URL;

export const getUsers = async () => {
  const res = await fetch(`${API}/users`);
  return res.json();
};

export const deleteUser = async (id) => {
  await fetch(`${API}/users/${id}`, {
    method: "DELETE",
  });
};