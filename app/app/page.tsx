import type { Metadata } from "next"
import { Suspense } from "react"

import { SignOutButton } from "@/components/auth/sign-out-button"
import { Logo } from "@/components/brand/logo"
import { requireSession } from "@/lib/session"

export const metadata: Metadata = { title: "Your projects" }

// Placeholder /app (dashboard asli dibuat di langkah berikutnya).
// Halaman tetap shell statis; sesi dibaca di dalam <Suspense> (aturan cacheComponents).
export default function HomePage() {
  return (
    <div className="px-4 py-5 sm:px-6">
      <header className="mx-auto flex max-w-5xl items-center justify-between">
        <Logo href="/app" />
        <SignOutButton />
      </header>
      <main className="mx-auto max-w-5xl pt-16">
        <h1 className="font-(family-name:--font-display) text-5xl font-extrabold tracking-[-0.045em]">
          <Suspense fallback="…">
            <UserName />
          </Suspense>
        </h1>
      </main>
    </div>
  )
}

async function UserName() {
  const { user } = await requireSession()
  return <>Halo, {user.name}.</>
}