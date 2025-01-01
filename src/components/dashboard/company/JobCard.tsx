import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import Link from 'next/link'

interface JobCardProps {
  title: string
  status: string
  location: string
  createdAt: string
  jobApplication: JobApplication[]
  handleDelete: () => void
}

interface JobApplication {
  notes: string
}

const JobCard = ({
  title,
  status,
  location,
  createdAt,
  jobApplication,
  handleDelete,
}: JobCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <div className='flex items-center justify-between'>
            <h3>{title}</h3>
            {status === 'aktif' && (
              <Badge className='bg-green-500'>{status}</Badge>
            )}
            {status === 'nonaktif' && (
              <Badge className='bg-red-500'>{status}</Badge>
            )}
            {status === 'selesai' && (
              <Badge className='bg-blue-500'>{status}</Badge>
            )}
            {status === 'draft' && (
              <Badge className='bg-slate-500'>{status}</Badge>
            )}
          </div>
        </CardTitle>
        <CardDescription className='flex flex-col pt-2'>
          <Label>{location}</Label>
          <Label className='text-sm text-gray-400'>
            Dibuat pada: {createdAt}
          </Label>
        </CardDescription>
      </CardHeader>
      <CardContent className='m-4 flex justify-between border border-gray-200 p-4'>
        <div className='flex flex-col px-4 text-center'>
          <h1 className='text-3xl font-bold'>{jobApplication.length}</h1>
          <p className='text-sm font-medium'>Pelamar</p>
        </div>
        <div className='flex flex-col px-4 text-center'>
          <h1 className='text-3xl font-bold'>
            {
              jobApplication.filter((app) => app.notes === 'Seleksi Berkas')
                .length
            }
          </h1>
          <p className='text-sm font-medium'>Seleksi Berkas</p>
        </div>
        <div className='flex flex-col px-4 text-center'>
          <h1 className='text-3xl font-bold'>
            {
              jobApplication.filter((app) => app.notes === 'Dalam Komunikasi')
                .length
            }
          </h1>
          <p className='text-sm font-medium'>Dalam Komunikasi</p>
        </div>
        <div className='flex flex-col px-4 text-center'>
          <h1 className='text-3xl font-bold'>
            {
              jobApplication.filter((app) => app.notes === 'Belum Sesuai')
                .length
            }
          </h1>
          <p className='text-sm font-medium'>Belum Sesuai</p>
        </div>
      </CardContent>
      <hr className='h-0.5 w-full' />
      <CardFooter className='mt-3 flex justify-end gap-4'>
        <Button
          variant='secondary'
          className='w-24 bg-green-500 text-white hover:bg-green-400'
        >
          <Link href='/company/edit-job'>Edit</Link>
        </Button>
        <Button variant='destructive' className='w-24' onClick={handleDelete}>
          Hapus
        </Button>
        <Button
          variant='outline'
          className='w-24 bg-blue-400 text-white hover:bg-blue-300'
        >
          <Link href={'/company/job-detail'}>Detail</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}

export default JobCard
