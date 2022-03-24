import { useRouter } from 'next/router'
import { useSelector } from 'react-redux'
import type { RootState } from '../redux/store'

export function withAuthentication(Component: React.FC) {

  return function Authentication(props: any) {
    const router = useRouter()
    const accessToken: string | null = useSelector((state: RootState) => state.accessToken)

    console.log('withAuthentication', accessToken)

    if (!accessToken && typeof window !== 'undefined') {
      router.push('/login')
      return null
    }
    else if (!accessToken)
      return null

    return <Component {...props} />
  }

}