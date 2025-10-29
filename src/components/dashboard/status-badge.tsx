import type { IssueStatus } from '@/lib/definitions';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

type StatusBadgeProps = {
  status: IssueStatus;
};

export function StatusBadge({ status }: StatusBadgeProps) {
  const statusStyles = {
    Reported: 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300 border-blue-300',
    'In Progress': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300 border-yellow-400',
    Resolved: 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300 border-green-400',
  };

  return (
    <Badge variant="outline" className={cn('font-medium', statusStyles[status])}>
      {status}
    </Badge>
  );
}
