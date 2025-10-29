'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { reportIssue } from '@/lib/actions';
import type { User } from '@/lib/definitions';
import { defaultIssueTypes } from '@/lib/definitions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Send } from 'lucide-react';
import { useState } from 'react';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full" aria-disabled={pending}>
      {pending ? 'Submitting...' : 'Submit Report'}
      <Send className="ml-2 h-4 w-4" />
    </Button>
  );
}

export function ReportIssueForm({ user }: { user?: Omit<User, 'password'> }) {
  const [errorMessage, dispatch] = useFormState(reportIssue, undefined);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleTypeSelect = (value: string) => {
    if (defaultIssueTypes.includes(value as any)) {
        setTitle(value);
        setDescription(`Issue regarding: ${value}. `);
    }
  }

  return (
    <form action={dispatch} className="space-y-6">
      {user ? (
        <>
          <input type="hidden" name="userId" value={user.id} />
          <input type="hidden" name="userName" value={user.name} />
        </>
      ) : (
        <>
          <input type="hidden" name="userId" value={''} />
          <input type="hidden" name="userName" value={'Anonymous'} />
        </>
      )}

      <div className="space-y-2">
        <Label htmlFor="issue-type">Issue Type (Optional)</Label>
        <Select onValueChange={handleTypeSelect}>
            <SelectTrigger id="issue-type">
                <SelectValue placeholder="Select a common issue type..." />
            </SelectTrigger>
            <SelectContent>
                {defaultIssueTypes.map(type => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
            </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          name="title"
          placeholder="e.g., Large pothole on Elm Street"
          required
          minLength={5}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          placeholder="Describe the issue in detail. The more information, the better!"
          required
          minLength={20}
          rows={5}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="location">Location</Label>
        <Input
          id="location"
          name="location"
          placeholder="e.g., Near the corner of Elm and Oak"
          required
          minLength={3}
        />
      </div>
      
      {/* File upload is a complex feature, so we'll just have a placeholder UI for it. */}
      <div className="space-y-2">
        <Label htmlFor="media">Add a Photo (Optional)</Label>
        <Input id="media" type="file" disabled />
        <p className="text-xs text-muted-foreground">Media uploads are currently disabled.</p>
      </div>

      <SubmitButton />

      {errorMessage && (
        <Alert variant="destructive">
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      )}
    </form>
  );
}
