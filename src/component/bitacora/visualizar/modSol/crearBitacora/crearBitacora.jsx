/* eslint-disable react-hooks/rules-of-hooks */
"use client"

import React, { useState, useEffect } from 'react'
import { useRouter } from "next/navigation";

function crearBitacora({ equipo }) {
    const [nombre, setNombre] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [bitacora, setBitacora] = useState([]);
    const [alcanceProyect, setAlcanceProyect] = useState('');
    const [alcance1, setAlcance1] = useState('');
    const [alcance2, setAlcance2] = useState('');
    const [crear, setCrear] = useState('false')
    const [showAlert, setShowAlert] = useState(false);
    const [showCorrecto, setShowCorrecto] = useState(false);
    const router = useRouter();
    const modificarBitacora = async () => {
        if (nombre.length === 0 || descripcion.length === 0 || alcanceProyect.length === 0 || alcance1.length === 0 || alcance2.length === 0) {
            setShowAlert(true);
            return;
        }

        const datos = {
            "codigoEquipo": equipo,
            "nombre": nombre,
            "descripcion": descripcion,
            "alcance": alcanceProyect,
            "socializacionuno": alcance1,
            "socializaciondos": alcance2
        };

        console.log('Datos a enviar:', datos);

        const requestOptions = {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(datos)
        };

        console.log('Opciones de la solicitud:', requestOptions);

        try {
            const url = 'https://td-g-production.up.railway.app/equipo-ppi/' + bitacora.id;
            //alert(`Enviando solicitud a: ${url}`); // Para fines de depuración, puedes eliminarlo si no es necesario.
            const response = await fetch(url, requestOptions);

            if (response.ok) {
                console.log('Solicitud exitosa:', await response.json());
                setShowCorrecto(true);
                setTimeout(() => {
                    router.back();
                }, 2000);
            } else {
                console.error('Error en la solicitud:', response.status, response.statusText);
            }
        } catch (error) {
            console.error('Error en la solicitud:', error);
        }
    };

    const crearBitacora = async () => {
        if (nombre.length == 0 || descripcion.length == 0 || alcanceProyect.length == 0 || alcance1.length == 0 || alcance2.length == 0) {
            setShowAlert(true);
            return;
        }
        const datos = {
            "codigoEquipo": equipo,
            "nombre": nombre,
            "descripcion": descripcion,
            "alcance": alcanceProyect,
            "socializacionuno": alcance1,
            "socializaciondos": alcance2
        }

        console.log(datos)
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(datos)
        };
        const response = await fetch('https://td-g-production.up.railway.app/equipo-ppi', requestOptions);
        if (response.ok) {
            setShowCorrecto(true);
            setTimeout(() => {
                router.back();
            }, 2000);
        }

    }
    useEffect(() => {
        if (showAlert) {
            const timer = setTimeout(() => {
                setShowAlert(false);
            }, 5000);

            return () => clearTimeout(timer);
        }
    }, [showAlert]);

    useEffect(() => {
        if (showCorrecto) {
            const timer = setTimeout(() => {
                setShowCorrecto(false);
            }, 2000);

            return () => clearTimeout(timer);
        }
    }, [showCorrecto]);

    useEffect(() => {
        const sePuedeCrear = async () => {
            const response = await fetch('https://td-g-production.up.railway.app/equipo-ppi/equipo/' + equipo);
            if (response.ok) {
                const contentType = response.headers.get('content-type');
                if (contentType && contentType.includes('application/json')) {
                    const data = await response.json();
                    console.log(data)
                    setBitacora(data)
                    setNombre(data.nombre)
                    setDescripcion(data.descripcion)
                    setAlcanceProyect(data.alcance)
                    setAlcance1(data.socializacionuno)
                    setAlcance2(data.socializaciondos)
                    setCrear(false)
                } else {
                    setCrear(true)
                }
            } else {
                console.log('Hubo un problema con la solicitud.');
            }
        }
        sePuedeCrear();
    }, []);


    return (
        <div>
            <div className='flex flex-col sm:flex-row'>
                <h1 className='text-3xl font-bold text-center text-gray-600'>Nombre/Alias:</h1>
                <input
                    type="email"
                    id="UserEmail"
                    value={nombre}
                    onChange={(e) => { setNombre(e.target.value) }}
                    className="ml-2 w-full      rounded-md border-gray-400 shadow-sm sm:text-sm sm:ml-4"
                />
            </div>

            <div className='mt-5'>
                <h1 className='text-3xl font-bold text-center text-gray-600'>Descripción del proyecto:</h1>
                <textarea
                    id="OrderNotes"
                    class="mt-2 w-full rounded-lg border-gray-500 align-top shadow-sm sm:text-sm"
                    rows="5"
                    value={descripcion}
                    onChange={(e) => { setDescripcion(e.target.value) }}
                    style={{ "resize": " none" }}
                ></textarea>
            </div>
            <div className='mt-5'>
                <h1 className='text-3xl font-bold text-center text-gray-600'>Alcance del proyecto:</h1>
                <textarea
                    id="OrderNotes"
                    class="mt-2 w-full rounded-lg border-gray-500 align-top shadow-sm sm:text-sm"
                    rows="5"
                    value={alcanceProyect}
                    onChange={(e) => { setAlcanceProyect(e.target.value) }}
                    style={{ "resize": " none" }}
                ></textarea>
            </div>
            <div className='mt-5'>
                <h1 className='text-3xl font-bold text-center text-gray-600'>Alcance primera socialización:</h1>
                <textarea
                    id="OrderNotes"
                    class="mt-2 w-full rounded-lg border-gray-500 align-top shadow-sm sm:text-sm"
                    rows="5"
                    value={alcance1}
                    onChange={(e) => { setAlcance1(e.target.value) }}
                    style={{ "resize": " none" }}
                ></textarea>
            </div>
            <div className='mt-5'>
                <h1 className='text-3xl font-bold text-center text-gray-600'>Alcance segunda socialización:</h1>
                <textarea
                    id="OrderNotes"
                    class="mt-2 w-full rounded-lg border-gray-500 align-top shadow-sm sm:text-sm"
                    rows="5"
                    value={alcance2}
                    onChange={(e) => { setAlcance2(e.target.value) }}
                    style={{ "resize": " none" }}
                ></textarea>
            </div>
            <div className='mt-5'>
                {bitacora.length == 0 ? (<button onClick={() => crearBitacora()} class="text-white py-2 px-4 w-full rounded bg-green-400 hover:bg-green-500 shadow hover:shadow-lg font-medium transition transform hover:-translate-y-0.5">Crear</button>
                ) : (
                    <button onClick={() => modificarBitacora()} class="text-white py-2 px-4 w-full rounded bg-orange-400 hover:bg-orange-500 shadow hover:shadow-lg font-medium transition transform hover:-translate-y-0.5">Modificar</button>
                )
                }
            </div>
            {showAlert && (
                <div className="fixed bottom-0 right-0 mb-8 mr-8">
                    <div className="flex w-96 shadow-lg rounded-lg">
                        <div className="bg-orange-600 py-4 px-6 rounded-l-lg flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" className="fill-current text-white" width="20" height="20">
                                <path fillRule="evenodd" d="M4.47.22A.75.75 0 015 0h6a.75.75 0 01.53.22l4.25 4.25c.141.14.22.331.22.53v6a.75.75 0 01-.22.53l-4.25 4.25A.75.75 0 0111 16H5a.75.75 0 01-.53-.22L.22 11.53A.75.75 0 010 11V5a.75.75 0 01.22-.53L4.47.22zm.84 1.28L1.5 5.31v5.38l3.81 3.81h5.38l3.81-3.81V5.31L10.69 1.5H5.31zM8 4a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 018 4zm0 8a1 1 0 100-2 1 1 0 000 2z"></path>
                            </svg>
                        </div>
                        <div className="px-4 py-6 bg-white rounded-r-lg flex justify-between items-center w-full border border-l-transparent border-gray-200">
                            <div>Todos los campos deben estar llenos.</div>
                            <button onClick={() => { setShowAlert(!showAlert) }}>
                                <svg xmlns="http://www.w3.org/2000/svg" className="fill-current text-gray-700" viewBox="0 0 16 16" width="20" height="20">
                                    <path fillRule="evenodd" d="M3.72 3.72a.75.75 0 011.06 0L8 6.94l3.22-3.22a.75.75 0 111.06 1.06L9.06 8l3.22 3.22a.75.75 0 11-1.06 1.06L8 9.06l-3.22 3.22a.75.75 0 01-1.06-1.06L6.94 8 3.72 4.78a.75.75 0 010-1.06z"></path>
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {showCorrecto && (
                <div className="fixed bottom-0 right-0 mb-8 mr-8">
                    <div className="flex w-96 shadow-lg rounded-lg">
                        <div class="bg-green-600 py-4 px-6 rounded-l-lg flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" class="text-white fill-current" viewBox="0 0 16 16" width="20" height="20"><path fill-rule="evenodd" d="M13.78 4.22a.75.75 0 010 1.06l-7.25 7.25a.75.75 0 01-1.06 0L2.22 9.28a.75.75 0 011.06-1.06L6 10.94l6.72-6.72a.75.75 0 011.06 0z"></path></svg>
                        </div>
                        <div className="px-4 py-6 bg-white rounded-r-lg flex justify-between items-center w-full border border-l-transparent border-gray-200">
                            <div>Creados correctamente.</div>
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

export default crearBitacora
