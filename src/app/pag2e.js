import React from 'react'
import { SlideBanner, SlideNewsCard } from '@/component/banner/banner'
function page() {
  <div className='flex flex-col bg-white justify-evenly content-center items-center m-4 h-[95vh] w-[95%]'>
    <div className='md:flex flex-col justify-center content-center items-center items-center min-w-[95%] max-w-[95%] min-h-[50%] max-h-[50%] hidden'>
      <SlideBanner />
    </div>
    <SlideNewsCard />
  </div>  
}

export default page