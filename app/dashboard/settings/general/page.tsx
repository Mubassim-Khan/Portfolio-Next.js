import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function GeneralSettingsPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>General Settings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="block mb-2 text-sm font-medium">Site Name</label>
          <Input placeholder="Enter site name" />
        </div>
        <div>
          <label className="block mb-2 text-sm font-medium">Primary Email</label>
          <Input type="email" placeholder="Enter email" />
        </div>
        <Button>Save Changes</Button>
      </CardContent>
    </Card>
  )
}
