import { index, integer, jsonb, pgTable, text, timestamp } from "drizzle-orm/pg-core"

import type { ProjectDoc, ProjectFormat } from "@/types/project"

import { user } from "./auth-schema"

// Tabel aplikasi. auth-schema.ts dibuat oleh Better Auth CLI; tabel aplikasi disimpan di sini.

export const project = pgTable(
  "project",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    format: text("format").$type<ProjectFormat>().notNull(),
    width: integer("width").notNull(),
    height: integer("height").notNull(),
    fps: integer("fps").notNull().default(30),
    durationInFrames: integer("duration_in_frames").notNull(),
    doc: jsonb("doc").$type<ProjectDoc>().notNull(),
    version: integer("version").notNull().default(0),
    thumbnailUrl: text("thumbnail_url"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [index("project_userId_updatedAt_idx").on(table.userId, table.updatedAt)]
)