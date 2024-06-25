import React from 'react'
import sidebar from '@/component/sidebar/sidebar'

function notFound() {
    return (
        <div className='h-screen w-screen dark:bg-gray-50'>
            <section className="flex items-center h-full p-16 dark:bg-gray-50 dark:text-gray-800">
                <div className="container flex flex-col items-center justify-center px-5 mx-auto my-8">
                    <div className="max-w-md text-center">
                        <h2 className="mb-8 font-extrabold text-9xl dark:text-primari">
                            <span className="sr-only">Error</span>404
                        </h2>
                        <p className="text-2xl font-semibold md:text-3xl">Lo sentimos.</p>
                        <p className="mt-4 mb-8 dark:text-gray-600">no pudimos encontrar esta página</p>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default notFound