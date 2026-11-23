import "server-only"

import { and, desc, eq } from "drizzle-orm"

import { db } from "@/db"
import { project } from "@/db/schema"
import { FORMATS, FPS } from "@/lib/project/formats"
import { EMPTY_DOC } from "@/lib/project/schema"
import type { CreateProjectInput, Project } from "@/types/project"

// Akses data proyek. Setiap query dibatasi ke pemiliknya (userId).

const summary = {
  id: project.id,
  name: project.name,
  format: project.format,
  width: project.width,
  height: project.height,
  fps: project.fps,
  durationInFrames: project.durationInFrames,
  thumbnailUrl: project.thumbnailUrl,
  createdAt: project.createdAt,
  updatedAt: project.updatedAt,
}

type Row = Omit<Project, "createdAt" | "updatedAt"> & { createdAt: Date; updatedAt: Date }

function toProject(row: Row): Project {
  return { ...row, createdAt: row.createdAt.toISOString(), updatedAt: row.updatedAt.toISOString() }
}

export async function listProjects(userId: string) {
  const rows = await db
    .select(summary)
    .from(project)
    .where(eq(project.userId, userId))
    .orderBy(desc(project.updatedAt))
  return rows.map(toProject)
}

export async function getProject(userId: string, id: string) {
  const [row] = await db
    .select(summary)
    .from(project)
    .where(and(eq(project.id, id), eq(project.userId, userId)))
    .limit(1)
  return row ? toProject(row) : null
}

export async function createProject(userId: string, input: Required<CreateProjectInput>) {
  const { width, height } = FORMATS[input.format]
  const [row] = await db
    .insert(project)
    .values({
      userId,
      name: input.name,
      format: input.format,
      width,
      height,
      fps: FPS,
      durationInFrames: input.durationSeconds * FPS,
      doc: EMPTY_DOC,
    })
    .returning(summary)
  return toProject(row)
}