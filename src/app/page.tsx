"use client";

import { useData } from "@/lib/data-context";
import { PLATFORMS, CONTENT_TYPES } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { BarChart3, List, CheckCircle2, ArrowRight, FileText, TrendingUp } from "lucide-react";

export default function Home() {
  const { contents, entries } = useData();

  const totalContent = contents.length;
  const totalRepurposed = entries.filter((e) => e.status === "done").length;
  const repurposingRate = totalContent > 0 ? Math.round((totalRepurposed / (totalContent * PLATFORMS.length)) * 100) : 0;
  const untouched = contents.filter((c) => {
    return entries.filter((e) => e.contentId === c.id && e.status === "done").length === 0;
  }).length;

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 py-12">
      {/* Hero */}
      <div className="text-center max-w-2xl mx-auto mb-12">
        <div className="text-5xl mb-4">🔄</div>
        <h1 className="text-4xl font-bold tracking-tight mb-4">
          ContentReflow
        </h1>
        <p className="text-xl text-muted-foreground mb-2">
          Know where every piece of content has been
        </p>
        <p className="text-muted-foreground">
          Track content repurposing across platforms. See what&apos;s been done, what&apos;s planned, and what&apos;s untouched.
        </p>
      </div>

      {/* Quick Stats */}
      {totalContent > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-12 w-full max-w-2xl">
          <Card>
            <CardContent className="pt-4 pb-4 text-center">
              <FileText className="h-5 w-5 text-blue-500 mx-auto mb-1" />
              <p className="text-2xl font-bold">{totalContent}</p>
              <p className="text-xs text-muted-foreground">Content</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 pb-4 text-center">
              <CheckCircle2 className="h-5 w-5 text-green-500 mx-auto mb-1" />
              <p className="text-2xl font-bold">{totalRepurposed}</p>
              <p className="text-xs text-muted-foreground">Repurposed</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 pb-4 text-center">
              <TrendingUp className="h-5 w-5 text-purple-500 mx-auto mb-1" />
              <p className="text-2xl font-bold">{repurposingRate}%</p>
              <p className="text-xs text-muted-foreground">Rate</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 pb-4 text-center">
              <BarChart3 className="h-5 w-5 text-orange-500 mx-auto mb-1" />
              <p className="text-2xl font-bold">{untouched}</p>
              <p className="text-xs text-muted-foreground">Untouched</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* CTA Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 mb-12">
        <Link href="/inventory">
          <Button size="lg" className="w-full sm:w-auto">
            <List className="mr-2 h-5 w-5" />
            {totalContent > 0 ? "View Inventory" : "Get Started"}
          </Button>
        </Link>
        {totalContent > 0 && (
          <Link href="/dashboard">
            <Button size="lg" variant="outline" className="w-full sm:w-auto">
              <BarChart3 className="mr-2 h-5 w-5" />
              Dashboard
            </Button>
          </Link>
        )}
      </div>

      {/* Features */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full max-w-3xl">
        <Card className="text-center p-6">
          <List className="h-8 w-8 text-blue-500 mx-auto mb-3" />
          <h3 className="font-semibold mb-2">Status Matrix</h3>
          <p className="text-sm text-muted-foreground">
            See all content and platform status at a glance. Click to toggle done/planned/skipped.
          </p>
        </Card>
        <Card className="text-center p-6">
          <CheckCircle2 className="h-8 w-8 text-green-500 mx-auto mb-3" />
          <h3 className="font-semibold mb-2">Detail Tracking</h3>
          <p className="text-sm text-muted-foreground">
            Per-platform entries with status, URLs, and notes for every repurposed piece.
          </p>
        </Card>
        <Card className="text-center p-6">
          <TrendingUp className="h-8 w-8 text-purple-500 mx-auto mb-3" />
          <h3 className="font-semibold mb-2">Gap Analysis</h3>
          <p className="text-sm text-muted-foreground">
            Find untouched content and neglected platforms. Never miss a repurposing opportunity.
          </p>
        </Card>
      </div>

      {/* Platforms */}
      <div className="mt-8 text-center">
        <p className="text-sm text-muted-foreground mb-2">Supported platforms:</p>
        <div className="flex flex-wrap justify-center gap-3">
          {PLATFORMS.map((p) => (
            <span key={p.value} className="px-3 py-1 bg-muted rounded-full text-sm">
              {p.icon} {p.label}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}