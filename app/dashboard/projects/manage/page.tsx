import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function ManageProjectsPage() {
  const projects = [
    { name: "Portfolio Website" },
    { name: "AI Quiz Generator" },
    { name: "Image Manipulation SaaS" },
  ]

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Manage Projects</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {projects.map((p, idx) => (
            <div key={idx} className="flex justify-between items-center">
              <span>{p.name}</span>
              <div className="space-x-2">
                <Button size="sm" variant="outline">Edit</Button>
                <Button size="sm" variant="destructive">Delete</Button>
              </div>
            </div>
          ))}
          <Button className="mt-4">Add New Project</Button>
        </CardContent>
      </Card>
    </div>
  )
}
