/* eslint-disable react-hooks/rules-of-hooks */
"use client"
import React, { useEffect, useState } from 'react'
import { format } from 'date-fns';
import CryptoJS from 'crypto-js';
import './css/style.css'
import { es } from 'date-fns/locale';


function page({ params }) {
    const [bitacora, setBitacora] = useState([]);
    const [estudiantes, setEstudiantes] = useState([])
    const [estudiantesAux, setEstudiantesAux] = useState([])
    const [usuario, setUsuario] = useState([])
    const [semanas, setSemanas] = useState([])
    const [rol, setRol] = useState([])
    const [showCorrecto, setShowCorrecto] = useState(false);
    const [showCorrecto2, setShowCorrecto2] = useState(false);
    const [asistencia, setAsistencia] = useState([])
    const [seguimiento, setSeguimiento] = useState([])
    const [modSol, setModSol] = useState([])
    const [fechaPruebas, setFechaPruebas] = useState(new Date());

    const fetchUsuario = async (usuarioId, asistencia) => {
        const response = await fetch(`https://td-g-production.up.railway.app/usuario/${usuarioId}`);
        const usuarioData = await response.json();
        return [usuarioData, asistencia];
    };
    const agregarTiempo = async (id, anterior) => {
        const datos = {
            "estadoSeguimiento": 3
        }
        const requestOptions = {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(datos)
        };
        const response = await fetch('https://td-g-production.up.railway.app/estado-seguimiento-cambio/' + anterior, requestOptions);
        if (response.ok) {
            setShowCorrecto(true)
            setTimeout(() => {
                window.location.reload();
            }, 2000);
        }
    }

    const noAsistencia = async (id, idEstado) => {
        const dato = {
            "compromiso": "NO ASISTIÓ",
            "observacion": "NO ASISTIÓ",
            "asistenciaEstudiante1": "0",
            "asistenciaEstudiante2": "0",
            "asistenciaEstudiante3": "0",
        }
        const requestOptions = {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dato)
        };
        const response = await fetch('https://td-g-production.up.railway.app/seguimiento-ppi/' + id, requestOptions);
        if (response.ok) {
            const dato = {
                "estadoSeguimiento": 2,
            }
            const requestOptions = {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dato)
            };
            const response = await fetch('https://td-g-production.up.railway.app/estado-seguimiento-cambio/' + idEstado, requestOptions);
            if (response.ok) { 
                const response2 = await fetch('https://td-g-production.up.railway.app/citas-asesoria-ppi/Seguimiento/' + id);
                const data2 = await response2.json();
                if (!response2.ok) { 
                    return
                }
                const dato = {
                    "estadoCita": 3
                }
                const requestOptions = {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(dato)
                };
                const response = await fetch('https://td-g-production.up.railway.app/citas-asesoria-ppi/' + data2.id, requestOptions);
                if (response.ok) {
                    setShowCorrecto2(true);
                    setTimeout(() => {
                        window.location.reload();
                    }, 2000);
                }
            }
        }

    }


    useEffect(() => {
        const fechData = async () => {
            const response = await fetch('https://td-g-production.up.railway.app/equipo-ppi/' + params.id);
            const data = await response.json();
            if (response.ok) {
                const response2 = await fetch('https://td-g-production.up.railway.app/equipo-ppi-pjic/' + data[0].codigoEquipo);
                const data2 = await response2.json();
                setModSol(data2.usuariopjic);
                setBitacora(data[0]);
            }
        }
        const login = async () => {

            const usuarioNest = localStorage.getItem('U2FsdGVkX1');
            if (usuarioNest !== null) {
                const bytes = CryptoJS.AES.decrypt(usuarioNest, 'PPIITYTPIJC');
                const usuarioN = JSON.parse(bytes.toString(CryptoJS.enc.Utf8))
                setUsuario(usuarioN)
                setRol(usuarioN.rol)
            }
        }

        const semanas = async () => {
            const response = await fetch('https://td-g-production.up.railway.app/semanas');
            const data = await response.json();
            if (response.ok) {
                setSemanas(data)
            }
        }

        semanas();
        login();
        fechData()
    }, [params]);
    useEffect(() => {
        const fetchData = async () => {
            const response2 = await fetch('https://td-g-production.up.railway.app/equipo-usuarios/Estudiantes');
            const data2 = await response2.json();
            if (response2.ok) {
                setEstudiantesAux(data2[bitacora.codigoEquipo])
                setEstudiantes(data2);
                if (bitacora.codigoEquipo != null) {
                    const response = await fetch('https://td-g-production.up.railway.app/seguimiento-ppi/' + bitacora.codigoEquipo);
                    const data = await response.json();
                    if (response.ok) {
                        data.sort((a, b) => a.semana - b.semana); 
                        setSeguimiento(data);
                    }
                }
            }
        };
        fetchData();
    }, [bitacora]);
    useEffect(() => {
        if (showCorrecto) {
            const timer = setTimeout(() => {
                setShowCorrecto(false);
            }, 2000);

            return () => clearTimeout(timer);
        }
    }, [showCorrecto]);


    useEffect(() => {
        const traerEstado = async () => {
            if (!seguimiento) return;
            setEstudiantes([]);
            const promises = {};
            for (let index = 0; index < seguimiento.length; index++) {
                const element = seguimiento[index];
                const vect = []
                if (element.estudiante1 != null) {
                    const aux = await fetchUsuario(element.estudiante1, element.asistenciaEstudiante1)
                    vect.push(aux);
                }
                if (element.estudiante2 != null) {
                    const aux = await fetchUsuario(element.estudiante2, element.asistenciaEstudiante2)
                    vect.push(aux);
                }
                if (element.estudiante3 != null) {
                    const aux = await fetchUsuario(element.estudiante3, element.asistenciaEstudiante3)
                    vect.push(aux);
                }
                promises[element.id] = vect
            }
            setEstudiantes(promises);
        };

        traerEstado();
    }, [seguimiento]);

    useEffect(() => {
        if (showCorrecto2) {
            const timer = setTimeout(() => {
                setShowCorrecto2(false);
            }, 2000);

            return () => clearTimeout(timer);
        }
    }, [showCorrecto2]);


    return (
        <div className="ml-6 mr-6 mt-6 border bg-white border-b flex justify-between">
            <div className="pt-8 pb-8 w-full">

                <div className='w-full border-b-2 flex flex-col sm:flex-row items-center sm:items-start justify-center sm:justify-between sm:pl-8 sm:h-22 pb-5 text-center sm:text-left'>
                    <div className="mb-5 sm:mb-0">
                        <h1 className="text-4xl font-bold text-gray-600">{bitacora.nombre}</h1>
                    </div>
                    <div className="mt-2 sm:mt-0 sm:mr-8">
                        <div className="sm:ml-auto">
                            <span className="text-3xl text-gray-600 font-bold">Equipo:</span>
                            <span className="text-3xl text-gray-500 font-semibold ml-2">{bitacora.codigoEquipo}</span>
                        </div>
                    </div>
                </div>



                <details class="w-full bg-white   border-t-2 border-b-2 mt-5 font-semibold text-xl text-gray-600 border-gray-600  mb-3">
                    <summary class="w-full bg-white text-dark flex justify-between px-4 py-3  cursor-pointer">Encabezado</summary><div className="p-10">
                        <div className="pb-5">
                            <div className='grid grid-cols-1 sm:grid-cols-2'>
                                <div className="mt-4 sm:mt-0">
                                    <span className="text-2xl font-bold text-gray-600">Estudiantes:</span>
                                    <div className="ml-5 sm:ml-10 mt-2 text-xl text-gray-400">
                                        {estudiantesAux && estudiantesAux.map((item) => (
                                            <div key={item.id}>
                                                {item.nombre}
                                                <br />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="mt-4 sm:mt-0">
                                    <span className="text-2xl font-bold text-gray-600">Módulo Sol:</span>
                                    <div className="ml-5 sm:ml-10 mt-2 text-xl text-gray-400">
                                        {modSol.nombre}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="pb-5">
                            <div className="grid grid-cols-1 sm:grid-cols-2">
                                <div>
                                    <span className="text-2xl font-bold text-gray-600">Descripción:</span>
                                    <div className="ml-5 sm:ml-10 mt-2 text-xl text-gray-400">
                                        {bitacora.descripcion}
                                    </div>
                                </div>
                                <div className="mt-4 sm:mt-0">
                                    <span className="text-2xl font-bold text-gray-600">Alcance:</span>
                                    <div className="ml-5 sm:ml-10 mt-2 text-xl text-gray-400">
                                        {bitacora.alcance}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="pb-5">
                            <div className="grid grid-cols-1 sm:grid-cols-2">
                                <div className="pr-5">
                                    <span className="text-2xl font-bold text-gray-600">Alcance Socialización 1:</span>
                                    <div className="ml-5 sm:ml-10 mt-2 text-xl text-gray-400">
                                        {bitacora.socializacionuno}
                                    </div>
                                </div>
                                <div className="mt-4 sm:mt-0">
                                    <span className="text-2xl font-bold text-gray-600">Alcance Socialización 2:</span>
                                    <div className="ml-5 sm:ml-10 mt-2 text-xl text-gray-400">
                                        {bitacora.socializaciondos}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </details>
                <details class="w-full bg-white  border-t-2 border-b-2 mt-5 font-semibold text-xl text-gray-600 border-gray-600  mb-3">
                    <summary class="w-full bg-white text-dark flex justify-between px-4 py-3 cursor-pointer">Asesorías</summary>
                    <div className="w-full border-t border-gray-400">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y-2 divide-gray-200 bg-white text-sm">
                                <thead className="ltr:text-left rtl:text-right">
                                    <tr>
                                        <th className="whitespace-nowrap px-4 py-2 font-blod text-gray-600">Semana    </th>
                                        <th className="whitespace-nowrap px-4 py-2 font-blod text-gray-600">Fecha</th>
                                        <th className="whitespace-nowrap px-4 py-2 font-blod text-gray-600">Compromisos</th>
                                        <th className="whitespace-nowrap px-4 py-2 font-blod text-gray-600">Observaciones</th>
                                        <th className="whitespace-nowrap px-4 py-2 font-blod text-gray-600">Asistencias</th>
                                        <th className="whitespace-nowrap px-4 py-2 font-blod text-gray-600">Asesor</th>
                                        <th className="whitespace-nowrap px-4 py-2 font-blod text-gray-600"></th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {seguimiento.map((item, index) => {
                                        const estados = item.estados
                                        const citas = item.citas
                                        const asesor = citas.usuariocitaequipo
                                        const asistenciaEstudiantes = estudiantes[item.id]
                                        let numSemana = item.semana
                                        console.log(rol.id == 3 && asesor.id == usuario.id && estados[0].estadoSeguimiento.id == 1 && new Date(estados[0].fecha).getDate() == new Date(fechaPruebas).getDate())
                                        console.log(estados[0].fecha) 
                                        estados.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
                                        return (
                                            <tr key={item.id}>
                                                <td className="whitespace-nowrap px-4 py-2 font-semibold text-center text-gray-400">{numSemana}</td>
                                                <td className="whitespace-nowrap px-4 py-2 font-semibold text-center text-gray-400">{format(item.citas.fecha, 'MMMM dd', { locale: es })}</td>
                                                <td className="whitespace-normal text-center font-semibold px-4 py-2 text-gray-400">{item.compromiso} </td>
                                                <td className="whitespace-normal px-4 py-2 font-semibold text-center text-gray-400">{item.observacion} </td>
                                                <td className="whitespace-nowrap px-4 py-2 font-semibold text-gray-400 text-center">{

                                                    asistenciaEstudiantes ? (
                                                        asistenciaEstudiantes.map((item) => {
                                                            if (item[1] == 1) {
                                                                return (
                                                                    <>{item[0].nombre}<br /></>
                                                                )
                                                            }
                                                        })
                                                    ) : (null)
                                                }
                                                </td>

                                                <td className="whitespace-normal px-4 py-2 font-semibold text-center text-gray-400">{asesor.nombre} </td>
                                                <td className="whitespace-normal px-4 py-2 text-center flex text-gray-700">
                                                    {
                                                        estados[0].estadoSeguimiento.id == 3 || (rol.id == 3 && asesor.id == usuario.id && estados[0].estadoSeguimiento.id == 1 && new Date(estados[0].fecha).getDate() == new Date(fechaPruebas).getDate()) ?
                                                            (
                                                                <><a href={'/component/seguimientos/modificar/' + item.id + '/' + estados[0].id} className=' flex items-center justify-center'>
                                                                    <div className='p-3 rounded-full bg-slate-600'>
                                                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" class="w-6 h-6">
                                                                            <path d="M21.731 2.269a2.625 2.625 0 0 0-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 0 0 0-3.712ZM19.513 8.199l-3.712-3.712-8.4 8.4a5.25 5.25 0 0 0-1.32 2.214l-.8 2.685a.75.75 0 0 0 .933.933l2.685-.8a5.25 5.25 0 0 0 2.214-1.32l8.4-8.4Z" />
                                                                            <path d="M5.25 5.25a3 3 0 0 0-3 3v10.5a3 3 0 0 0 3 3h10.5a3 3 0 0 0 3-3V13.5a.75.75 0 0 0-1.5 0v5.25a1.5 1.5 0 0 1-1.5 1.5H5.25a1.5 1.5 0 0 1-1.5-1.5V8.25a1.5 1.5 0 0 1 1.5-1.5h5.25a.75.75 0 0 0 0-1.5H5.25Z" />
                                                                        </svg>
                                                                    </div>
                                                                </a>
                                                                    <button onClick={() => { noAsistencia(item.id, estados[0].id) }} className='ml-5 flex items-center justify-center'>
                                                                        <div className='p-2 rounded-full bg-slate-600'>
                                                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="white" class="w-8 h-8">
                                                                                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
                                                                            </svg>

                                                                        </div>
                                                                    </button>
                                                                </>

                                                            ) : (<a href={'/component/seguimientos/visualizar/' + item.id} className=' flex items-center justify-center'>
                                                                <div className='p-3 rounded-full bg-gray-600'>
                                                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" class="w-6 h-6">
                                                                        <path fill-rule="evenodd" d="M5.625 1.5c-1.036 0-1.875.84-1.875 1.875v17.25c0 1.035.84 1.875 1.875 1.875h12.75c1.035 0 1.875-.84 1.875-1.875V12.75A3.75 3.75 0 0 0 16.5 9h-1.875a1.875 1.875 0 0 1-1.875-1.875V5.25A3.75 3.75 0 0 0 9 1.5H5.625ZM7.5 15a.75.75 0 0 1 .75-.75h7.5a.75.75 0 0 1 0 1.5h-7.5A.75.75 0 0 1 7.5 15Zm.75 2.25a.75.75 0 0 0 0 1.5H12a.75.75 0 0 0 0-1.5H8.25Z" clip-rule="evenodd" />
                                                                        <path d="M12.971 1.816A5.23 5.23 0 0 1 14.25 5.25v1.875c0 .207.168.375.375.375H16.5a5.23 5.23 0 0 1 3.434 1.279 9.768 9.768 0 0 0-6.963-6.963Z" />
                                                                    </svg>

                                                                </div>
                                                            </a>)
                                                    }
                                                    {
                                                        rol.id == 4 && estados[0].estadoSeguimiento.id == 1 ? (
                                                            <button onClick={() => { agregarTiempo(item.id, estados[0].id) }} className=' flex items-center justify-center ml-5'>
                                                                <div className='p-3 rounded-full bg-gray-600'>
                                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="white" class="w-6 h-6">
                                                                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                                                    </svg>


                                                                </div>
                                                            </button>
                                                        ) :
                                                            (null)
                                                    }

                                                </td>

                                            </tr>
                                        )
                                    })}


                                </tbody>
                            </table>
                        </div>
                    </div>
                </details>


                {showCorrecto && (
                    <div className="fixed bottom-0 right-0 mb-8 mr-8">
                        <div className="flex w-96 shadow-lg rounded-lg">
                            <div class="bg-green-600 py-4 px-6 rounded-l-lg flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" class="text-white fill-current" viewBox="0 0 16 16" width="20" height="20"><path fill-rule="evenodd" d="M13.78 4.22a.75.75 0 010 1.06l-7.25 7.25a.75.75 0 01-1.06 0L2.22 9.28a.75.75 0 011.06-1.06L6 10.94l6.72-6.72a.75.75 0 011.06 0z"></path></svg>
                            </div>
                            <div className="px-4 py-6 bg-white rounded-r-lg flex justify-between items-center w-full border border-l-transparent border-gray-200">
                                <div>Se cambió el tiempo correctamente para el día hoy.</div>
                                <button onClick={() => { setShowCorrecto(!showCorrecto) }}>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="fill-current text-gray-700" viewBox="0 0 16 16" width="20" height="20">
                                        <path fillRule="evenodd" d="M3.72 3.72a.75.75 0 011.06 0L8 6.94l3.22-3.22a.75.75 0 111.06 1.06L9.06 8l3.22 3.22a.75.75 0 11-1.06 1.06L8 9.06l-3.22 3.22a.75.75 0 01-1.06-1.06L6.94 8 3.72 4.78a.75.75 0 010-1.06z"></path>
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                )}
                {showCorrecto2 && (
                    <div className="fixed bottom-0 right-0 mb-8 mr-8">
                        <div className="flex w-96 shadow-lg rounded-lg">
                            <div class="bg-green-600 py-4 px-6 rounded-l-lg flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" class="text-white fill-current" viewBox="0 0 16 16" width="20" height="20"><path fill-rule="evenodd" d="M13.78 4.22a.75.75 0 010 1.06l-7.25 7.25a.75.75 0 01-1.06 0L2.22 9.28a.75.75 0 011.06-1.06L6 10.94l6.72-6.72a.75.75 0 011.06 0z"></path></svg>
                            </div>
                            <div className="px-4 py-6 bg-white rounded-r-lg flex justify-between items-center w-full border border-l-transparent border-gray-200">
                                <div>Modificado correctamente.</div>
                                <button onClick={() => { setShowCorrecto2(!showCorrecto2) }}>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="fill-current text-gray-700" viewBox="0 0 16 16" width="20" height="20">
                                        <path fillRule="evenodd" d="M3.72 3.72a.75.75 0 011.06 0L8 6.94l3.22-3.22a.75.75 0 111.06 1.06L9.06 8l3.22 3.22a.75.75 0 11-1.06 1.06L8 9.06l-3.22 3.22a.75.75 0 01-1.06-1.06L6.94 8 3.72 4.78a.75.75 0 010-1.06z"></path>
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>

    )
}

export default page
