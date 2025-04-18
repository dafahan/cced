/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import Image from 'next/image'
import { Card, CardContent, CardFooter, CardHeader } from '../ui/card'
import { startTransition, useRef, useState } from 'react'
import { ImagePlus } from 'lucide-react'
import { Button } from '../ui/button'
import {
  updateCompanyPersonalInformation,
  updateLogoCompany,
} from '@/actions/company-action'
import { FormError } from '../auth/form-error'
import { FormSuccess } from '../auth/form-succsess'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { useForm } from 'react-hook-form'
import { updateCompanySchema } from '@/lib/zod'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Input } from '../ui/input'
import { Textarea } from '../ui/textarea'
import Link from 'next/link'

interface EditProfileCompanyProps {
  data: any
}

const EditProfileCompany = ({ data }: EditProfileCompanyProps) => {
  const [errorMessageLogo, setErrorMessageLogo] = useState('')
  const [successMessageLogo, setSuccessMessageLogo] = useState('')
  const [errorMessagePersonal, setErrorMessagePersonal] = useState('')
  const [successMessagePersonal, setSuccessMessagePersonal] = useState('')
  const [isPending, setIsPending] = useState(false)
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [srcImage, setSrcImage] = useState(data.company.logo.src)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      const maxSize = 100 * 1024 // 100 KB
      const validTypes = ['image/png', 'image/webp','image/jpg','image/jpeg']

      if (!validTypes.includes(file.type)) {
        setErrorMessageLogo('Hanya file PNG,JPG,JPEG dan WebP yang diperbolehkan.')
        return
      }

      if (file.size > maxSize) {
        setErrorMessageLogo('Ukuran file maksimal 100 KB.')
        return
      }

      setErrorMessageLogo('')
      setSuccessMessageLogo('File berhasil diunggah!')
      setLogoFile(file)
      setSrcImage(URL.createObjectURL(file))
    }
  }

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  const handleEditLogo = async () => {
    if (!logoFile) {
      setErrorMessageLogo('Tidak ada file yang dipilih.')
      return
    }

    setIsPending(true)
    try {
      const response = await updateLogoCompany(
        data.company.id,
        data.company.logo.id,
        logoFile
      )
      setSuccessMessageLogo(response?.success ?? '')
      setErrorMessageLogo(response?.error ?? '')
    } catch (err) {
      console.error('Error updating logo:', err)
      setErrorMessageLogo('Terjadi kesalahan saat memperbarui logo.')
      setSuccessMessageLogo('')
    } finally {
      setIsPending(false)
    }
  }

  const formPersonal = useForm<z.infer<typeof updateCompanySchema>>({
    resolver: zodResolver(updateCompanySchema),
    defaultValues: {
      username: data.username || '',
      fullname: data.fullname || '',
      companyName: data.company.companyName || '',
      industry: data.company.industry || '',
      ownership: data.company.ownership || '',
      phone: data.company.phone || '',
      companyPhone: data.company.companyPhone || '',
      website: data.company.website || '',
      publicMail: data.company.publicMail || '',
      bio: data.company.bio || '',
      address: data.company.address || '',
      city: data.company.city || '',
    },
  })
  const onSubmitPersonal = (value: z.infer<typeof updateCompanySchema>) => {
    setErrorMessagePersonal('')
    setSuccessMessagePersonal('')
    startTransition(() => {
      setIsPending(true)
      // todo: implement submit logic
      updateCompanyPersonalInformation(value, data.id, data.company.id)
        .then((response) => {
          setSuccessMessagePersonal(response?.success ?? '')
          setErrorMessagePersonal(response?.error ?? '')
          setIsPending(false)
        })
        .catch((err) => {
          console.error('Error updating personal information:', err)
          setErrorMessagePersonal(
            'Terjadi kesalahan saat memperbarui informasi personal.'
          )
          setSuccessMessagePersonal('')
          setIsPending(false)
        })
    })
  }

  return (
    <div className='max-w-6xl mx-auto p-8 w-full'>
      <h1 className='text-3xl font-bold text-green-700 mb-6'>
        Edit Profile Company
      </h1>

      {/* section edit logo */}
      <Card className='shadow-lg'>
        <CardHeader>
          <p className='text-lg font-semibold text-green-700 mb-4'>
            Edit Logo Perusahaan
          </p>
          {errorMessageLogo && <FormError message={errorMessageLogo} />}
          {successMessageLogo && <FormSuccess message={successMessageLogo} />}
        </CardHeader>
        <CardContent>
          <div>
            <div className='mb-4 flex justify-between'>
              <p className='text-md font-medium text-gray-700 mb-4'>
                Logo Perusahaan
              </p>
              <Button onClick={handleEditLogo} disabled={isPending}>
                Simpan Perubahan
              </Button>
            </div>
            <div className='cursor-pointer rounded-lg border-2 border-dashed p-6 text-center h-80 flex flex-col gap-4 items-center justify-center'>
              <input
                type='file'
                accept='.png,.webp,.jpg,.jpeg'
                className='hidden'
                ref={fileInputRef}
                onChange={handleFileChange}
              />
              <div className='flex flex-col items-center w-full h-full justify-center gap-4'>
                {srcImage ? (
                  <Image
                    src={srcImage}
                    width={100}
                    height={100}
                    alt='logo'
                    className='rounded-md shadow'
                  />
                ) : (
                  <ImagePlus className='h-12 w-12 text-gray-400' />
                )}
                <div className='text-sm text-gray-600'>
                  Set logo perusahaan. Hanya file berformat *.png,*.jpg,*.jpeg dan *.webp
                  dengan ukuran maksimal 100 KB.
                </div>
                {logoFile && (
                  <div className='text-sm text-green-600'>
                    File terpilih: {logoFile.name}
                  </div>
                )}
                <Button
                  variant='outline'
                  className='w-full hover:bg-green-100 hover:border-green-700 transition'
                  onClick={handleButtonClick}
                >
                  Pilih File
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* section personal data */}
      <Card className='shadow-lg'>
        <CardHeader>
          <p className='text-lg font-semibold text-green-700 mb-4'>
            Edit Personal Information
          </p>
          {errorMessagePersonal && <FormError message={errorMessagePersonal} />}
          {successMessagePersonal && (
            <FormSuccess message={successMessagePersonal} />
          )}
        </CardHeader>

        <CardContent>
          <Form {...formPersonal}>
            <form
              onSubmit={formPersonal.handleSubmit(onSubmitPersonal)}
              className='space-y-6'
            >
              <div className='mb-4 flex justify-between'>
                <p className='text-md font-medium text-gray-700 mb-4'>
                  Personal Information
                </p>
                <Button type='submit' disabled={isPending}>
                  Simpan Perubahan
                </Button>
              </div>
              <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
                <div className='space-y-4'>
                  <FormField
                    control={formPersonal.control}
                    name='username'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Username</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            disabled={formPersonal.formState.isSubmitting}
                            placeholder='Username'
                            className='border-2 border-gray-100 shadow-sm'
                            type='text'
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={formPersonal.control}
                    name='fullname'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nama Lengkap</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            disabled={formPersonal.formState.isSubmitting}
                            placeholder='fullname'
                            className='border-2 border-gray-100 shadow-sm'
                            type='text'
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={formPersonal.control}
                    name='companyName'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nama Perusahaaan</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            disabled={formPersonal.formState.isSubmitting}
                            placeholder='Nama Perusahaan'
                            className='border-2 border-gray-100 shadow-sm'
                            type='text'
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={formPersonal.control}
                    name='industry'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Bidang Industry</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            disabled={formPersonal.formState.isSubmitting}
                            placeholder='Bidang Industry'
                            className='border-2 border-gray-100 shadow-sm'
                            type='text'
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={formPersonal.control}
                    name='ownership'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Kepemilikan Perusahaan</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            disabled={formPersonal.formState.isSubmitting}
                            placeholder='Kepemilikan Perusahaan'
                            className='border-2 border-gray-100 shadow-sm'
                            type='text'
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={formPersonal.control}
                    name='phone'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nomor Telephone</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            disabled={formPersonal.formState.isSubmitting}
                            placeholder='Nomor Telephone'
                            className='border-2 border-gray-100 shadow-sm'
                            type='text'
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={formPersonal.control}
                    name='companyPhone'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nomor Telephone Perusahaan</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            disabled={formPersonal.formState.isSubmitting}
                            placeholder='Nomor Telephone Perusahaan'
                            className='border-2 border-gray-100 shadow-sm'
                            type='text'
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className='space-y-4'>
                  <FormField
                    control={formPersonal.control}
                    name='website'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Website Perusahaan</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            disabled={formPersonal.formState.isSubmitting}
                            placeholder='Website Perusahaan'
                            className='border-2 border-gray-100 shadow-sm'
                            type='text'
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={formPersonal.control}
                    name='publicMail'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Alamat Email Public</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            disabled={formPersonal.formState.isSubmitting}
                            placeholder='Alamat Email Public'
                            className='border-2 border-gray-100 shadow-sm'
                            type='text'
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={formPersonal.control}
                    name='address'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Alamat</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            disabled={formPersonal.formState.isSubmitting}
                            placeholder='Alamat Anda'
                            className='border-2 border-gray-100 shadow-sm'
                            type='text'
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={formPersonal.control}
                    name='city'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Kota</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            disabled={formPersonal.formState.isSubmitting}
                            placeholder='kota Anda'
                            className='border-2 border-gray-100 shadow-sm'
                            type='text'
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={formPersonal.control}
                    name='bio'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Biodata Perusahaan</FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            disabled={formPersonal.formState.isSubmitting}
                            placeholder='Biodata Perusahaan'
                            className='border-2 border-gray-100 shadow-sm h-[216px]'
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </form>
          </Form>
        </CardContent>
        <CardFooter className='text-center pt-6 border-t'>
          <Link
            href='/dashboard'
            className='text-green-600 hover:text-green-700 font-medium'
          >
            Back to Dashboard
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
}

export default EditProfileCompany
