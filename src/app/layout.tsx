import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/components/auth-provider";
import { CursorInitializer } from "@/components/cursor-initializer";
import { PageTracker } from "@/components/page-tracker";
import { CustomScripts } from "@/components/custom-scripts";
import { Navbar } from "@/components/shared/navbar";
import { Footer } from "@/components/shared/footer";
import { prisma } from "@/lib/prisma";

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-jetbrains-mono",
});

// Fetch dynamic settings for metadata (favicon, site name etc.)
async function getSiteSettings() {
  try {
    const settings = await prisma.settings.findMany({
      where: {
        key: { in: ["siteName", "siteDescription", "favicon", "logo"] },
      },
    });
    const map: Record<string, string> = {};
    settings.forEach((s) => {
      map[s.key] = s.value;
    });
    return map;
  } catch {
    return {};
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();

  const siteName = settings.siteName || "Uptix Digital";
  const siteDesc =
    settings.siteDescription || "Premium Web & App Development Agency";
  const faviconUrl = settings.favicon || "/favicon.ico";

  return {
    title: `${siteName} | Premium Web & App Development Agency`,
    description: `${siteName} - ${siteDesc}`,
    keywords:
      "web development, app development, digital agency, API development, Python applications, performance optimization, Uptix Digital",
    authors: [{ name: siteName }],
    icons: {
      icon: faviconUrl,
      shortcut: faviconUrl,
      apple: faviconUrl,
    },
    openGraph: {
      title: `${siteName} | Premium Web & App Development Agency`,
      description: `Transform your digital presence with ${siteName}. We build high-performance web applications, mobile apps, and custom software solutions.`,
      url: "https://uptixdigital.com",
      siteName: siteName,
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${siteName} | Premium Web & App Development Agency`,
      description: `Transform your digital presence with ${siteName}. We build high-performance web applications, mobile apps, and custom software solutions.`,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      data-scroll-behavior="smooth"
      className={jetbrainsMono.variable}
    >
      <body className="antialiased font-mono">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          <AuthProvider>
            <CursorInitializer />
            <PageTracker />
            <CustomScripts />
            <div className="relative min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
              {/* Background Effects */}
              <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-[40%] -left-[20%] w-[80%] h-[80%] rounded-full bg-blue-500/10 blur-[120px]" />
                <div className="absolute -bottom-[40%] -right-[20%] w-[80%] h-[80%] rounded-full bg-purple-500/10 blur-[120px]" />
                <div className="absolute top-[20%] right-[10%] w-[40%] h-[40%] rounded-full bg-pink-500/5 blur-[100px]" />
              </div>

              {/* Grid Pattern */}
              <div
                className="fixed inset-0 opacity-[0.02]"
                style={{
                  backgroundImage: `linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)`,
                  backgroundSize: "50px 50px",
                }}
              />

              <Navbar />
              <main className="relative z-10">{children}</main>
              <Footer />
              <SpeedInsights />
            </div>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
