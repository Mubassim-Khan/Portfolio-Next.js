import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default function ReferrersPage() {
  // Placeholder data — replace with actual analytics API data
  const topReferrers = [
    { source: "Google", visitors: 1245 },
    { source: "Twitter", visitors: 532 },
    { source: "Reddit", visitors: 298 },
    { source: "LinkedIn", visitors: 187 },
    { source: "Direct / None", visitors: 162 },
  ]

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Top Referrers</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Source</TableHead>
                <TableHead className="text-right">Visitors</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {topReferrers.map((referrer, index) => (
                <TableRow key={index}>
                  <TableCell>{referrer.source}</TableCell>
                  <TableCell className="text-right">{referrer.visitors}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
