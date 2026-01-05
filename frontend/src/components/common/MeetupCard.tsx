import React from "react";
import { CalendarDays, Clock, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge, type BadgeProps } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export type MeetupStatus = "APPROVED" | "PENDING";
export type MeetupPlatform = "TEAMS" | "GOOGLE_MEET";

export interface Meetup {
  id: string;
  title: string;
  type: "STANDUP" | "TRAINING" | "ONE_ON_ONE" | "PLANNING" | string;
  date: string; // formatted date string
  timeRange: string; // formatted time range
  platform: MeetupPlatform;
  status: MeetupStatus;
  host?: string;
  description?: string;
}

interface MeetupCardProps {
  meetup: Meetup;
  onJoin?: (meetup: Meetup) => void;
}

export const MeetupCard: React.FC<MeetupCardProps> = ({ meetup, onJoin }) => {
  const platformVariant: BadgeProps["variant"] = meetup.platform === "TEAMS" ? "primary" : "secondary";
  const statusVariant: BadgeProps["variant"] = meetup.status === "APPROVED" ? "success" : "warning";

  return (
    <Card className="flex h-full flex-col border-gray-200 bg-white shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <CardTitle className="truncate text-base font-semibold text-gray-900">
              {meetup.title}
            </CardTitle>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <Badge variant="outline" className="uppercase tracking-wide text-[10px] text-gray-600">
                {meetup.type}
              </Badge>
              <Badge variant={platformVariant as any} className="uppercase text-[10px]">
                {meetup.platform}
              </Badge>
              <Badge variant={statusVariant} className="text-[10px]">
                {meetup.status === "APPROVED" ? "Approved" : "Pending"}
              </Badge>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-3 pt-0">
        <div className="space-y-1 text-sm text-gray-700">
          <div className="flex items-center gap-2">
            <CalendarDays className="h-4 w-4 text-gray-500" />
            <span>{meetup.date}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-gray-500" />
            <span>{meetup.timeRange}</span>
          </div>
          {meetup.host && (
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-gray-500" />
              <span className="truncate">Host: {meetup.host}</span>
            </div>
          )}
        </div>

        {meetup.description && (
          <p className="mt-1 line-clamp-2 text-xs text-gray-500">{meetup.description}</p>
        )}

        <div className="mt-3 flex items-center justify-end">
          <Button
            size="sm"
            className="px-3"
            onClick={() => onJoin?.(meetup)}
            disabled={meetup.status !== "APPROVED"}
          >
            Join Meet
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};



