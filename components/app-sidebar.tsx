"use client";

import * as React from "react";
import { ChartColumn, Frame, Settings2, SquareTerminal } from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarRail,
} from "@/components/ui/sidebar";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const data = {
  user: {
    name: "Mubassim Ahmed Khan",
    email: "mubassimkhan@gmail.com",
    avatar: "https://avatars.githubusercontent.com/u/113042537?v=4",
  },
  navMain: [
    {
      title: "Projects",
      url: "/dashboard/projects/status",
      icon: SquareTerminal,
      isActive: true,
      items: [
        { title: "Status Overview", url: "/dashboard/projects/status" },
        { title: "Manage Projects", url: "/dashboard/projects/manage" },
        { title: "Deployments", url: "/dashboard/projects/deployments" },
      ],
    },
    {
      title: "Analytics",
      url: "/dashboard/analytics/traffic",
      icon: ChartColumn,
      items: [
        { title: "Traffic Reports", url: "/dashboard/analytics/traffic" },
        { title: "Top Referrers", url: "/dashboard/analytics/referrers" },
        { title: "Visitor Map", url: "/dashboard/analytics/visitors" },
      ],
    },
    {
      title: "Settings",
      url: "/dashboard/settings/general",
      icon: Settings2,
      items: [
        { title: "General Settings", url: "/dashboard/settings/general" },
        { title: "Integrations", url: "/dashboard/settings/integrations" },
      ],
    },
    {
      title: "Quick Actions",
      url: "/dashboard/quick/github",
      icon: Frame,
      items: [
        { title: "GitHub Repos", url: "https://github.com/Mubassim-Khan?tab=repositories" },
        { title: "Vercel Dashboard", url: "https://vercel.com/dashboard" },
        { title: "Analytics Panel", url: "https://umami.com/stats" },
      ],
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [open, setOpen] = React.useState(false);
  const [targetUrl, setTargetUrl] = React.useState("");

  const handleQuickActionClick = (url: string) => {
    setTargetUrl(url);
    setOpen(true);
  };

  const confirmNavigation = () => {
    setOpen(false);
    window.open(targetUrl, "_blank");
  };

  return (
    <>
      <Sidebar collapsible="icon" {...props}>
        <SidebarContent>
          {/* Pass click handler to NavMain so only Quick Actions trigger dialog */}
          <NavMain
            items={data.navMain}
            onQuickActionClick={handleQuickActionClick}
          />
        </SidebarContent>
        <SidebarFooter>
          <NavUser user={data.user} />
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>

      {/* Shadcn Confirmation Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Leave Dashboard?</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-gray-600">
            Are you sure you want to leave and open this external link?
          </p>
          <DialogFooter className="mt-4 flex gap-2">
            <Button onClick={confirmNavigation}>Yes, Continue</Button>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
