export interface ApplyGymDTO {
  gymName: string
  city: string
  fullAddress: string
  contactPhone: string
  officialEmail: string
  
  ownerName: string
  ownerContact: string
  ownerEmail: string
  
  description?: string
  facilities?: string[]
  
  category: 'BASIC' | 'STANDARD' | 'PREMIUM'
  
  documents: {
    name: string
    url: string
  }[]

  bankDetails: {
    accountHolder: string
    bankName: string
    accountNumber: string
    ifscCode: string
  }

  agreedToTerms: boolean
}