import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/desktop/ui/card";

export default function VercelPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Vercel Deployments</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Monitor and manage your Vercel deployments.</p>
      </CardContent>
    </Card>
  );
}
