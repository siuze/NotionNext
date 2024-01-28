import Link from 'next/link'
import { useState,useEffect,useCallback } from 'react'
import throttle from 'lodash.throttle'
import { useRouter } from 'next/router'

export const MenuItemDrop = ({ link }) => {
  const [show, changeShow] = useState(false)
  const [pickColor, setPickColor] = useState("nav-menu-link");
  const hasSubMenu = link?.subMenus?.length > 0
  useEffect(() => {
    scrollTrigger()
    window.addEventListener('scroll', scrollTrigger)
    return () => {
      window.removeEventListener('scroll', scrollTrigger)
    }
  }, [])
  const router = useRouter()

  const throttleMs = 200
  const scrollTrigger = useCallback(throttle(() => {
    const scrollS = window.scrollY
    const header = document.querySelector('#header')
    // 是否将导航栏透明
    const navTransparent = (scrollS < document.documentElement.clientHeight - 12 && router.route === '/') || scrollS < 300 // 透明导航条的条件

    if (header && navTransparent) {
		setPickColor('nav-menu-link')
    } else {
		setPickColor('nav-menu-link-scroll')
    }
}, throttleMs)
)
  if (!link || !link.show) {
    return null
  }

  return <div onMouseOver={() => changeShow(true)} onMouseOut={() => changeShow(false)} className={"transform duration-200 hover:scale-110 "+pickColor} >

        {!hasSubMenu &&
            <Link
                href={link?.to} target={link?.to?.indexOf('http') === 0 ? '_blank' : '_self'}
                className="font-sans pl-2 pr-4 text-white-700 dark:text-white-200 no-underline tracking-widest pb-1">
                {link?.icon && <i className={link?.icon}/>} {link?.name}
                {hasSubMenu && <i className='px-2 fa fa-angle-down'></i>}
            </Link>}

        {hasSubMenu && <>
            <div className='cursor-pointer font-sans pl-2 pr-4 text-white-700 dark:text-white-200 no-underline tracking-widest pb-1'>
                {link?.icon && <i className={link?.icon}/>} {link?.name}
                <i className={`px-2 fa fa-angle-down duration-300  ${show ? 'rotate-180' : 'rotate-0'}`}></i>
            </div>
        </>}

        {/* 子菜单 */}
        {hasSubMenu && <ul style={{ backdropFilter: 'blur(3px)' }} className={`${show ? 'visible opacity-100 top-12' : 'invisible opacity-0 top-20'} drop-shadow-md overflow-hidden rounded-md bg-white transition-all duration-300 z-20 absolute block  `}>
            {link.subMenus.map((sLink, index) => {
              return <li key={index} className='cursor-pointer hover:bg-indigo-300 text-gray-900 hover:text-black tracking-widest transition-all duration-200 dark:border-gray-800  py-1 pr-6 pl-3'>
                    <Link href={sLink.to} target={link?.to?.indexOf('http') === 0 ? '_blank' : '_self'}>
                        <span className='text-sm text-nowrap font-extralight'>{link?.icon && <i className={sLink?.icon} > &nbsp; </i>}{sLink.title}</span>
                    </Link>
                </li>
            })}
        </ul>}

    </div>
}
