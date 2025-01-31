import { useEffect, useState } from 'react'
import { siteConfig } from '@/lib/config'
import Card from '@/themes/hexo/components/Card'
import { useGlobal } from '@/lib/global'
import Link from 'next/link'
import { RecentComments } from '@waline/client'

/**
 * @see https://waline.js.org/guide/get-started.html
 * @param {*} props
 * @returns
 */
const HexoRecentComments = (props) => {
  const [comments, updateComments] = useState([])
  const { locale } = useGlobal()
  const [onLoading, changeLoading] = useState(true)
  useEffect(() => {
    RecentComments({
      serverURL: siteConfig('COMMENT_WALINE_SERVER_URL'),
      count: 5
    }).then(({ comments }) => {
      changeLoading(false)
      updateComments(comments)
    })
  }, [])

  return (
        <Card >
            <div className=" mb-2 px-1 justify-between">
                <i className="mr-2 fas fas fa-comment" />
                {locale.COMMON.RECENT_COMMENTS}
            </div>

            {onLoading && <div>Loading...<br />首次访问加载时间较长，如果超过半分钟还未自动刷新页面，请尝试手动刷新。<br />也有可能自动刷新之后提示404并跳转回首页，这时可以再次尝试访问该页面，若页面确实存在，则此次应能访问。<i className='ml-2 fas fa-spinner animate-spin' /></div>}
            {!onLoading && comments && comments.length === 0 && <div>No Comments</div>}
            {!onLoading && comments && comments.length > 0 && comments.map((comment) => <div key={comment.objectId} className='pb-2 pl-1'>
                <div className='dark:text-gray-200 text-sm waline-recent-content wl-content' dangerouslySetInnerHTML={{ __html: comment.comment }} />
                <div className='dark:text-gray-400 text-gray-400  text-sm text-right cursor-pointer hover:text-red-500 hover:underline pt-1 pr-2'>
                    <Link href={{ pathname: comment.url, hash: comment.objectId, query: { target: 'comment' } }}>--{comment.nick}</Link>
                </div>
            </div>)}

        </Card>
  )
}

export default HexoRecentComments
