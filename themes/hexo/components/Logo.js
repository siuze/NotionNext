import BLOG from '@/blog.config'
import Link from 'next/link'
import React from 'react'

const Logo = props => {
  const { siteInfo } = props
  return (
    <Link href='/' passHref legacyBehavior>
      <div className='my-nav-logo hover:scale-110 flex flex-col justify-center items-center cursor-pointer space-y-3'>
        <img className='my-icon' src='favicon.ico'/>
        <div className='my-icon-text text-lg p-1.5 rounded dark:border-white transform duration-200'> {siteInfo?.title || BLOG.TITLE}</div>
      </div>
    </Link>
  );
}
export default Logo
