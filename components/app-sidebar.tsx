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
      url: "#",
      icon: SquareTerminal,
      isActive: true,
      items: [
        { title: "Status Overview", url: "#" },   // Uptime, last deployment, version
        { title: "Manage Projects", url: "#" },   // Add, edit, delete
        { title: "Deployments", url: "#" },       // Vercel / GitHub commits
      ],
    },
    {
      title: "Analytics",
      url: "#",
      icon: ChartColumn,
      items: [
        { title: "Traffic Reports", url: "#" },   // Plausible/Umami/Vercel Analytics
        { title: "Top Referrers", url: "#" },     // From analytics API
        { title: "Visitor Map", url: "#" },       // Country breakdown
      ],
    },
    {
      title: "Settings",
      url: "#",
      icon: Settings2,
      items: [
        { title: "General Settings", url: "#" },  // Basic config
        { title: "Integrations", url: "#" },      // GitHub, Vercel APIs
      ],
    },
    {
      title: "Quick Actions",
      url: "#",
      icon: Frame,
      items: [
        { title: "GitHub Repos", url: "#" },
        { title: "Vercel Dashboard", url: "#" },
        { title: "Analytics Panel", url: "#" },
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
