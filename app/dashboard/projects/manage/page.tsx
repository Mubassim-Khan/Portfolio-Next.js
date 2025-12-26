"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Plus, Search } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import toast from "react-hot-toast";

type Project = {
  id: string;
  name: string;
  url: string;
  description: string;
  coverImage: string;
  order: number | null;
  featured: boolean;
  githubURL: string | null;
};

export default function ManageProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [description, setDescription] = useState("");
  const [githubURL, setGithubURL] = useState("");
  const [order] = useState<number | null>(null);
  const [coverImage, setCoverImage] = useState("");
  const [featured, setFeatured] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchProjects();
  }, []);

  async function fetchProjects() {
    setLoading(true);
    const res = await fetch("/api/projects");
    const data = await res.json();
    setProjects(data);
    setLoading(false);
  }

  async function handleSave() {
    setSaving(true);

    // Validate required fields
    if (!name.trim() || !description.trim() || !githubURL.trim()) {
      toast.error(
        "Please fill in all required fields: Name, Description, and GitHub URL"
      );
      setSaving(false);
      return;
    }

    // Validate GitHub URL format
    const githubUrlPattern = /^https:\/\/github\.com\/.+/;
    if (!githubUrlPattern.test(githubURL)) {
      toast.error(
        "Please enter a valid GitHub URL (e.g., https://github.com/username/repo)"
      );
      setSaving(false);
      return;
    }

    const payload = {
      name: name.trim(),
      url: url.trim() || null, // Send null if empty
      description: description.trim(),
      coverImage: coverImage.trim() || null, // Send null if empty
      featured,
      order,
      githubURL: githubURL.trim(),
    };

    try {
      if (editId) {
        const response = await fetch(`/api/projects/${editId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to update project");
        }

        toast.success("Project updated successfully!");
      } else {
        const response = await fetch("/api/projects", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to create project");
        }

        toast.success("Project created successfully!");
      }

      setDialogOpen(false);
      resetForm();
      fetchProjects();
    } catch (error: any) {
      console.error("Error saving project:", error);
      toast.error(
        error.message || "An error occurred while saving the project"
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    await fetch(`/api/projects/${deleteTarget}`, { method: "DELETE" });
    setDeleting(false);
    setDeleteDialogOpen(false);
    setDeleteTarget(null);
    fetchProjects();
  }

  function openEditDialog(project: Project) {
    setName(project.name);
    setUrl(project.url);
    setDescription(project.description);
    setEditId(project.id);
    setDialogOpen(true);
  }

  function resetForm() {
    setName("");
    setUrl("");
    setDescription("");
    setEditId(null);
  }

  const filteredProjects = projects.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="pt-6 space-y-4">
          {/* Header Row */}
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold w-1/3">Manage Projects</h2>

            {/* Search bar */}
            <div className="w-1/3 flex justify-center relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search by name"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full max-w-sm pl-9 rounded-xl"
              />
            </div>

            {/* Add project button */}
            <div className="w-1/3 flex justify-end">
              <Button
                onClick={() => {
                  resetForm();
                  setDialogOpen(true);
                }}
                className="rounded-[10px] flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Project
              </Button>
            </div>
          </div>

          {/* Loading State */}
          {loading ? (
            <div className="space-y-2">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="w-full h-6" />
              ))}
            </div>
          ) : filteredProjects.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center">
              No projects found.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Project</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProjects.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium flex items-center gap-2">
                          {p.name}
                          {p.featured && (
                            <Badge className="bg-green-100 ml-3 rounded-xl text-green-800 hover:bg-green-100">
                              Featured
                            </Badge>
                          )}
                        </span>
                        <TooltipProvider>
                          <Tooltip delayDuration={200}>
                            <TooltipTrigger asChild>
                              <span
                                className="text-xs text-muted-foreground cursor-pointer hover:text-foreground hover:underline hover:cursor-pointer"
                                onClick={(e) => {
                                  if (e.ctrlKey || e.metaKey) {
                                    e.preventDefault();
                                    if (p.url) {
                                      window.open(p.url, "_blank");
                                    }
                                  }
                                }}
                              >
                                {p.url}
                              </span>
                            </TooltipTrigger>
                            <TooltipContent
                              side="top"
                              align="center"
                              className="bg-white/5 backdrop-blur-lg rounded-xl z-100 left-[-40rem] border border-white/10 text-white mb-2"
                            >
                              Follow link (Ctrl + Click)
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          size="sm"
                          variant="secondary"
                          className="rounded-[5px]"
                          onClick={() => openEditDialog(p)}
                        >
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          className="rounded-[5px]"
                          onClick={() => {
                            setDeleteTarget(p.id);
                            setDeleteDialogOpen(true);
                          }}
                        >
                          Delete
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}

          {/* Add/Edit Project Dialog */}
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>
                  {editId ? "Edit Project" : "Add New Project"}
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-3">
                <Input
                  placeholder="Project name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                <Input
                  placeholder="Project URL"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                />
                <Input
                  placeholder="Cover Image URL"
                  value={coverImage}
                  onChange={(e) => setCoverImage(e.target.value)}
                />
                <Input
                  placeholder="GitHub Repository URL"
                  value={githubURL}
                  onChange={(e) => setGithubURL(e.target.value)}
                />
                <Textarea
                  placeholder="Project description"
                  value={description || ""}
                  onChange={(e) => setDescription(e.target.value)}
                  className="min-h-[120px]"
                />
                {/* Featured toggle */}
                <div className="flex items-center justify-between p-3">
                  <Label htmlFor="featured" className="text-sm font-medium">
                    Show on portfolio
                  </Label>
                  <Switch
                    id="featured"
                    checked={featured}
                    onCheckedChange={(val) => {
                      setFeatured(val);
                    }}
                  />
                </div>
              </div>

              <DialogFooter>
                <Button onClick={handleSave} disabled={saving}>
                  {saving ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : null}
                  {editId ? "Save Changes" : "Add Project"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Delete Confirmation Dialog */}
          <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Delete Project</DialogTitle>
              </DialogHeader>
              <p>Are you sure you want to delete this project?</p>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setDeleteDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleDelete}
                  disabled={deleting}
                >
                  {deleting ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : null}
                  Delete
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>
    </div>
  );
}
