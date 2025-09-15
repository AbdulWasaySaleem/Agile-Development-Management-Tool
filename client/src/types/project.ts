import { Member } from "./member"
import { Task } from "./task"


export interface Project {
  _id: string
  title: string
  description: string
  startDate: string
  endDate: string
  methodology: string
  status: string
  members: Member[]
  tasks: Task[]
  createdAt: string
  updatedAt: string
}
