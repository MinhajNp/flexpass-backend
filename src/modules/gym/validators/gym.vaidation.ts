import { z } from "zod"

// -----------------------------------------
// Apply Gym
// -----------------------------------------
export const applyGymSchema = z.object({

  name: z.string().min(3).max(100),

  email: z.string().email(),

  phone: z.string().regex(/^[0-9]{10}$/),

  location: z
    .string()
    .min(5, "Location is required")
    .max(255),

  description: z
    .string()
    .min(10)
    .max(500)
    .optional(),

  facilities: z
    .array(z.string().min(1))
    .optional(),

  documents: z
    .array(z.string().min(1))
    .min(1, "At least one document is required")

})

export type ApplyGymDTO = z.infer<typeof applyGymSchema>


// -----------------------------------------
// Reject Gym
// -----------------------------------------
export const rejectGymSchema = z.object({
  reason: z.string().min(5).max(200)
})

export type RejectGymDTO = z.infer<typeof rejectGymSchema>


// -----------------------------------------
// Complete Registration
// -----------------------------------------
export const completeRegistrationSchema = z.object({
  token: z.string().min(10),
  password: z.string().min(6).max(50)
})

export type CompleteRegistrationDTO = z.infer<typeof completeRegistrationSchema>