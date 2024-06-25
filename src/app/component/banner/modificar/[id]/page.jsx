import React from 'react'
import BannerForm from '@/component/banner/bannerForm'

function Page({ params }) {
    return (
        <div className="ml-6 mr-6 mt-6 border bg-white border-b flex justify-between">
            <div className='pt-8 pb-8 w-full'>
                <div className=' md:h-22 lg:h-16 xl:h-22 sm:h-22  border-b-2 pl-8 items-start w-full flex '>
                    <h2 className='text-4xl font-bold text-center text-gray-600'>Modificar: Contenido informativo</h2>
                </div>
                <div className='p-5'>
                    <BannerForm type={2} id={params.id} />
                </div>
            </div>
        </div >
    );
}

export default Page;