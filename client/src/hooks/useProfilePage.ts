"use client";

import { getUserProfile } from "@/api/profileApi";
import { UserProfile } from "@/types/profile";
import { useQuery } from "@tanstack/react-query";

export function useProfilePage(userId: string) {
  return useQuery<UserProfile>({
    queryKey: ["userProfile", userId],
    queryFn: () => getUserProfile(userId),
    enabled: !!userId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}
