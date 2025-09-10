"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Pencil, Trash } from "lucide-react";

export default function PortfolioEditor() {
  // Mock data
  const [projects, setProjects] = useState([
    {
      id: 1,
      title: "DocTools",
      desc: "All-in-one document utility with AI features",
    },
    {
      id: 2,
      title: "F1 Dashboard",
      desc: "Predicts race outcomes with ML models",
    },
  ]);

  const [certifications, setCertifications] = useState([
    { id: 1, name: "AWS Certified Cloud Practitioner" },
    { id: 2, name: "Google Data Analytics Professional Certificate" },
  ]);

  return (
    <div className="p-6">
      <Tabs defaultValue="projects">
        <TabsList className="mb-4">
          <TabsTrigger value="projects">Projects</TabsTrigger>
          <TabsTrigger value="certifications">Certifications</TabsTrigger>
        </TabsList>

        {/* Projects Tab */}
        <TabsContent value="projects">
          <Card>
            <CardHeader>
              <CardTitle>Projects</CardTitle>
              <CardDescription>Manage your portfolio projects</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {projects.map((project) => (
                <div
                  key={project.id}
                  className="flex items-start justify-between border rounded-md p-3"
                >
                  <div>
                    <p className="font-medium">{project.title}</p>
                    <p className="text-sm text-gray-500">{project.desc}</p>
                  </div>
                  <div className="flex space-x-2">
                    <Button size="icon" variant="outline">
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button size="icon" variant="destructive">
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
              <Button className="w-full">
                <Plus className="h-4 w-4 mr-2" /> Add Project
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Certifications Tab */}
        <TabsContent value="certifications">
          <Card>
            <CardHeader>
              <CardTitle>Certifications</CardTitle>
              <CardDescription>Manage your certifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {certifications.map((cert) => (
                <div
                  key={cert.id}
                  className="flex items-center justify-between border rounded-md p-3"
                >
                  <p className="font-medium">{cert.name}</p>
                  <div className="flex space-x-2">
                    <Button size="icon" variant="outline">
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button size="icon" variant="destructive">
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
              <Button className="w-full">
                <Plus className="h-4 w-4 mr-2" /> Add Certification
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
