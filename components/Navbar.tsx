import { useState, Fragment } from 'react'
import { useRouter } from 'next/router'
import NextLink from 'next/link'
import { useSelector, useDispatch } from 'react-redux'
import { Popover, Transition } from '@headlessui/react'
import { RiSunLine, RiMoonLine, RiMenuLine, RiAccountCircleLine } from 'react-icons/ri'
import { logout, setTheme } from '../redux/actions'
import api from '../services/api'
import type { RootState } from '../redux/store'
import type { ThemeType } from '../utils/theme'

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
    text: "Équipe",
    href: "/team",
  },
  // {
  //   text: "Onglet 2",
  //   href: "/onglet2",
  // },
  {
    text: "Contact",
    href: "/contact",
  },
]

const NavBar = () => {
  const router = useRouter()
  const theme: ThemeType = useSelector((state: RootState) => state.theme)
  const user = useSelector((state: RootState) => state.user)
  const dispatch = useDispatch()
  const [open, setOpen] = useState(false)

  const SwitchThemeButton = () => (
    <button
      className="rounded-lg text-gray-700 px-2 py-2 hover:bg-gray-300 dark:text-gray-300 dark:hover:bg-gray-800 transition-all"
      onClick={() => dispatch(setTheme(theme === "dark" ? "light" : "dark"))}
    >
      {theme === "dark" ? <RiSunLine size={24} /> : <RiMoonLine size={24} />}
    </button>
  )

  async function clickLogout() {
    dispatch(logout())
    api.setToken(null)
  }

  return <>
    <div className="bg-background-light dark:bg-background-dark h-16 py-1">
      <div className="container px-2 flex justify-between items-center h-100">
        <div>
          <NextLink href="/">
            <a className="flex items-center">
              {/* <div className="mr-3 flex items-center">
                <Image src={Logo} width={50} height={50} alt="" />
              </div> */}
              <h1 className="text-2xl font-semibold">
                <span>BDE</span> <span className="text-primary-light dark:text-primary-dark">MEGA</span>
              </h1>
            </a>
          </NextLink>
        </div>
        <div className="hidden lg:flex flex-col items-start justify-center w-full space-x-6 text-center lg:space-x-8 md:w-2/3 md:mt-0 md:flex-row md:items-center">
          {links.filter(({ footerOnly }) => !footerOnly).map(({ text, href }, i) => (
            <NextLink key={i} href={href}>
              <a className="inline-block w-full py-2 mx-0 font-medium text-left text-gray-700 dark:text-gray-300 md:w-auto md:px-0 md:mx-2 hover:text-primary-light dark:hover:text-primary-dark lg:mx-3 md:text-center transition-all">{text}</a>
            </NextLink>
          ))}
        </div>
        <div className="hidden lg:flex items-center relative">
          {!user && <>
            <SwitchThemeButton />
            <NextLink href="/login">
              <a className="ml-5 button-outline">Connexion</a>
            </NextLink>
          </>}
          {user && <>
            <SwitchThemeButton />
            <Popover>
              <Popover.Button className="ml-2">
                <div>
                  <button
                    className="rounded-lg text-gray-700 px-2 py-2 hover:bg-gray-300 dark:text-gray-300 dark:hover:bg-gray-800 transition-all"
                  >
                    <RiAccountCircleLine size={24} />
                  </button>
                </div>
              </Popover.Button>
              <Transition
                as={Fragment}
                enter="transition ease-out duration-200"
                enterFrom="opacity-0 translate-y-1"
                enterTo="opacity-100 translate-y-0"
                leave="transition ease-in duration-150"
                leaveFrom="opacity-100 translate-y-0"
                leaveTo="opacity-0 translate-y-1"
              >
                <Popover.Panel className="absolute -right-4 z-50 flex flex-col items-center justify-center w-40 gap-4 p-6 bg-white dark:bg-black rounded-lg shadow-xl text-center">
                  {({ close }) => <>
                    <span>{user.name}</span>
                    <button
                      className="button-outline"
                      onClick={() => {
                        close()
                        clickLogout()
                      }}
                    >
                      Déconnexion
                    </button>
                  </>}
                </Popover.Panel>
              </Transition>
            </Popover>
          </>}
        </div>
        <div className="flex lg:hidden">
          <button
            className="rounded-lg text-gray-700 px-2 py-2 hover:bg-gray-300 dark:text-gray-300 dark:hover:bg-gray-800 transition-all"
            onClick={() => setOpen(!open)}
          >
            <RiMenuLine size={24} />
          </button>
        </div>
      </div>
    </div>
    <div
      className="bg-background-light dark:bg-background-dark flex flex-col lg:hidden fixed top-0 h-screen w-[300px] max-w-full pt-16 z-50"
      style={{
        right: open ? 0 : -300,
        transition: "right 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
        transitionDelay: open ? "0.1s" : "0s"
      }}>
      <div className="mt-4 flex justify-center items-center">
        {!user && <>
          <NextLink href="/login">
            <a className="ml-5 button-outline">Connexion</a>
          </NextLink>
          <SwitchThemeButton />
        </>}
        {user && <div className="flex flex-col items-center">
          <div>
            <span>{user.name}</span>
          </div>
          <div className="mt-8 flex justify-center items-center">
            <button
              className="mr-4 button-outline"
              onClick={() => {
                clickLogout()
                setOpen(false)
              }}
            >
              Déconnexion
            </button>
            <SwitchThemeButton />
          </div>
        </div>}
      </div>
      <div className="mt-8 flex flex-col justify-center items-center">
        {links.map(({ text, href }, i) => (
          <NextLink key={i} href={href}>
            <a onClick={() => setOpen(false)} className="mt-3 mx-3 text-gray-700 hover:text-gray-800 dark:text-gray-300 dark:hover:text-gray-400 transition-all">{text}</a>
          </NextLink>
        ))}
      </div>
    </div>
    <div
      className={`fixed top-0 left-0 w-screen h-screen bg-gray-600 z-10 opacity-50${open ? " block lg:hidden" : " hidden"}`}
      onClick={() => setOpen(false)}
    />
  </>
}

export default NavBar