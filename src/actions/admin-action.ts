import prisma from '@/lib/prisma'

export const getUsers = async () => {
  try {
    const user = await prisma.user.findMany()
    return user
  } catch {
    return null
  }
}

export const getCompanies = async () => {
  try {
    const company = await prisma.company.findMany()
    return company
  } catch {
    return null
  }
}

export const getMembers = async () => {
  try {
    const member = await prisma.member.findMany()
    return member
  } catch {
    return null
  }
}

export const getJobs = async () => {
  try {
    const job = await prisma.job.findMany()
    return job
  } catch {
    return null
  }
}

export const getJobApplications = async () => {
  try {
    const jobApplication = await prisma.jobApplication.findMany()
    return jobApplication
  } catch {
    return null
  }
}

export const getContents = async () => {
  try {
    const news = await prisma.news.findMany()
    const article = await prisma.article.findMany()
    return { news, article }
  } catch {
    return null
  }
}
