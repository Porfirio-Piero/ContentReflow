export type ContentStatus = "done" | "planned" | "skipped";
export type ContentType = "blog" | "newsletter" | "video" | "podcast" | "social" | "other";
export type PlatformType = "twitter" | "linkedin" | "youtube" | "newsletter" | "instagram" | "tiktok" | "other";

export interface Content {
  id: string;
  title: string;
  type: ContentType;
  originalUrl?: string;
  createdAt: string;
  notes?: string;
}

export interface PlatformEntry {
  id: string;
  contentId: string;
  platform: PlatformType;
  status: ContentStatus;
  url?: string;
  notes?: string;
  updatedAt: string;
}

export const PLATFORMS: { value: PlatformType; label: string; icon: string }[] = [
  { value: "twitter", label: "Twitter/X", icon: "𝕏" },
  { value: "linkedin", label: "LinkedIn", icon: "in" },
  { value: "youtube", label: "YouTube", icon: "▶" },
  { value: "newsletter", label: "Newsletter", icon: "✉" },
  { value: "instagram", label: "Instagram", icon: "📷" },
  { value: "tiktok", label: "TikTok", icon: "♪" },
];

export const CONTENT_TYPES: { value: ContentType; label: string; icon: string }[] = [
  { value: "blog", label: "Blog Post", icon: "📝" },
  { value: "newsletter", label: "Newsletter", icon: "📧" },
  { value: "video", label: "Video", icon: "🎬" },
  { value: "podcast", label: "Podcast", icon: "🎙️" },
  { value: "social", label: "Social Post", icon: "💬" },
  { value: "other", label: "Other", icon: "📋" },
];

export const STATUS_CONFIG: Record<ContentStatus, { label: string; color: string; bg: string }> = {
  done: { label: "Done", color: "text-green-700", bg: "bg-green-100 border-green-300" },
  planned: { label: "Planned", color: "text-yellow-700", bg: "bg-yellow-100 border-yellow-300" },
  skipped: { label: "Skipped", color: "text-gray-500", bg: "bg-gray-100 border-gray-300" },
};