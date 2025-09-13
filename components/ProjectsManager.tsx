"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Plus } from "lucide-react";
import EditProjectDialog from "./EditProjectDialog";
import DeleteConfirmDialog from "./DeleteConfirmDialog";
import ProjectItem from "./ProjectItem"; // optional: extract row UI

type Project = {
  id: string;
  name: string;
  url?: string;
  description?: string;
  github?: string;
  coverImage?: string;
  featured: boolean;
  order: number | null;
};

export default function ProjectsManager() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Project | null>(null);
  const [deleting, setDeleting] = useState<Project | null>(null);

  async function fetchProjects() {
    setLoading(true);
    const res = await fetch("/api/portfolio/projects");
    const data = await res.json();
    setProjects(data);
    setLoading(false);
  }

  useEffect(() => {
    fetchProjects();
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Featured Projects</CardTitle>
        <CardDescription>Curate and order your portfolio projects</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex justify-end mb-4">
          <Button onClick={() => setEditing({} as Project)}>
            <Plus className="mr-2 h-4 w-4" /> Add Project
          </Button>
        </div>

        {loading ? (
          <p>Loading...</p>
        ) : projects.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center">No projects yet</p>
        ) : (
          projects.map((p) => (
            <ProjectItem
              key={p.id}
              project={p}
              onEdit={() => setEditing(p)}
              onDelete={() => setDeleting(p)}
              refresh={fetchProjects}
            />
          ))
        )}
      </CardContent>

      <EditProjectDialog project={editing} onClose={() => setEditing(null)} refresh={fetchProjects} />
      <DeleteConfirmDialog
        open={Boolean(deleting)}
        onClose={() => setDeleting(null)}
        onConfirm={async () => {
          await fetch(`/api/projects/${deleting?.id}`, { method: "DELETE" });
          setDeleting(null);
          fetchProjects();
        }}
      />
    </Card>
  );
}
