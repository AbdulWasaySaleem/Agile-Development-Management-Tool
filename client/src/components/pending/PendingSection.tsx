"use client";

import { useState } from "react";
import PendingUsersTable from "@/components/pending/PendingUsersTable";
import PendingTableSkeleton from "@/components/pending/PendingTableSkeleton";
import ApproveDialog from "@/components/pending/ApproveDialog";
import { useApproveUser, usePendingUsers } from "@/hooks/useMembers";

export default function PendingSection() {
  const { data: users = [], isLoading } = usePendingUsers();
  const approveUser = useApproveUser();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [role, setRole] = useState<string>("junior_developer");

  const openApprove = (user: any) => {
    setSelectedUser(user);
    setRole(user.role || "junior_developer");
    setDialogOpen(true);
  };

  const onApprove = () => {
    if (!selectedUser) return;
    approveUser.mutate({ id: selectedUser._id, role });
    setDialogOpen(false);
  };

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">
          Pending Users
        </h1>
        <p className="text-sm text-muted-foreground">
          Approve new users and assign a role.
        </p>
      </div>

      {isLoading ? (
        <PendingTableSkeleton rows={6} />
      ) : (
        <PendingUsersTable users={users} onApproveClick={openApprove} />
      )}

      <ApproveDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        role={role}
        setRole={setRole}
        onApprove={onApprove}
        userName={selectedUser?.name || ""}
        isLoading={approveUser.isPending}
      />
    </div>
  );
}
