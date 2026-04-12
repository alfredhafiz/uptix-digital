"use client";

import Link from "next/link";
import { useState, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSession, signOut } from "next-auth/react";
import {
  Menu,
  X,
  Code2,
  Terminal,
  User,
  LogOut,
  LayoutDashboard,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { throttle } from "@/lib/performance-utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/projects", label: "Projects" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const sessionData = useSession();
  const { data: session, status } = sessionData || {};
  const isLoading = status === "loading";
  const isAuthenticated = !!session?.user;
  const isAdmin = session?.user?.role === "ADMIN";

  // Throttled scroll handler
  const handleScroll = useCallback(() => {
    setScrolled(window.scrollY > 50);
  }, []);

  const throttledScroll = useMemo(
    () => throttle(handleScroll, 100),
    [handleScroll],
  );

  useEffect(() => {
    window.addEventListener("scroll", throttledScroll, { passive: true });
    return () => window.removeEventListener("scroll", throttledScroll);
  }, [throttledScroll]);

  const avatarUrl = useMemo(() => {
    if (session?.user?.image) return session.user.image;
    const name = session?.user?.name || session?.user?.email || "User";
    return `https://api.dicebear.com/7.x/avataaars/png?seed=${encodeURIComponent(name)}&backgroundColor=b6e3f4`;
  }, [session]);

  const userInitials = useMemo(() => {
    const name = session?.user?.name || session?.user?.email || "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  }, [session]);

  const dashboardLink = isAdmin ? "/admin/dashboard" : "/client/dashboard";

  const accountLabel = isAdmin ? "Admin Dashboard" : "My Account";

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "glass-strong" : "bg-transparent"
      }`}
    >
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 group">
            <motion.div
              whileHover={{ rotate: 180 }}
              transition={{ duration: 0.3 }}
              className="relative"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg blur-lg opacity-50 group-hover:opacity-100 transition-opacity" />
              <div className="relative bg-slate-900 rounded-lg p-2 border border-white/10">
                <Code2 className="w-6 h-6 text-blue-400" />
              </div>
            </motion.div>
            <span className="text-xl font-bold gradient-text">
              Uptix<span className="text-white">.digital</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link, index) => (
              <Link
                key={link.href}
                href={link.href}
                className="relative text-sm text-slate-300 hover:text-white transition-colors group"
              >
                <span className="font-mono text-blue-400/50 mr-1">
                  0{index + 1}.
                </span>
                {link.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 group-hover:w-full transition-all duration-300" />
              </Link>
            ))}
          </div>

          {/* CTA Buttons - Dynamic based on auth state */}
          <div className="hidden md:flex items-center space-x-4">
            {isLoading ? (
              <div className="w-8 h-8 rounded-full bg-slate-800 border border-white/10 animate-pulse" />
            ) : isAuthenticated ? (
              <>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="relative h-10 w-10 rounded-full"
                    >
                      <Avatar className="h-10 w-10 border-2 border-white/10">
                        <AvatarImage
                          src={avatarUrl}
                          alt={session?.user?.name || ""}
                        />
                        <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                          {userInitials}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    className="w-56 glass-card border-white/10"
                    align="end"
                    forceMount
                  >
                    <div className="flex items-center justify-start gap-2 p-2">
                      <div className="flex flex-col space-y-1 leading-none">
                        {session?.user?.name && (
                          <p className="font-medium text-white">
                            {session.user.name}
                          </p>
                        )}
                        <p className="w-[200px] truncate text-sm text-slate-400">
                          {session?.user?.email}
                        </p>
                        {isAdmin && (
                          <span className="text-xs text-purple-400 font-medium">
                            Administrator
                          </span>
                        )}
                      </div>
                    </div>
                    <DropdownMenuSeparator className="bg-white/10" />
                    <DropdownMenuItem
                      asChild
                      className="cursor-pointer focus:bg-white/5"
                    >
                      <Link href={dashboardLink} className="flex items-center">
                        <LayoutDashboard className="mr-2 h-4 w-4" />
                        {accountLabel}
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      asChild
                      className="cursor-pointer focus:bg-white/5"
                    >
                      <Link
                        href="/client/settings"
                        className="flex items-center"
                      >
                        <User className="mr-2 h-4 w-4" />
                        Settings
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-white/10" />
                    <DropdownMenuItem
                      className="cursor-pointer text-red-400 focus:text-red-400 focus:bg-red-500/10"
                      onClick={() => signOut({ callbackUrl: "/" })}
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Log out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <Link href="/contact">
                  <Button className="btn-glow bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white border-0">
                    <Terminal className="w-4 h-4 mr-2" />
                    Start Project
                  </Button>
                </Link>
              </>
            ) : (
              <>
                <Link href="/auth/login">
                  <Button
                    variant="ghost"
                    className="text-slate-300 hover:text-white"
                  >
                    Sign In
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button className="btn-glow bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white border-0">
                    <Terminal className="w-4 h-4 mr-2" />
                    Start Project
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden relative z-50 p-2"
          >
            <motion.div
              animate={{ rotate: isOpen ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              {isOpen ? (
                <X className="w-6 h-6 text-white" />
              ) : (
                <Menu className="w-6 h-6 text-white" />
              )}
            </motion.div>
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="md:hidden fixed inset-0 top-20 glass-strong"
          >
            <div className="flex flex-col items-center justify-center h-full space-y-8">
              {navLinks.map((link, index) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className="text-2xl font-mono text-slate-300 hover:text-white transition-colors"
                  >
                    <span className="text-blue-400">0{index + 1}.</span>{" "}
                    {link.label}
                  </Link>
                </motion.div>
              ))}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="pt-8 space-y-4"
              >
                {isAuthenticated ? (
                  <>
                    <Link href={dashboardLink} onClick={() => setIsOpen(false)}>
                      <Button variant="outline" className="w-full glass-card">
                        <LayoutDashboard className="w-4 h-4 mr-2" />
                        {accountLabel}
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      className="w-full glass-card text-red-400"
                      onClick={() => {
                        signOut({ callbackUrl: "/" });
                        setIsOpen(false);
                      }}
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Log out
                    </Button>
                  </>
                ) : (
                  <>
                    <Link href="/auth/login" onClick={() => setIsOpen(false)}>
                      <Button variant="outline" className="w-full glass-card">
                        Sign In
                      </Button>
                    </Link>
                    <Link href="/contact" onClick={() => setIsOpen(false)}>
                      <Button className="w-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500">
                        <Terminal className="w-4 h-4 mr-2" />
                        Start Project
                      </Button>
                    </Link>
                  </>
                )}
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
