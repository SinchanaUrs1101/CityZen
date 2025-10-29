import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { ReportIssueForm } from "@/components/report-issue-form";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default async function ReportIssuePage() {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }

  return (
    <div className="mx-auto max-w-2xl">
        <Card>
            <CardHeader>
                <CardTitle className="text-3xl font-bold font-headline">Report a New Issue</CardTitle>
                <CardDescription>
                    Help us improve the community by reporting problems you see. Provide as much detail as possible.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <ReportIssueForm user={session.user} />
            </CardContent>
        </Card>
    </div>
  );
}
