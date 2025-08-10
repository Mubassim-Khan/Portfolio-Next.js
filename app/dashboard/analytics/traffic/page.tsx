import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

export default function TrafficPage() {
  const trafficData = [
    { label: "This Week", value: 4200 },
    { label: "Last Week", value: 3500 },
    { label: "Change", value: "+20%" },
  ]

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Traffic Overview</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {trafficData.map((item, i) => (
            <div key={i} className="flex justify-between items-center">
              <span>{item.label}</span>
              <span className="font-medium">{item.value}</span>
            </div>
          ))}
          <Progress value={60} className="w-full" />
        </CardContent>
      </Card>
    </div>
  )
}
