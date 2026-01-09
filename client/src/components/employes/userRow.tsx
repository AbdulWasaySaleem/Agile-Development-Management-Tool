"use client";

import { Member } from "@/types/member";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

interface Props {
  user: Member;
  index: number;
}

export default function UserRow({ user, index }: Props) {
  return (
    <tr className="border-b hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors">
      {/* Serial Number */}
      <td className="p-4 font-mono text-sm text-gray-700">{index + 1}</td>

      {/* Name only */}
      <td className="p-4">
        <span className="font-medium">{user.name}</span>
      </td>

      {/* Skills */}
      <td className="p-4">
        <div className="flex flex-wrap gap-2">
          {user.skills?.map((skill, i) => (
            <Badge
              key={i}
              className="bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-200"
            >
              {skill}
            </Badge>
          ))}
        </div>
      </td>

      {/* Profile picture only */}
      <td className="p-4">
        <Avatar className="w-12 h-12 border-2 border-indigo-500">
          <AvatarImage src={user.profilePicture?.url} alt={user.name} />
          <AvatarFallback className="bg-indigo-100 text-indigo-600">
            {user.name.charAt(0)}
          </AvatarFallback>
        </Avatar>
      </td>
    </tr>
  );
}
