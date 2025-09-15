"use client";

import { PendingUser } from "@/app/pending-requests/page";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CheckCircle2, ShieldAlert, UserRound } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Props {
  users: PendingUser[];
  onApproveClick: (user: PendingUser) => void;
}

export default function PendingUsersTable({ users, onApproveClick }: Props) {
  if (!users.length) {
    return (
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShieldAlert className="h-5 w-5 text-amber-500" />
            No Pending Users
          </CardTitle>
        </CardHeader>
        <CardContent className="text-muted-foreground">
          All caught up 🎉 New pending requests will appear here.
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2">
          <UserRound className="h-5 w-5 text-indigo-500" />
          Pending Approval
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[64px]">#</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Email</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((u, idx) => (
                <TableRow key={u._id} className="hover:bg-muted/50">
                  <TableCell className="font-mono text-xs">{idx + 1}</TableCell>
                  <TableCell className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={u.profilePicture?.url} alt={u.name} />
                      <AvatarFallback>
                        {u.name?.[0]?.toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <span className="font-medium">{u.name}</span>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {u.email}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      size="sm"
                      className="gap-2"
                      onClick={() => onApproveClick(u)}
                    >
                      <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                      Approve
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
