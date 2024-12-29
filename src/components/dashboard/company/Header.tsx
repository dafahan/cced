import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { User } from 'lucide-react'
import Link from 'next/link'

interface HeaderProps {
  companyName: string
  industri: string
  // logo: string
}

const Header = ({ companyName, industri }: HeaderProps) => {
  return (
    <div className='flex items-center justify-between bg-gray-100 p-4'>
      <div className='flex items-center gap-4'>
        <Link href={'/company/profile'}>
          <Avatar>
            <AvatarImage src='https://github.com/shadcn.png' alt='@shadcn' />
            <AvatarFallback>
              <User />
            </AvatarFallback>
          </Avatar>
        </Link>
        <div>
          <h2 className='text-lg font-bold'>{companyName}</h2>
          <p className='text-sm'>{industri}</p>
        </div>
      </div>
      <div className='flex items-center gap-4'>
        <Button variant='outline'>
          <Link href='company/edit-profile-company'>
            Edit Profil Perusahaan
          </Link>
        </Button>
      </div>
    </div>
  )
}

export default Header
