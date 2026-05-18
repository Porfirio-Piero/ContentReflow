"use client";

import { createContext, useContext, useCallback, useEffect, useState, ReactNode } from "react";
import { Content, PlatformEntry, ContentStatus } from "@/types";

interface DataContextType {
  contents: Content[];
  entries: PlatformEntry[];
  addContent: (content: Omit<Content, "id" | "createdAt">) => Content;
  updateContent: (id: string, updates: Partial<Content>) => void;
  deleteContent: (id: string) => void;
  addEntry: (entry: Omit<PlatformEntry, "id" | "updatedAt">) => PlatformEntry;
  updateEntry: (id: string, updates: Partial<PlatformEntry>) => void;
  deleteEntry: (id: string) => void;
  toggleEntryStatus: (contentId: string, platform: string) => void;
  getEntriesForContent: (contentId: string) => PlatformEntry[];
  getContentById: (id: string) => Content | undefined;
  exportData: () => string;
  importData: (json: string) => boolean;
}

const DataContext = createContext<DataContextType | null>(null);

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error("useData must be used within DataProvider");
  return ctx;
}

const STORAGE_KEYS = {
  content: "contentreflow_content",
  entries: "contentreflow_entries",
};

function generateId(): string {
  return crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
}

export function DataProvider({ children }: { children: ReactNode }) {
  const [contents, setContents] = useState<Content[]>([]);
  const [entries, setEntries] = useState<PlatformEntry[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const storedContent = localStorage.getItem(STORAGE_KEYS.content);
      const storedEntries = localStorage.getItem(STORAGE_KEYS.entries);
      if (storedContent) setContents(JSON.parse(storedContent));
      if (storedEntries) setEntries(JSON.parse(storedEntries));
    } catch (e) {
      console.error("Failed to load data:", e);
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) {
      localStorage.setItem(STORAGE_KEYS.content, JSON.stringify(contents));
    }
  }, [contents, loaded]);

  useEffect(() => {
    if (loaded) {
      localStorage.setItem(STORAGE_KEYS.entries, JSON.stringify(entries));
    }
  }, [entries, loaded]);

  const addContent = useCallback((data: Omit<Content, "id" | "createdAt">): Content => {
    const content: Content = {
      ...data,
      id: generateId(),
      createdAt: new Date().toISOString(),
    };
    setContents((prev) => [content, ...prev]);
    return content;
  }, []);

  const updateContent = useCallback((id: string, updates: Partial<Content>) => {
    setContents((prev) => prev.map((c) => (c.id === id ? { ...c, ...updates } : c)));
  }, []);

  const deleteContent = useCallback((id: string) => {
    setContents((prev) => prev.filter((c) => c.id !== id));
    setEntries((prev) => prev.filter((e) => e.contentId !== id));
  }, []);

  const addEntry = useCallback((data: Omit<PlatformEntry, "id" | "updatedAt">): PlatformEntry => {
    const entry: PlatformEntry = {
      ...data,
      id: generateId(),
      updatedAt: new Date().toISOString(),
    };
    setEntries((prev) => [entry, ...prev]);
    return entry;
  }, []);

  const updateEntry = useCallback((id: string, updates: Partial<PlatformEntry>) => {
    setEntries((prev) =>
      prev.map((e) => (e.id === id ? { ...e, ...updates, updatedAt: new Date().toISOString() } : e))
    );
  }, []);

  const deleteEntry = useCallback((id: string) => {
    setEntries((prev) => prev.filter((e) => e.id !== id));
  }, []);

  const toggleEntryStatus = useCallback(
    (contentId: string, platform: string) => {
      setEntries((prev) => {
        const existing = prev.find((e) => e.contentId === contentId && e.platform === platform);
        if (existing) {
          const next: ContentStatus = existing.status === "done" ? "planned" : existing.status === "planned" ? "skipped" : "done";
          return prev.map((e) =>
            e.id === existing.id ? { ...e, status: next, updatedAt: new Date().toISOString() } : e
          );
        } else {
          const entry: PlatformEntry = {
            id: generateId(),
            contentId,
            platform: platform as PlatformEntry["platform"],
            status: "done",
            updatedAt: new Date().toISOString(),
          };
          return [entry, ...prev];
        }
      });
    },
    []
  );

  const getEntriesForContent = useCallback(
    (contentId: string) => entries.filter((e) => e.contentId === contentId),
    [entries]
  );

  const getContentById = useCallback((id: string) => contents.find((c) => c.id === id), [contents]);

  const exportData = useCallback(() => {
    return JSON.stringify({ contents, entries, exportedAt: new Date().toISOString() }, null, 2);
  }, [contents, entries]);

  const importData = useCallback(
    (json: string): boolean => {
      try {
        const data = JSON.parse(json);
        if (data.contents && Array.isArray(data.contents)) {
          setContents(data.contents);
        }
        if (data.entries && Array.isArray(data.entries)) {
          setEntries(data.entries);
        }
        return true;
      } catch {
        return false;
      }
    },
    []
  );

  return (
    <DataContext.Provider
      value={{
        contents,
        entries,
        addContent,
        updateContent,
        deleteContent,
        addEntry,
        updateEntry,
        deleteEntry,
        toggleEntryStatus,
        getEntriesForContent,
        getContentById,
        exportData,
        importData,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}