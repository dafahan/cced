import { getDetailUserCompanyFull } from '@/actions/company-action'
import HeaderCompany from '@/components/dashboard/company/Header'
import HeaderMember from '@/components/dashboard/member/Header'
import { getUserDetailMember } from '@/data/userRole'
import { currentUser } from '@/lib/authenticate'

export default async function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await currentUser()

  if (!user) {
    return (
      <div>
        {/* <h1>ini layout guest</h1> */}
        {children}
      </div>
    )
  }

  if (user.role === 'ADMIN') {
    return (
      <div>
        {/* <h1>ini layout admin</h1> */}
        {children}
      </div>
    )
  }

  if (user.role === 'COMPANY') {
    const detailsUser = await getDetailUserCompanyFull(user?.id || '')
    return (
      <div>
        {detailsUser && (
          <HeaderCompany
            companyName={detailsUser?.company?.companyName || ''}
            industri={detailsUser?.company?.industry || ''}
            logo={detailsUser?.company?.logo?.src || ''}
          />
        )}
        {children}
      </div>
    )
  }

  if (user.role === 'MEMBER') {
    const detailsUser = await getUserDetailMember(user?.id || '')
    return (
      <div>
        {detailsUser && (
          <HeaderMember
            fullname={detailsUser.fullname || ''}
            membertype={detailsUser.memberType || ''}
          />
        )}
        {/* <h1>ini layout member</h1> */}
        {children}
      </div>
    )
  }
}
