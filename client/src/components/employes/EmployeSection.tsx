"use client";

import { useMembers } from "@/hooks/useMembers"; // adjust path if needed
import UserTable from "@/components/employes/employTable";
import UserTableSkeleton from "@/components/employes/UserTableSkeleton";

export default function EmployeesSection() {
  const { data: users, isLoading, isError, error } = useMembers();

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">All Employees</h1>
        <UserTableSkeleton />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="container mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">All Employees</h1>
        <p className="text-red-500">❌ {error.message}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">All Employees</h1>
      <UserTable users={users ?? []} />
    </div>
  );
}
