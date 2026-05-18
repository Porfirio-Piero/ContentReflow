"use client";

import { useData } from "@/lib/data-context";
import { useParams, useRouter } from "next/navigation";
import { PLATFORMS, CONTENT_TYPES, STATUS_CONFIG, PlatformType } from "@/types";
import { Content, PlatformEntry } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
import { ArrowLeft, Plus, ExternalLink, Pencil, Trash2, CheckCircle2, Circle, MinusCircle } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function ContentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { contents, entries, getContentById, getEntriesForContent, addEntry, updateEntry, deleteEntry, updateContent } = useData();
  const [addEntryOpen, setAddEntryOpen] = useState(false);
  const [editEntry, setEditEntry] = useState<PlatformEntry | null>(null);

  const contentId = params.id as string;
  const content = getContentById(contentId);
  const contentEntries = getEntriesForContent(contentId);

  if (!content) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Content not found.</p>
        <Button variant="outline" className="mt-4" onClick={() => router.push("/inventory")}>
          Back to Inventory
        </Button>
      </div>
    );
  }

  const typeInfo = CONTENT_TYPES.find((t) => t.value === content.type);
  const doneCount = contentEntries.filter((e) => e.status === "done").length;
  const completionPct = PLATFORMS.length > 0 ? Math.round((doneCount / PLATFORMS.length) * 100) : 0;

  // Platforms without entries
  const usedPlatforms = new Set(contentEntries.map((e) => e.platform));
  const availablePlatforms = PLATFORMS.filter((p) => !usedPlatforms.has(p.value));

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/inventory">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight truncate">{content.title}</h1>
            <Badge variant="outline">{typeInfo?.icon} {typeInfo?.label}</Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            {doneCount}/{PLATFORMS.length} platforms · {completionPct}% complete · Added {new Date(content.createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>

      {/* Original Link */}
      {content.originalUrl && (
        <Card>
          <CardContent className="py-3 flex items-center gap-2">
            <ExternalLink className="h-4 w-4 text-muted-foreground" />
            <a
              href={content.originalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline text-sm truncate"
            >
              {content.originalUrl}
            </a>
          </CardContent>
        </Card>
      )}

      {/* Notes */}
      {content.notes && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground whitespace-pre-wrap">{content.notes}</p>
          </CardContent>
        </Card>
      )}

      {/* Platform Entries */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Repurposing Status</h2>
          {availablePlatforms.length > 0 && (
            <Dialog open={addEntryOpen} onOpenChange={setAddEntryOpen}>
              <DialogTrigger>
                <Button size="sm" onClick={() => setAddEntryOpen(true)}>
                  <Plus className="mr-1 h-4 w-4" /> Add Platform
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Add Platform Entry</DialogTitle>
                </DialogHeader>
                <EntryForm
                  contentId={contentId}
                  availablePlatforms={availablePlatforms}
                  onSubmit={(data) => {
                    addEntry(data);
                    setAddEntryOpen(false);
                  }}
                />
              </DialogContent>
            </Dialog>
          )}
        </div>

        {contentEntries.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="py-8 text-center text-muted-foreground">
              No platforms tracked yet. Click &quot;Add Platform&quot; to start tracking repurposing status.
            </CardContent>
          </Card>
        ) : (
          contentEntries.map((entry) => {
            const platformInfo = PLATFORMS.find((p) => p.value === entry.platform);
            const statusConfig = STATUS_CONFIG[entry.status];
            return (
              <Card key={entry.id} className="group">
                <CardContent className="py-3">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5">
                      {entry.status === "done" ? (
                        <CheckCircle2 className="h-5 w-5 text-green-600" />
                      ) : entry.status === "planned" ? (
                        <Circle className="h-5 w-5 text-yellow-600" />
                      ) : (
                        <MinusCircle className="h-5 w-5 text-gray-400" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{platformInfo?.icon} {platformInfo?.label || entry.platform}</span>
                        <Badge className={`${statusConfig.bg} ${statusConfig.color} text-xs`}>
                          {statusConfig.label}
                        </Badge>
                      </div>
                      {entry.url && (
                        <a
                          href={entry.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline text-sm block mt-1 truncate"
                        >
                          {entry.url}
                        </a>
                      )}
                      {entry.notes && (
                        <p className="text-sm text-muted-foreground mt-1">{entry.notes}</p>
                      )}
                      <p className="text-xs text-muted-foreground mt-1">
                        Updated {new Date(entry.updatedAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setEditEntry(entry)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive"
                        onClick={() => deleteEntry(entry.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

      {/* Edit Entry Dialog */}
      <Dialog open={!!editEntry} onOpenChange={(open) => !open && setEditEntry(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Platform Entry</DialogTitle>
          </DialogHeader>
          {editEntry && (
            <EntryForm
              contentId={contentId}
              initial={editEntry}
              availablePlatforms={PLATFORMS}
              onSubmit={(data) => {
                updateEntry(editEntry.id, data);
                setEditEntry(null);
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function EntryForm({
  contentId,
  initial,
  availablePlatforms,
  onSubmit,
}: {
  contentId: string;
  initial?: PlatformEntry;
  availablePlatforms: { value: string; label: string; icon: string }[];
  onSubmit: (data: Omit<PlatformEntry, "id" | "updatedAt">) => void;
}) {
  const [platform, setPlatform] = useState(initial?.platform || availablePlatforms[0]?.value || "twitter");
  const [status, setStatus] = useState<PlatformEntry["status"]>(initial?.status || "planned");
  const [url, setUrl] = useState(initial?.url || "");
  const [notes, setNotes] = useState(initial?.notes || "");

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit({
          contentId,
          platform: platform as PlatformType,
          status,
          url: url || undefined,
          notes: notes || undefined,
        });
      }}
      className="space-y-4"
    >
      {!initial && (
        <div className="space-y-2">
          <label className="text-sm font-medium">Platform *</label>
          <Select value={platform} onValueChange={(v) => v && setPlatform(v)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {availablePlatforms.map((p) => (
                <SelectItem key={p.value} value={p.value}>
                  {p.icon} {p.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
      <div className="space-y-2">
        <label className="text-sm font-medium">Status *</label>
        <Select value={status} onValueChange={(v) => v && setStatus(v as PlatformEntry["status"])}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="done">✅ Done</SelectItem>
            <SelectItem value="planned">🟡 Planned</SelectItem>
            <SelectItem value="skipped">⏭️ Skipped</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">URL</label>
        <Input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://..." type="url" />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">Notes</label>
        <Textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="E.g., 'Condensed to 3 tweets', 'Turned into LinkedIn carousel'"
        />
      </div>
      <Button type="submit" className="w-full">
        {initial ? "Save Changes" : "Add Entry"}
      </Button>
    </form>
  );
}