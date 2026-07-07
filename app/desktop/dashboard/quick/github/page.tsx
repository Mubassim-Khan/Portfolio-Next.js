import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/desktop/ui/card";

export default function GithubPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>GitHub Integration</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Manage and view connected GitHub repositories here.</p>
      </CardContent>
    </Card>
  );
}
