"use client";

import { useData } from "@/lib/data-context";
import { Content, PlatformEntry, PLATFORMS, CONTENT_TYPES, STATUS_CONFIG } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import {
  Plus,
  Search,
  ArrowUpDown,
  MoreHorizontal,
  Pencil,
  Trash2,
  ExternalLink,
  Filter,
} from "lucide-react";
import { useState, useMemo } from "react";
import Link from "next/link";

type SortKey = "date" | "title" | "completion";
type FilterType = "all" | Content["type"];
type FilterPlatform = "all" | string;
type FilterStatus = "all" | "untouched" | "in-progress" | "complete";

export default function InventoryPage() {
  const { contents, entries, addContent, updateContent, deleteContent, toggleEntryStatus } = useData();
  const [sortKey, setSortKey] = useState<SortKey>("date");
  const [filterType, setFilterType] = useState<FilterType>("all");
  const [filterPlatform, setFilterPlatform] = useState<FilterPlatform>("all");
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("all");
  const [search, setSearch] = useState("");
  const [addOpen, setAddOpen] = useState(false);
  const [editContent, setEditContent] = useState<Content | null>(null);

  const getCompletionPct = (contentId: string) => {
    const contentEntries = entries.filter((e) => e.contentId === contentId);
    const done = contentEntries.filter((e) => e.status === "done").length;
    return PLATFORMS.length > 0 ? Math.round((done / PLATFORMS.length) * 100) : 0;
  };

  const getStatusForPlatform = (contentId: string, platform: string) => {
    const entry = entries.find((e) => e.contentId === contentId && e.platform === platform);
    return entry?.status || null;
  };

  const filteredContents = useMemo(() => {
    let result = [...contents];

    if (search) {
      const s = search.toLowerCase();
      result = result.filter((c) => c.title.toLowerCase().includes(s) || c.notes?.toLowerCase().includes(s));
    }

    if (filterType !== "all") {
      result = result.filter((c) => c.type === filterType);
    }

    if (filterPlatform !== "all") {
      result = result.filter((c) =>
        entries.some((e) => e.contentId === c.id && e.platform === filterPlatform)
      );
    }

    if (filterStatus !== "all") {
      result = result.filter((c) => {
        const pct = getCompletionPct(c.id);
        if (filterStatus === "untouched") return pct === 0;
        if (filterStatus === "in-progress") return pct > 0 && pct < 100;
        if (filterStatus === "complete") return pct === 100;
        return true;
      });
    }

    result.sort((a, b) => {
      if (sortKey === "date") return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      if (sortKey === "title") return a.title.localeCompare(b.title);
      if (sortKey === "completion") return getCompletionPct(b.id) - getCompletionPct(a.id);
      return 0;
    });

    return result;
  }, [contents, entries, search, filterType, filterPlatform, filterStatus, sortKey]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Content Inventory</h1>
          <p className="text-muted-foreground text-sm">{contents.length} pieces of content tracked</p>
        </div>
        <Dialog open={addOpen} onOpenChange={setAddOpen}>
          <DialogTrigger>
            <Button onClick={() => setAddOpen(true)}>
              <Plus className="mr-2 h-4 w-4" /> Add Content
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Content</DialogTitle>
            </DialogHeader>
            <ContentForm
              onSubmit={(data) => {
                addContent(data);
                setAddOpen(false);
              }}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search content..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={filterType} onValueChange={(v) => v && setFilterType(v as FilterType)}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            {CONTENT_TYPES.map((t) => (
              <SelectItem key={t.value} value={t.value}>
                {t.icon} {t.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={filterPlatform} onValueChange={(v) => v && setFilterPlatform(v)}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Platform" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Platforms</SelectItem>
            {PLATFORMS.map((p) => (
              <SelectItem key={p.value} value={p.value}>
                {p.icon} {p.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={filterStatus} onValueChange={(v) => v && setFilterStatus(v as FilterStatus)}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="untouched">Untouched</SelectItem>
            <SelectItem value="in-progress">In Progress</SelectItem>
            <SelectItem value="complete">Complete</SelectItem>
          </SelectContent>
        </Select>
        <Button
          variant="outline"
          size="icon"
          onClick={() => {
            const next: Record<SortKey, SortKey> = { date: "title", title: "completion", completion: "date" };
            setSortKey(next[sortKey]);
          }}
        >
          <ArrowUpDown className="h-4 w-4" />
        </Button>
      </div>

      {/* Status Matrix */}
      <div className="overflow-x-auto">
        <div className="min-w-[700px]">
          {/* Header */}
          <div className="grid grid-cols-[1fr_repeat(6,80px)_80px_40px] gap-1 px-3 py-2 text-xs font-medium text-muted-foreground border-b">
            <div>Content</div>
            {PLATFORMS.map((p) => (
              <div key={p.value} className="text-center">
                {p.icon}
              </div>
            ))}
            <div className="text-center">%</div>
            <div></div>
          </div>

          {/* Rows */}
          {filteredContents.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              {contents.length === 0
                ? "No content yet. Click 'Add Content' to get started!"
                : "No content matches your filters."}
            </div>
          ) : (
            filteredContents.map((content) => {
              const pct = getCompletionPct(content.id);
              const typeInfo = CONTENT_TYPES.find((t) => t.value === content.type);
              return (
                <div
                  key={content.id}
                  className="grid grid-cols-[1fr_repeat(6,80px)_80px_40px] gap-1 px-3 py-2 items-center hover:bg-muted/50 rounded-md transition-colors"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <Link
                      href={`/content/${content.id}`}
                      className="font-medium hover:underline truncate"
                    >
                      {content.title}
                    </Link>
                    <Badge variant="outline" className="text-xs shrink-0">
                      {typeInfo?.icon} {typeInfo?.label}
                    </Badge>
                  </div>

                  {PLATFORMS.map((p) => {
                    const status = getStatusForPlatform(content.id, p.value);
                    const config = status ? STATUS_CONFIG[status] : null;
                    return (
                      <Tooltip key={p.value}>
                        <TooltipTrigger>
                          <button
                            onClick={() => toggleEntryStatus(content.id, p.value)}
                            className={`w-16 h-8 rounded-md border text-xs font-medium transition-all hover:scale-105 ${
                              config
                                ? `${config.bg} ${config.color} border-current/20`
                                : "bg-muted/30 border-muted text-muted-foreground hover:bg-muted/50"
                            }`}
                          >
                            {config?.label || "—"}
                          </button>
                        </TooltipTrigger>
                        <TooltipContent>
                          {p.label}: {config?.label || "Not started"} (click to cycle)
                        </TooltipContent>
                      </Tooltip>
                    );
                  })}

                  <div className="text-center text-sm font-medium">
                    <span className={pct === 100 ? "text-green-600" : pct > 0 ? "text-yellow-600" : "text-muted-foreground"}>
                      {pct}%
                    </span>
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Link href={`/content/${content.id}`} className="flex items-center w-full">
                          <ExternalLink className="mr-2 h-4 w-4" /> View Details
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => setEditContent(content)}
                      >
                        <Pencil className="mr-2 h-4 w-4" /> Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-destructive"
                        onClick={() => deleteContent(content.id)}
                      >
                        <Trash2 className="mr-2 h-4 w-4" /> Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Edit Dialog */}
      <Dialog open={!!editContent} onOpenChange={(open) => !open && setEditContent(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Content</DialogTitle>
          </DialogHeader>
          {editContent && (
            <ContentForm
              initial={editContent}
              onSubmit={(data) => {
                updateContent(editContent.id, data);
                setEditContent(null);
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function ContentForm({
  initial,
  onSubmit,
}: {
  initial?: Content;
  onSubmit: (data: Omit<Content, "id" | "createdAt">) => void;
}) {
  const [title, setTitle] = useState(initial?.title || "");
  const [type, setType] = useState<Content["type"]>(initial?.type || "blog");
  const [originalUrl, setOriginalUrl] = useState(initial?.originalUrl || "");
  const [notes, setNotes] = useState(initial?.notes || "");

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit({ title, type, originalUrl: originalUrl || undefined, notes: notes || undefined });
      }}
      className="space-y-4"
    >
      <div className="space-y-2">
        <label className="text-sm font-medium">Title *</label>
        <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="My Blog Post" required />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">Type *</label>
        <Select value={type} onValueChange={(v) => v && setType(v as Content["type"])}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {CONTENT_TYPES.map((t) => (
              <SelectItem key={t.value} value={t.value}>
                {t.icon} {t.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">Original URL</label>
        <Input
          value={originalUrl}
          onChange={(e) => setOriginalUrl(e.target.value)}
          placeholder="https://..."
          type="url"
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">Notes</label>
        <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Optional notes..." />
      </div>
      <Button type="submit" className="w-full">
        {initial ? "Save Changes" : "Add Content"}
      </Button>
    </form>
  );
}