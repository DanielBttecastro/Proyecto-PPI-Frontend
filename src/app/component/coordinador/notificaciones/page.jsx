/* eslint-disable react-hooks/rules-of-hooks */
"use client"
import React, { useEffect, useState } from 'react'
import notificaciones from '@/component/notificaciones/notificaciones'
import { useRouter } from "next/navigation";

function page() {

    const [notificaciones, setNotificaciones] = useState([])
    const [showCorrecto, setShowCorrecto] = useState(false);
    const router = useRouter();

    const eliminarNotificacion = async (id) => {
        const requestOptions = {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' }
        };
        const response = await fetch('https://td-g-production.up.railway.app/notificaciones/' + id, requestOptions);
        if (response.ok) {
            setShowCorrecto(true)
            setTimeout(() => {
                window.location.reload(); // Recarga la página
            }, 2000);
        }
    }

    useEffect(() => {
        const notificaciones = async () => {
            const response = await fetch('https://td-g-production.up.railway.app/notificaciones/');
            const data = await response.json();
            if (response.ok) {
                console.log(data)
                setNotificaciones(data)
            }
        }

        notificaciones()
    }, []);

    useEffect(() => {
        if (showCorrecto) {
            const timer = setTimeout(() => {
                setShowCorrecto(false);
            }, 5000);

            return () => clearTimeout(timer);
        }
    }, [showCorrecto]);

    const verAsesor = async (asesor, id, tipo) => {
        const datos = {
            "estado": 2
        }
        const requestOptions = {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(datos)
        };
        const response = await fetch('https://td-g-production.up.railway.app/notificaciones/' + id, requestOptions);
        if (response.ok) {
            if (tipo == 1) {
                router.push('/component/coordinador/horasAsesores/' + asesor);
            } else {
                router.push('/component/asesorias/visualizar/asesor/' + asesor);
            }
        }
    }
    return (
        <div className="ml-6 mr-6 mt-6 border   bg-white border-b flex justify-between">
            <div className='pt-8  pb-8 w-full'>
                <div className='md:h-22 lg:h-22 xl:h-22 sm:h-22 border-b-2 pl-8 pb-5 pr-52 flex justify-between items-center'>
                    <div>
                        <h1 className='text-4xl font-bold text-gray-600'>Notificaciones</h1>
                    </div>
                </div>
                <div className='px-10'>
                    <div>

                        {notificaciones.map((item) => {
                            return (
                                <div key={item.id} className={`relative  h-auto min-h-14 w-full mt-8 rounded-xl border-2 items-center grid grid-cols-3 ${item.tipo == 1 ? (`bg-green-400  border-green-400`) : (`bg-red-400  border-red-400`)} shadow-md`}>
                                    <div className='text-white text-xl font-bold flex  items-center justify-start ml-10'>
                                        {item.tipo == 1 ? (<>Creación</>) : (<>Cancelación</>)}
                                    </div>
                                    <div className='text-white text-xl font-semibold flex items-center justify-start'>
                                        {item.mensaje}
                                    </div>
                                    <div className='text-white text-xl font-semibold flex items-center justify-end mr-5'>
                                        <button onClick={() => { verAsesor(item.redireccion, item.id, item.tipo) }}>
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="white" className="w-6 h-6 mr-5 cursor-pointer">
                                                <path stroke-linecap="round" stroke-linejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607ZM10.5 7.5v6m3-3h-6" />
                                            </svg>
                                        </button>
                                        <button onClick={() => { eliminarNotificacion(item.id) }}>
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="white" className="w-6 h-6 cursor-pointer">
                                                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    </div>
                                    {item.estado == 1 ? (<div className='absolute -top-2 -left-2 bg-orange-500 h-5 w-5 rounded-full'></div>) : (<></>)}
                                </div>
                            )
                        })}

                    </div>
                </div>
            </div>
            {showCorrecto && (
                <div className="fixed bottom-0 right-0 mb-8 mr-8">
                    <div className="flex w-96 shadow-lg rounded-lg">
                        <div class="bg-green-600 py-4 px-6 rounded-l-lg flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" class="text-white fill-current" viewBox="0 0 16 16" width="20" height="20"><path fill-rule="evenodd" d="M13.78 4.22a.75.75 0 010 1.06l-7.25 7.25a.75.75 0 01-1.06 0L2.22 9.28a.75.75 0 011.06-1.06L6 10.94l6.72-6.72a.75.75 0 011.06 0z"></path></svg>
                        </div>
                        <div className="px-4 py-6 bg-white rounded-r-lg flex justify-between items-center w-full border border-l-transparent border-gray-200">
                            <div>Eliminado correctamente.</div>
                            <button onClick={() => { setShowCorrecto(!showCorrecto) }}>
                                <svg xmlns="http://www.w3.org/2000/svg" className="fill-current text-gray-700" viewBox="0 0 16 16" width="20" height="20">
                                    <path fillRule="evenodd" d="M3.72 3.72a.75.75 0 011.06 0L8 6.94l3.22-3.22a.75.75 0 111.06 1.06L9.06 8l3.22 3.22a.75.75 0 11-1.06 1.06L8 9.06l-3.22 3.22a.75.75 0 01-1.06-1.06L6.94 8 3.72 4.78a.75.75 0 010-1.06z"></path>
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default page