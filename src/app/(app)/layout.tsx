import { getSession } from "@/lib/session";
import { AppLayout } from "@/components/app/app-layout";
import { redirect } from "next/navigation";

export default async function Layout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }

  return (
    <AppLayout user={session.user}>
      {children}
    </AppLayout>
  );
}
