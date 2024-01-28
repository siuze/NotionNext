import { siteConfig } from '@/lib/config'
import dynamic from 'next/dynamic'
const Footer = ({ title }) => {
  const d = new Date()
  const currentYear = d.getFullYear()
  const since = siteConfig('SINCE')
  const copyrightDate = parseInt(since) < currentYear ? since + '-' + currentYear : currentYear
  const Fish = dynamic(() => {return import('@/components/Fish')},{ ssr: false })
  return (
    <footer
      className='relative z-10 dark:bg-black flex-shrink-0 bg-hexo-light-gray justify-center text-center m-auto w-full leading-6  text-gray-600 dark:text-gray-100 text-sm'
    >
      {/* <DarkModeButton/> */}
      <div style={{ position: 'absolute', width: "100%", zIndex: 0 }}>
        {siteConfig('BEI_AN') && <><i className='fas fa-shield-alt' /> <a href='https://beian.miit.gov.cn/' className='mr-2'>{siteConfig('BEI_AN')}</a><br /></>}
        <a href={siteConfig('LINK')} className='text-xs pt-4 text-light-400 dark:text-gray-400'>{title} {siteConfig('BIO') && <>|</>} {siteConfig('BIO')}</a><br />
        <span className='text-xs pl-2 hidden busuanzi_container_site_uv'><i className='text-xs fas fa-users' /> <span className='text-xs px-1 busuanzi_value_site_uv'> </span> </span><span className='text-xs hidden busuanzi_container_site_pv'><i className='text-xs fas fa-eye' /><span className='text-xs px-1 busuanzi_value_site_pv'> </span>  </span><br />
        <i className='far fa-copyright' /> {`${copyrightDate}`} <a href={siteConfig('LINK')} className='text-xs pt-4 text-light-400 dark:text-gray-400'>{siteConfig('AUTHOR')}</a>. All Rights Reserved. <p className='text-xs pt-2 text-light-500 dark:text-gray-500'><i className='mx-1 fas fa-code' />Powered by <a href='https://github.com/siuze/NotionNext' className='dark:text-gray-300'>NotionNext {siteConfig('VERSION')}</a>.</p>
      </div>
      <Fish />
    </footer>
  )
}

export default Footer
