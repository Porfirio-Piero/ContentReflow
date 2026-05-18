"use client";

import { useData } from "@/lib/data-context";
import { PLATFORMS, CONTENT_TYPES } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { TrendingUp, FileText, CheckCircle2, AlertTriangle, ArrowRight } from "lucide-react";

export default function DashboardPage() {
  const { contents, entries } = useData();

  // Stats
  const totalContent = contents.length;
  const totalRepurposed = entries.filter((e) => e.status === "done").length;
  const totalEntries = entries.length;
  const repurposingRate = totalContent > 0 ? Math.round((totalRepurposed / (totalContent * PLATFORMS.length)) * 100) : 0;

  // Untouched content (zero "done" entries)
  const untouched = contents.filter((c) => {
    const doneCount = entries.filter((e) => e.contentId === c.id && e.status === "done").length;
    return doneCount === 0;
  });

  // Neglected platforms
  const platformStats = PLATFORMS.map((p) => {
    const count = entries.filter((e) => e.platform === p.value && e.status === "done").length;
    const possible = contents.length;
    return { ...p, count, possible, pct: possible > 0 ? Math.round((count / possible) * 100) : 0 };
  }).sort((a, b) => a.count - b.count);

  const neglectedPlatforms = platformStats.filter((p) => p.count < totalContent * 0.3);

  // Most repurposed content
  const topContent = [...contents]
    .map((c) => ({
      ...c,
      doneCount: entries.filter((e) => e.contentId === c.id && e.status === "done").length,
    }))
    .sort((a, b) => b.doneCount - a.doneCount)
    .slice(0, 5);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground text-sm">Content repurposing overview</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-100">
                <FileText className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Content</p>
                <p className="text-2xl font-bold">{totalContent}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-100">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Repurposed</p>
                <p className="text-2xl font-bold">{totalRepurposed}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-purple-100">
                <TrendingUp className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Repurposing Rate</p>
                <p className="text-2xl font-bold">{repurposingRate}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-orange-100">
                <AlertTriangle className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Untouched</p>
                <p className="text-2xl font-bold">{untouched.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Platform Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Platform Coverage</CardTitle>
        </CardHeader>
        <CardContent>
          {totalContent === 0 ? (
            <p className="text-muted-foreground text-sm text-center py-4">
              Add content to see platform coverage stats.
            </p>
          ) : (
            <div className="space-y-3">
              {platformStats.map((p) => (
                <div key={p.value} className="flex items-center gap-3">
                  <span className="w-24 text-sm font-medium">
                    {p.icon} {p.label}
                  </span>
                  <div className="flex-1 bg-muted rounded-full h-4 overflow-hidden">
                    <div
                      className="bg-green-500 h-full rounded-full transition-all"
                      style={{ width: `${p.pct}%` }}
                    />
                  </div>
                  <span className="text-sm text-muted-foreground w-16 text-right">
                    {p.count}/{p.possible}
                  </span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Two columns: Untouched + Neglected */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Untouched Content */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-500" />
              Untouched Content
            </CardTitle>
          </CardHeader>
          <CardContent>
            {untouched.length === 0 ? (
              <p className="text-muted-foreground text-sm text-center py-4">
                {totalContent === 0 ? "No content yet." : "All content has been repurposed to at least one platform! 🎉"}
              </p>
            ) : (
              <div className="space-y-2">
                {untouched.slice(0, 10).map((c) => {
                  const typeInfo = CONTENT_TYPES.find((t) => t.value === c.type);
                  return (
                    <Link
                      key={c.id}
                      href={`/content/${c.id}`}
                      className="flex items-center gap-2 p-2 rounded-md hover:bg-muted/50 transition-colors group"
                    >
                      <span className="text-sm">{typeInfo?.icon}</span>
                      <span className="text-sm font-medium truncate flex-1">{c.title}</span>
                      <ArrowRight className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Link>
                  );
                })}
                {untouched.length > 10 && (
                  <p className="text-xs text-muted-foreground text-center pt-2">
                    +{untouched.length - 10} more untouched pieces
                  </p>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Neglected Platforms */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-purple-500" />
              Neglected Platforms
            </CardTitle>
          </CardHeader>
          <CardContent>
            {neglectedPlatforms.length === 0 ? (
              <p className="text-muted-foreground text-sm text-center py-4">
                {totalContent === 0 ? "No data yet." : "No neglected platforms! All platforms have good coverage. 🎉"}
              </p>
            ) : (
              <div className="space-y-3">
                {neglectedPlatforms.map((p) => (
                  <div key={p.value} className="flex items-center justify-between p-2 bg-orange-50 dark:bg-orange-950/20 rounded-md">
                    <span className="font-medium text-sm">
                      {p.icon} {p.label}
                    </span>
                    <div className="text-right">
                      <p className="text-sm font-semibold">{p.count}/{p.possible}</p>
                      <p className="text-xs text-muted-foreground">{p.pct}% coverage</p>
                    </div>
                  </div>
                ))}
                <p className="text-xs text-muted-foreground text-center pt-1">
                  Platforms with &lt;30% coverage are highlighted
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Top Repurposed Content */}
      {topContent.length > 0 && topContent[0].doneCount > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Most Repurposed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {topContent.map((c, i) => {
                const typeInfo = CONTENT_TYPES.find((t) => t.value === c.type);
                return (
                  <Link
                    key={c.id}
                    href={`/content/${c.id}`}
                    className="flex items-center gap-3 p-2 rounded-md hover:bg-muted/50 transition-colors"
                  >
                    <span className="text-sm font-bold text-muted-foreground w-6">#{i + 1}</span>
                    <span className="text-sm">{typeInfo?.icon}</span>
                    <span className="font-medium text-sm flex-1 truncate">{c.title}</span>
                    <Badge variant="secondary" className="text-xs">
                      {c.doneCount}/{PLATFORMS.length}
                    </Badge>
                  </Link>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Stats */}
      {totalContent === 0 && (
        <Card className="border-dashed">
          <CardContent className="py-12 text-center">
            <h3 className="text-lg font-semibold mb-2">Get Started</h3>
            <p className="text-muted-foreground text-sm mb-4">
              Add your first piece of content to start tracking repurposing.
            </p>
            <Link href="/inventory">
              <Button>
                <FileText className="mr-2 h-4 w-4" /> Go to Inventory
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  );
}