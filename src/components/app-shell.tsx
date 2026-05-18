"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, List, Download, Upload } from "lucide-react";
import { useData } from "@/lib/data-context";
import { Button } from "@/components/ui/button";
import { useRef } from "react";

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { exportData, importData } = useData();
  const fileRef = useRef<HTMLInputElement>(null);

  const handleExport = () => {
    const data = exportData();
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `contentreflow-export-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = () => {
    fileRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target?.result as string;
      const success = importData(text);
      if (success) {
        alert("Data imported successfully!");
      } else {
        alert("Failed to import data. Please check the JSON format.");
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  const navItems = [
    { href: "/dashboard", label: "Dashboard", icon: BarChart3 },
    { href: "/inventory", label: "Inventory", icon: List },
  ];

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-14 items-center px-4">
          <Link href="/dashboard" className="font-bold text-lg mr-8">
            🔄 ContentReflow
          </Link>
          <nav className="flex items-center gap-1 flex-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    active
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleImport}>
              <Upload className="mr-1 h-3 w-3" /> Import
            </Button>
            <Button variant="outline" size="sm" onClick={handleExport}>
              <Download className="mr-1 h-3 w-3" /> Export
            </Button>
            <input
              ref={fileRef}
              type="file"
              accept=".json"
              className="hidden"
              onChange={handleFileChange}
            />
          </div>
        </div>
      </header>
      <main className="container mx-auto px-4 py-6">{children}</main>
    </div>
  );
}