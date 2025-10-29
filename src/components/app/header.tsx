'use client';

import Link from 'next/link';
import type { User } from '@/lib/definitions';
import { logout } from '@/lib/actions';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { LogOut, User as UserIcon } from 'lucide-react';
import { Logo } from '../logo';
import { useIsMobile } from '@/hooks/use-mobile';

export function AppHeader({ user }: { user: Omit<User, 'password'> }) {
    const isMobile = useIsMobile();
  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background/80 px-4 backdrop-blur-sm md:px-6">
        <SidebarTrigger className="md:hidden" />
        
        {isMobile && <div className="flex-1"><Logo /></div>}

      <div className="flex w-full items-center justify-end gap-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full">
              <Avatar>
                <AvatarImage src={`https://avatar.vercel.sh/${user.email}.png`} alt={user.name} />
                <AvatarFallback>{user.name.charAt(0).toUpperCase()}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>
                <p className='font-bold'>{user.name}</p>
                <p className='text-xs text-muted-foreground font-normal'>{user.email}</p>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <Link href="/profile" passHref>
                <DropdownMenuItem>
                    <UserIcon className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                </DropdownMenuItem>
            </Link>
            <DropdownMenuSeparator />
            <form action={logout} className="w-full">
                <button type='submit' className='w-full'>
                    <DropdownMenuItem>
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>Log out</span>
                    </DropdownMenuItem>
                </button>
            </form>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
