/* eslint-disable @typescript-eslint/no-explicit-any */
'use server'

import prisma from '@/lib/prisma'
import { saveFile } from '@/lib/file-handler'
import { registerSchema } from '@/lib/zod'
import { Role } from '@prisma/client'
import bcrypt from 'bcryptjs'
import { ZodError } from 'zod'

interface Response {
  success: boolean
  message?: string
  role?: Role
  errors?: Record<string, string[]>
}

export default async function register(formData: FormData): Promise<Response> {
  try {
    const validatedFields = registerSchema.parse(Object.fromEntries(formData))

    const hashedPassword = await bcrypt.hash(validatedFields.password, 10)

    const user = await prisma.user.create({
      data: {
        username: validatedFields.username,
        fullname: validatedFields.fullName,
        email: validatedFields.email,
        password: hashedPassword,
        role: validatedFields.role,
      },
    })

    if (validatedFields.role === Role.MEMBER) {
      await handleMemberRegistration(user.id, validatedFields)
    } else if (validatedFields.role === Role.COMPANY) {
      await handleCompanyRegistration(user.id, validatedFields)
    }

    return {
      success: true,
      message: 'Pendaftaran berhasil!',
      role: validatedFields.role,
    }
  } catch (error) {
    if (error instanceof ZodError) {
      const normalizedErrors: Record<string, string[]> = Object.fromEntries(
        Object.entries(error.flatten().fieldErrors).map(([key, value]) => [
          key,
          value || [],
        ])
      )

      return {
        success: false,
        errors: normalizedErrors,
      }
    }
  }
}

async function handleMemberRegistration(userId: string, fields: any) {
  await prisma.member.create({
    data: {
      userId,
      memberType: fields.memberType,
      nim: fields.nim,
      phone: fields.phone,
    },
  })
}

async function handleCompanyRegistration(userId: string, fields: any) {
  if (!fields.logo) {
    throw new Error('Logo is required for company registration')
  }

  const logoFile = await saveFile('company-logos', fields.logo)

  await prisma.company.create({
    data: {
      userId,
      logoId: logoFile.id,
      companyName: fields.companyName,
      industry: fields.industry,
      ownership: fields.ownership,
      phone: fields.phoneNumber,
      companyPhone: fields.companyPhone,
      website: fields.website,
      publicMail: fields.emailPublic,
      bio: fields.bio,
    },
  })
}
