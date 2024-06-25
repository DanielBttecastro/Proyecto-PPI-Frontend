"use client"
/* eslint-disable react-hooks/rules-of-hooks */
import React, { useEffect, useState } from 'react'
import MostrarEstudiante from '@/component/asesorias/mostrar/estudiante/mostrarEstudiante'
import { format } from 'date-fns';
import { useRouter } from "next/navigation";
import CryptoJS from 'crypto-js';

function page({ params }) {
    const [showAlert, setShowAlert] = useState(false);
    const [cita, setCita] = useState([]);
    const [profesor, setProfesor] = useState([]);
    const [equipo, setEquipo] = useState([]);
    const [showCorrecto, setShowCorrecto] = useState(false);
    const [showNoCancelar, setShowNoCancelar] = useState(false);
    const [estadoCita, setEstadoCita] = useState([]);
    const [tipoCita, setTipoCita] = useState([]);
    const [fecha, setFecha] = useState('');
    const [hora, setHora] = useState('');
    const [salon, setSalon] = useState('');
    const [motivo, setMotivo] = useState([]);
    const [fechaPruebas, setFechaPruebas] = useState(new Date());
    const router = useRouter();
    const [showAlertDelete, setShowAlertDelete] = useState(false);
    const [CancelId, setCancelId] = useState('');
    const [CancelCalendarId, setCancelCalendarId] = useState('');
    const cancelCauses = ["Calamidad doméstica.", "Incapacidad física.", "Quebranto de salud.", "Dificultad de acceso tecnologíco.", "Compromiso académico/laboral imprevisto"]

    const handleShowAlertDelete = (idDate, idCalendar) => {
        setShowAlertDelete(true);
        setCancelId(idDate);
        setCancelCalendarId(idCalendar);
    };

    const handleConfirm = (confirm) => {
        if (confirm) {
            const causeInput = document.getElementById('causes').value;
            if (causeInput !== 'Nothing') {
                cancelarCita(CancelId, CancelCalendarId, causeInput)
                setShowAlertDelete(false);
            } else {
                return null
            }
        }
        setShowAlertDelete(false);
    };

    function formatDate(dateString) {
        return format(new Date(dateString), 'dd/MM/yyyy');
    }
    function formatTime(timeString) {
        const hora = timeString.split(':')[0] + ':' + timeString.split(':')[1];
        const formattedTime = format(new Date(`2000-01-01T${hora}`), 'HH:mm');
        return formattedTime;
    }
    useEffect(() => {
        const traerCita = async () => {
            if (params.estado != '4') {
                const response = await fetch(`https://td-g-production.up.railway.app/citas-asesoria-ppi/${params.id}`);
                const data = await response.json();
                if (response.ok) {
                    setCita(data)
                    setEquipo(data.equipocita)
                    setEstadoCita(data.estadoCita)
                    setHora(formatTime(data.hora))
                    setMotivo(data.observacionCita)
                    setFecha(formatDate(data.fecha))
                    setTipoCita(data.tipoCita)
                    setProfesor(data.usuariocitaequipo)
                    const response2 = await fetch(`https://td-g-production.up.railway.app/hora-semanal/profesor/${data.usuariocitaequipo.id}`);
                    const data2 = await response2.json();
                    setSalon(data2[0].salon)
                }
            } else if (params.estado == '4') {
                const usuarioNest = localStorage.getItem('U2FsdGVkX1');
                const bytes = CryptoJS.AES.decrypt(usuarioNest, 'PPIITYTPIJC');
                const usuarioN = JSON.parse(bytes.toString(CryptoJS.enc.Utf8))
                const response = await fetch('https://td-g-production.up.railway.app/equipo-ppi/equipo/' + usuarioN.usuario[0].codigoEquipo);
                const data = await response.json();
                if (response.ok) {
                    const canceladas = data.canceladas;
                    for (const item in canceladas) {
                        if (canceladas[item].id == params.id) {
                            setCita(canceladas[item])
                            setEquipo(canceladas[item].equipocita)
                            setEstadoCita(canceladas[item].estadoCita)
                            setHora(formatTime(canceladas[item].hora))
                            setFecha(formatDate(canceladas[item].fecha))
                            setTipoCita(canceladas[item].tipoCita)
                            setProfesor(canceladas[item].usuariocitaequipo)
                        }
                    }
                }
            }
        }
        traerCita();
    }, []);

    const cancelarCita = async (id, idCalendar, causeInput) => {

        const fechaActual = new Date(fechaPruebas)
        if (fechaActual.getDate() == fecha.split("/")[0]) {
            const horaCita = (parseInt(hora.split(":")[0]) * 60) + parseInt(hora.split(":")[1])
            const horaActual = (parseInt(fechaActual.getHours() + 2) * 60) + parseInt(fechaActual.getMinutes())
            if (horaCita - horaActual < 0) {
                setShowNoCancelar(true)
                return
            }
        }
        const dataCrearMeet = {
            "eventId": idCalendar,
            "cause": causeInput
        };
        const requestOptionsMEET = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dataCrearMeet)
        };
        const responseMeet = await fetch('https://td-g-production.up.railway.app/google/delete-event/', requestOptionsMEET);
        if (!responseMeet.ok) {
            setShowAlert(true)
            return
        }
        const dataCita = {
            "link": " ",
            "equipocita": null,
            "estadoCita": 1,
            "link": "",
            "idCalendar": ""
        };
        const requestOptionsCita = {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dataCita)
        };
        let dataEquipo = {}
        cita.estadoCita.id = 4;
        cita.estadoCita.nombre = "Cancelada";
        const ids = cita.id
        if (equipo.canceladas == null) {
            dataEquipo = {
                "canceladas": { ids: cita }
            };
        } else {
            const citaCanceladas = equipo.canceladas
            const nuevaCita = {
                ...citaCanceladas,
                [ids]: cita

            }
            dataEquipo = {
                "canceladas": nuevaCita
            };
        }

        const requestOptionsEquipo = {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dataEquipo)
        };

        try {
            const [responseCita, responseEquipo] = await Promise.allSettled([
                fetch('https://td-g-production.up.railway.app/citas-asesoria-ppi/' + id, requestOptionsCita),
                fetch('https://td-g-production.up.railway.app/equipo-ppi/' + cita.equipocita.id, requestOptionsEquipo)
            ]);

            if (responseCita.status === 'fulfilled' && responseEquipo.status === 'fulfilled') {
                setShowCorrecto(true);
                setTimeout(() => {
                    router.push('/component/asesorias/visualizar/estudiante');
                }, 2000);
            } else {
                setShowAlert(true);
            }
        } catch (error) {
            setShowAlert(true);
        }
    };

    useEffect(() => {
        if (showCorrecto) {
            const timer = setTimeout(() => {
                setShowCorrecto(false);
            }, 2000);

            return () => clearTimeout(timer);
        }
    }, [showCorrecto]);

    useEffect(() => {
        if (showNoCancelar) {
            const timer = setTimeout(() => {
                setShowNoCancelar(false);
            }, 2000);

            return () => clearTimeout(timer);
        }
    }, [showNoCancelar]);
    const verAsesoria = async (id) => {
        const response = await fetch('https://td-g-production.up.railway.app/seguimiento-ppi/Cita/' + id);
        const data = await response.json();
        router.push('/component/seguimientos/visualizar/' + data.id);
    }

    useEffect(() => {
        if (showAlert) {
            const timer = setTimeout(() => {
                setShowAlert(false);
            }, 2000);

            return () => clearTimeout(timer);
        }
    }, [showAlert]);
    return (
        <>
            <div className="ml-6 mr-6 mt-6 border   bg-white border-b flex justify-between">
                <div className='pt-8  pb-8 w-full'>
                    <div className='w-full border-b-2 flex items-center sm:items-start justify-center sm:justify-start sm:pl-8 sm:h-22 pb-5 text-center sm:text-left'>
                        <h1 className='text-4xl font-bold text-gray-600'>Cita de asesorías</h1>
                    </div>
                    <div className='p-5'>
                        <div className={`grid grid-cols-1 ${estadoCita.id == 5?('lg:grid-cols-4'):('lg:grid-cols-3')}`}>
                            <div className="m-4 sm:m-10 text-center">
                                <div>
                                    <h1 className="text-2xl  font-bold text-gray-600">Estado:</h1>
                                </div>
                                <div>
                                    <span className={`inline-block text-2xl ml-2 sm:ml-4 px-2 sm:px-3 py-1 ${estadoCita.id == 4 || estadoCita.id == 5 ? 'bg-red-500' : estadoCita.id == 6 ? 'bg-amber-500' : estadoCita.id == 3 ? 'bg-indigo-500' : 'bg-green-500'} text-white font-semibold rounded-full`}>
                                        {estadoCita.nombre}
                                    </span>
                                </div>
                            </div>
                            <div className="m-4 sm:m-10 text-center">
                                <div>
                                    <h1 className="text-2xl  font-bold text-gray-600">Profesor:</h1>  </div>
                                <div className='-mt-2'>
                                    <span className="inline-block sm:mt-2 ml-2  sm:ml-4 px-2 sm:px-3 py-1 font-semibold text-2xl text-gray-500  ">
                                        {profesor.nombre}   </span>
                                </div>
                            </div>
                            <div className="m-4 sm:m-10 text-center">
                                <div>
                                    <h1 className="text-2xl  font-bold text-gray-600">Fecha:</h1>
                                </div>
                                <div>
                                    <span className="inline-block sm:mt-2 ml-2 sm:ml-4 px-2 sm:px-3 py-1 font-semibold text-2xl text-gray-500 ">
                                        {fecha}     </span>
                                </div>
                            </div>
                            <div className="m-4 sm:m-10 text-center">
                                <div>
                                    <h1 className="text-2xl  font-bold text-gray-600">Hora:</h1>
                                </div>
                                <div>
                                    <span className="inline-block sm:mt-2 ml-2 sm:ml-4 px-2 sm:px-3 py-1 font-semibold text-2xl text-gray-500 ">
                                        {hora}     </span>
                                </div>
                            </div>
                            <div className="m-4 sm:m-10 text-center">
                                <div>
                                    <h1 className="text-2xl  font-bold text-gray-600">Tipo:</h1>
                                </div>
                                <div>
                                    <span className="inline-block font-semibold text-2xl text-gray-500 sm:mt-2 ml-2 sm:ml-4 px-2 sm:px-3 py-1 ">
                                        {tipoCita.nombre}
                                    </span>
                                </div>
                            </div>
                            <div className="m-4 sm:m-10 text-center">
                                <div>
                                    {tipoCita.id == 1 ? (
                                        <h1 className="text-2xl font-bold text-gray-600">Enlace:</h1>
                                    ) : (
                                        <h1 className="text-2xl font-bold text-gray-600">Ubicación:</h1>
                                    )}
                                </div>
                                <div className="flex flex-col min-w-full justify-center items-center">
                                    {tipoCita.id == 1 ? (
                                        <a href={cita.link} className="flex flex-row min-w-[60px] max-w-[60px] min-h-[60px] max-h-[60px] justify-center items-center">
                                            <svg className="w-min-[50px] max-w-[50px] object-scale-down" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="100" height="100" viewBox="0 0 48 48">
                                                <rect width="16" height="16" x="12" y="16" fill="#fff" transform="rotate(-90 20 24)"></rect><polygon fill="#1e88e5" points="3,17 3,31 8,32 13,31 13,17 8,16"></polygon><path fill="#4caf50" d="M37,24v14c0,1.657-1.343,3-3,3H13l-1-5l1-5h14v-7l5-1L37,24z"></path><path fill="#fbc02d" d="M37,10v14H27v-7H13l-1-5l1-5h21C35.657,7,37,8.343,37,10z"></path><path fill="#1565c0" d="M13,31v10H6c-1.657,0-3-1.343-3-3v-7H13z"></path><polygon fill="#e53935" points="13,7 13,17 3,17"></polygon><polygon fill="#2e7d32" points="38,24 37,32.45 27,24 37,15.55"></polygon><path fill="#4caf50" d="M46,10.11v27.78c0,0.84-0.98,1.31-1.63,0.78L37,32.45v-16.9l7.37-6.22C45.02,8.8,46,9.27,46,10.11z"></path>
                                            </svg>
                                        </a>
                                    ) : (
                                        <span className="inline-block sm:mt-2 ml-2 sm:ml-4 px-2 sm:px-3 py-1 font-semibold text-2xl text-gray-500 ">
                                            {salon}       </span>
                                    )}

                                </div>
                            </div>
                            
                            {estadoCita.id == 5 ? (
                                    <div className="m-4 sm:m-10 text-center">
                                        <div>
                                            <h1 className="text-2xl  font-bold text-gray-600">Motivo:</h1>
                                        </div>
                                        <div>
                                            <span className="inline-block font-semibold text-2xl text-gray-500 sm:mt-2 ml-2 sm:ml-4 px-2 sm:px-3 py-1 ">
                                                {motivo.nombre}   </span>
                                        </div>
                                    </div>

                                ) : (null)}

                        </div>
                        <div className="flex justify-center">
                            {estadoCita.id == 2 ? (
                                <button onClick={() => { handleShowAlertDelete(cita.id, cita.idCalendar) }} class="text-white h-14 py-2 px-4 w-full rounded bg-red-400 hover:bg-red-500 shadow hover:shadow-lg font-medium transition transform hover:-translate-y-0.5 min-w-[250px] max-w-[250px]">Cancelar</button>

                            ) : estadoCita.id == 3 ? (
                                <button onClick={() => { verAsesoria(cita.id) }} class="text-white   h-14 py-2 px-4 w-full rounded bg-indigo-400 hover:bg-indigo-500 shadow hover:shadow-lg font-medium transition transform hover:-translate-y-0.5 min-w-[250px] max-w-[250px]">Ver asesoría</button>

                            ) : estadoCita.id == 5 ? (
                                <div className="flex justify-center">
                                    <button onClick={() => { router.push('/component/asesorias/visualizar/estudiante/' + cita.modificaciones + '/6/' + params.esdutiante); }} class="text-white h-14 py-2 px-4 w-full rounded bg-orange-400 hover:bg-orange-500 shadow hover:shadow-lg font-medium transition transform hover:-translate-y-0.5 min-w-[250px] max-w-[250px]">Nueva cita</button>
                                </div>
                            ) : (<div className='pb-5'></div>)
                            }
                            {showAlertDelete && (
                                <div className="fixed inset-0 z-10 bg-grey bg-opacity-10 backdrop-blur-sm flex justify-center items-center">
                                    <div className="flex flex-col justify-center content-center items-center rounded-lg bg-white p-4 shadow-2xl w-11/12 sm:w-3/4 md:w-2/3 lg:w-1/2 xl:w-1/3 border border-solid border-gray-300">
                                        <h2 className="text-lg font-bold">¿Deseas cancelar esta cita?</h2>
                                        <p className="mt-2 text-sm text-gray-800">
                                            Por favor indique el motivo de cancelación (Obligatorio).
                                        </p>
                                        <select name="" id="causes" className="mt-2 w-full">
                                            <option value="Nothing">Seleccione un motivo</option>
                                            {cancelCauses.map((cancelCause, index) => (
                                                <option key={index} value={cancelCause}>{cancelCause}</option>
                                            ))}
                                        </select>
                                        <div class="mt-4 flex flex-row flex-wrap gap-2 min-w-full items-center content-center justify-center gap-2">
                                            <button type="button" class="min-w-[25%] rounded-lg bg-green-400 px-4 py-2 text-sm font-medium text-white hover:bg-green-500" onClick={() => handleConfirm(true)}>
                                                Confirmar
                                            </button>
                                            <button type="button" class="min-w-[25%] rounded-lg bg-red-400 px-4 py-2 text-sm font-medium text-white hover:bg-red-500" onClick={() => handleConfirm(false)}>
                                                Cancelar
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}

                        </div>
                    </div>
                </div>
            </div>

            {showAlert && (
                <div className="fixed bottom-0 right-0 mb-8 mr-8">
                    <div className="flex w-96 shadow-lg rounded-lg">
                        <div className="bg-red-600 py-4 px-6 rounded-l-lg flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" className="fill-current text-white" width="20" height="20">
                                <path fillRule="evenodd" d="M4.47.22A.75.75 0 015 0h6a.75.75 0 01.53.22l4.25 4.25c.141.14.22.331.22.53v6a.75.75 0 01-.22.53l-4.25 4.25A.75.75 0 0111 16H5a.75.75 0 01-.53-.22L.22 11.53A.75.75 0 010 11V5a.75.75 0 01.22-.53L4.47.22zm.84 1.28L1.5 5.31v5.38l3.81 3.81h5.38l3.81-3.81V5.31L10.69 1.5H5.31zM8 4a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 018 4zm0 8a1 1 0 100-2 1 1 0 000 2z"></path>
                            </svg>
                        </div>
                        <div className="px-4 py-6 bg-white rounded-r-lg flex justify-between items-center w-full border border-l-transparent border-gray-200">
                            <div>Error al cancelar</div>
                            <button onClick={() => { setShowAlert(!showAlert) }}>
                                <svg xmlns="http://www.w3.org/2000/svg" className="fill-current text-gray-700" viewBox="0 0 16 16" width="20" height="20">
                                    <path fillRule="evenodd" d="M3.72 3.72a.75.75 0 011.06 0L8 6.94l3.22-3.22a.75.75 0 111.06 1.06L9.06 8l3.22 3.22a.75.75 0 11-1.06 1.06L8 9.06l-3.22 3.22a.75.75 0 01-1.06-1.06L6.94 8 3.72 4.78a.75.75 0 010-1.06z"></path>
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {showNoCancelar && (
                <div className="fixed bottom-0 right-0 mb-8 mr-8">
                    <div className="flex w-96 shadow-lg rounded-lg">
                        <div className="bg-red-600 py-4 px-6 rounded-l-lg flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" className="fill-current text-white" width="20" height="20">
                                <path fillRule="evenodd" d="M4.47.22A.75.75 0 015 0h6a.75.75 0 01.53.22l4.25 4.25c.141.14.22.331.22.53v6a.75.75 0 01-.22.53l-4.25 4.25A.75.75 0 0111 16H5a.75.75 0 01-.53-.22L.22 11.53A.75.75 0 010 11V5a.75.75 0 01.22-.53L4.47.22zm.84 1.28L1.5 5.31v5.38l3.81 3.81h5.38l3.81-3.81V5.31L10.69 1.5H5.31zM8 4a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 018 4zm0 8a1 1 0 100-2 1 1 0 000 2z"></path>
                            </svg>
                        </div>
                        <div className="px-4 py-6 bg-white rounded-r-lg flex justify-between items-center w-full border border-l-transparent border-gray-200">
                            <div>La cita se debe cancelar con 2 horas de anticipación.</div>
                            <button onClick={() => { setShowNoCancelar(!showNoCancelar) }}>
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
                            <div>Cancelado correctamente.</div>
                            <button onClick={() => { setShowCorrecto(!showCorrecto) }}>
                                <svg xmlns="http://www.w3.org/2000/svg" className="fill-current text-gray-700" viewBox="0 0 16 16" width="20" height="20">
                                    <path fillRule="evenodd" d="M3.72 3.72a.75.75 0 011.06 0L8 6.94l3.22-3.22a.75.75 0 111.06 1.06L9.06 8l3.22 3.22a.75.75 0 11-1.06 1.06L8 9.06l-3.22 3.22a.75.75 0 01-1.06-1.06L6.94 8 3.72 4.78a.75.75 0 010-1.06z"></path>
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default page
