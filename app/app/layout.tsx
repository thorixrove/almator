import { NewProjectDialog } from "@/components/new-project/new-project-dialog"

// Tidak membaca sesi di sini: dengan cacheComponents layout harus tetap shell statis.
// Halaman membaca sesi di dalam <Suspense>; proxy.ts menangani redirect saat belum login.
export default function AppLayout({ children }: LayoutProps<"/app">) {
    return (
        <>
            {children}
            <NewProjectDialog />
        </>
    )
}