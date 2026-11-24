import type { Project } from "@/types/project"

/** Error body returned by every route in app/api (kecuali route Better Auth sendiri). */
export type ApiError = { error: string }

export type ProjectsResponse = { projects: Project[] }
export type ProjectResponse = { project: Project }

export type ApiKeySummary = {
    id: string
    name: string | null
    start: string | null
    createdAt: string
    lastUsedAt: string | null
    expiresAt: string | null
}