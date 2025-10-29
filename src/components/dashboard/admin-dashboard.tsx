import type { Issue } from '@/lib/definitions';
import { IssueTable } from './issue-table';

export function AdminDashboard({ issues }: { issues: Issue[] }) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold font-headline">Admin Dashboard</h1>
        <p className="text-muted-foreground">Manage and track all reported civic issues.</p>
      </div>
      <IssueTable issues={issues} />
    </div>
  );
}
