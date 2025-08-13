"use client"

import * as React from "react"
import {
  ChartColumn,
  Frame,
  Settings2,
  SquareTerminal,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavProjects } from "@/components/nav-projects"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarRail,
} from "@/components/ui/sidebar"

// This is sample data.
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
        { title: "GitHub Repos", url: "/dashboard/quick/github" },
        { title: "Vercel Dashboard", url: "/dashboard/quick/vercel" },
        { title: "Analytics Panel", url: "/dashboard/quick/analytics" },
      ],
    },
  ],

  projects: [
    { name: "Portfolio Website", url: "#" },
    { name: "AI Quiz Generator", url: "#" },
    { name: "Image Manipulation SaaS", url: "#" },
    { name: "F1 Race Predictor", url: "#" },
  ]

}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
