/* eslint-disable react/jsx-key */
"use client"
/* eslint-disable react-hooks/rules-of-hooks */
import React, { useState, useEffect } from 'react'
import CryptoJS from 'crypto-js';

function modSol() {

    const [equipo, setEquipo] = useState([])
    const [auxEquipo, setAuxEquipo] = useState([])
    const [usuarioSol, setUsuarioSol] = useState([])
    const [estado, setEstado] = useState()


    const filtroRadio = (data) => {
        setEstado(data)
        if (data == 1) {
            setAuxEquipo(equipo)
        } else if (data == 2) {
            const EquipoAx = {}
            Object.entries(equipo).forEach(([key, value]) => {
                if (value.bitacora.length != 0) {
                    EquipoAx[key] = equipo[key];
                }
            });
            setAuxEquipo(EquipoAx)
        } else if (data == 3) {
            const EquipoAx = {}
            Object.entries(equipo).forEach(([key, value]) => {
                if (value.bitacora.length != 1) {
                    EquipoAx[key] = equipo[key];
                }
            });
            setAuxEquipo(EquipoAx)
        }
    }

    const filtroText = (valor) => {
        if (valor === "" || valor.length === 0) {
            if (estado == 1) {
                setAuxEquipo(equipo)
            } else if (estado == 2) {
                const EquipoAx = {}
                Object.entries(equipo).forEach(([key, value]) => {
                    if (value.bitacora.length != 0) {
                        EquipoAx[key] = equipo[key];
                    }
                });
                setAuxEquipo(EquipoAx)
            } else if (estado == 3) {
                const EquipoAx = {}
                Object.entries(equipo).forEach(([key, value]) => {
                    if (value.bitacora.length != 1) {
                        EquipoAx[key] = equipo[key];
                    }
                });
                setAuxEquipo(EquipoAx)
            }
        } else {

            const EquipoAx = {}
            Object.entries(auxEquipo).filter(([key, value]) => {
                if (key.includes(valor)) {
                    EquipoAx[key] = value;
                }
            });
            setAuxEquipo(EquipoAx)
        }
    };

    useEffect(() => {
        const traerEquipos = async () => {
            const response = await fetch('https://td-g-production.up.railway.app/equipo-usuarios/bitacora');
            const data = await response.json();
            if (response.ok) {
                setEquipo(data)
                setAuxEquipo(data)
            }
        }

        const login = async () => {
            const usuarioNest = localStorage.getItem('U2FsdGVkX1');
            const bytes = CryptoJS.AES.decrypt(usuarioNest, 'PPIITYTPIJC');
            const usuarioN = JSON.parse(bytes.toString(CryptoJS.enc.Utf8))
            setUsuarioSol(usuarioN)
        }
        login()
        traerEquipos();
    }, []);

    return (
        <div className="">
            <div className='w-full'>
                <div className="relative w-full">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" className="absolute left-0 top-1/2  transform -translate-y-1/2 ml-3" style={{ fill: 'rgb(75 85 99)' }}>
                        <path d="M19.023 16.977a35.13 35.13 0 0 1-1.367-1.384c-.372-.378-.596-.653-.596-.653l-2.8-1.337A6.962 6.962 0 0 0 16 9c0-3.859-3.14-7-7-7S2 5.141 2 9s3.14 7 7 7c1.763 0 3.37-.66 4.603-1.739l1.337 2.8s.275.224.653.596c.387.363.896.854 1.384 1.367l1.358 1.392.604.646 2.121-2.121-.646-.604c-.379-.372-.885-.866-1.391-1.36zM9 14c-2.757 0-5-2.243-5-5s2.243-5 5-5 5 2.243 5 5-2.243 5-5 5z"></path>
                    </svg>
                    <input
                        type="email"
                        id="UserEmail"
                        onChange={(e) => { filtroText(e.target.value) }}
                        placeholder="Buscar" defaultChecked
                        className="mt-1 pl-10 pr-4 py-2 w-full border-2 rounded-md border-gray-300 shadow-sm sm:text-sm"
                    />
                </div>
                <div className='flex flex-wrap gap-3 mt-2'>
                    <div className=' sm:py-4'>
                        <input defaultChecked type="radio" onChange={() => { filtroRadio(1) }} id='Todos' name="FiltroRadio" className=" peer hidden" />
                        <label htmlFor='Todos' className=" cursor-pointer rounded-lg border-2 text-sm border-gray-500 py-2 px-5 font-bold text-gray-500 transition-colors duration-200 ease-in-out peer-checked:bg-gray-500 peer-checked:text-white peer-checked:border-gray-500">Todos</label>
                    </div>

                    <div className=' sm:py-4'>
                        <input type="radio" id='Completados' onChange={() => { filtroRadio(2) }} name="FiltroRadio" className=" peer hidden" />
                        <label htmlFor='Completados' className=" cursor-pointer rounded-lg text-sm border-2 border-emerald-500 py-2 px-5 font-bold text-emerald-500 transition-colors duration-200 ease-in-out peer-checked:bg-emerald-500 peer-checked:text-white peer-checked:border-emerald-500">Completados</label>
                    </div>
                    <div className='    py-4'>
                        <input type="radio" id='Pendientes' name="FiltroRadio" onChange={() => { filtroRadio(3) }} className=" peer hidden" />
                        <label htmlFor='Pendientes' className=" cursor-pointer rounded-md text-sm border-2 border-red-500 py-2 px-5    font-bold text-red-500 transition-colors duration-200 ease-in-out peer-checked:bg-red-500 peer-checked:text-white peer-checked:border-red-500">Pendientes</label>
                    </div>
                </div>
            </div>
            <div className='mt-5'>
                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-9 gap-5 justify-items-center'>
                    {Object.entries(auxEquipo).map(([key, value]) => {
                        const bitacora = value.bitacora;
                        const modSol = value.moduloSol[0];
                        if (usuarioSol != null) {
                            if (modSol.id == usuarioSol.id) {
                                return (
                                    <div key={key} className='mt-3'>
                                        <a href={'/component/bitacora/visualizar/modSol/' + key} className={bitacora.length == 0 ? 'py-3 px-10 cursor-pointer rounded-xl text-lg border-2 font-bold text-red-600 border-red-600 hover:text-white hover:border-red-600 hover:bg-red-600' : 'py-3 px-10 rounded-xl text-lg border-2 font-bold text-emerald-600 border-emerald-600 hover:text-white hover:border-emerald-600 hover:bg-emerald-600'}>
                                            {key}
                                        </a>
                                    </div>
                                );
                            }
                        } else {
                            return (
                                <div className="col-span-full text-center">
                                    <h1>No hay equipos creados a tu nombre</h1>
                                </div>
                            );
                        }
                    })}
                </div>

            </div>

        </div>
    )
}

export default modSol
