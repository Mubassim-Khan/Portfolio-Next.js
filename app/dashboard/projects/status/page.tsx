import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function StatusPage() {
  const projects = [
    { name: "Portfolio Website", status: "Online" },
    { name: "AI Quiz Generator", status: "Deploying" },
    { name: "Image Manipulation SaaS", status: "Offline" },
  ]

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Project Status Overview</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {projects.map((p, idx) => (
            <div key={idx} className="flex justify-between">
              <span>{p.name}</span>
              <Badge variant={p.status === "Online" ? "default" : p.status === "Deploying" ? "secondary" : "destructive"}>
                {p.status}
              </Badge>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
