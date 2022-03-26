import { useState } from 'react'
import { useRouter } from 'next/router'
import NextLink from 'next/link'
import { useDispatch } from 'react-redux'
import { logout } from '../redux/actions'
import api from '../services/api'

export interface NavbarLink {
  text: string;
  href: string;
  footerOnly?: boolean;
}
export const links: NavbarLink[] = [
  {
    text: "Accueil",
    href: "/",
    footerOnly: true
  },
  {
    text: "Caisse",
    href: "/checkout",
  },
  {
    text: "Stocks",
    href: "/stocks",
  },
]

const NavBar = () => {
  const router = useRouter()
  const dispatch = useDispatch()
  const [open, setOpen] = useState(false)

  async function clickLogout() {
    dispatch(logout())
    api.setToken(null)
    router.push('/')
  }

  return <>
    <div className="bg-background-light dark:bg-background-dark h-16 py-1">
      <div className="container px-2 flex justify-between items-center h-100">
        <div>
          <NextLink href="/">
            <a className="flex items-center">
              <h1 className="text-2xl font-semibold">
                <span className="text-primary-light dark:text-primary-dark">MEGA</span> <span>KFET</span>
              </h1>
            </a>
          </NextLink>
        </div>
        <div className="flex flex-col items-start justify-center w-full text-center space-x-8 md:w-2/3 md:mt-0 md:flex-row md:items-center">
          {links.filter(({ footerOnly }) => !footerOnly).map(({ text, href }, i) => (
            <NextLink key={i} href={href}>
              <a className="inline-block w-full py-2 mx-0 font-medium text-left text-gray-700 dark:text-gray-300 md:w-auto md:px-0 md:mx-2 hover:text-primary-light dark:hover:text-primary-dark lg:mx-3 md:text-center transition-all">{text}</a>
            </NextLink>
          ))}
        </div>
        <div>
          <button
            className="mr-4 button-outline"
            onClick={() => {
              clickLogout()
              setOpen(false)
            }}
          >
            Déconnexion
          </button>
        </div>
      </div>
    </div>
  </>
}

export default NavBar