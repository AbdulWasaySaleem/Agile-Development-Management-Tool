"use client";

import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useProfilePage } from "@/hooks/useProfilePage";
import { useAuthStore } from "@/app/store/authStore";
import SkillIcons from "@/components/profile/SkillsIcon";
import dayjs from "dayjs";

export default function ProfileSection() {
  const userId = useAuthStore((s) => s.user?.id) ?? "";
  const { data: rawData, isLoading, error } = useProfilePage(userId);

  const user = rawData?.user ?? rawData;


  if (isLoading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="animate-pulse space-y-4 text-center">
          <div className="h-16 w-16 rounded-full bg-gray-200 mx-auto" />
          <div className="h-5 w-64 bg-gray-200 mx-auto" />
          <div className="h-4 w-40 bg-gray-200 mx-auto" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <Card className="max-w-xl">
          <CardHeader>
            <CardTitle>Failed to load profile</CardTitle>
            <CardDescription>
              Try refreshing or check your connection.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => window.location.reload()}>Retry</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 sm:p-10 lg:p-14">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Left column */}
        <Card className="col-span-1 shadow-xl p-6">
          <CardContent className="flex flex-col items-center text-center gap-6">
            {/* Bigger avatar */}
            <Avatar className="h-36 w-36">
              {user?.profilePicture?.url ? (
                <AvatarImage
                  src={user.profilePicture.url}
                  alt={user?.name ?? "avatar"}
                />
              ) : (
                <AvatarFallback className="text-2xl">
                  {user?.name?.[0] ?? "U"}
                </AvatarFallback>
              )}
            </Avatar>

            <div>
              <h2 className="text-2xl font-bold">{user?.name ?? "No name"}</h2>
              <p className="text-base text-muted-foreground">
                {user?.role ?? "Member"}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Badge variant="secondary" className="text-sm px-3 py-1">
                {user?.status ?? "status unknown"}
              </Badge>
              <Badge variant="outline" className="text-sm px-3 py-1">
                {user?.role ?? "role"}
              </Badge>
            </div>

            <Separator className="my-4" />

            <div className="w-full text-left space-y-4 text-lg">
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium break-all">{user?.email ?? "-"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Phone</p>
                <p className="font-medium">{user?.phone ?? "-"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Location</p>
                <p className="font-medium">
                  {user?.address ?? user?.locations?.[0] ?? "-"}
                </p>
              </div>
            </div>

            <div className="w-full flex justify-center gap-3 mt-4">
              <Button size="lg">Message</Button>
              <Button size="lg" variant="outline">
                Edit
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Right column */}
        <div className="lg:col-span-2 flex flex-col gap-8">
          {/* About */}
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center justify-between text-xl">
                <span>About</span>
                <div className="hidden sm:flex items-center gap-3">
                  <Button size="sm">Download CV</Button>
                  <Button size="sm" variant="ghost">
                    Share
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="text-lg">
              <p>{user?.biography ?? "No biography provided."}</p>
            </CardContent>
          </Card>

          {/* Skills */}
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle className="text-xl">Skills</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-4 items-center">
              <SkillIcons skills={user?.skills ?? []} />
            </CardContent>
          </Card>

          {/* Activity & Settings */}
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle className="text-xl">Activity & Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="activity" className="w-full">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <TabsList>
                    <TabsTrigger value="activity">Activity</TabsTrigger>
                    <TabsTrigger value="settings">Settings</TabsTrigger>
                  </TabsList>
                </div>

                <TabsContent value="activity">
                  <div className="space-y-4 text-lg">
                    <p className="text-muted-foreground">
                      Joined:{" "}
                      {dayjs(user?.createdAt).format("MMMM D, YYYY")}
                    </p>
                    <p>
                      Status:{" "}
                      <span className="font-medium">{user?.status ?? "-"}</span>
                    </p>
                    <div className="mt-3 grid gap-2">
                      <div className="p-4 rounded-md border">
                        No recent activity
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="settings">
                  <form className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-lg">
                    <div>
                      <Label>Name</Label>
                      <Input defaultValue={user?.name ?? ""} />
                    </div>
                    <div>
                      <Label>Email</Label>
                      <Input defaultValue={user?.email ?? ""} />
                    </div>
                    <div className="sm:col-span-2">
                      <Label>Bio</Label>
                      <Textarea defaultValue={user?.biography ?? ""} />
                    </div>
                    <div className="sm:col-span-2 flex justify-end">
                      <Button size="lg">Save changes</Button>
                    </div>
                  </form>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
