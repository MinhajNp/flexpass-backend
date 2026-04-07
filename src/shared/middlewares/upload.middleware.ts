import multer from "multer"
import { Request } from "express"
import { CloudinaryStorage } from "multer-storage-cloudinary"
import cloudinary from "../../core/config/cloudinary"
import { AppError } from "../utils/AppError"
import { HttpStatus } from "../enums/httpStatus.enum"

// --------------------------------------------------
// Storage Configuration
// --------------------------------------------------

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (_req: Request, file: Express.Multer.File) => {
    return {
      folder: "flexpass/gym-docs",
      public_id: `${file.fieldname}-${Date.now()}`,
      resource_type: "auto" // Supports both images and PDFs
    }
  }
})

// --------------------------------------------------
// File Filter
// --------------------------------------------------

const fileFilter = (_req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedMimeTypes = ["image/jpeg", "image/png", "application/pdf"]
  
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true)
  } else {
    cb(new AppError("Invalid file type. Only JPEG, PNG, and PDF are allowed.", HttpStatus.BAD_REQUEST))
  }
}

// --------------------------------------------------
// Upload Configuration
// --------------------------------------------------

export const gymUpload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  }
}).fields([
  { name: "businessRegistration", maxCount: 1 },
  { name: "ownerIdentityProof", maxCount: 1 },
  { name: "addressProof", maxCount: 1 },
  { name: "gymLicense", maxCount: 1 },
  { name: "gymInsurance", maxCount: 1 }
])
