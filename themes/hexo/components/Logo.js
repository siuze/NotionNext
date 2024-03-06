import { siteConfig } from '@/lib/config'
import Link from 'next/link'

const Logo = props => {
  return (
    <Link href='/' passHref legacyBehavior>
      <div className='my-nav-logo transform duration-200 hover:scale-105 flex flex-col justify-center items-center cursor-pointer'>
        <image className='my-icon' src='/favicon.ico'/>
        <div className='my-icon-text font-medium text-lg rounded dark:border-white'> {siteConfig('TITLE') }</div>
      </div>
    </Link>
  )
}
export default Logo
