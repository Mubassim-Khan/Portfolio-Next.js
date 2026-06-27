"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Pencil, Trash, Plus, ArrowUp, ArrowDown, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { AnimatePresence, motion } from "framer-motion";

type Project = {
  id: string;
  name: string;
  url?: string | null;
  description?: string | null;
  coverImage?: string | null;
  githubURL?: string | null;
  featured?: boolean;
  order?: number | null;
};

type Certification = {
  id: string;
  name: string;
  verifyUrl?: string | null;
  skill?: string | null;
  featured?: boolean;
  order?: number | null;
};

interface ProjectPayload {
  name: string;
  url: string | null;
  description: string | null;
  githubURL: string | null;
  coverImage: string | null;
  featured: boolean;
  order?: number;  // optional because you set undefined
}

interface CertificatePayload {
  name: string;
  skill: string | null;
  verifyUrl: string | null;
  featured: boolean;
  order?: number;  // optional because you set undefined
}

export default function PortfolioEditor() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [loadingCerts, setLoadingCerts] = useState(true);

  // project dialog state
  const [projectDialogOpen, setProjectDialogOpen] = useState(false);
  const [projectSaving, setProjectSaving] = useState(false);
  const [editProjectId, setEditProjectId] = useState<string | null>(null);

  const [pName, setPName] = useState("");
  const [pUrl, setPUrl] = useState("");
  const [pDescription, setPDescription] = useState("");
  const [pGithub, setPGithub] = useState("");
  const [pCoverImage, setPCoverImage] = useState("");
  const [pFeatured, setPFeatured] = useState(true); // portfolio editor works on featured items
  const [pOrder, setPOrder] = useState<number | null>(null);

  // cert dialog state
  const [certDialogOpen, setCertDialogOpen] = useState(false);
  const [certSaving, setCertSaving] = useState(false);
  const [editCertId, setEditCertId] = useState<string | null>(null);

  const [cName, setCName] = useState("");
  const [cSkill, setCSkill] = useState("");
  const [cUrl, setCUrl] = useState("");
  const [cFeatured, setCFeatured] = useState(true);
  const [cOrder, setCOrder] = useState<number | null>(null);

  // portfolio count state
  const [allProjects, setAllProjects] = useState<Project[]>([]);
  const [portfolioCount, setPortfolioCount] = useState(3);
  const [countDialogOpen, setCountDialogOpen] = useState(false);
  const [countSaving, setCountSaving] = useState(false);
  const [selectedProjectIds, setSelectedProjectIds] = useState<Set<string>>(new Set());

  // confirmation states
  const [deleteProjectId, setDeleteProjectId] = useState<string | null>(null);
  const [deletingProject, setDeletingProject] = useState(false);

  const [deleteCertId, setDeleteCertId] = useState<string | null>(null);
  const [deletingCert, setDeletingCert] = useState(false);

  useEffect(() => {
    fetchFeaturedProjects();
    fetchCertifications();
    fetchAllProjects();
  }, []);

  async function fetchAllProjects() {
    try {
      const res = await fetch("/api/projects");
      const data = await res.json();
      data.sort((a: Project, b: Project) => {
        const aa = a.order ?? Number.MAX_SAFE_INTEGER;
        const bb = b.order ?? Number.MAX_SAFE_INTEGER;
        return aa - bb;
      });
      setAllProjects(data);
    } catch {
      setAllProjects([]);
    }
  }

  // sync portfolio count when projects load
  useEffect(() => {
    if (!loadingProjects) {
      setPortfolioCount(projects.length);
    }
  }, [loadingProjects, projects.length]);

  async function fetchFeaturedProjects() {
    setLoadingProjects(true);
    try {
      const res = await fetch("/api/portfolio/projects");
      const data = await res.json();
      // ensure sorted by order asc
      data.sort((a: Project, b: Project) => {
        const aa = a.order ?? Number.MAX_SAFE_INTEGER;
        const bb = b.order ?? Number.MAX_SAFE_INTEGER;
        return aa - bb;
      });
      setProjects(data);
    } catch (err) {
      console.error("Failed to fetch featured projects:", err);
      setProjects([]);
    } finally {
      setLoadingProjects(false);
    }
  }

  async function fetchCertifications() {
    setLoadingCerts(true);
    try {
      const res = await fetch("/api/certifications");
      const data = await res.json();
      // filter featured in UI if you want portfolio-only here; currently fetching all certs
      setCertifications(data);
    } catch (err) {
      console.error("Failed to fetch certifications:", err);
      setCertifications([]);
    } finally {
      setLoadingCerts(false);
    }
  }

  // ----- Projects CRUD -----
  function openNewProjectDialog() {
    setEditProjectId(null);
    setPName("");
    setPUrl("");
    setPDescription("");
    setPGithub("");
    setPCoverImage("");
    setPFeatured(true);
    setPOrder(null);
    setProjectDialogOpen(true);
  }

  function openEditProjectDialog(project: Project) {
    setEditProjectId(project.id);
    setPName(project.name ?? "");
    setPUrl(project.url ?? "");
    setPDescription(project.description ?? "");
    setPGithub(project.githubURL ?? "");
    setPCoverImage(project.coverImage ?? "");
    setPFeatured(Boolean(project.featured));
    setPOrder(project.order ?? null);
    setProjectDialogOpen(true);
  }

  async function saveProject() {
    // basic validation
    if (!pName.trim()) {
      toast.error("Project name is required.");
      return;
    }

    setProjectSaving(true);

    try {
      const payload: ProjectPayload = {
        name: pName,
        url: pUrl || null,
        description: pDescription || null,
        githubURL: pGithub || null,
        coverImage: pCoverImage || null,
        featured: Boolean(pFeatured),
        order: pOrder === null ? undefined : pOrder,
      };

      if (editProjectId) {
        await fetch(`/api/projects/${editProjectId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        await fetch(`/api/projects`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      setProjectDialogOpen(false);
      toast.success("Project saved.");
      fetchFeaturedProjects();
    } catch (err) {
      console.error(err);
      toast.error("Failed to save project.");
    } finally {
      setProjectSaving(false);
    }
  }

  async function confirmDeleteProject(id: string) {
    setDeleteProjectId(id);
  }

  async function deleteProject() {
    if (!deleteProjectId) return;
    setDeletingProject(true);
    try {
      await fetch(`/api/projects/${deleteProjectId}`, { method: "DELETE" });
      setDeleteProjectId(null);
      fetchFeaturedProjects();
      toast.success("Project deleted.");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete project.");
    } finally {
      setDeletingProject(false);
    }
  }

  // reorder helpers (swap orders)
  async function swapProjectOrder(i: number, j: number) {
    if (i < 0 || j < 0 || i >= projects.length || j >= projects.length) return;

    const a = projects[i];
    const b = projects[j];

    // compute fallback orders if null
    const aOrder = a.order ?? i + 1;
    const bOrder = b.order ?? j + 1;

    try {
      await Promise.all([
        fetch(`/api/projects/${a.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ order: bOrder }),
        }),
        fetch(`/api/projects/${b.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ order: aOrder }),
        }),
      ]);
      await fetchFeaturedProjects();
      toast.success("Project order updated.");
    } catch (err) {
      console.error("Failed to swap order", err);
      toast.error("Failed to reorder projects");
    }
  }

  async function updateProjectOrder(id: string, newOrder: number | null) {
    try {
      await fetch(`/api/projects/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ order: newOrder }),
      });
      await fetchFeaturedProjects();
      toast.success("Project order updated.");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update order");
    }
  }

  // ----- Portfolio count control -----
  const featuredIds = useMemo(() => new Set(projects.map((p) => p.id)), [projects]);

  function openCountDialog() {
    setSelectedProjectIds(featuredIds);
    setCountDialogOpen(true);
  }

  function toggleProjectSelection(id: string) {
    setSelectedProjectIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  async function savePortfolioSelection() {
    setCountSaving(true);
    try {
      await Promise.all(
        allProjects.map((p) =>
          fetch(`/api/projects/${p.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ featured: selectedProjectIds.has(p.id) }),
          })
        )
      );
      setCountDialogOpen(false);
      toast.success("Portfolio selection updated.");
      fetchFeaturedProjects();
    } catch {
      toast.error("Failed to update portfolio selection.");
    } finally {
      setCountSaving(false);
    }
  }

  // ----- Certifications CRUD -----
  function openNewCertDialog() {
    setEditCertId(null);
    setCName("");
    setCSkill("");
    setCUrl("");
    setCFeatured(true);
    setCOrder(null);
    setCertDialogOpen(true);
  }

  function openEditCertDialog(cert: Certification) {
    setEditCertId(cert.id);
    setCName(cert.name ?? "");
    setCUrl(cert.verifyUrl ?? "");
    setCSkill(cert.skill ?? "");
    setCFeatured(Boolean(cert.featured));
    setCOrder(cert.order ?? null);
    setCertDialogOpen(true);
  }

  async function saveCertification() {
    if (!cName.trim()) {
      toast.error("Certification name is required.");
      return;
    }
    setCertSaving(true);
    try {
      const payload: CertificatePayload = {
        name: cName,
        skill: cSkill || null,
        verifyUrl: cUrl || null,
        featured: Boolean(cFeatured),
        order: cOrder === null ? undefined : cOrder,
      };

      if (editCertId) {
        await fetch(`/api/certifications/${editCertId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        await fetch(`/api/certifications`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      setCertDialogOpen(false);
      fetchCertifications();
      toast.success("Certification saved.");
    } catch (err) {
      console.error(err);
      toast.error("Failed to save certification.");
    } finally {
      setCertSaving(false);
    }
  }

  async function confirmDeleteCert(id: string) {
    setDeleteCertId(id);
  }

  async function deleteCert() {
    if (!deleteCertId) return;
    setDeletingCert(true);
    try {
      await fetch(`/api/certifications/${deleteCertId}`, { method: "DELETE" });
      setDeleteCertId(null);
      fetchCertifications();
      toast.success("Certification deleted.");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete certification.");
    } finally {
      setDeletingCert(false);
    }
  }

  // ----- validations for UI -----
  // Projects - url is optional (some projects have GitHub only)
  const incompleteProjects = projects.filter(
    (p) => !p.description || !p.githubURL || !p.coverImage
  );
  const missingUrlProjects = projects.filter((p) => !p.url);
  const hasIncompleteProjects = incompleteProjects.length > 0;
  const projectsCount = projects.length;

  // Certifications
  const incompleteCertifications = certifications.filter(
    (c) => !c.name || !c.skill || !c.verifyUrl
  );
  const hasIncompleteCertifications = incompleteCertifications.length > 0;
  const certificationsCount = certifications.length;

  return (
    <div className="space-y-4 p-6">
      <Card>
        <CardContent className="pt-6 space-y-4">
          {/* Portfolio count control */}
          <div className="flex items-center gap-3 p-3 bg-zinc-900 rounded-xl border border-zinc-800 mb-4">
            <Label className="text-sm text-zinc-300 shrink-0">Projects on portfolio:</Label>
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="outline"
                className="h-8 w-8"
                onClick={() => setPortfolioCount(Math.max(0, portfolioCount - 1))}
                disabled={portfolioCount <= 0}
              >
                -
              </Button>
              <span className="text-lg font-semibold text-purple-400 w-6 text-center">
                {portfolioCount}
              </span>
              <Button
                size="sm"
                variant="outline"
                className="h-8 w-8"
                onClick={() => setPortfolioCount(Math.min(allProjects.length, portfolioCount + 1))}
                disabled={portfolioCount >= allProjects.length}
              >
                +
              </Button>
            </div>
            <span className="text-xs text-zinc-500">of {allProjects.length} total</span>
            <Button
              size="sm"
              variant="secondary"
              className="ml-auto rounded-[8px]"
              onClick={openCountDialog}
            >
              Select projects
            </Button>
          </div>

          <Tabs defaultValue="projects" className="w-full rounded-2xl">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold w-1/3">Portfolio Editor</h2>

              <div className="w-1/3 flex justify-center mb-2">
                <TabsList className="mx-auto rounded-xl p-5">
                  <TabsTrigger
                    value="projects"
                    className="text-md rounded-2xl px-4"
                  >
                    Projects
                  </TabsTrigger>
                  <TabsTrigger
                    value="certifications"
                    className="text-md rounded-2xl px-4"
                  >
                    Certifications
                  </TabsTrigger>
                </TabsList>
              </div>

              <div className="w-1/3 flex justify-end"></div>
            </div>

            {/* ALERTS */}
            {hasIncompleteProjects && (
              <Alert variant="destructive">
                <AlertTitle>Incomplete data</AlertTitle>
                <AlertDescription>
                  {incompleteProjects.length} project(s) are missing required
                  fields (description, GitHub URL, or cover image URL).
                  {missingUrlProjects.length > 0 && (
                    <span className="block mt-1">
                      {missingUrlProjects.length} project(s) are also missing a
                      website URL (optional, but recommended).
                    </span>
                  )}
                </AlertDescription>
              </Alert>
            )}

            {hasIncompleteCertifications && (
              <Alert variant="destructive">
                <AlertTitle>Incomplete data</AlertTitle>
                <AlertDescription>
                  {incompleteCertifications.length} certification(s) are missing
                  required fields (name, skill, or verification URL).
                </AlertDescription>
              </Alert>
            )}

            {/* Projects Tab */}
            <TabsContent value="projects">
              <AnimatePresence mode="wait">
                <motion.div
                  key="projects"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                >
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Featured Projects</CardTitle>
                      <CardDescription>
                        Curate and order the projects that appear on your
                        portfolio
                      </CardDescription>
                    </div>
                    <Button
                      onClick={openNewProjectDialog}
                      className="flex items-center gap-1"
                    >
                      <Plus className="h-4 w-4" />
                      Add Project
                    </Button>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="flex flex-col gap-3">
                    {loadingProjects ? (
                      <div className="w-full flex justify-center py-10">
    <Loader2 className="animate-spin h-6 w-6 text-gray-500" />
  </div>
                    ) : projects.length === 0 ? (
                      <p className="text-sm text-muted-foreground text-center">
                        No featured projects found.
                      </p>
                    ) : (
                      projects.map((p, idx) => (
                        <div
                          key={p.id}
                          className="flex items-start justify-between border rounded-xl p-4"
                        >
                          <div>
                            <div className="flex items-center gap-2 mb-3">
                              <p className="font-medium">{p.name}</p>
                              <Badge className="bg-green-100 ml-3 rounded-xl text-green-800 hover:bg-green-100">
                                Featured
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-500">
                              {p.description ?? "⚠️ Missing description"}
                            </p>
                            <div className="mt-2 flex gap-4 text-xs">
                              {!p.url && (
                                <span className="text-red-500">
                                  ⚠️ Missing Website URL
                                </span>
                              )}
                              {!p.githubURL && (
                                <span className="text-red-500">
                                  ⚠️ Missing GitHub URL
                                </span>
                              )}
                              {!p.coverImage && (
                                <span className="text-red-500">
                                  ⚠️ Missing cover image URL
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            {/* ordering controls */}
                            <div className="flex flex-col items-center">
                              <Button
                                size="icon"
                                variant="ghost"
                                onClick={() => swapProjectOrder(idx, idx - 1)}
                              >
                                <ArrowUp className="h-4 w-4" />
                              </Button>
                              <div className="text-xs">{p.order ?? "-"}</div>
                              <Button
                                size="icon"
                                variant="ghost"
                                onClick={() => swapProjectOrder(idx, idx + 1)}
                              >
                                <ArrowDown className="h-4 w-4" />
                              </Button>
                            </div>

                            <Input
                              className="w-20"
                              type="number"
                              value={p.order ?? ""}
                              onChange={async (e) => {
                                const val = e.target.value
                                  ? parseInt(e.target.value)
                                  : null;
                                await updateProjectOrder(p.id, val);
                              }}
                            />

                            <div className="flex space-x-2">
                              <Button
                                size="icon"
                                variant="outline"
                                onClick={() => openEditProjectDialog(p)}
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button
                                size="icon"
                                variant="destructive"
                                onClick={() => confirmDeleteProject(p.id)}
                              >
                                <Trash className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
                </motion.div>
              </AnimatePresence>
            </TabsContent>

            {/* Certifications Tab */}
            <TabsContent value="certifications">
              <AnimatePresence mode="wait">
                <motion.div
                  key="certifications"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.2 }}
                >
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Certifications</CardTitle>
                      <CardDescription>
                        Manage certifications (featured flag available)
                      </CardDescription>
                    </div>
                    <Button
                      onClick={openNewCertDialog}
                      className="flex items-center gap-1"
                    >
                      <Plus className="h-4 w-4" /> Add Certification
                    </Button>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {loadingCerts ? (
                    <div className="w-full flex justify-center py-10">
    <Loader2 className="animate-spin h-6 w-6 text-gray-500" />
  </div>
                  ) : certifications.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center">
                      No certifications
                    </p>
                  ) : (
                    certifications.map((c) => (
                      <div
                        key={c.id}
                        className="flex items-center justify-between border rounded-xl p-5"
                      >
                        <div>
                          <p className="font-medium mb-3">{c.name}</p>
                          <p className="text-sm text-muted-foreground">
                            Skill: {c.skill ?? ""}
                          </p>
                        </div>
                        <div className="flex space-x-2">
                          <Button
                            size="icon"
                            variant="outline"
                            onClick={() => openEditCertDialog(c)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            size="icon"
                            variant="destructive"
                            onClick={() => confirmDeleteCert(c.id)}
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                </CardContent>
              </Card>
                </motion.div>
              </AnimatePresence>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Portfolio Selection Dialog */}
      <Dialog open={countDialogOpen} onOpenChange={setCountDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Select projects for portfolio</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-zinc-400 mb-3">
            Choose exactly {portfolioCount} project(s) to show on your portfolio.
            Currently {selectedProjectIds.size} selected.
          </p>
          <div className="space-y-2 max-h-80 overflow-y-auto">
            {allProjects.map((p) => (
              <div
                key={p.id}
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-zinc-800 transition-colors"
              >
                <Checkbox
                  id={p.id}
                  checked={selectedProjectIds.has(p.id)}
                  onCheckedChange={() => toggleProjectSelection(p.id)}
                />
                <Label htmlFor={p.id} className="text-sm cursor-pointer flex-1">
                  {p.name}
                  <span className="text-xs text-zinc-500 ml-2">
                    {p.description ? "" : "⚠️ no description"}
                  </span>
                </Label>
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCountDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={savePortfolioSelection}
              disabled={countSaving || selectedProjectIds.size !== portfolioCount}
            >
              {countSaving ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="animate-spin h-4 w-4" />
                  <span>Saving...</span>
                </div>
              ) : (
                `Show ${portfolioCount} projects`
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Project Dialog */}
      <Dialog open={projectDialogOpen} onOpenChange={setProjectDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {editProjectId ? "Edit Project" : "Add Featured Project"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-3">
            <Input
              placeholder="Name"
              value={pName}
              onChange={(e) => setPName(e.target.value)}
            />
            <Input
              placeholder="Website URL"
              value={pUrl}
              onChange={(e) => setPUrl(e.target.value)}
            />
            <Input
              placeholder="GitHub URL"
              value={pGithub}
              onChange={(e) => setPGithub(e.target.value)}
            />
            <Input
              placeholder="Cover image URL"
              value={pCoverImage}
              onChange={(e) => setPCoverImage(e.target.value)}
            />
            <Textarea
              placeholder="Description"
              value={pDescription}
              onChange={(e) => setPDescription(e.target.value)}
              className="min-h-[120px]"
            />

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Switch
                  checked={pFeatured}
                  onCheckedChange={(v) => setPFeatured(Boolean(v))}
                />
                <span className="text-sm">Featured on portfolio</span>
              </div>
              <Input
                type="number"
                className="w-30"
                placeholder="Order (optional)"
                value={pOrder ?? ""}
                onChange={(e) =>
                  setPOrder(e.target.value ? parseInt(e.target.value) : null)
                }
              />
            </div>
          </div>

          <DialogFooter>
            <Button onClick={saveProject} disabled={projectSaving}>
              {projectSaving ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="animate-spin h-4 w-4" />
                  <span>Saving...</span>
                </div>
              ) : editProjectId ? (
                "Save changes"
              ) : (
                "Add project"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete project confirmation */}
      <Dialog
        open={Boolean(deleteProjectId)}
        onOpenChange={() => setDeleteProjectId(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete project</DialogTitle>
          </DialogHeader>
          <p>Are you sure you want to delete this project?</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteProjectId(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={deleteProject}
              disabled={deletingProject}
            >
              {deletingProject ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="animate-spin h-4 w-4" />
                  <span>Deleting...</span>
                </div>
              ) : (
                "Delete"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Certification Dialog */}
      <Dialog open={certDialogOpen} onOpenChange={setCertDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {editCertId ? "Edit Certification" : "Add Certification"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-3">
            <Input
              placeholder="Name"
              value={cName}
              onChange={(e) => setCName(e.target.value)}
            />
            <Input
              placeholder="Skill"
              value={cSkill}
              onChange={(e) => setCSkill(e.target.value)}
            />
            <Input
              placeholder="Verification URL"
              value={cUrl}
              onChange={(e) => setCUrl(e.target.value)}
            />
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Switch
                  checked={cFeatured}
                  onCheckedChange={(v) => setCFeatured(Boolean(v))}
                />
                <span className="text-sm">Featured</span>
              </div>
              <Input
                type="number"
                className="w-30"
                placeholder="Order (optional)"
                value={cOrder ?? ""}
                onChange={(e) =>
                  setCOrder(e.target.value ? parseInt(e.target.value) : null)
                }
              />
            </div>
          </div>

          <DialogFooter>
            <Button onClick={saveCertification} disabled={certSaving}>
              {certSaving ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="animate-spin h-4 w-4" />
                  <span>Saving...</span>
                </div>
              ) : editCertId ? (
                "Save changes"
              ) : (
                "Add certification"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete cert confirmation */}
      <Dialog
        open={Boolean(deleteCertId)}
        onOpenChange={() => setDeleteCertId(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete certification</DialogTitle>
          </DialogHeader>
          <p>Are you sure you want to delete this certification?</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteCertId(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={deleteCert}
              disabled={deletingCert}
            >
              {deletingCert ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="animate-spin h-4 w-4" />
                  <span>Deleting...</span>
                </div>
              ) : (
                "Delete"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
