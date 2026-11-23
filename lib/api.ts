import axios, { isAxiosError } from "axios"

import { authClient } from "@/lib/auth-client"
import type { ApiError, ProjectResponse, ProjectsResponse } from "@/types/api"
import type { CreateProjectInput } from "@/types/project"

export const api = axios.create({
    baseURL: "/api",
    withCredentials: true,
    headers: { "Content-Type": "application/json" },
})

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
}

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