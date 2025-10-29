'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import type { User } from '@/lib/definitions';
import { logout } from '@/lib/actions';
import {
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarSeparator
} from '@/components/ui/sidebar';
import { Logo } from '@/components/logo';
import { Button } from '@/components/ui/button';
import { LogOut, LayoutDashboard, FilePenLine, User as UserIcon } from 'lucide-react';

const menuItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, adminOnly: false },
  { href: '/report-issue', label: 'Report an Issue', icon: FilePenLine, adminOnly: false },
  { href: '/profile', label: 'Profile', icon: UserIcon, adminOnly: false },
];

export function AppSidebar({ user }: { user: Omit<User, 'password'> }) {
  const pathname = usePathname();

  const filteredMenuItems = menuItems.filter(item => 
    user.role === 'admin' || !item.adminOnly
  );

  return (
    <>
      <SidebarHeader>
        <Logo />
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {filteredMenuItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <Link href={item.href} legacyBehavior passHref>
                <SidebarMenuButton
                  isActive={pathname === item.href}
                  tooltip={item.label}
                >
                  <item.icon />
                  <span>{item.label}</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className='mt-auto'>
        <SidebarSeparator />
        <form action={logout}>
          <Button variant="ghost" className="w-full justify-start gap-2">
            <LogOut />
            <span>Log Out</span>
          </Button>
        </form>
      </SidebarFooter>
    </>
  );
}
