import React, { useEffect, useState } from 'react'
import axios from 'axios'


const Pendingusers = () => {
  const [pendingUsers, setPendingUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [role, setRole] = useState('');
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fetchPendingUsers = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/v1/auth/pendinguser');
        console.log(response.data);
        if (response.data.sucess && Array.isArray(response.data.user)) {
          setPendingUsers(response.data.user);
        } else {
          console.error('API response does not contain a valid user array');
        }
      } catch (error) {
        console.error('Error fetching pending users:', error);
      }
    };
    fetchPendingUsers();
  }, []);

  const handleClickOpen = (user) => {
    console.log("handle click",user)
    setSelectedUser(user);
    setRole(user.role);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedUser(null);
  };

  const handleApprove = async () => {
    try {
      const res = await axios.put(`http://localhost:3001/api/v1/auth/${selectedUser._id}/approve`, { role });
      console.log(res)
      setPendingUsers(pendingUsers.filter((user) => user._id !== selectedUser._id));
      handleClose();
    } catch (error) {
      console.error('Error approving user:', error);
    }
  };


  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Pending Users</h2>
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">Name</th>
            <th className="py-2 px-4 border-b">Email</th>
            <th className="py-2 px-4 border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          {pendingUsers.map((user) => (
            <tr key={user._id}>
              <td className="py-2 px-4 border-b">{user.name}</td>
              <td className="py-2 px-4 border-b">{user.email}</td>
              <td className="py-2 px-4 border-b">
                <button
                  className="bg-blue-500 text-white py-1 px-4 rounded"
                  onClick={() => handleClickOpen(user)}
                >
                  Approve
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {open && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-4 w-1/3">
            <h3 className="text-xl font-bold mb-4">Approve User</h3>
            <div className="mb-4">
              <label className="block mb-2">Role</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full p-2 border rounded"
              >
                <option value="admin">Admin</option>
                <option value="senior_developer">Senior Developer</option>
                <option value="junior_developer">Junior Developer</option>
                <option value="HR">HR</option>
              </select>
            </div>
            <div className="flex justify-end">
              <button
                className="bg-gray-500 text-white py-1 px-4 rounded mr-2"
                onClick={handleClose}
              >
                Cancel
              </button>
              <button
                className="bg-blue-500 text-white py-1 px-4 rounded"
                onClick={handleApprove}
              >
                Approve
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Pendingusers