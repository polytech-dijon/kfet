import NextLink from 'next/link'
import { RiHeartFill } from 'react-icons/ri'
import FacebookIcon from "../public/Facebook-Logo-White.svg"
import InstagramIcon from "../public/Instagram-Logo-White.svg"
import DiscordIcon from "../public/Discord-Logo-White.svg"
import YoutubeIcon from "../public/Youtube-Logo-White.svg"
import TwitchIcon from "../public/Twitch-Logo-White.svg"
import TwitterIcon from "../public/Twitter-Logo-White.svg"
import TiktokIcon from "../public/Tiktok-Logo-White.svg"

export interface FooterLink {
  text: string;
  href: string;
}
export const links: FooterLink[] = [
  {
    text: "Accueil",
    href: "/",
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

const Footer = () => {
  return <div className="p-4 border-t border-gray-300 dark:border-gray-800">
    <div className="container flex flex-col md:flex-row justify-between items-center">
      <div>
        <div className="flex flex-col items-center md:items-start">
          <h3 className=" text-2xl">
            BDE <span className="text-primary-light dark:text-primary-dark">MEGA</span>
          </h3>
          <NextLink href="/">
            <a className="mt-2 text-sm text-gray-700 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 transition-all" target="_blank">
              Site officiel de la liste du BDE MEGA.
            </a>
          </NextLink>
        </div>
        <div className="mt-6 md:mt-8 flex justify-center md:justify-start items-center">
          <a className="text-gray-500" href="https://facebook.com/bdemega/" target="_blank" rel="noreferrer">
            <FacebookIcon style={{ fill: "currentColor", width: 24 }} />
          </a>
          <a className="text-gray-500 ml-1.5" href="https://instagram.com/bde_mega" target="_blank" rel="noreferrer">
            <InstagramIcon style={{ fill: "currentColor", width: 24 }} />
          </a>
          {/* <a className="text-gray-500 ml-3" href="https://discord.com/" target="_blank" rel="noreferrer">
            <DiscordIcon style={{ fill: "currentColor", width: 24 }} />
          </a> */}
          <a className="text-gray-500 ml-3" href="https://www.youtube.com/channel/UCCFiMmGyjgpQS8Bb4Et9h7g" target="_blank" rel="noreferrer">
            <YoutubeIcon style={{ fill: "currentColor", height: 20 }} />
          </a>
          <a className="text-gray-500 ml-3" href="https://twitch.com/bde_mega" target="_blank" rel="noreferrer">
            <TwitchIcon style={{ fill: "currentColor", height: 24 }} />
          </a>
          <a className="text-gray-500 ml-3" href="https://twitter.com/bde_mega" target="_blank" rel="noreferrer">
            <TwitterIcon style={{ fill: "currentColor", width: 24 }} />
          </a>
          <a className="text-gray-500 ml-1.5" href="https://www.tiktok.com/@bde_mega" target="_blank" rel="noreferrer">
            <TiktokIcon style={{ fill: "currentColor", width: 24 }} />
          </a>
        </div>
      </div>
      <div className="flex flex-col justify-center items-center mt-8 md:mt-4">
        <div className="flex flex-wrap justify-center">
          {links.map(({ text, href }, i) => (
            <div key={i}>
              <NextLink href={href}>
                <a className="my-1 mx-2 text-sm text-gray-700 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 transition-all" color="neutral">{text}</a>
              </NextLink>
            </div>
          ))}
        </div>
        <div className="mt-4 flex items-center text-sm text-gray-500 dark:text-gray-500">
          Créé avec <RiHeartFill className="mx-1" /> par <a className="ml-1" href="https://github.com/gauthier-th" target="_blank" rel="noreferrer">gauthier-th</a>
        </div>
      </div>
    </div>
  </div>
}

export default Footer