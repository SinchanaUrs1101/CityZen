import { SignUpForm } from '@/components/auth/signup-form';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import Link from 'next/link';

export default function SignUpPage() {
  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-headline">Create an Account</CardTitle>
        <CardDescription>Join CityZen and help improve your community</CardDescription>
      </CardHeader>
      <CardContent>
        <SignUpForm />
        <div className="mt-4 text-center text-sm">
          Already have an account?{' '}
          <Link href="/login" className="underline text-primary">
            Sign in
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
