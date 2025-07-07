"use client";

import {
  Home,
  NotebookPen,
  Newspaper,
  Settings,
  UserRoundPlus,
  LogIn,
  PenSquare,
  LayoutDashboard,
} from "lucide-react";
import { IconSignRight } from "@tabler/icons-react";
import { IoMdClose } from "react-icons/io";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

const menuItems = [
  {
    title: "Home",
    url: "/",
    icon: Home,
  },
  {
    title: "Blogs",
    url: "/blogs",
    icon: Newspaper,
  },
  {
    title: "Create Blog",
    url: "/blogs/create",
    icon: PenSquare,
  },{
    title: "Create Category",
    url: "/blogs/category/create",
    icon: PenSquare,
  },
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
  },
];

const userItems = [
  {
    title: "Login",
    url: "/login",
    icon: LogIn,
  },
  {
    title: "Signup",
    url: "/signup",
    icon: UserRoundPlus,
  },
];

const utilityItems = [
  {
    title: "Settings",
    url: "/settings",
    icon: Settings,
  },
];

export function AppSidebar() {
  const { toggleSidebar } = useSidebar();

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          {/* Mobile Close Button */}
          <div className="absolute top-0 right-0 p-3 md:hidden">
            <button onClick={() => toggleSidebar()}>
              <IoMdClose size={24} />
            </button>
          </div>

          <SidebarGroupLabel className="pt-6">
            🧠 Utsab's Blog App
          </SidebarGroupLabel>

          {/* Main Navigation */}
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url} className="flex items-center gap-2">
                      <item.icon size={18} />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>

          {/* User Navigation */}
          <SidebarGroupLabel>👤 Account</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {userItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url} className="flex items-center gap-2">
                      <item.icon size={18} />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>

          {/* Settings */}
          <SidebarGroupLabel>⚙️ More</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {utilityItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url} className="flex items-center gap-2">
                      <item.icon size={18} />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
