"use client"

import { useMutation } from "@tanstack/react-query"
import { useRouter } from "next/navigation"

import { PillButton } from "@/components/brand/pill-button"
import { Spinner } from "@/components/ui/spinner"
import { signOutMutationFn } from "@/lib/api"

export function SignOutButton() {
    const router = useRouter()
    const { mutate, isPending } = useMutation({
        mutationFn: signOutMutationFn,
        onSuccess: () => {
            router.replace("/sign-in")
            router.refresh()
        },
    })

    return (
        <PillButton variant="secondary" size="md" onClick={() => mutate()} disabled={isPending}>
            {isPending && <Spinner />}
            Sign out
        </PillButton>
    )
}