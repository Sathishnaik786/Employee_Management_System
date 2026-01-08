import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { format } from "date-fns";

export type MeetupFormMode = "create" | "request";

export interface MeetupFormValues {
  title: string;
  description: string;
  type: string;
  platform: "TEAMS" | "GOOGLE_MEET";
  link: string;
  date: Date;
  startTime: string;
  endTime: string;
}

interface CreateMeetupModalProps {
  open: boolean;
  mode: MeetupFormMode;
  onClose: () => void;
  onSubmit: (values: MeetupFormValues) => Promise<void> | void;
  isSubmitting?: boolean;
}

const defaultValues: MeetupFormValues = {
  title: "",
  description: "",
  type: "STANDUP",
  platform: "TEAMS",
  link: "",
  date: new Date(),
  startTime: "10:00",
  endTime: "10:30",
};

export const CreateMeetupModal: React.FC<CreateMeetupModalProps> = ({
  open,
  mode,
  onClose,
  onSubmit,
  isSubmitting,
}) => {
  const [values, setValues] = useState<MeetupFormValues>(defaultValues);

  const handleChange = <K extends keyof MeetupFormValues>(field: K, value: MeetupFormValues[K]) => {
    setValues((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(values);
  };

  const titleLabel = mode === "create" ? "Create Meet" : "Request Meet";
  const descriptionLabel =
    mode === "create"
      ? "Set up a new team meet-up for your organization."
      : "Request a new meet-up for your team or manager to review.";

  return (
    <Dialog open={open} onOpenChange={(open) => !isSubmitting && !open && onClose()}>
      <DialogContent className="max-w-full sm:max-w-2xl max-h-[90vh] overflow-y-auto sm:rounded-xl p-4 sm:p-6">
        <DialogHeader>
          <DialogTitle>{titleLabel}</DialogTitle>
          <DialogDescription>{descriptionLabel}</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4 sm:space-y-6">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-800">Title</label>
            <Input
              value={values.title}
              onChange={(e) => handleChange("title", e.target.value)}
              placeholder="e.g. Sprint Planning, Weekly Standup"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-800">Description</label>
            <Textarea
              value={values.description}
              onChange={(e) => handleChange("description", e.target.value)}
              placeholder="Add context, agenda, or goals for this meet-up."
              rows={3}
            />
          </div>

          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-800">Meetup Type</label>
              <Select
                value={values.type}
                onValueChange={(v) => handleChange("type", v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="STANDUP">Standup</SelectItem>
                  <SelectItem value="TRAINING">Training</SelectItem>
                  <SelectItem value="ONE_ON_ONE">1:1</SelectItem>
                  <SelectItem value="PLANNING">Planning</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-800">Platform</label>
              <Select
                value={values.platform}
                onValueChange={(v) =>
                  handleChange("platform", v as "TEAMS" | "GOOGLE_MEET")
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select platform" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="TEAMS" className="flex items-center gap-2">
                    <img 
                      src="https://www.liblogo.com/img-logo/mi462m3e6-microsoft-teams-logo-microsoft-teams-logo-png-and-vector-logo-download.png" 
                      alt="Microsoft Teams" 
                      className="h-4 w-4 object-contain"
                    />
                    Microsoft Teams
                  </SelectItem>
                  <SelectItem value="GOOGLE_MEET" className="flex items-center gap-2">
                    <img 
                      src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Google_Meet_text_logo_%282020%29.svg/1024px-Google_Meet_text_logo_%282020%29.svg.png" 
                      alt="Google Meet" 
                      className="h-4 w-4 object-contain"
                    />
                    Google Meet
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-800">Meet Link</label>
            <Input
              value={values.link}
              onChange={(e) => handleChange("link", e.target.value)}
              placeholder="Paste your Teams or Google Meet link"
            />
          </div>

          <div className="grid gap-4 grid-cols-1 sm:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-800">Date</label>
              <div className="rounded-lg border border-gray-200 bg-white p-1 sm:p-2">
                <Calendar
                  mode="single"
                  selected={values.date}
                  onSelect={(date) => date && handleChange("date", date)}
                  className="w-full max-w-full"
                />
              </div>
            </div>

            <div className="space-y-3">
              <p className="mt-3 sm:mt-5 text-xs font-medium uppercase tracking-wide text-gray-500">
                Time
              </p>
              <div className="grid grid-cols-2 gap-2 sm:gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-gray-700">
                    Start time
                  </label>
                  <Input
                    type="time"
                    value={values.startTime}
                    onChange={(e) => handleChange("startTime", e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-gray-700">
                    End time
                  </label>
                  <Input
                    type="time"
                    value={values.endTime}
                    onChange={(e) => handleChange("endTime", e.target.value)}
                    required
                  />
                </div>
              </div>
              <p className="text-xs text-gray-500">
                {values.date &&
                  `${format(values.date, "EEE, dd MMM yyyy")} • ${values.startTime} - ${
                    values.endTime
                  }`}
              </p>
            </div>
          </div>

          <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={onClose} disabled={!!isSubmitting} className="w-full sm:w-auto">
              Cancel
            </Button>
            <Button type="submit" disabled={!!isSubmitting} className="w-full sm:w-auto">
              {isSubmitting ? "Saving..." : titleLabel}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};


