import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { prisma } from "@/lib/prisma"

export default async function StatusPage() {
  const projects = await prisma.project.findMany({
    include: { logs: { orderBy: { checkedAt: "desc" }, take: 1 } },
  })

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-semibold">
            Project Status Overview
          </CardTitle>
        </CardHeader>
        <CardContent className="divide-y divide-border">
          {projects.length === 0 ? (
            <p className="text-muted-foreground text-sm">No projects found.</p>
          ) : (
            projects.map((p) => {
              const isUp = p.logs?.[0]?.status
              const lastCheck = p.logs?.[0]?.checkedAt
                ? new Date(p.logs[0].checkedAt).toLocaleString()
                : "No checks yet"

              return (
                <div
                  key={p.id}
                  className="flex items-center justify-between py-3"
                >
                  <div className="flex flex-col">
                    <span className="font-medium">{p.name}</span>
                    <span className="text-xs text-muted-foreground">
                      Last check: {lastCheck}
                    </span>
                  </div>
                  <Badge
                    variant={isUp ? "secondary" : "destructive"}
                    className={isUp ? "bg-green-500 text-white hover:bg-green-600" : ""}
                  >
                    {isUp ? "UP" : "DOWN"}
                  </Badge>
                </div>
              )
            })
          )}
        </CardContent>
      </Card>
    </div>
  )
}
