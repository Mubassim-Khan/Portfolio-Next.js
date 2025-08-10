import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function IntegrationsSettingsPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Integrations</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between items-center">
          <span>GitHub</span>
          <Button size="sm">Connect</Button>
        </div>
        <div className="flex justify-between items-center">
          <span>Vercel</span>
          <Button size="sm">Connect</Button>
        </div>
      </CardContent>
    </Card>
  )
}
