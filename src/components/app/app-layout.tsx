'use client';
import type { User } from '@/lib/definitions';
import { SidebarProvider, Sidebar, SidebarInset } from '@/components/ui/sidebar';
import { AppSidebar } from './sidebar';
import { AppHeader } from './header';

export function AppLayout({ user, children }: { user: Omit<User, 'password'>; children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <Sidebar>
        <AppSidebar user={user} />
      </Sidebar>
      <SidebarInset>
        <AppHeader user={user} />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
