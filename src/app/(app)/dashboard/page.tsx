import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { getIssues } from "@/lib/data";
import { AdminDashboard } from "@/components/dashboard/admin-dashboard";
import { UserDashboard } from "@/components/dashboard/user-dashboard";

export default async function DashboardPage() {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }

  if (session.user.role === 'admin') {
    const allIssues = await getIssues();
    return <AdminDashboard issues={allIssues} />;
  }
  
  const userIssues = await getIssues(session.user.id);
  return <UserDashboard issues={userIssues} />;
}
