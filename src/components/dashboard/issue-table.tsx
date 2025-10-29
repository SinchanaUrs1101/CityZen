'use client';

import * as React from 'react';
import Link from 'next/link';
import { format } from 'date-fns';
import { MoreHorizontal, ArrowUpDown } from 'lucide-react';
import type { Issue, IssueStatus } from '@/lib/definitions';
import { issueStatuses } from '@/lib/definitions';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuPortal,
} from '@/components/ui/dropdown-menu';
import { StatusBadge } from './status-badge';
import { updateIssueStatus } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';

function ActionsCell({ issue }: { issue: Issue }) {
    const { toast } = useToast();
    const handleStatusChange = async (status: IssueStatus) => {
        try {
            await updateIssueStatus(issue.id, status);
            toast({
                title: 'Status Updated',
                description: `Issue #${issue.id} has been marked as ${status}.`,
            });
        } catch (error) {
            toast({
                title: 'Update Failed',
                description: 'Could not update the issue status.',
                variant: 'destructive',
            });
        }
    };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <Link href={`/issues/${issue.id}`} passHref>
            <DropdownMenuItem>View Details</DropdownMenuItem>
        </Link>
        <DropdownMenuSeparator />
        <DropdownMenuSub>
            <DropdownMenuSubTrigger>Change Status</DropdownMenuSubTrigger>
            <DropdownMenuPortal>
                <DropdownMenuSubContent>
                    {issueStatuses.map(status => (
                        <DropdownMenuItem 
                            key={status} 
                            onClick={() => handleStatusChange(status)}
                            disabled={status === issue.status}
                        >
                            {status}
                        </DropdownMenuItem>
                    ))}
                </DropdownMenuSubContent>
            </DropdownMenuPortal>
        </DropdownMenuSub>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function IssueTable({ issues }: { issues: Issue[] }) {
  // For simplicity, we are not implementing full sorting/filtering client-side.
  // This is a placeholder for a more complex data table.
  const [sort, setSort] = React.useState({ key: 'createdAt', order: 'desc' });

  const sortedIssues = React.useMemo(() => {
    return [...issues].sort((a, b) => {
        const aVal = a[sort.key as keyof Issue];
        const bVal = b[sort.key as keyof Issue];
        if (sort.key === 'createdAt') {
            return sort.order === 'asc' ? new Date(aVal).getTime() - new Date(bVal).getTime() : new Date(bVal).getTime() - new Date(aVal).getTime();
        }
        if (String(aVal) < String(bVal)) return sort.order === 'asc' ? -1 : 1;
        if (String(aVal) > String(bVal)) return sort.order === 'asc' ? 1 : -1;
        return 0;
    });
  }, [issues, sort]);

  const handleSort = (key: keyof Issue) => {
    setSort(prev => ({
        key,
        order: prev.key === key && prev.order === 'asc' ? 'desc' : 'asc'
    }));
  }

  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>
                <Button variant="ghost" onClick={() => handleSort('status')}>
                    Status <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            </TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Reported by</TableHead>
            <TableHead>
                <Button variant="ghost" onClick={() => handleSort('createdAt')}>
                    Date Reported <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            </TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedIssues.map((issue) => (
            <TableRow key={issue.id}>
              <TableCell className="font-medium">
                <Link href={`/issues/${issue.id}`} className="hover:underline">
                    {issue.title}
                </Link>
              </TableCell>
              <TableCell>
                <StatusBadge status={issue.status} />
              </TableCell>
              <TableCell>{issue.category}</TableCell>
              <TableCell>{issue.userName}</TableCell>
              <TableCell>{format(new Date(issue.createdAt), 'PPp')}</TableCell>
              <TableCell className="text-right">
                <ActionsCell issue={issue} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
