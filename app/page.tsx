import { Logo } from "@/components/brand/logo"
import { ThemeToggle } from "@/components/nav/theme-toggle"
import { Button } from "@/components/ui/button"

// Halaman uji sementara: memastikan tema, font, logo, dan tombol bekerja.
export default function Home() {
  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-8 px-6 py-16">
      <header className="flex items-center justify-between">
        <Logo />
        <ThemeToggle />
      </header>

      <h1 className="font-(family-name:--font-display) text-5xl font-black tracking-tight">
        Fondasi siap.
      </h1>

      <div className="rounded-2xl border bg-card p-6 text-card-foreground">
        <p className="text-muted-foreground">
          Kartu ini memakai token --card. Coba tombol tema di kanan atas untuk pindah gelap/terang.
        </p>
        <div className="mt-4 flex gap-3">
          <Button>Primary (oranye)</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
        </div>
      </div>

      <div className="flex gap-3">
        {["code", "text", "video", "image", "audio"].map((type) => (
          <span key={type} className="rounded-full px-3 py-1 text-xs text-white" style={{ background: `var(--clip-${type})` }}>
            {type}
          </span>
        ))}
      </div>
    </main>
  )
}