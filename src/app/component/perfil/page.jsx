/* eslint-disable react-hooks/rules-of-hooks */
"use client"
import React, { useState, useEffect } from 'react'
import CryptoJS from 'crypto-js';


function page() {
    const [showContr, setShowContr] = useState(false);
    const [showMod, setShowMod] = useState(false);
    const [usuarioNest, setUsuarioNest] = useState(false);
    const [usuarioGoogle, setUsuarioGoogle] = useState(false);
    const [oficina, setOficina] = useState('');
    const [rol, setRol] = useState(false);
    const [showCorrecto, setShowCorrecto] = useState(false);

    const [imagen, setImagen] = useState()
    useEffect(() => {

        const validarSesion = async () => {
            const usuarioNest = localStorage.getItem('U2FsdGVkX1');
            const bytes = CryptoJS.AES.decrypt(usuarioNest, 'PPIITYTPIJC');
            const usuarioN = JSON.parse(bytes.toString(CryptoJS.enc.Utf8))
            const usuarioGoogle = localStorage.getItem('U2FsdGVkX2');
            const bytes2 = CryptoJS.AES.decrypt(usuarioGoogle, 'PPIITYTPIJC');
            const usuarioG = JSON.parse(bytes2.toString(CryptoJS.enc.Utf8))
            console.log(usuarioG.picture)
            setImagen(usuarioG.picture)
            setUsuarioGoogle(usuarioG)
            setUsuarioNest(usuarioN)
            setRol(usuarioN.rol)
        }

        validarSesion()
    }, []);

    const modificar = async () => {
        const datos = {
            "salon": oficina
        }
        const requestOptions = {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(datos)
        };
        const response = await fetch('https://td-g-production.up.railway.app/hora-semanal/' + usuarioNest.id, requestOptions);
        if (response.ok) {
            setShowCorrecto(true)
            setShowMod(false)
        }
    }

    useEffect(() => {
        if (showCorrecto) {
            const timer = setTimeout(() => {
                setShowCorrecto(false);
            }, 2000);

            return () => clearTimeout(timer);
        }
    }, [showCorrecto]);
    return (
        <><div className="p-16">
            <div className="p-8 bg-white shadow mt-24">
                <div className="grid grid-cols-1 md:grid-cols-3">
                    <div className="grid grid-cols-1 lg:grid-cols-3 text-center sm:text-left order-last md:order-first mt-20 md:mt-0">
                        {rol.id == 1 ? (
                            <div className="flex flex-col items-center sm:items-start">
                                <p className="font-bold text-gray-700 text-xl">101</p>
                                <p className="text-gray-400">Grupo</p>
                            </div>
                        ) : rol.id == 3 ? (
                            <>
                                <div className="flex flex-col sm:text-center   items-center sm:items-start">
                                    <p className="font-bold sm:ml-3 text-gray-700 text-xl">{usuarioNest.hora[0].horasAsignadas}</p>
                                    <p className="text-gray-400">Horas</p>
                                </div>
                                <div className="flex text-center flex-col items-center sm:items-start">
                                    <p className="font-bold sm:-ml-3 text-gray-700 text-xl">
                                        {oficina.length === 0 ? usuarioNest.hora[0].salon : oficina}
                                    </p>
                                    <p className="text-gray-400">Oficina</p>
                                </div>

                            </>
                        ) : null}
                    </div>

                    <div className="relative">
                        <div className=" w-28 h-28 shadow-2xl shadow-gray-600 bg-indigo-100 mx-auto rounded-full   absolute inset-x-0 top-0 -mt-24 flex items-center justify-center text-indigo-500">
                            <img src={imagen} className='w-28 h-28 rounded-full ' />
                        </div>
                    </div>

                    {rol.id == 3 ? (
                        <div className="flex flex-col space-y-4 md:space-y-0 md:space-x-8 justify-center items-center mt-32 md:mt-0">
                            {showMod ? null : (
                                <button
                                    onClick={() => { setShowMod(!showMod) }}
                                    className="text-white py-2 px-4 rounded bg-orange-400 hover:bg-orange-500 shadow hover:shadow-lg font-medium transition transform hover:-translate-y-0.5"
                                >
                                    Modificar
                                </button>
                            )}
                        </div>
                    ) : null}

                </div>
                <div className="mt-20 text-center border-b pb-12 px-4 sm:px-6 md:px-8">
                    <h1 className="text-3xl sm:text-4xl font-medium text-gray-700">{usuarioNest.nombre}</h1>
                    <p className="font-light text-gray-600 mt-3 break-words">
                        <span className='font-bold'>Correo: </span>{usuarioNest.correo}
                    </p>
                    <p className="font-light text-gray-600 break-words">
                        <span className='font-bold'>Documento: </span>{usuarioNest.documento}
                    </p>
                </div>

                {showMod ? (
                    <div className="text-center mt-5">
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                            <div className=''>
                                <label htmlFor="hora" className="block text-xs font-medium text-gray-700">Oficina</label>
                                <input
                                    value={oficina}
                                    onChange={(e) => { setOficina(e.target.value) }}
                                    type="text"
                                    id="hora"
                                    className="mt-1 w-full rounded-md border-gray-200 shadow-sm sm:text-sm"
                                />
                            </div>
                            <div className='mt-4 sm:mt-0 sm:col-span-2 md:col-span-1 flex justify-center items-center'>
                                <button
                                    onClick={() => { modificar() }}
                                    className="text-white py-2 px-4 rounded bg-orange-400 hover:bg-orange-500 shadow hover:shadow-lg font-medium transition transform hover:-translate-y-0.5"
                                >
                                    Modificar
                                </button>
                                <button
                                    onClick={() => { setShowMod(!showMod) }}
                                    className="text-white ml-4 py-2 px-4 rounded bg-red-400 hover:bg-red-500 shadow hover:shadow-lg font-medium transition transform hover:-translate-y-0.5"
                                >
                                    Cancelar
                                </button>
                            </div>
                        </div>
                    </div>

                ) : null}
            </div>
            {showCorrecto && (
                <div className="fixed bottom-0 right-0 mb-8 mr-8">
                    <div className="flex w-96 shadow-lg rounded-lg">
                        <div class="bg-green-600 py-4 px-6 rounded-l-lg flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" class="text-white fill-current" viewBox="0 0 16 16" width="20" height="20"><path fill-rule="evenodd" d="M13.78 4.22a.75.75 0 010 1.06l-7.25 7.25a.75.75 0 01-1.06 0L2.22 9.28a.75.75 0 011.06-1.06L6 10.94l6.72-6.72a.75.75 0 011.06 0z"></path></svg>
                        </div>
                        <div className="px-4 py-6 bg-white rounded-r-lg flex justify-between items-center w-full border border-l-transparent border-gray-200">
                            <div>Modificado correctamente.</div>
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

        </>
    )
}

export default page
