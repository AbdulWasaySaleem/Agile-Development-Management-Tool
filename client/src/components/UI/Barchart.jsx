import React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Card, Typography } from "antd";

const { Title } = Typography;

const ProjectBarChart = ({ projects }) => {
  // Transforming projects data into the format needed for the chart
  const projectData = projects.reduce((acc, project) => {
    // Find or create a data entry for the current project title
    const existingProject = acc.find(item => item.project === project.title);
    
    if (existingProject) {
      // Increment the count based on project status
      if (project.status.toLowerCase() === 'not started') {
        existingProject.NotStarted += 1;
      } else if (project.status.toLowerCase() === 'in progress') {
        existingProject.InProgress += 1;
      } else if (project.status.toLowerCase() === 'completed') {
        existingProject.Completed += 1;
      }
    } else {
      // Create a new entry for the project
      acc.push({
        project: project.title,
        NotStarted: project.status.toLowerCase() === 'not started' ? 1 : 0,
        InProgress: project.status.toLowerCase() === 'in progress' ? 1 : 0,
        Completed: project.status.toLowerCase() === 'completed' ? 1 : 0,
      });
    }
    return acc;
  }, []);

  return (
    <Card bordered={false} style={{ backgroundColor: "#fafafa", padding: "24px" }}>
      <Title level={5}>Project Progress</Title>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={projectData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="project" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="NotStarted" fill="#8884d8" />
          <Bar dataKey="InProgress" fill="#82ca9d" />
          <Bar dataKey="Completed" fill="#ffc658" />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
};

export default ProjectBarChart;
