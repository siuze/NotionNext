import { siteConfig } from '@/lib/config'
import SmartLink from '@/components/SmartLink'
/**
 * Logo
 * 实际值支持文字
 * @param {*} props
 * @returns
 */
const Logo = props => {
  const { siteInfo } = props
  return (
    <SmartLink href='/' passHref legacyBehavior>
      <div className='my-nav-logo transform duration-200 hover:scale-105 flex flex-col justify-center items-center cursor-pointer space-y-3'>
        <img className='my-icon' src='/favicon.ico'/>
        <div className='my-icon-text font-medium text-lg rounded dark:border-white'>
          {' '}
          {siteInfo?.title || siteConfig('TITLE')}
        </div>
      </div>
    </SmartLink>
  )
}
export default Logo
