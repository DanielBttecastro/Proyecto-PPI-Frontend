/* eslint-disable react-hooks/rules-of-hooks */
"use client"
import React, { useState } from 'react'

function mostrarEstudiante({ citaid }) {
    const [cita,setCita]=useState([]);
    useEffect(() => {
        const traerCita = async () => {
            const response = await fetch(`https://projectppi-backend-production.up.railway.app/citas-asesoria-ppi/${citaid}`);
            const data = await response.json();
            if (response.ok) {
                setCita(data)

            }
        }
        traerCita();
    }, [citaid]); 
    console.log(estadoCita)
    return (
        <div className='p-10  grid grid-cols-1 lg:grid-cols-2'>
            <div className="xl:ml-40">
                <div className="flex m-4 sm:m-10">
                    <h1 className="text-2xl sm:text-4xl font-bold text-gray-600">Estado:</h1>
                    <span className="inline-block mt-1 sm:mt-2 ml-2 sm:ml-4 px-2 sm:px-3 py-1 bg-green-500 text-white font-semibold rounded-full">
                        
                    </span>
                </div>
                <div className="flex m-4 sm:m-10">
                    <h1 className="text-2xl sm:text-4xl font-bold text-gray-600">Fecha:</h1>
                    <span className="inline-block mt-1 sm:mt-2 ml-2 sm:ml-4 px-2 sm:px-3 py-1 text-lg">
                        sdsd   </span>
                </div>
                <div className="flex m-4 sm:m-10">
                    <h1 className="text-2xl sm:text-4xl font-bold text-gray-600">Hora:</h1>
                    <span className="inline-block mt-1 sm:mt-2 ml-2 sm:ml-4 px-2 sm:px-3 py-1 text-lg">
                        sd     </span>
                </div>
            </div>
            <div className="justify-center  lg:mt-20 xl:mt-0">
                <button class="text-white xl:mt-20 h-14 py-2 px-4 w-full rounded bg-orange-400 hover:bg-orange-500 shadow hover:shadow-lg font-medium transition transform hover:-translate-y-0.5">Modificar</button>
                <button class="text-white mt-7 h-14 py-2 px-4 w-full rounded bg-red-400 hover:bg-red-500 shadow hover:shadow-lg font-medium transition transform hover:-translate-y-0.5">Cancelar</button>

            </div>
        </div>
    )
}

export default mostrarEstudiante