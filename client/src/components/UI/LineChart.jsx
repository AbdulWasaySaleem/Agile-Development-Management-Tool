import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Card, Typography } from "antd";

const { Title } = Typography;

// Sample data for tasks over weeks
const data = [
  { week: "Week 1", ToDo: 10, InProgress: 5, Done: 3 },
  { week: "Week 2", ToDo: 15, InProgress: 8, Done: 7 },
  { week: "Week 3", ToDo: 7, InProgress: 12, Done: 10 },
  { week: "Week 4", ToDo: 20, InProgress: 10, Done: 15 },
];

const TaskLineChart  = (tasks) => {
  console.log(tasks)
  return (
    <Card
      bordered={false}
      style={{ backgroundColor: "#fafafa", padding: "24px" }}
    >
      <Title level={5}>Task Distribution Over Time</Title>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="week" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="ToDo" stroke="#8884d8" />
          <Line type="monotone" dataKey="InProgress" stroke="#82ca9d" />
          <Line type="monotone" dataKey="Done" stroke="#ffc658" />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  );
};

export default TaskLineChart ;
