"use client"
import React, { useState } from 'react';
import ExcelUploader from './ExcelUploader';

function Page() {

    return (
        <div className="ml-6 mr-6 mt-6 border bg-white border-b flex justify-between">
            <div className='pt-8 pb-8 w-full'> 
                <div className=' w-full border-b-2 flex items-center sm:items-start justify-center sm:justify-start sm:pl-8 sm:h-22 pb-5 text-center sm:text-left'>
                    <h1 className='text-4xl font-bold text-gray-600'>Estudiantes</h1>
                </div>
                <div className='p-10'>
                    <div className="mt-2">
                        <p>Antes de continuar, te recomendamos tener a la mano todos los archivos Excel de cada asignatura previamente descargados del Portal Académico, posteriormente puedes cargar tus archivos de manera simultánea haciendo clic en el botón a continuación:</p><br></br>
                        <ExcelUploader onUpload={() => setMostrarBoton(true)} />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Page;
