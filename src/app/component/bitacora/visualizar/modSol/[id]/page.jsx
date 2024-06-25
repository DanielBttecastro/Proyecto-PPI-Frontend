"use client"
/* eslint-disable react-hooks/rules-of-hooks */
import React, { useEffect, useState } from 'react'
import CrearBitacora from '@/component/bitacora/visualizar/modSol/crearBitacora/crearBitacora'

function page({ params }) {

    return (
        <div className="ml-6 mr-6 mt-6 border   bg-white border-b flex justify-between">
            <div className='pt-8  pb-8 w-full'>
                <div className='w-full border-b-2 flex items-center sm:items-start justify-center sm:justify-start sm:pl-8 sm:h-22 pb-5 text-center sm:text-left'>
                    <h1 className='text-4xl font-bold text-gray-600'>Bitácoras del equipo {params.id}</h1>
                </div>
                <div className='p-10'>
                    <CrearBitacora equipo={params.id} />
                </div>
            </div>
        </div>
    )
}

export default page
