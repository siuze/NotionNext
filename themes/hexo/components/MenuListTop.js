import { useGlobal } from '@/lib/global'
import CONFIG from '../config'
import { siteConfig } from '@/lib/config'
import { MenuItemDrop } from './MenuItemDrop'

export const MenuListTop = ({ props, position = 'right' }) => {
  const { customNav, customMenu } = props
  const { locale } = useGlobal()

  let links = [
    { id: 1, icon: 'fa-solid fa-house', name: locale.NAV.INDEX, to: '/', show: siteConfig('HEXO_MENU_INDEX', null, CONFIG) },
    { id: 2, icon: 'fas fa-search', name: locale.NAV.SEARCH, to: '/search', show: siteConfig('HEXO_MENU_SEARCH', null, CONFIG) },
    { id: 3, icon: 'fas fa-archive', name: locale.NAV.ARCHIVE, to: '/archive', show: siteConfig('HEXO_MENU_ARCHIVE', null, CONFIG) }
    // { icon: 'fas fa-folder', name: locale.COMMON.CATEGORY, to: '/category', show: siteConfig('MENU_CATEGORY', null, CONFIG) },
    // { icon: 'fas fa-tag', name: locale.COMMON.TAGS, to: '/tag', show: siteConfig('MENU_TAG', null, CONFIG) }
  ]

  if (customNav) {
    // links = links.concat(customNav)
    links = []
    for (let i = 0; i < customNav.length; i++) {
      if (position === 'right') {
        if (!(customNav[i].summary) || !(customNav[i].summary.startsWith('left'))) {
          links.push(customNav[i])
        }
      } else {
        if (customNav[i].summary && customNav[i].summary.startsWith('left')) {
          links.push(customNav[i])
        }
      }
    }
  }

  // 如果 开启自定义菜单，则覆盖Page生成的菜单
  if (siteConfig('CUSTOM_MENU') && customMenu) {
    // links = customMenu
    links = []
    for (let i = 0; i < customMenu.length; i++) {
      if (position === 'right') {
        if (!(customMenu[i].summary) || !(customMenu[i].summary.startsWith('left'))) {
          links.push(customMenu[i])
        }
      } else {
        if (customMenu[i].summary && customMenu[i].summary.startsWith('left')) {
          links.push(customMenu[i])
        }
      }
    }
  }
  for (let i = 0; i < links.length; i++) {
    if (links[i].id !== i) {
      links[i].id = i
    }
  }

  if (!links || links.length === 0) {
    return null
  }

  return (<>
        <nav id='nav-mobile' className='leading-8 justify-center font-light w-full flex'>
            {links?.map((link, index) => link && link.show && <MenuItemDrop key={index} link={link} />)}
        </nav>
    </>)
}
