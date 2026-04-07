import { z } from "zod"

// -----------------------------------------
// Apply Gym
// -----------------------------------------
export const applyGymSchema = z.object({
  gymName: z.string().min(3).max(100),
  city: z.string().min(3).max(50),
  fullAddress: z.string().min(5).max(255),
  contactPhone: z.string().regex(/^[0-9+]{10,15}$/),
  officialEmail: z.string().email(),
  
  ownerName: z.string().min(3).max(100),
  ownerContact: z.string().regex(/^[0-9+]{10,15}$/),
  ownerEmail: z.string().email(),

  description: z
    .string()
    .min(10)
    .max(500)
    .optional(),

  facilities: z
    .array(z.string().min(1))
    .optional(),
  
  category: z.enum(['BASIC', 'STANDARD', 'PREMIUM']),

  documents: z
    .array(
      z.object({
        name: z.string().min(1),
        url: z.string().min(1)
      })
    )
    .min(1),

  bankDetails: z.object({
    accountHolder: z.string().min(3),
    bankName: z.string().min(3),
    accountNumber: z.string().min(10),
    ifscCode: z.string().min(4)
  }),

  agreedToTerms: z.boolean().refine(val => val === true, {
    message: "You must agree to the terms"
  })
})

export type ApplyGymDTO = z.infer<typeof applyGymSchema>


// -----------------------------------------
// Approve Gym
// -----------------------------------------
export const approveGymSchema = z.object({
  category: z.enum(['BASIC', 'STANDARD', 'PREMIUM'])
})

export type ApproveGymDTO = z.infer<typeof approveGymSchema>


// -----------------------------------------
// Reject Gym
// -----------------------------------------
export const rejectGymSchema = z.object({
  reason: z.string().min(1).max(500)
})

export type RejectGymDTO = z.infer<typeof rejectGymSchema>


// -----------------------------------------
// Complete Registration
// -----------------------------------------
export const completeRegistrationSchema = z.object({
  token: z.string().min(10),
  password: z.string().min(8).max(50),
  adminFullName: z.string().min(3).max(100),
  adminContactNumber: z.string().regex(/^[0-9+]{10,15}$/, "Invalid contact number")
})

export type CompleteRegistrationDTO = z.infer<typeof completeRegistrationSchema>