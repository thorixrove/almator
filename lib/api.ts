import axios, { isAxiosError } from "axios"

import { authClient } from "@/lib/auth-client"
import type { ApiError, ApiKeySummary, ProjectResponse, ProjectsResponse } from "@/types/api"
import type { CreateProjectInput } from "@/types/project"
/*
 * Semua fungsi data sisi-client ada di sini, siap dipakai TanStack Query:
 *   useQuery({ queryKey: queryKeys.projects, queryFn: getProjectsQueryFn })
 *   useMutation({ mutationFn: createProjectMutationFn })
 * Route aplikasi (/api/*) lewat axios; auth lewat client Better Auth sendiri.
 */

export const api = axios.create({
  baseURL: "/api",
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
})

// Tampilkan pesan `{ error }` dari route kita, bukan pesan generik axios.
api.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    if (isAxiosError<ApiError>(error)) {
      return Promise.reject(new Error(error.response?.data?.error ?? error.message))
    }
    return Promise.reject(error)
  }
)

export const queryKeys = {
  session: ["session"] as const,
  projects: ["projects"] as const,
  project: (id: string) => ["projects", id] as const,
  apiKeys: ["api-keys"] as const,
}

// ── Projects ────────────────────────────────────────────────────────────

export async function getProjectsQueryFn() {
  const { data } = await api.get<ProjectsResponse>("/projects")
  return data.projects
}

export async function getProjectQueryFn(id: string) {
  const { data } = await api.get<ProjectResponse>(`/projects/${id}`)
  return data.project
}

export async function createProjectMutationFn(input: CreateProjectInput) {
  const { data } = await api.post<ProjectResponse>("/projects", input)
  return data.project
}

// ── Auth (client Better Auth) ───────────────────────────────────────────

type BetterAuthResult<T> = { data: T; error: null } | { data: null; error: { message?: string } }

function unwrap<T>(result: BetterAuthResult<T>, fallback: string) {
  if (result.error) throw new Error(result.error.message ?? fallback)
  return result.data as T
}

export async function signInMutationFn(input: { email: string; password: string }) {
  return unwrap(await authClient.signIn.email(input), "Couldn't sign you in.")
}

export async function signUpMutationFn(input: { name: string; email: string; password: string }) {
  return unwrap(await authClient.signUp.email(input), "Couldn't create your account.")
}

export async function signOutMutationFn() {
  return unwrap(await authClient.signOut(), "Couldn't sign you out.")
}

export async function getSessionQueryFn() {
  return unwrap(await authClient.getSession(), "Couldn't load your session.")
}


export async function createApiKeyMutationFn({ name, expiresInDays }: { name: string; expiresInDays: number | null }) {
  const result = await authClient.apiKey.create({ name, expiresIn: expiresInDays ? expiresInDays * 24 * 60 * 60 : null })
  return unwrap(result as BetterAuthResult<{ key: string; id: string; expiresAt: Date | string | null }>, "Couldn't create the key.")
}

const iso = (value: Date | string | null) => (value ? new Date(value).toISOString() : null)

export async function listApiKeysQueryFn(): Promise<ApiKeySummary[]> {
  const data = unwrap(await authClient.apiKey.list(), "Couldn't load your keys.")
  return (data?.apiKeys ?? [])
    .map((key) => ({
      id: key.id,
      name: key.name,
      start: key.start,
      createdAt: iso(key.createdAt)!,
      lastUsedAt: iso(key.lastRequest),
      expiresAt: iso(key.expiresAt),
    }))
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
}

export async function revokeApiKeyMutationFn(keyId: string) {
  return unwrap(await authClient.apiKey.delete({ keyId }), "Couldn't revoke the key.")
}