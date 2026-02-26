"use client";

import * as React from "react";
import {
  ChartColumn,
  Frame,
  Settings2,
  SquareTerminal,
} from "lucide-react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

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
        { title: "Coding Analytics", url: "/dashboard/analytics/coding" },
      ],
    },
    {
      title: "Settings",
      url: "/dashboard/settings/reports",
      icon: Settings2,
      items: [
        { title: "Reports & Export", url: "/dashboard/settings/reports" },
        { title: "API Keys", url: "/dashboard/settings/api-keys" },
        { title: "Edit Portfolio", url: "/dashboard/settings/edit" },
      ],
    },
    {
      title: "Quick Actions",
      url: "/dashboard/quick/github",
      icon: Frame,
      items: [
        {
          title: "GitHub Repos",
          url: "https://github.com/Mubassim-Khan?tab=repositories",
        },
        { title: "Vercel Dashboard", url: "https://vercel.com/dashboard" },
        { title: "Analytics Panel", url: "https://umami.com/stats" },
      ],
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [open, setOpen] = React.useState(false);
  const [targetUrl, setTargetUrl] = React.useState("");
  const [user, setUser] = React.useState<{
    name: string;
    email: string;
    profilePhoto: string;
  } | null>(null);
  const router = useRouter();

  React.useEffect(() => {
    const fetchUser = async () => {
      try {
        let retries = 2;
        while (retries--) {
          const res = await fetch("/api/user", { cache: "no-store" });
          if (res.ok) {
            const data = await res.json();
            if (data) {
              setUser(data);
              return;
            }
          }
          await new Promise((r) => setTimeout(r, 500)); // small retry delay
        }
      } catch (err) {
        console.error("Failed to fetch user:", err);
      }
    };
    fetchUser();
  }, []);

  if (!user) return null;

  const handleLogout = async () => {
    await fetch("/api/signout", { method: "POST" });
    toast.success("Logged out successfully");
    router.push("/");
  };

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
          <NavUser
            user={user}
            onProfileClick={() => router.push("/dashboard/profile")}
            onSettingsClick={() => router.push("/dashboard/settings")}
            onLogout={handleLogout}
          />
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
