import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

export default async function ProfilePage() {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }
  const { user } = session;

  return (
    <div className="mx-auto max-w-lg">
      <Card>
        <CardHeader className="items-center text-center">
            <Avatar className="h-24 w-24 mb-4">
                <AvatarImage src={`https://avatar.vercel.sh/${user.email}.png`} alt={user.name} />
                <AvatarFallback className="text-3xl">{user.name.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
            <CardTitle className="text-3xl font-bold font-headline">{user.name}</CardTitle>
            <CardDescription>{user.email}</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-4">
            <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-muted-foreground">Role:</span>
                <Badge variant={user.role === 'admin' ? 'destructive' : 'secondary'}>
                    {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                </Badge>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
