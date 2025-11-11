import type { Metadata } from "next";
import "./globals.css";
import packageJson from "../../package.json";

// Helper function to format version for display (14.0.0 → V14, 14.1.0 → V14.1)
function getVersionDisplay(version: string): string {
  const parts = version.split('.');
  const major = parts[0];
  const minor = parts[1];

  // If minor version is 0, show only major (14.0.0 → V14)
  // Otherwise show major.minor (14.1.0 → V14.1)
  if (minor === '0') {
    return `V${major}`;
  }
  return `V${major}.${minor}`;
}

const versionDisplay = getVersionDisplay(packageJson.version);

export const metadata: Metadata = {
  title: `Enterprise AI Support ${versionDisplay} - Demo | Multi-Persona Interface`,
  description: "Demo reference with mock data - Three personas: C-Level, CS Manager, Support Agent",
  keywords: ["support", "ticketing", "AI", "dashboard", "analytics", "demo", "multi-persona"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
      </head>
      <body className="h-screen overflow-hidden bg-background font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
