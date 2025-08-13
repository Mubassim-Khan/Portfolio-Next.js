import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function VisitorsPage() {
  const visitors = [
    { country: "United States", count: 1240 },
    { country: "India", count: 980 },
    { country: "United Kingdom", count: 430 },
    { country: "Canada", count: 295 },
  ]

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Visitors by Country</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {visitors.map((v, idx) => (
              <li key={idx} className="flex justify-between">
                <span>{v.country}</span>
                <span className="font-medium">{v.count}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
