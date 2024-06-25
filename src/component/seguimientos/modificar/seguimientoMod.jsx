/* eslint-disable react-hooks/rules-of-hooks */
"use client"
import React, { useEffect, useState } from 'react'
import { useRouter } from "next/navigation";

function seguimientoMod({ idSeguimiento, idEstado }) {
    const [estudiantes, setEstudiantes] = useState([])
    const [asistencia, setAsistencia] = useState([]);
    const [asesoria, setAsesoria] = useState([])
    const [compromisos, setCompromisos] = useState('');
    const [observaciones, setObservaciones] = useState('');
    const [showAlert, setShowAlert] = useState(false);
    const [showCorrecto, setShowCorrecto] = useState(false);
    const [showNoCumplido, setShowNoCumplido] = useState(false);
    const [cita, setCita] = useState(false);
    const [id, setId] = useState(idSeguimiento)
    const [estado, setEstado] = useState([])
    const [estadoSeguimiento, setEstadoSeguimiento] = useState([])
    const router = useRouter();



    useEffect(() => {
        const traerAsesoria = async () => {
            const response = await fetch('https://td-g-production.up.railway.app/seguimiento-ppi/id/' + id);
            const data = await response.json();
            if (response.ok) {
                setAsesoria(data);
            }
        }

        const fetchData = async () => {
            const response = await fetch('https://td-g-production.up.railway.app/seguimiento-ppi/estudiantes/' + id);
            const data = await response.json();
            if (response.ok) {
                setEstudiantes(data)
                setAsistencia(data.map(item => [item.id, 0]));
            }
        };

        const traerEstado = async () => {
            const response = await fetch('https://td-g-production.up.railway.app/estado-seguimiento-cambio/id/' + idEstado);
            const data = await response.json();
            if (response.ok) {
                setEstado(data.estadoSeguimiento);
                setEstadoSeguimiento(data);
                console.log(data.estadoSeguimiento)
            }
        }

        const traerCita = async () => {
            const response = await fetch('https://td-g-production.up.railway.app/citas-asesoria-ppi/Seguimiento/' + id);
            const data = await response.json();
            if (response.ok) {
                setCita(data)
            }
        }
        traerCita();
        traerEstado();
        traerAsesoria();
        fetchData();
    }, [idSeguimiento]);

    const cambiarAsistencia = (index) => {
        const nuevaAsistencia = [...asistencia];

        nuevaAsistencia.forEach(element => {
            if (element[0] === index) {
                if (element[1] === 1) {
                    element[1] = 0;
                } else {
                    element[1] = 1;
                }
            }
        });
        setAsistencia(nuevaAsistencia);
    };


    const modificarSeguimiento = async () => {
        if ((parseInt(new Date(estadoSeguimiento.fecha).getDate()) == new Date().getDate())||estado.id==3) {
            const horaCita = parseInt(cita.hora.split(':')[1]) + (parseInt(cita.hora.split(':')[0]) * 60) 
            const fechaACtual = new Date(); 
            const horaActual = (fechaACtual.getHours() * 60) + fechaACtual.getMinutes();
            if ((horaCita - horaActual > 0)&&estado.id!=3) {
                setShowNoCumplido(true)
                return;
            }
            if (compromisos.length == 0 && observaciones == 0) { 
                setShowAlert(true)
            } else {
                if (asistencia[0][1] == 0 && asistencia[1][1] == 0) { 
                    setShowAlert(true)
                    return;
                }

                const dato = {
                    "compromiso": compromisos,
                    "observacion": observaciones,
                }
                const requestOptions = {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(dato)
                };
                const response = await fetch('https://td-g-production.up.railway.app/seguimiento-ppi/' + id, requestOptions);
                if (response.ok) {
                    let dato = {
                    }

                    for (let index = 0; index < 3; index++) {
                        const nombre1 = "asistenciaEstudiante" + (index + 1)
                        if (asistencia[index] != null) {
                            const aux = asistencia[index]
                            dato[nombre1] = aux[1]
                        }
                    }
                    const requestOptions = {
                        method: 'PATCH',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(dato)
                    };
                    const response = await fetch('https://td-g-production.up.railway.app/seguimiento-ppi/Asistencia/' + id, requestOptions);
                    if (response.ok) {
                        const dato = {
                            "estadoCita": 3
                        }
                        const requestOptions = {
                            method: 'PATCH',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify(dato)
                        };
                        const response = await fetch('https://td-g-production.up.railway.app/citas-asesoria-ppi/' + cita.id, requestOptions);
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
                                setShowCorrecto(true);
                                setTimeout(() => {
                                    router.back();
                                }, 2000);
                            }
                        }
                    }
                }
            }
        } else {
            setShowAlert(true)
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
            }, 5000);

            return () => clearTimeout(timer);
        }
    }, [showCorrecto]);



    useEffect(() => {
        if (showNoCumplido) {
            const timer = setTimeout(() => {
                setShowNoCumplido(false);
            }, 5000);

            return () => clearTimeout(timer);
        }
    }, [showNoCumplido]);
    return (


        <div>
            <div>
                <h1 className='text-3xl font-bold text-center text-gray-600'>Compromisos:</h1>
                <textarea
                    id="OrderNotes"
                    class="mt-2 w-full rounded-lg border-gray-500 align-top shadow-sm sm:text-sm"
                    rows="5"
                    value={compromisos}
                    onChange={(e) => { setCompromisos(e.target.value) }}
                    style={{ "resize": " none" }}
                ></textarea>
            </div>
            <div className='mt-5'>
                <h1 className='text-3xl font-bold text-center text-gray-600'>Observaciones:</h1>
                <textarea
                    id="OrderNotes"
                    class="mt-2 w-full rounded-lg border-gray-500 align-top shadow-sm sm:text-sm"
                    rows="5"
                    value={observaciones}
                    onChange={(e) => { setObservaciones(e.target.value) }}
                    style={{ "resize": " none" }}
                ></textarea>
            </div>
            <div className='mt-5'>
                <h1 className='text-3xl font-bold text-center text-gray-600'>Asistencias:</h1>
                <div className='text-center'>
                    <div>
                        {estudiantes.map((estudiante, index) => {
                            const valorAsistencia = asistencia.find(item => item[0] === estudiante.id);
                            const isChecked = valorAsistencia && valorAsistencia[1] === 1;
                            return (
                                <div key={index} className='mt-5 grid grid-cols-2'>
                                    <div className='text-2xl font-semibold text-center text-gray-500'>
                                        {estudiante.nombre}
                                    </div>
                                    <div>
                                        <div onClick={() => cambiarAsistencia(estudiante.id)} className="flex justify-center items-center cursor-pointer">
                                            <input
                                                type="checkbox"
                                                id={`asistencia-${estudiante.id}`}
                                                name={`asistencia-${estudiante.id}`}
                                                className="sr-only"
                                                checked={isChecked} // Usar el valor de isChecked para determinar si el checkbox debe estar marcado
                                            />
                                            <div className={`relative rounded-full w-12 h-6 transition duration-200 ease-linear ${isChecked ? 'bg-green-400' : 'bg-gray-400'}`}>
                                                <div htmlFor={`asistencia-${estudiante.id}`} className="absolute left-0 bg-white border-2 mb-2 w-6 h-6 rounded-full transition transform duration-100 ease-linear "
                                                    style={{ transform: isChecked ? 'translateX(100%)' : 'translateX(0)', borderColor: isChecked ? '#10B981' : '#9CA3AF' }}>
                                                </div>
                                            </div>
                                            <span className="text-xl font-semibold text-center text-gray-500 ml-2">{isChecked ? 'Sí' : 'No'}</span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}

                    </div>
                </div>

            </div>
            <div className='mt-5'>
                {(estado.id == 1 && parseInt(new Date(estadoSeguimiento.fecha).getDate()) == parseInt(new Date().getDate()))||estado.id == 3 ? (<button onClick={() => { modificarSeguimiento() }} class="text-white py-2 px-4 w-full rounded bg-green-400 hover:bg-green-500 shadow hover:shadow-lg font-medium transition transform hover:-translate-y-0.5">Modificar</button>
                ) : (null)}
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
                            <div>Todos los campos deben estar llenos y debe haber asistido un estudiante.</div>
                            <button onClick={() => { setShowAlert(!showAlert) }}>
                                <svg xmlns="http://www.w3.org/2000/svg" className="fill-current text-gray-700" viewBox="0 0 16 16" width="20" height="20">
                                    <path fillRule="evenodd" d="M3.72 3.72a.75.75 0 011.06 0L8 6.94l3.22-3.22a.75.75 0 111.06 1.06L9.06 8l3.22 3.22a.75.75 0 11-1.06 1.06L8 9.06l-3.22 3.22a.75.75 0 01-1.06-1.06L6.94 8 3.72 4.78a.75.75 0 010-1.06z"></path>
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {showNoCumplido && (
                <div className="fixed bottom-0 right-0 mb-8 mr-8">
                    <div className="flex w-96 shadow-lg rounded-lg">
                        <div className="bg-orange-600 py-4 px-6 rounded-l-lg flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" className="fill-current text-white" width="20" height="20">
                                <path fillRule="evenodd" d="M4.47.22A.75.75 0 015 0h6a.75.75 0 01.53.22l4.25 4.25c.141.14.22.331.22.53v6a.75.75 0 01-.22.53l-4.25 4.25A.75.75 0 0111 16H5a.75.75 0 01-.53-.22L.22 11.53A.75.75 0 010 11V5a.75.75 0 01.22-.53L4.47.22zm.84 1.28L1.5 5.31v5.38l3.81 3.81h5.38l3.81-3.81V5.31L10.69 1.5H5.31zM8 4a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 018 4zm0 8a1 1 0 100-2 1 1 0 000 2z"></path>
                            </svg>
                        </div>
                        <div className="px-4 py-6 bg-white rounded-r-lg flex justify-between items-center w-full border border-l-transparent border-gray-200">
                            <div>La asesoría aún no se ha cumplido.</div>
                            <button onClick={() => { setShowNoCumplido(!showNoCumplido) }}>
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
                            <div>Registrado correctamente.</div>
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

export default seguimientoMod