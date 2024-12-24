'use server'

import { signIn } from '@/auth'
import { getUserByEmail } from '@/data/user'
import { generateVerificationToken } from '@/lib/tokens'
import { signInSchema } from '@/lib/zod'
import { DEFAULT_LOGIN_REDIRECT } from '@/routes'
import { AuthError } from 'next-auth'
import * as z from 'zod'

export const login = async (data: z.infer<typeof signInSchema>) => {
  const validatedFields = signInSchema.safeParse(data)

  if (!validatedFields.success) {
    return { error: 'Invalid fields!' }
  }

  const { email, password } = validatedFields.data

  const existingUser = await getUserByEmail(email)

  if (!existingUser || !existingUser?.email || !existingUser?.password) {
    return { error: 'Invalid credentials!' }
  }

  if (!existingUser.emailVerified) {
    const verificationToken = await generateVerificationToken(
      existingUser.email
    )
    console.log(verificationToken) // jangan lupa hapus ini
    return { success: 'Confirmation Email Sent!' }
  }

  try {
    await signIn('credentials', {
      email,
      password,
      redirectTo: DEFAULT_LOGIN_REDIRECT,
    })
  } catch (e) {
    if (e instanceof AuthError) {
      switch (e.type) {
        case 'CredentialsSignin':
          return { error: 'Invalid Credentials' }
        default:
          return { error: 'Something went wrong' }
      }
    }
    throw e
  }
}
