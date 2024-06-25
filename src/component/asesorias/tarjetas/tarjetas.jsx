/* eslint-disable react-hooks/rules-of-hooks */
"use client"
import React, { useEffect, useState } from 'react'
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import CryptoJS from 'crypto-js'; 

function tarjetas() {

    const [citas, setCitas] = useState([]);
    const [usuario, setUsuario] = useState([]);
    const [equipo, setEquipo] = useState([]);
    const [citasDisponibles, setCitasDisponibles] = useState(true);
    const [showNoEqupo, setShowNoEqupo] = useState(false);

    function formatTime(timeString) {
        const hora = timeString.split(':')[0] + ':' + timeString.split(':')[1];
        const formattedTime = format(new Date(`2000-01-01T${hora}`), 'HH:mm');
        return formattedTime.replace(/^0(\d)/, '$1');
    }

    useEffect(() => {
        const traerCitasEquipo = async () => {
            const usuarioNest = localStorage.getItem('U2FsdGVkX1');
            const bytes = CryptoJS.AES.decrypt(usuarioNest, 'PPIITYTPIJC');
            const usuarioN = JSON.parse(bytes.toString(CryptoJS.enc.Utf8))
            setUsuario(usuarioN)
            setEquipo(usuarioN.usuario[0])
            const fechaActual = new Date();
            const fechaLunes = new Date(fechaActual);
            const fechaSabado = new Date(fechaActual);
            fechaLunes.setDate(fechaActual.getDate() - fechaActual.getDay() + 1);
            fechaSabado.setDate(fechaActual.getDate() - (fechaActual.getDay() - 7));
            try{
            const response = await fetch(`https://td-g-production.up.railway.app/citas-asesoria-ppi/Equipo/` + usuarioN.usuario[0].codigoEquipo);
            const data = await response.json();
            if (response.ok) {
                if (data.length == 0) {
                    const response2 = await fetch(`https://td-g-production.up.railway.app/equipo-ppi/equipo/` + usuarioN.usuario[0].codigoEquipo);
                    if (response2.ok) {
                        const data2 = await response2.json();
                        if (data2.canceladas != null) {
                            setCitasDisponibles(true)
                            const citasArray = Object.values(data2.canceladas).flatMap(cita => Array.isArray(cita) ? cita : [cita]);
                            setCitas(citasArray)
                            return
                        }
                    }
                    setCitasDisponibles(false)
                } else {
                    setCitasDisponibles(true)
                    let citasCanceladas = data[0].equipocita.canceladas;
                    let citasActivas = data;
                    if (citasCanceladas != null) {
                        citasActivas = {
                            ...citasActivas,
                            ...citasCanceladas
                        };
                    }
                    delete citasActivas.citasCanceladas;

                    const citasArray = Object.values(citasActivas).flatMap(cita => Array.isArray(cita) ? cita : [cita]);

                    setCitas(citasArray);
                }

            }
        }catch(e){
            setShowNoEqupo(true)
        }
        }
        traerCitasEquipo();
    }, []);
    const capitalizeFirstLetter = (str) => {
        return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    }
    useEffect(() => {
        if (showNoEqupo) {
            const timer = setTimeout(() => {
                setShowNoEqupo(false);
            }, 5000);

            return () => clearTimeout(timer);
        }
    }, [showNoEqupo]);

    return (
        <>
            {
                citasDisponibles ? (
                    <div className='grid grid-cols-1 xl:grid-cols-4 lg:grid-cols-2 ' >
                        {citas.map((item, index) => (
                            <div key={index} className=' my-4 mx-4'>
                                <a
                                    href={`/component/asesorias/visualizar/estudiante/${item.id}/${item.estadoCita.id}/${usuario.id}`}
                                    className="relative block overflow-hidden rounded-lg border-2 border-gray-200 p-4 sm:p-6 lg:p-8"
                                ><span
                                    className={`absolute inset-x-0 bottom-0 h-2 bg-gradient-to-r ${item.estadoCita.id === 2
                                        ? 'from-emerald-500 via-emerald-400 to-emerald-500'
                                        : item.estadoCita.id === 3
                                            ? 'from-indigo-500 via-indigo-400 to-indigo-500'
                                            : item.estadoCita.id === 4
                                                ? 'from-red-500 via-red-400 to-red-500'
                                                : item.estadoCita.id === 5
                                                    ? 'from-red-600 via-red-500 to-red-600'
                                                    : item.estadoCita.id === 6
                                                        ? 'from-amber-600 via-amber-500 to-amber-600'
                                                        : 'from-stone-500 via-stone-400 to-stone-500'
                                        }`}
                                ></span>
                                    <div>
                                        <div className='border-b-2 w-full border-gray-200'>
                                            <h1 className='text-2xl -mt-4 mb-1 font-bold text-center text-gray-600'>
                                                {capitalizeFirstLetter(format(item.fecha, 'EEEE', { locale: es }))} <br />
                                                {capitalizeFirstLetter(format(item.fecha, 'MMMM dd', { locale: es }))}
                                            </h1>
                                        </div>
                                        <div className='flex justify-center pt-4'>
                                            <span className='text-xl font-semibold text-center text-gray-600'>Hora: </span>
                                            <span className='text-xl   text-center text-gray-500'>{formatTime(item.hora)}</span>
                                        </div>
                                        <div className='text-center justify-center'>
                                            <span className='text-xl font-semibold text-center text-gray-600'>Profesor:</span>
                                            <span className='text-xl   text-center text-gray-500'> {item.usuariocitaequipo.nombre}</span><br />
                                            <span className='text-xl font-semibold text-center text-gray-600'>Modalidad:</span>
                                            <span className='text-xl   text-center text-gray-500'> {item.tipoCita.nombre}</span>

                                        </div>
                                    </div>

                                </a>
                            </div>
                        ))}


                    </div >

                ) : (
                    <div>No hay citas disponibles</div>
                )
            }
            {
                showNoEqupo && (
                    <div className="fixed bottom-0 right-0 mb-8 mr-8">
                        <div className="flex w-96 shadow-lg rounded-lg">
                            <div className="bg-orange-600 py-4 px-6 rounded-l-lg flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" className="fill-current text-white" width="20" height="20">
                                    <path fillRule="evenodd" d="M4.47.22A.75.75 0 015 0h6a.75.75 0 01.53.22l4.25 4.25c.141.14.22.331.22.53v6a.75.75 0 01-.22.53l-4.25 4.25A.75.75 0 0111 16H5a.75.75 0 01-.53-.22L.22 11.53A.75.75 0 010 11V5a.75.75 0 01.22-.53L4.47.22zm.84 1.28L1.5 5.31v5.38l3.81 3.81h5.38l3.81-3.81V5.31L10.69 1.5H5.31zM8 4a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 018 4zm0 8a1 1 0 100-2 1 1 0 000 2z"></path>
                                </svg>
                            </div>
                            <div className="px-4 py-6 bg-white rounded-r-lg flex justify-between items-center w-full border border-l-transparent border-gray-200">
                                <div>Actualmente, no te encuentras registrado en ningún equipo.</div>
                                <button onClick={() => { setShowNoEqupo(!showNoEqupo) }}>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="fill-current text-gray-700" viewBox="0 0 16 16" width="20" height="20">
                                        <path fillRule="evenodd" d="M3.72 3.72a.75.75 0 011.06 0L8 6.94l3.22-3.22a.75.75 0 111.06 1.06L9.06 8l3.22 3.22a.75.75 0 11-1.06 1.06L8 9.06l-3.22 3.22a.75.75 0 01-1.06-1.06L6.94 8 3.72 4.78a.75.75 0 010-1.06z"></path>
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                )
            }
        </>

    )
}

export default tarjetas