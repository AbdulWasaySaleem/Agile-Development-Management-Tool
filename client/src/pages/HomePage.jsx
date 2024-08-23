// Homepage.jsx
import React from 'react';
import BarChart from '../components/UI/Barchart'; // Bar chart component
import LineChart from '../components/UI/LineChart'; // Line chart component
import { useAuth } from '../components/Context/UserContext';

const Homepage = () => {
  const [auth] = useAuth();

  // Check if auth and auth.user exist
  const user = auth?.user;

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <header className="bg-gray-800 text-white p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">{user?.name || 'User'}</h1>
          {/* User profile section can go here */}
        </div>
      </header>

      <main className="container mx-auto mt-6">
        {/* Project Overview */}
        <section className="bg-white p-2 rounded-lg shadow-md mb-2">
          <h2 className="text-xl font-semibold mb-4">Project Overview</h2>
          
        </section>

        {/* Task Statuses */}
        <section className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-xl font-semibold mb-4">Task Statuses</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-blue-100 p-4 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold">Done</h3>
              <p className="text-gray-600">Number of tasks done.</p>
            </div>
            <div className="bg-yellow-100 p-4 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold">Working On</h3>
              <p className="text-gray-600">Number of tasks currently being worked on.</p>
            </div>
            <div className="bg-red-100 p-4 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold">Stuck</h3>
              <p className="text-gray-600">Number of tasks that are stuck.</p>
            </div>
            <div className="bg-gray-200 p-4 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold">Paused</h3>
              <p className="text-gray-600">Number of tasks paused.</p>
            </div>
            <div className="bg-green-100 p-4 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold">Deliver</h3>
              <p className="text-gray-600">Number of tasks delivered.</p>
            </div>
            <div className="bg-purple-100 p-4 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold">Revision</h3>
              <p className="text-gray-600">Number of tasks under revision.</p>
            </div>
          </div>
        </section>

        {/* Charts */}
        <section className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Project Metrics</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <BarChart />
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <LineChart />
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Homepage;
