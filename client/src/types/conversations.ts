export interface ProfilePicture {
  public_id: string
  url: string
}

export interface SocialLinks {
  twitter?: string
  linkedin?: string
  github?: string
}

export interface Conversation {
  _id: string
  name: string
  email: string
  phone: number
  address: string
  biography: string
  gender: string
  role: "admin" | "user" | "moderator" // 👈 adjust based on your app
  status: "approved" | "pending" | "rejected" // 👈 adjust if needed
  skills: string[]
  locations: string[]
  socials: SocialLinks
  profilePicture: ProfilePicture
  createdAt: string
  updatedAt: string
  __v: number
}
