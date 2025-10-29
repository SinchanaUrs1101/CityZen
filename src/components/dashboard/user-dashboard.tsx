import Link from 'next/link';
import type { Issue } from '@/lib/definitions';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { IssueCard } from './issue-card';

export function UserDashboard({ issues }: { issues: Issue[] }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
            <h1 className="text-3xl font-bold font-headline">Your Reported Issues</h1>
            <p className="text-muted-foreground">Here are the issues you&apos;ve reported. Thank you for your contribution!</p>
        </div>
        <Link href="/report-issue" passHref>
          <Button>
            <PlusCircle />
            Report New Issue
          </Button>
        </Link>
      </div>

      {issues.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {issues.map((issue) => (
            <IssueCard key={issue.id} issue={issue} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 border-2 border-dashed rounded-lg">
          <h3 className="text-xl font-semibold">No issues reported yet.</h3>
          <p className="text-muted-foreground mt-2">Ready to make a difference? Report your first issue today.</p>
          <Link href="/report-issue" passHref>
            <Button className="mt-4">
              <PlusCircle />
              Report an Issue
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}
