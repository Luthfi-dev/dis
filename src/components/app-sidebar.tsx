'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
} from '@/components/ui/sidebar';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { Button } from '@/components/ui/button';
import { BookCopy, GraduationCap, Plus, Users, Settings, LogOut, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';


const subMenuItems = [
  { href: '/siswa', label: 'Lihat Daftar Siswa', icon: Users },
  { href: '/siswa/tambah', label: 'Tambah Data Siswa', icon: Plus },
];

export function AppSidebar() {
  const pathname = usePathname();
  const [isBukuIndukOpen, setIsBukuIndukOpen] = useState(pathname.startsWith('/siswa'));

  return (
    <Sidebar collapsible="icon" variant="sidebar">
      <SidebarHeader>
        <Link href="/siswa" className="flex items-center gap-2.5">
          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10 shrink-0 rounded-full group-data-[collapsible=icon]:h-8 group-data-[collapsible=icon]:w-8 text-primary"
          >
            <GraduationCap className="h-6 w-6" />
          </Button>
          <span className="text-lg font-semibold group-data-[collapsible=icon]:hidden">
            EduArchive
          </span>
        </Link>
      </SidebarHeader>
      <SidebarContent className="p-2">
        <Collapsible open={isBukuIndukOpen} onOpenChange={setIsBukuIndukOpen} className="w-full">
          <CollapsibleTrigger asChild>
            <SidebarMenuButton
              className="w-full justify-between"
              isActive={pathname.startsWith('/siswa')}
              tooltip={{
                children: 'Buku Induk Siswa',
                className: 'group-data-[collapsible=icon]:flex hidden',
              }}
            >
              <div className="flex items-center gap-2">
                <BookCopy />
                <span>Buku Induk Siswa</span>
              </div>
              <ChevronsUpDown className="h-4 w-4 shrink-0 group-data-[collapsible=icon]:hidden" />
            </SidebarMenuButton>
          </CollapsibleTrigger>
          <CollapsibleContent className="group-data-[collapsible=icon]:hidden">
            <SidebarMenu className="ml-4 mt-1 space-y-1 border-l py-1 pl-4">
              {subMenuItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <Link href={item.href} className="w-full">
                    <SidebarMenuButton
                      variant="ghost"
                      size="sm"
                      isActive={pathname === item.href}
                      className={cn(
                        'w-full justify-start',
                        pathname === item.href && 'bg-primary/10 text-primary hover:bg-primary/20 hover:text-primary'
                      )}
                    >
                      <item.icon className="mr-2 h-4 w-4" />
                      {item.label}
                    </SidebarMenuButton>
                  </Link>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </CollapsibleContent>
        </Collapsible>
      </SidebarContent>
      <SidebarFooter className="p-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton tooltip="Settings">
              <Settings />
              <span>Settings</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton tooltip="Logout">
              <LogOut />
              <span>Logout</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
