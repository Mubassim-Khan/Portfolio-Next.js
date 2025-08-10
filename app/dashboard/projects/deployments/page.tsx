import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function DeploymentsPage() {
  const deployments = [
    { project: "Portfolio Website", date: "2025-08-10", status: "Success" },
    { project: "AI Quiz Generator", date: "2025-08-08", status: "Failed" },
    { project: "Image Manipulation SaaS", date: "2025-08-05", status: "Success" },
  ]

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Recent Deployments</CardTitle>
        </CardHeader>
        <CardContent>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left border-b">
                <th className="py-2">Project</th>
                <th className="py-2">Date</th>
                <th className="py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {deployments.map((d, idx) => (
                <tr key={idx} className="border-b">
                  <td className="py-2">{d.project}</td>
                  <td>{d.date}</td>
                  <td className={d.status === "Success" ? "text-green-600" : "text-red-600"}>
                    {d.status}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  )
}
