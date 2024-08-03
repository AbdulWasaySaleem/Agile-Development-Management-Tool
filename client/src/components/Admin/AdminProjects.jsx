import React, { useEffect, useState } from 'react';

const AdminProjects = () => {
  const [projects, setProjects] = useState([]);

  // Mock data for demonstration
  const fetchProjects = async () => {
    // Replace with API call to fetch ongoing projects
    const response = [
      { id: 1, name: 'Project Alpha', status: 'Ongoing', deadline: '2024-12-31' },
      { id: 2, name: 'Project Beta', status: 'Ongoing', deadline: '2024-11-15' },
      // Add more project data as needed
    ];
    setProjects(response);
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  return (
    <div className="p-6 ">
      <h1 className="text-2xl font-bold mb-6">Ongoing Projects</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map(project => (
          <div key={project.id} className="bg-white p-4 border border-gray-300 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-2">{project.name}</h2>
            <p className="text-gray-600 mb-1"><strong>Status:</strong> {project.status}</p>
            <p className="text-gray-600 mb-4"><strong>Deadline:</strong> {project.deadline}</p>
            <button className="text-blue-500 hover:underline">View Details</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminProjects;
