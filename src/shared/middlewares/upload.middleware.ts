import multer from "multer"
import path from "path"
import fs from "fs"
import { Request } from "express"
import { AppError } from "../utils/AppError"
import { HttpStatus } from "../enums/httpStatus.enum"

// --------------------------------------------------
// Storage Configuration
// --------------------------------------------------

const storage = multer.diskStorage({
  destination: (_req: Request, _file: Express.Multer.File, cb) => {
    const uploadPath = path.join(process.cwd(), "uploads", "gym-docs")
    
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true })
    }
    
    cb(null, uploadPath)
  },
  filename: (_req: Request, file: Express.Multer.File, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`
    cb(null, `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`)
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
