"use client"
/* eslint-disable react-hooks/rules-of-hooks */
import React, { useEffect, useState } from 'react'
import SeguimientoMod from '@/component/seguimientos/modificar/seguimientoMod'

function page({ params }) {

    const [estado, setEstado] = useState([])
    const [estadoSeguimiento, setEstadoSeguimiento] = useState([])

    useEffect(() => {
        const fechData = async () => {
            const response = await fetch('https://td-g-production.up.railway.app/estado-seguimiento-cambio/id/' + params.idB);
            const data = await response.json();
            if (response.ok) {
                setEstado(data.estadoSeguimiento);
                setEstadoSeguimiento(data);
            }
        }
        fechData()
    }, [params]);

    return (
        <div className="ml-6 mr-6 mt-6 border   bg-white border-b flex justify-between">
            <div className='pt-8  pb-8 w-full'>
                <div className='md:h-22 lg:h-22 xl:h-22 sm:h-22 border-b-2 pl-8 pb-5 pr-52 flex justify-between items-center'>
                    <div>
                        <h1 className='text-4xl font-bold text-gray-600'>Seguimiento</h1>
                    </div>
                </div>
                <div className='p-10'>
                    {(estado.id == 1 && parseInt(new Date(estadoSeguimiento.fecha).getDate()) == parseInt(new Date().getDate())||estado.id == 3) ? (<SeguimientoMod idSeguimiento={params.id} idEstado={params.idB} />) : (<h1 className='text-3xl font-bold text-gray-400'>No puedes editar esta asesoría. Si la fecha han pasado, comunícate con el coordinador para volver a activarla.</h1>)}

                </div>
            </div>
        </div>
    )
}

export default page