"use client";

import { Member } from "@/types/member";
import { Card, CardContent } from "@/components/ui/card";
import UserRow from "./userRow";

interface Props {
  users: Member[];
}

export default function UserTable({ users }: Props) {
  if (!users.length) {
    return (
      <Card className="p-6 text-center">
        <p className="text-gray-500">No employees found.</p>
      </Card>
    );
  }

  return (
    <Card className="overflow-x-auto">
      <CardContent className="p-0">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-100 dark:bg-gray-800">
            <tr>
              <th className="p-4">#</th>
              <th className="p-4">Name</th>
              <th className="p-4">Skills</th>
              <th className="p-4">Profile</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <UserRow key={user._id} user={user} index={index} />
            ))}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
}
