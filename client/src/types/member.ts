export interface Member {
  _id: string
  name: string
  skills?: string[]
  profilePicture?: {
    url: string
    public_id?: string
  }
}
