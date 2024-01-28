import { siteConfig } from '@/lib/config'
import { useGlobal } from '@/lib/global'
import { useRouter } from 'next/router'
import AlgoliaSearchModal from '@/components/AlgoliaSearchModal'
import { useRef } from 'react'
import { useHexoGlobal } from '..'

/**
 * 搜索按钮
 * @returns
 */
export default function SearchButton(props) {
  const { locale } = useGlobal()
  const router = useRouter()
  const { searchModal} = useHexoGlobal()

  function handleSearch() {
    if (siteConfig('ALGOLIA_APP_ID')) {
      searchModal.current.openSearch()
    } else {
      router.push('/search')
    }
  }

  return <>
        <div onClick={handleSearch} title={locale.NAV.SEARCH} alt={locale.NAV.SEARCH} className=''>
            <i title={locale.NAV.SEARCH} className="fa-solid fa-magnifying-glass" /> {'搜索'}
        </div>
    </>
}
