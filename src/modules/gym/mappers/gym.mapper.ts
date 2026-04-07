import { Request } from "express"
import { IGym } from "../entities/gym.entity"
import { GymResponseDTO } from "../dto/gym.response.dto"
import { ApplyGymDTO } from "../dto/apply.gym.dto"

export const mapGymToResponseDTO = (gym: IGym): GymResponseDTO => {
  return {
    id: gym._id.toString(),
    name: gym.gymName || (gym as any).name,
    gymName: gym.gymName || (gym as any).name,
    officialEmail: gym.officialEmail || (gym as any).email,
    contactPhone: gym.contactPhone,
    location: gym.city || (gym as any).location,
    city: gym.city || (gym as any).location,
    fullAddress: gym.fullAddress,
    ownerName: gym.ownerName,
    ownerContact: gym.ownerContact,
    ownerEmail: gym.ownerEmail,
    description: gym.description,
    facilities: gym.facilities,
    documents: gym.documents,
    status: gym.status,
    category: gym.category,
    createdAt: (gym as any).createdAt
  }
}

export const mapRequestToApplyGymDTO = (req: Request): ApplyGymDTO => {
  const files = req.files as { [fieldname: string]: Express.Multer.File[] } | undefined;
  
  // Parse JSON strings from FormData
  const bankDetails = typeof req.body.bankDetails === 'string' 
    ? JSON.parse(req.body.bankDetails) 
    : req.body.bankDetails;
      
  const facilities = typeof req.body.facilities === 'string' 
    ? JSON.parse(req.body.facilities) 
    : req.body.facilities;

  const agreedToTerms = req.body.agreedToTerms === 'true' || req.body.agreedToTerms === true;

  // Map files to documents array
  const documents: { name: string, url: string }[] = [];
  if (files) {
    Object.keys(files).forEach((key) => {
      const file = files[key][0];
      documents.push({
        name: key,
        url: file.path // Cloudinary URL
      });
    });
  }

  return {
    ...req.body,
    bankDetails,
    facilities,
    agreedToTerms,
    documents
  };
}

export const mapGymAdminStatsToDTO = (stats: any) => {
  return {
    totalSlots: stats.totalSlots,
    bookedSlots: stats.bookedSlots,
    primaryAuto: stats.primaryAuto,
    trainersAvailable: stats.trainersAvailable
  }
}

export const mapCheckInToResponseDTO = (checkIn: any) => {
  return {
    id: checkIn._id?.toString() || checkIn.id,
    gymId: checkIn.gymId?.toString() || checkIn.gymId,
    userId: {
      id: checkIn.userId?._id?.toString() || checkIn.userId?.id || checkIn.userId,
      name: checkIn.userId?.name,
      avatar: checkIn.userId?.avatar
    },
    checkInType: checkIn.checkInType,
    status: checkIn.status,
    createdAt: checkIn.createdAt
  }
}