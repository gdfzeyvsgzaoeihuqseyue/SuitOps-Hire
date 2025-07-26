export interface Company {
  id: number
  name: string
  emailAddress: string
  phoneNumber: string
  address: string
  mainActivity: string
  secondaryActivity: string
  logo?: any
}

export interface Quiz {
  id: number
  statement: string
  status: string
  answers: {
    id: number
    statement: string
  }[]
}

export interface Job {
  id: number
  slug: string
  post: string
  profile: string
  contract: string
  placeNumber: number
  location: string
  tasks: string
  summary: string
  skills: string
  aptitudes: string
  email: string
  contact: string
  requiredDocument: string
  status: string
  closingDate: number
  createdAt: number
  updatedAt: number
  company: Company
  quizzes: Quiz[]
}

export interface JobsResponse {
  nb: number
  data: Job[]
  recents: Job[]
}
