"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  ArrowDownCircle,
  Heart,
  Users,
  Wallet,
  Calculator,
  FileText,
  UserCog,
  LogOut,
  Church,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
} from "lucide-react";

const menuItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Pemasukan & Pengeluaran", href: "/transaksi", icon: ArrowDownCircle },
  { name: "Persepuluhan & Persembahan", href: "/persembahan", icon: Heart },
  { name: "Kas", href: "/kas", icon: Wallet },
  { name: "Anggaran", href: "/anggaran", icon: Calculator },
  { name: "Laporan", href: "/laporan", icon: FileText },
];

const adminMenuItems = [
  { name: "Manajemen Pengguna", href: "/pengguna", icon: UserCog },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const isAdmin = (session?.user as any)?.role === "KETUA";

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setMobileOpen(false);
      } else {
        setCollapsed(false);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const SidebarContent = (
    <div
      className={`flex flex-col h-full bg-white border-r border-gray-200 transition-all duration-300 ${
        collapsed ? "w-20" : "w-64"
      }`}
    >
      <div className="flex items-center px-2 py-3 sm:py-4 border-b border-gray-200 relative h-[72px]">
        {collapsed && !mobileOpen ? (
          <div className="hidden lg:flex w-full h-full items-center justify-center relative">
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="flex items-center justify-center w-full h-full"
              title="Buka Menu"
            >
              <Church className="h-8 w-8 text-indigo-600" />
            </button>
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="absolute -right-3 top-1/2 -translate-y-1/2 p-1 rounded-full bg-white border border-gray-200 shadow-sm hover:bg-gray-50 transition"
              title="Buka Menu"
            >
              <ChevronRight className="h-4 w-4 text-gray-600" />
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center overflow-hidden min-w-0">
              <Church className="h-8 w-8 text-indigo-600 flex-shrink-0" />
              <span className="ml-2 text-lg sm:text-xl font-bold text-gray-900 whitespace-nowrap truncate">
                Hofalo
              </span>
            </div>
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="hidden lg:flex p-1.5 rounded-lg hover:bg-gray-100 transition flex-shrink-0"
              title="Tutup Menu"
            >
              <ChevronLeft className="h-5 w-5 text-gray-600" />
            </button>
            <button
              onClick={() => setMobileOpen(false)}
              className="lg:hidden p-1.5 rounded-lg hover:bg-gray-100 transition flex-shrink-0"
            >
              <X className="h-5 w-5 text-gray-600" />
            </button>
          </div>
        )}
        <button
          onClick={() => setMobileOpen(false)}
          className="lg:hidden p-1.5 rounded-lg hover:bg-gray-100 transition flex-shrink-0"
        >
          <X className="h-5 w-5 text-gray-600" />
        </button>
      </div>

      <nav className="flex-1 px-2 py-3 sm:py-4 space-y-1 overflow-y-auto overflow-x-hidden">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.name}
              href={item.href}
              title={collapsed && !mobileOpen ? item.name : ""}
              className={`flex items-center px-2.5 sm:px-3 py-2 text-sm font-medium rounded-lg transition ${
                isActive
                  ? "bg-indigo-50 text-indigo-700"
                  : "text-gray-700 hover:bg-gray-50"
              } ${collapsed && !mobileOpen ? "justify-center" : ""}`}
            >
              <Icon className="h-5 w-5 flex-shrink-0" />
              {!(collapsed && !mobileOpen) && <span className="ml-3 whitespace-nowrap truncate">{item.name}</span>}
            </Link>
          );
        })}

        {isAdmin && (
          <>
            {!(collapsed && !mobileOpen) && (
              <div className="pt-4 mt-4 border-t border-gray-200">
                <p className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Administrasi
                </p>
              </div>
            )}
            {(collapsed && !mobileOpen) && <div className="pt-4 mt-4 border-t border-gray-200 mx-2" />}
            {adminMenuItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  title={collapsed && !mobileOpen ? item.name : ""}
                  className={`flex items-center px-2.5 sm:px-3 py-2 text-sm font-medium rounded-lg transition ${
                    isActive
                      ? "bg-indigo-50 text-indigo-700"
                      : "text-gray-700 hover:bg-gray-50"
                  } ${collapsed && !mobileOpen ? "justify-center" : ""}`}
                >
                  <Icon className="h-5 w-5 flex-shrink-0" />
                  {!(collapsed && !mobileOpen) && <span className="ml-3 whitespace-nowrap truncate">{item.name}</span>}
                </Link>
              );
            })}
          </>
        )}
      </nav>

      <div className="border-t border-gray-200 p-2">
        {!(collapsed && !mobileOpen) && (
          <div className="flex items-center mb-2 px-2">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {session?.user?.name}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {(session?.user as any)?.role}
              </p>
            </div>
          </div>
        )}
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          title={collapsed && !mobileOpen ? "Keluar" : ""}
          className={`flex items-center w-full px-2.5 sm:px-3 py-2 text-sm font-medium text-red-700 rounded-lg hover:bg-red-50 transition ${
            collapsed && !mobileOpen ? "justify-center" : ""
          }`}
        >
          <LogOut className="h-5 w-5 flex-shrink-0" />
          {!(collapsed && !mobileOpen) && <span className="ml-3">Keluar</span>}
        </button>
      </div>
    </div>
  );

  return (
    <>
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-40 p-2 rounded-lg bg-white shadow border border-gray-200"
      >
        <Menu className="h-5 w-5 text-gray-700" />
      </button>

      <div className="hidden lg:block h-full flex-shrink-0">{SidebarContent}</div>

      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute left-0 top-0 h-full">{SidebarContent}</div>
        </div>
      )}
    </>
  );
}
