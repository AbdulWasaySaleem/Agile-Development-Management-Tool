"use client"

import { approveUserApi, fetchPendingUsersApi, getAllMembers } from "@/api/membersApi"
import { Member } from "@/types/member"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import toast from "react-hot-toast"

export function useMembers() {
  return useQuery<Member[], Error>({
    queryKey: ["members"],
    queryFn: getAllMembers,
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}

export const usePendingUsers = () => {
  return useQuery({
    queryKey: ["pendingUsers"],
    queryFn: fetchPendingUsersApi,
  });
};

export const useApproveUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, role }: { id: string; role: string }) =>
      approveUserApi(id, role),
    onSuccess: () => {
      toast.success("User approved successfully!");
      queryClient.invalidateQueries({ queryKey: ["pendingUsers"] });
    }
  });
};