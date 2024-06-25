"use client"
/* eslint-disable react-hooks/rules-of-hooks */
import React, { useEffect, useState } from 'react'
import { es } from 'date-fns/locale';
import { format } from 'date-fns';
import './css/style.css'
import CryptoJS from 'crypto-js';

function miBitacora() {

    const [bitacora, setBitacora] = useState([])
    const [estudiantes, setEstudiantes] = useState([])
    const [estudiantesAux, setEstudiantesAux] = useState([])
    const [asistencia, setAsistencia] = useState([])
    const [seguimiento, setSeguimiento] = useState([])
    const [usuario, setUsuario] = useState([])
    const [showNoEqupo, setShowNoEqupo] = useState(false);
    const [modSol, setModSol] = useState([])

    useEffect(() => {
        const traerBitacora = async () => {
            const usuarioNest = localStorage.getItem('U2FsdGVkX1');
            const bytes = CryptoJS.AES.decrypt(usuarioNest, 'PPIITYTPIJC');
            try {
                const usuarioN = JSON.parse(bytes.toString(CryptoJS.enc.Utf8))
                setUsuario(usuarioN)
                const response = await fetch(`https://td-g-production.up.railway.app/equipo-usuarios/EstudiantesBitacora/${usuarioN.correo}`);
                if (response.ok) {
                    const data = await response.json()
                    setBitacora(data)
                    const response2 = await fetch('https://td-g-production.up.railway.app/equipo-ppi-pjic/' + data.codigoEquipo);
                    const data2 = await response2.json();
                    setModSol(data2.usuariopjic);

                }
            } catch (e) {
                setShowNoEqupo(true)
            }
        }
        traerBitacora();
    }, []);
    useEffect(() => {
        const fetchData = async () => {
            const response2 = await fetch('https://td-g-production.up.railway.app/equipo-usuarios/Estudiantes');
            const data2 = await response2.json();
            if (response2.ok) {
                setEstudiantesAux(data2[bitacora.codigoEquipo])
                setEstudiantes(data2);
                const response = await fetch('https://td-g-production.up.railway.app/seguimiento-ppi/' + bitacora.codigoEquipo);
                const data = await response.json();
                if (response.ok) { 
                    data.sort((a, b) => a.semana - b.semana);
                    setSeguimiento(data);
                }
            }
        };
        fetchData();
    }, [bitacora]);


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

    const fetchUsuario = async (usuarioId, asistencia) => {
        const response = await fetch(`https://td-g-production.up.railway.app/usuario/${usuarioId}`);
        const usuarioData = await response.json();
        return [usuarioData, asistencia];
    };
    useEffect(() => {
        if (showNoEqupo) {
            const timer = setTimeout(() => {
                setShowNoEqupo(false);
            }, 5000);

            return () => clearTimeout(timer);
        }
    }, [showNoEqupo]);
    return (
        <div>


            <details class="w-full bg-white   border-t-2 border-b-2 mt-5 font-semibold text-xl text-gray-600 border-gray-600  mb-3">
                <summary class="w-full bg-white text-dark flex justify-between px-4 py-3  cursor-pointer">Encabezado</summary><div className="p-10">
                    <div className="pb-5">
                        <div className='grid grid-cols-1 sm:grid-cols-2'>
                            <div>
                                <span className="text-2xl font-bold text-gray-600">Estudiantes:</span>
                                <div className="ml-5 sm:ml-10 mt-2 text-xl text-gray-400">
                                    {
                                        estudiantesAux && estudiantesAux.map((item) => (
                                            <>{item.nombre}<br /></>
                                        ))
                                    }
                                </div>
                            </div>
                            <div className="pt-5 sm:pt-0">
                                <span className="text-2xl font-bold text-gray-600">Módulo sol:</span>
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
                            <div className="pt-5 sm:pt-0">
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
                            <div className="pt-5 sm:pt-0">
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
                                    console.log(item)
                                    const asistenciaEstudiantes = estudiantes[item.id]
                                    estados.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
                                    return (
                                        <tr key={item.id}>
                                            <td className="whitespace-nowrap px-4 py-2 font-semibold text-center text-gray-400">{item.semana}</td>
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
                                            <td className="whitespace-normal px-4 py-2 font-semibold text-center text-gray-400">{item.citas.usuariocitaequipo.nombre} </td>
                                            <td className="whitespace-normal px-4 py-2 text-center flex text-gray-700">
                                                <a href={'/component/seguimientos/visualizar/' + item.id} className=' flex items-center justify-center'>
                                                    <div className='p-3 rounded-full bg-gray-600'>
                                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" class="w-6 h-6">
                                                            <path fill-rule="evenodd" d="M5.625 1.5c-1.036 0-1.875.84-1.875 1.875v17.25c0 1.035.84 1.875 1.875 1.875h12.75c1.035 0 1.875-.84 1.875-1.875V12.75A3.75 3.75 0 0 0 16.5 9h-1.875a1.875 1.875 0 0 1-1.875-1.875V5.25A3.75 3.75 0 0 0 9 1.5H5.625ZM7.5 15a.75.75 0 0 1 .75-.75h7.5a.75.75 0 0 1 0 1.5h-7.5A.75.75 0 0 1 7.5 15Zm.75 2.25a.75.75 0 0 0 0 1.5H12a.75.75 0 0 0 0-1.5H8.25Z" clip-rule="evenodd" />
                                                            <path d="M12.971 1.816A5.23 5.23 0 0 1 14.25 5.25v1.875c0 .207.168.375.375.375H16.5a5.23 5.23 0 0 1 3.434 1.279 9.768 9.768 0 0 0-6.963-6.963Z" />
                                                        </svg>

                                                    </div>
                                                </a>

                                            </td>

                                        </tr>
                                    )
                                })}


                            </tbody>
                        </table>
                    </div>
                </div>
            </details>


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
        </div>
    )
}

export default miBitacora
