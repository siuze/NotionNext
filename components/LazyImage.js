import { siteConfig } from '@/lib/config'
import Head from 'next/head'
import React, { useEffect, useRef, useState } from 'react'
// import CrossfadeImage from 'react-crossfade-image'
/**
 * 图片懒加载
 * @param {*} param0
 * @returns
 */
export default function LazyImage({
  priority,
  id,
  src,
  alt,
  placeholderSrc,
  className,
  width,
  height,
  title,
  onLoad,
  style
}) {
  const imageRef = useRef(null)
  const [imageLoaded, setImageLoaded] = useState(false)
  if (!placeholderSrc) {
    placeholderSrc = siteConfig('IMG_LAZY_LOAD_PLACEHOLDER')
  }

  const handleImageLoad = () => {
    setImageLoaded(true)
    if (typeof onLoad === 'function') {
      onLoad() // 触发传递的onLoad回调函数
    }
  }

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const lazyImage = entry.target
            lazyImage.src = src
            observer.unobserve(lazyImage)
          }
        })
      },
      { rootMargin: '50px 0px' } // Adjust the rootMargin as needed to trigger the loading earlier or later
    )

    if (imageRef.current) {
      observer.observe(imageRef.current)
    }

    return () => {
      if (imageRef.current) {
        observer.unobserve(imageRef.current)
      }
    }
  }, [src])

  // 动态添加width、height和className属性，仅在它们为有效值时添加
  const imgProps = {
    ref: imageRef,
    src: imageLoaded ? src : id === 'header-cover' ? `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1024' height='576'%3E%3Cpath fill='%235a9cbc' d='M0 0h1024v576H0z'/%3E%3Cg fill-opacity='.502'%3E%3Cpath fill='%23c4fcff' d='M-62 346l1148-44L846 42z'/%3E%3Cpath fill='%2336271c' d='M838 570l248-264-1148 80z'/%3E%3Cpath fill='%2300b8ff' d='M10-62l-44 336L1086 46z'/%3E%3Cpath fill='%237d726b' d='M-62 378l1148 88-912 172z'/%3E%3Cpath fill='%234ebeff' d='M22 230l1064-28-88-264z'/%3E%3Cpath fill='%23c4d9ef' d='M-42 178l680 120-680 60z'/%3E%3Cpath fill='%231f3c49' d='M2 346l580 36-616 128z'/%3E%3Cpath fill='%230095e9' d='M750-6L-62-62 2 150z'/%3E%3Cpath fill='%237ca4c4' d='M314 518l484 120 276-140z'/%3E%3Cpath fill='%23dfe5f3' d='M562 342l-28-128 472 84z'/%3E%3Cpath fill='%23184b60' d='M430 374l656 92V290z'/%3E%3Cpath fill='%2388694e' d='M590 446l496-80-36 128z'/%3E%3Cpath fill='%23c0e3fe' d='M702 238l344-84 40 164z'/%3E%3Cpath fill='%23837c72' d='M-42 538l52-128 444 48z'/%3E%3Cpath fill='%236498c0' d='M550 558L18 486l-80 152z'/%3E%3Cpath fill='%2331acec' d='M498 46l588-108-264 244z'/%3E%3Cpath fill='%2359b9ea' d='M-62 258l572-68-444-68z'/%3E%3Cpath fill='%23b3d7eb' d='M594 342l100-8-220-116z'/%3E%3Cpath fill='%23143648' d='M558 338l96 88H234z'/%3E%3Cpath fill='%235cc0f4' d='M1086 14v268L690 106z'/%3E%3Cpath fill='%23a9c8d6' d='M418 446l104 28H346z'/%3E%3Cpath fill='%2300a0e4' d='M-62 170l44-232L818 2z'/%3E%3Cpath fill='%237494a9' d='M998 638l-516-88 604-72z'/%3E%3Cpath fill='%23c0ddee' d='M442 342l40-112-428 28z'/%3E%3Cpath fill='%23005984' d='M1086 406l-368-76 368-28z'/%3E%3Cpath fill='%23001b3a' d='M26 418l-88-48 212 16z'/%3E%3Cpath fill='%230a354f' d='M110 382l200-28-60 68z'/%3E%3Cpath fill='%23cce1eb' d='M830 310l244-8-212-120z'/%3E%3Cpath fill='%236a6d68' d='M378 406H-62l300 116z'/%3E%3Cpath fill='%2365bfed' d='M574 138L-6 206l300 44z'/%3E%3Cpath fill='%23bbd7e6' d='M698 334l16-92-268 88z'/%3E%3Cpath fill='%23a7cee3' d='M-62 258l440-24-440 148z'/%3E%3Cpath fill='%23096587' d='M434 382l24-44h136z'/%3E%3Cpath fill='%231c88c3' d='M222 370L78 330l-120 40z'/%3E%3Cpath fill='%2362574a' d='M586 506H354l112-36z'/%3E%3Cpath fill='%236a401d' d='M-6 634l-56-64 228 4z'/%3E%3Cpath fill='%237d6c56' d='M-62 490l324 8-144-52z'/%3E%3Cpath fill='%23897662' d='M674 450l412-16-188 68z'/%3E%3Cpath fill='%236592af' d='M738 502L34 514l488 124z'/%3E%3Cpath fill='%234db8ee' d='M830 34l-56 148-496-8z'/%3E%3Cpath fill='%2395b7ce' d='M182 338l-232-60-12 80z'/%3E%3Cpath fill='%236aabd9' d='M346 318l64 44-192-24z'/%3E%3Cpath fill='%2383b8d9' d='M326 638L62 546l384 28z'/%3E%3Cpath fill='%2335afea' d='M18 242l-80-132 576-36z'/%3E%3Cpath fill='%2374caf7' d='M854 142l-88 108-328-36z'/%3E%3Cpath fill='%2317526a' d='M390 354l168 60 236-72z'/%3E%3Cpath fill='%234a3f37' d='M622 402l172-4-60 32z'/%3E%3Cpath fill='%233e7ca5' d='M-46 554l224-56-204-8z'/%3E%3Cpath fill='%23e2f1f9' d='M654 234H502l68 32z'/%3E%3Cpath fill='%2321a8eb' d='M1086 18L830-62 630 46z'/%3E%3Cpath fill='%23ac9b82' d='M126 466l-64 24 132-12z'/%3E%3Cpath fill='%23796c5b' d='M434 498l168-72 232 80z'/%3E%3Cpath fill='%23165472' d='M586 390l292-80 88 80z'/%3E%3Cpath fill='%23fffffc' d='M962 274l-84-40 4 40z'/%3E%3Cpath fill='%23c7dfe9' d='M106 274l4 48L6 254z'/%3E%3Cpath fill='%2360a6d5' d='M2 450l-32-16h88z'/%3E%3Cpath fill='%23092c44' d='M206 382l248-8-100 44z'/%3E%3Cpath fill='%23485259' d='M1050 442l-312-40 340-48z'/%3E%3Cpath fill='%2372c9f5' d='M962 254l40-176-104 160z'/%3E%3Cpath fill='%23009ae1' d='M-2-62l-60 192L682-2z'/%3E%3Cpath fill='%23247fb0' d='M206 350l52 20-68 4z'/%3E%3Cpath fill='%23d4e9f3' d='M398 318l-16-84 96 20z'/%3E%3Cpath fill='%237098b1' d='M486 514l568-12-76 136z'/%3E%3Cpath fill='%237d8482' d='M386 446l164 44 24-44z'/%3E%3Cpath fill='%23a8cae0' d='M450 262l96 60-120 24z'/%3E%3Cpath fill='%23889497' d='M166 466l144 36 80-48z'/%3E%3Cpath fill='%2391b9d2' d='M162 302l128 40-268 4z'/%3E%3Cpath fill='%23e9f1ee' d='M226 326l-40-32 24-44z'/%3E%3Cpath fill='%23263843' d='M634 426H378l176-56z'/%3E%3Cpath fill='%23a1cde0' d='M586 334l116 8-4-40z'/%3E%3Cpath fill='%237cb5dc' d='M882 222l-68-16 40 40z'/%3E%3Cpath fill='%23525a5e' d='M338 506l-100 4-12-32z'/%3E%3Cpath fill='%2392bbd7' d='M782 298l96-4-128-32z'/%3E%3Cpath fill='%235eb7e4' d='M90 166l-144 84 364-44z'/%3E%3Cpath fill='%236c7b7f' d='M326 430l-224 4 124 32z'/%3E%3Cpath fill='%231988bf' d='M442 346l-92 12 40 12z'/%3E%3Cpath fill='%23002c47' d='M226 406l-128-4 80-24z'/%3E%3Cpath fill='%23625542' d='M30 474l108-32H-14z'/%3E%3Cpath fill='%23b6d1de' d='M398 458l56 8-60 8z'/%3E%3Cpath fill='%23678ba1' d='M602 638l324-72-676-56z'/%3E%3C/g%3E%3C/svg%3E` : placeholderSrc ,
    alt: alt,
    onLoad: handleImageLoad
  }

  if (id) {
    imgProps.id = id
  }

  if (title) {
    imgProps.title = title
  }

  if (width && width !== 'auto') {
    imgProps.width = width
  }

  if (height && height !== 'auto') {
    imgProps.height = height
  }
  if (className) {
    imgProps.className = className
  }
  if (style) {
    imgProps.style = style
  }
  return (<>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img {...imgProps} />
        {/* 预加载 */}
        {priority && <Head>
            <link rel='preload' as='image' src={src} />
        </Head>}
    </>)
}
