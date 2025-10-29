import Link from 'next/link';
import Image from 'next/image';
import type { Issue } from '@/lib/definitions';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { StatusBadge } from './status-badge';
import { Separator } from '@/components/ui/separator';
import { MapPin, Tag } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export function IssueCard({ issue }: { issue: Issue }) {
  return (
    <Link href={`/issues/${issue.id}`} className="group block">
      <Card className="flex h-full flex-col transition-all duration-200 group-hover:shadow-lg group-hover:-translate-y-1">
        <CardHeader>
          {issue.imageUrl && (
            <div className="relative mb-4 h-48 w-full overflow-hidden rounded-lg">
              <Image
                src={issue.imageUrl}
                alt={issue.title}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                data-ai-hint={issue.imageHint}
              />
            </div>
          )}
          <CardTitle className="text-lg font-bold leading-tight">{issue.title}</CardTitle>
        </CardHeader>
        <CardContent className="flex-grow">
          <div className="flex items-center justify-between">
            <StatusBadge status={issue.status} />
            <p className="text-xs text-muted-foreground">
              {formatDistanceToNow(new Date(issue.createdAt), { addSuffix: true })}
            </p>
          </div>
        </CardContent>
        <Separator className="mx-6" />
        <CardFooter className="grid grid-cols-2 gap-4 pt-6 text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
                <Tag className="h-4 w-4" />
                <span className="truncate">{issue.category}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span className="truncate">{issue.location}</span>
            </div>
        </CardFooter>
      </Card>
    </Link>
  );
}
