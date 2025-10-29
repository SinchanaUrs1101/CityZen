import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { getIssueById } from "@/lib/data";
import { notFound } from "next/navigation";
import Image from "next/image";
import { format, formatDistanceToNow } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { MapPin, Tag, User, Calendar, Bot, Milestone, Pencil } from 'lucide-react';
import type { IssueUpdate } from "@/lib/definitions";

function TimelineItem({ update, isLast }: { update: IssueUpdate, isLast: boolean }) {
    const statusIcons = {
        Reported: <Pencil className="h-4 w-4" />,
        'In Progress': <Milestone className="h-4 w-4" />,
        Resolved: <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-check-circle-2"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/><path d="m9 12 2 2 4-4"/></svg>
    };

    return (
        <li className="flex gap-4">
            <div className="flex flex-col items-center">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                    {statusIcons[update.status]}
                </span>
                {!isLast && <div className="w-px flex-1 bg-border" />}
            </div>
            <div className="pb-8 flex-1">
                <p className="font-semibold">{update.status}</p>
                <p className="text-sm text-muted-foreground">
                    {format(new Date(update.timestamp), 'MMMM d, yyyy HH:mm')}
                </p>
                {update.notes && (
                    <p className="mt-2 text-sm italic">Note: "{update.notes}"</p>
                )}
            </div>
        </li>
    );
}


export default async function IssueDetailPage({ params }: { params: { id: string } }) {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }

  const issue = await getIssueById(params.id);
  if (!issue) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
        <header>
            <p className="text-primary font-semibold">{issue.category}</p>
            <h1 className="text-4xl font-bold font-headline mt-1">{issue.title}</h1>
            <p className="text-muted-foreground mt-2">
                Reported {formatDistanceToNow(new Date(issue.createdAt), { addSuffix: true })} by {issue.userName}
            </p>
        </header>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-6">
                {issue.imageUrl && (
                    <Card>
                        <CardContent className="p-0">
                        <Image
                            src={issue.imageUrl}
                            alt={issue.title}
                            width={800}
                            height={500}
                            className="rounded-lg object-cover"
                            data-ai-hint={issue.imageHint}
                        />
                        </CardContent>
                    </Card>
                )}

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><Bot /> AI Summary</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="italic text-muted-foreground">{issue.summary}</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Full Description</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="whitespace-pre-wrap">{issue.description}</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Update History</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ul>
                            {issue.updates.map((update, index) => (
                                <TimelineItem key={update.timestamp} update={update} isLast={index === issue.updates.length - 1} />
                            ))}
                        </ul>
                    </CardContent>
                </Card>
            </div>
            <div className="md:col-span-1 space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Issue Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 text-sm">
                        <div className="flex items-center justify-between">
                            <span className="text-muted-foreground">Status</span>
                            <StatusBadge status={issue.status} />
                        </div>
                        <Separator />
                        <div className="flex items-start gap-2">
                            <Tag className="h-4 w-4 mt-1 text-muted-foreground" />
                            <div>
                                <p className="text-muted-foreground">Category</p>
                                <p className="font-medium">{issue.category}</p>
                            </div>
                        </div>
                         <div className="flex items-start gap-2">
                            <MapPin className="h-4 w-4 mt-1 text-muted-foreground" />
                            <div>
                                <p className="text-muted-foreground">Location</p>
                                <p className="font-medium">{issue.location}</p>
                            </div>
                        </div>
                         <div className="flex items-start gap-2">
                            <User className="h-4 w-4 mt-1 text-muted-foreground" />
                            <div>
                                <p className="text-muted-foreground">Reported By</p>
                                <p className="font-medium">{issue.userName}</p>
                            </div>
                        </div>
                         <div className="flex items-start gap-2">
                            <Calendar className="h-4 w-4 mt-1 text-muted-foreground" />
                            <div>
                                <p className="text-muted-foreground">Reported On</p>
                                <p className="font-medium">{format(new Date(issue.createdAt), "MMMM d, yyyy 'at' p")}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    </div>
  );
}
