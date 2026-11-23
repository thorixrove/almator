import { z } from "zod"

import { DEFAULT_SECONDS, MAX_SECONDS } from "@/lib/project/formats"

export const createProjectSchema = z.object({
  name: z
    .string()
    .trim()
    .max(80, "Keep the name under 80 characters.")
    .transform((name) => name || "Untitled"),
  format: z.enum(["16:9", "9:16", "1:1"], { error: "Pick a format: 16:9, 9:16 or 1:1." }),
  durationSeconds: z
    .number()
    .int("Length must be whole seconds.")
    .min(1, "Length must be at least 1 second.")
    .max(MAX_SECONDS, `Length can be at most ${MAX_SECONDS} seconds.`)
    .default(DEFAULT_SECONDS),
})