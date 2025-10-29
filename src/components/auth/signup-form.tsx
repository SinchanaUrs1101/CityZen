'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { signUp } from '@/lib/actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Mail, KeyRound, User as UserIcon } from 'lucide-react';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full" aria-disabled={pending}>
      {pending ? 'Creating Account...' : 'Create Account'}
    </Button>
  );
}

export function SignUpForm() {
  const [errorMessage, dispatch] = useFormState(signUp, undefined);

  return (
    <form action={dispatch} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Full Name</Label>
        <div className="relative">
          <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input id="name" name="name" placeholder="John Doe" required className="pl-10" />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input id="email" name="email" type="email" placeholder="name@example.com" required className="pl-10" />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <div className="relative">
            <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input id="password" name="password" type="password" required className="pl-10" />
        </div>
      </div>
      <div className="space-y-2">
        <Label>Sign up as</Label>
        <RadioGroup defaultValue="citizen" name="role" className="flex gap-4">
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="citizen" id="citizen" />
            <Label htmlFor="citizen">Citizen</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="admin" id="admin" />
            <Label htmlFor="admin">Admin</Label>
          </div>
        </RadioGroup>
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
