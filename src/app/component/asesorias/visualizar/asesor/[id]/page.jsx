"use client"
/* eslint-disable react-hooks/rules-of-hooks */
import React, { useEffect, useState } from 'react'
import Mostrar from '@/component/asesorias/mostrar/mostrarAs'
import { format } from 'date-fns';
import { useRouter } from "next/navigation";
import CryptoJS from 'crypto-js';

function page({ params }) {

    const [fechaPruebas, setFechaPruebas] = useState(new Date());

    const [showNoCancelar, setShowNoCancelar] = useState(false);
    const [cita, setCita] = useState([]);
    const [motivoView, setMotivoView] = useState([]);
    const [semanaConst, setSemanaConst] = useState(['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'])
    const [diasConst, setDiasConst] = useState(['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'])
    const [semanaCancelar, setSemanaCancelar] = useState([])
    const [estadoModificar, setEstadoModificar] = useState(false);
    const [grupoTrue, setGrupoTrue] = useState(false);
    const [selectEstado, setSelectEstado] = useState(1);
    const [citaEstado, setCitaEstado] = useState([]);
    const [tipoCita, setTipoCita] = useState([]);
    const [showModificar, setShowModificar] = useState(true)
    const [dia, setDia] = useState()
    const [numeroDia, setNumeroDia] = useState()
    const [fecha, setFecha] = useState('');
    const [hora, setHora] = useState('');
    const [horaInicio, setHoraInicio] = useState('');
    const [horaFin, setHoraFin] = useState('');
    const [horaConst, setHoraConst] = useState('');
    const [minConst, setMinConst] = useState('');
    const [horaFija, setHoraFija] = useState('');
    const [minFija, setMinFija] = useState('');
    const [equipo, setEquipo] = useState('');
    const [showAlert, setShowAlert] = useState(false);
    const [showACampos, setShowACampos] = useState(false);
    const [numeroDiaLunes, setNumeroDiaLunes] = useState(null);
    const [salon, setSalon] = useState('');
    const [idEquipo, setIdEquipo] = useState('');
    const [listEquipos, setListEquipos] = useState([]);
    const [estudiantesEquipo, setEstudiantesEquipo] = useState([]);
    const [showCorrecto, setShowCorrecto] = useState(false);
    const [showOcupado, setShowOcupado] = useState(false);
    const [cancelar, setCancelar] = useState(false);
    const [showCamposVacios, setShowCamposVacios] = useState(false);
    const [horaCancelar, setHoraCancelar] = useState(-1);
    const [minCancelar, setMinCancelar] = useState(-1);
    const [observacion, setObservacion] = useState(-1);
    const [diaCancelar, setDiaCancelar] = useState(0);
    const [motivo, setMotivo] = useState([]);
    const router = useRouter();
    const calcularNumeroDiaLunes = (fecha) => {
        const diaSemana = fecha.getDay();
        const numeroDia = fecha.getDate();
        return numeroDia - diaSemana;
    };

    function formatDate(dateString) {
        return format(new Date(dateString), 'dd/MM/yyyy');
    }
    function formatTime(timeString) {
        const hora = timeString.split(':')[0] + ':' + timeString.split(':')[1];
        return format(new Date(`2000-01-01T${hora}`), 'HH:mm');
    }


    useEffect(() => {
        const fetchData = async () => {
            try {

                const responseob = await fetch(`https://td-g-production.up.railway.app/observacion-cita/`);
                const dataob = await responseob.json();
                setMotivo(dataob)
                const response = await fetch(`https://td-g-production.up.railway.app/citas-asesoria-ppi/${params.id}`);
                const data = await response.json();
                setCita(data);
                setMotivo(data.observacionCita)
                setCitaEstado(data.estadoCita)
                setNumeroDiaLunes(calcularNumeroDiaLunes(new Date(data.fecha)) + fechaPruebas.getDay())
                setDia(new Date(data.fecha).getDay());
                setSemanaCancelar([semanaConst.slice(fechaPruebas.getDay() - 6), semanaConst]);
                setSemanaConst(semanaConst.slice(fechaPruebas.getDay() - 7))
                setSelectEstado(data.estadoCita.id)
                setNumeroDia(new Date(data.fecha).getDate())
                setTipoCita(data.tipoCita)
                const response2 = await fetch(`https://td-g-production.up.railway.app/hora-semanal/profesor/${data.usuariocitaequipo.id}`);
                const data2 = await response2.json();
                setSalon(data2[0].salon)
                if (fechaPruebas.getDate() == new Date(data.fecha).getDate()) {
                    setHoraInicio(fechaPruebas.getHours() + 4)
                    setHoraFin(14 - fechaPruebas.getHours() + 4)
                } else {
                    setHoraInicio(6)
                    setHoraFin(14)
                }
                setEquipo(data.equipocita)
                setHoraConst(data.hora.split(':')[0])
                setHoraFija(data.hora.split(':')[0])
                setMinConst(data.hora.split(':')[1])
                setMinFija(data.hora.split(':')[1])
                setHora(formatTime(data.hora))
                setFecha(formatDate(data.fecha))
                if (fechaPruebas.getDate() > new Date(data.fecha).getDate()) {
                    setShowModificar(true)
                } else if (fechaPruebas.getDate() < new Date(data.fecha).getDate()) {
                    setShowModificar(false)
                } else {
                    const fecha = new Date(fechaPruebas);
                    /*fecha.setHours(15)
                    fecha.setMinutes(0)*/
                    const minHoraACtual = (fecha.getHours() + 4) * 60 + (fecha.getMinutes())
                    const minCita = (parseInt(data.hora.split(':')[0])) * 60 + ((parseInt(data.hora.split(':')[1])))
                    if (minHoraACtual - minCita <= 0) {

                        setShowModificar(false)
                    } else {
                        setShowModificar(true)

                    }
                }
                if (!response.ok) {
                    setShowAlert(true);
                    throw new Error('Respuesta no exitosa');
                }
            } catch (error) {
                setShowAlert(true);
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
    }, [params.id, setCita]);
    const verAsesoria = async (id) => {
        const response = await fetch('https://td-g-production.up.railway.app/seguimiento-ppi/Cita/' + id);
        const data = await response.json();
        router.push('/seguimientos/visualizar/' + data.id);
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
        if (showACampos) {
            const timer = setTimeout(() => {
                setShowACampos(false);
            }, 5000);

            return () => clearTimeout(timer);
        }
    }, [showACampos]);
    useEffect(() => {
        if (showNoCancelar) {
            const timer = setTimeout(() => {
                setShowNoCancelar(false);
            }, 2000);

            return () => clearTimeout(timer);
        }
    }, [showNoCancelar]);
    useEffect(() => {
        if (showCamposVacios) {
            const timer = setTimeout(() => {
                setShowCamposVacios(false);
            }, 5000);

            return () => clearTimeout(timer);
        }
    }, [showCamposVacios]);
    useEffect(() => {
        if (fechaPruebas.getDate() == numeroDia) {
            setHoraInicio(fechaPruebas.getHours() + 4)
            setHoraFin(14 - fechaPruebas.getHours() + 4)
        } else {
            setHoraInicio(6)
            setHoraFin(14)
        }
    }, [numeroDia]);
    useEffect(() => {
    }, [listEquipos]);
    const listarEquipo = async () => {
        try {
            const response = await fetch(`https://td-g-production.up.railway.app/equipo-ppi`);
            const data = await response.json();
            if (response.ok) {
                setListEquipos(data)
            }
        } catch (error) {
            setShowAlert(true);
        }
    }
    useEffect(() => {



        const getEstudiantesXEquipo = async () => {
            try {
                const response = await fetch(`https://td-g-production.up.railway.app/equipo-usuarios/Estudiantes`);
                const data = await response.json();
                if (response.ok) {
                    console.log(data[equipo.codigoEquipo])
                    setEstudiantesEquipo(data[equipo.codigoEquipo])
                }
            } catch (error) {
                setShowAlert(true);
            }
        }
        if (citaEstado.id != 1) {
            getEstudiantesXEquipo();
        }
    }, [equipo]);

    const modificarCita = async () => {
        let datos = {}
        let banEquipo = false
        let mnCan = minCancelar
        let horCan = horaCancelar
        if (mnCan == -1) {
            mnCan = minConst
        }
        if (horCan == -1) {
            horCan = horaConst
        }
        const fecha = new Date(fechaPruebas);
        if (parseInt(numeroDia) >= fecha.getDate()) {
            const horaMod = parseInt(horCan * 60) + parseInt(mnCan);
            const horaActual = (parseInt(fecha.getHours() * 60) + parseInt(fecha.getMinutes()));
            if (parseInt(numeroDia) == fecha.getDate()) {
                if (horaMod - horaActual < 0) {
                    setShowACampos(true)
                    return
                }
            }
            fecha.setDate(parseInt(fecha.getDate()) + (parseInt(numeroDia) - parseInt(fecha.getDate())) + 1)
            const fechaFormat = format(fecha, "MM-dd-yyyy");
            const hora = `${horCan}:${mnCan}`;
            datos = {
                "fecha": fechaFormat,
                "hora": hora,
            }
        } else {
            setShowACampos(true)
        }
        const response2 = await fetch(`https://td-g-production.up.railway.app/citas-asesoria-ppi/BuscarFechaHoraUsuario/${datos.fecha}/${horCan}:${mnCan}/` + cita.usuariocitaequipo.id);

        if (response2.ok) {
            const data2 = await response2.json();
            if (data2.length == 0) {
                const requestOptions = {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(datos)
                };
                const response = await fetch('https://td-g-production.up.railway.app/citas-asesoria-ppi/' + params.id, requestOptions);

                if (response.ok) {
                    setShowCorrecto(true)
                    setTimeout(function () {
                        window.location.reload();
                    }, 2000);

                }
            } else {
                setShowOcupado(true)
            }
        }
    }
    const cancelarCita = async (id) => {
        if (diaCancelar != 0 && horaCancelar != 0 && minCancelar != -1 && observacion != -1) {
            const fechaActual = new Date(fechaPruebas)
            if (fechaActual.getDate() == fecha.split("/")[0]) {
                const horaCita = (parseInt(hora.split(":")[0]) * 60) + parseInt(hora.split(":")[1])
                const horaActual = (parseInt(fechaActual.getHours() + 2) * 60) + parseInt(fechaActual.getMinutes())
                if (horaCita - horaActual < 0) {
                    setShowNoCancelar(true)
                    return
                }
            }

            const usuarioNest = localStorage.getItem('U2FsdGVkX1');
            const bytes = CryptoJS.AES.decrypt(usuarioNest, 'PPIITYTPIJC');
            const usuarioN = JSON.parse(bytes.toString(CryptoJS.enc.Utf8))
            const FechaCancelar = new Date(fechaPruebas);
            FechaCancelar.setDate(diaCancelar);
            const Fecha = format(FechaCancelar, 'yyyy-MM-dd');
            const response2 = await fetch(`https://td-g-production.up.railway.app/citas-asesoria-ppi/BuscarFechaHoraUsuario/${Fecha}/${horaCancelar}:${minCancelar}/${usuarioN.id}`);
            const data2 = await response2.json();
            if (data2.length != 0) {
                setShowOcupado(true)
                return
            }
            const FechaActual = new Date(fechaPruebas);
            const FechaSabado = new Date(fechaPruebas);
            FechaSabado.setDate(FechaActual.getDate() - (FechaActual.getDay() - 7))
            let datosCrear = {}
            let EstadoCita = 0
            let estudiantes = []
            const responseEstu = await fetch(`https://td-g-production.up.railway.app/equipo-usuarios/estudiantes`);
            const dataEstu = await responseEstu.json();
            if (responseEstu.ok) {
                estudiantes = dataEstu[equipo.codigoEquipo];
            }
            let Tcita = 1;
            if (tipoCita.nombre == "Presencial") {
                Tcita = 0;
            }
            let estudiant = []
            for (let index = 0; index < estudiantes.length; index++) {
                const element = estudiantes[index];
                estudiant.push(element.correo)
            }
            const dataCrearMeet = {
                "date": format(FechaCancelar, 'yyyy-MM-dd'),
                "dateTime": `${horaCancelar}:${minCancelar}:00`,
                "attendees": estudiant,
                "conferenceDataVersion": Tcita.toString()
            };
            console.log(dataCrearMeet)
            const requestOptionsMEET = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dataCrearMeet)
            };
            const responseMeet = await fetch('https://td-g-production.up.railway.app/google/create-event/', requestOptionsMEET);
            if (!responseMeet.ok) {
                setShowError(true)
                return
            }
            const dataMeet = await responseMeet.json()
            let linCita = dataMeet.htmlLink
            if (dataMeet.meetLink != null) {
                linCita = dataMeet.meetLink
            }
            if (FechaSabado.getDate() < FechaCancelar.getDate()) {
                EstadoCita = 6
                datosCrear = {
                    "fecha": FechaCancelar,
                    "hora": `${horaCancelar}:${minCancelar}`,
                    "estadoCita": 6,
                    "link": "",
                    "modificaciones": "",
                    "usuariocitaequipo": usuarioN.id,
                    "tipoCita": tipoCita.id,
                    "equipocita": equipo.id,
                    "link": linCita,
                    "idCalendar": dataMeet.eventId
                }
            } else {
                EstadoCita = 2
                datosCrear = {
                    "fecha": FechaCancelar,
                    "hora": `${horaCancelar}:${minCancelar}`,
                    "estadoCita": 2,
                    "link": "",
                    "modificaciones": "",
                    "usuariocitaequipo": usuarioN.id,
                    "tipoCita": tipoCita.id,
                    "equipocita": equipo.id,
                    "link": linCita,
                    "idCalendar": dataMeet.eventId
                }
            }

            const requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(datosCrear)
            };
            console.log(datosCrear)
            const response = await fetch('https://td-g-production.up.railway.app/citas-asesoria-ppi', requestOptions);

            if (response.ok) {

                const response = await fetch('https://td-g-production.up.railway.app/hora-semanal/profesor/' + usuarioN.id);

                const data = await response.json();
                const response3 = await fetch(`https://td-g-production.up.railway.app/citas-asesoria-ppi/BuscarFechaHoraUsuario/${Fecha}/${horaCancelar}:${minCancelar}/` + usuarioN.id);
                if (!response3.ok) {
                    showAlert(true)
                    return;
                }

                const citaNueva = await response3.json();
                let datos = {}
                const ids = cita.id
                if (response.ok) {
                    const horasPendientes = data[0].horasPendientes;
                    if (Object.keys(horasPendientes).length == null || Object.keys(horasPendientes).length == 0) {
                        datos = {
                            "horasPendientes": {
                                [Fecha]: {
                                    "cancelada": cita,
                                    "nueva": citaNueva[0]
                                }
                            }
                        };
                    } else {
                        const citaCanceladas = data[0].horasPendientes
                        const nuevaCita = {
                            ...citaCanceladas,
                            [Fecha]: {
                                "cancelada": cita,
                                "nueva": citaNueva[0]
                            }
                        }
                        datos = {
                            "horasPendientes": nuevaCita
                        };
                    }
                    const dataCita = {
                        "estadoCita": 5,
                        "modificaciones": citaNueva[0].id,
                        "observacionCita": observacion

                    };
                    const requestOptionsCita = {
                        method: 'PATCH',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(dataCita)
                    };
                    const requestOptionsEquipo = {
                        method: 'PATCH',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(datos)
                    };
                    try {
                        const [responseCita] = await Promise.allSettled([
                            fetch('https://td-g-production.up.railway.app/citas-asesoria-ppi/' + id, requestOptionsCita),
                            //fetch('https://td-g-production.up.railway.app/hora-semanal/' + data[0].id, requestOptionsEquipo)
                        ]);
                        if (responseCita.status === 'fulfilled') {
                            let auxBan = false
                            if (EstadoCita == 2) {
                                const datos = {
                                    "citas": citaNueva[0].id
                                }
                                const requestOptions = {
                                    method: 'PATCH',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify(datos)
                                };
                                const response = await fetch('https://td-g-production.up.railway.app/seguimiento-ppi/CancelacionCita/' + cita.id, requestOptions);
                                if (response.ok)
                                    auxBan = true
                            } else {
                                const requestOptions = {
                                    method: 'DELETE',
                                    headers: { 'Content-Type': 'application/json' }
                                };
                                const response = await fetch('https://td-g-production.up.railway.app/seguimiento-ppi/' + cita.id, requestOptions);
                                if (response.ok)
                                    auxBan = true
                            }
                            if (auxBan) {
                                const mensaje = `El asesor ${cita.usuariocitaequipo.nombre} ha cancelado una cita`
                                const datos = {
                                    "mensaje": mensaje,
                                    "tipo": 2,
                                    "redireccion": cita.id,
                                    "estado": 1
                                }
                                const requestOptions = {
                                    method: 'POST',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify(datos)
                                };
                                const response = await fetch('https://td-g-production.up.railway.app/notificaciones', requestOptions);
                                if (response.ok) {

                                    const filtroMotivo = motivo.find((item) => item.id === parseInt(observacion));
                                    const dataCrearMeet = {
                                        "eventId": cita.idCalendar,
                                        "cause": filtroMotivo.nombre
                                    };
                                    console.log(dataCrearMeet)
                                    const requestOptionsMEET = {
                                        method: 'POST',
                                        headers: { 'Content-Type': 'application/json' },
                                        body: JSON.stringify(dataCrearMeet)
                                    };
                                    const responseMeet = await fetch('https://td-g-production.up.railway.app/google/delete-event/', requestOptionsMEET);
                                    if (responseMeet.ok) {
                                        setShowCorrecto(true);
                                        setTimeout(() => {
                                            router.back();
                                        }, 1000);
                                    }
                                }
                            }
                        } else {

                            setShowAlert(true);
                        }
                    } catch (error) {

                        setShowAlert(true);
                    }
                }
            } else {
                setShowAlert(true)
            }
        } else {
            setShowCamposVacios(true)
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
    useEffect(() => {
        if (showOcupado) {
            const timer = setTimeout(() => {
                setShowOcupado(false);
            }, 2000);

            return () => clearTimeout(timer);
        }
    }, [showOcupado]);

    const verBitacora = (id) => {
        router.push('/component/bitacora/visualizar/asesor/' + id);
    }
    return (<>

        <div className="ml-6 mr-6 mt-6 border   bg-white border-b flex justify-between">
            <div className='pt-8  pb-8 w-full'>
                <div className='w-full border-b-2 flex flex-col sm:flex-row items-center sm:items-start justify-between sm:pl-8 sm:h-22 sm:pr-5 pb-5 text-center sm:text-left'>
                    <h1 className='text-4xl font-bold text-gray-600 mb-2 sm:mb-0'>Visualizar citas de asesorías</h1>
                </div>

                {citaEstado.id == 1 ? (

                    <><div className='p-10  grid grid-cols-1 lg:grid-cols-3'>
                        <div className=" text-center m-4 sm:m-5">
                            <div>
                                <h1 className="text-2xl sm:text-4xl font-bold text-gray-600">Estado:</h1>
                            </div>
                            <div className=''>
                                <span className="inline-block mt-1 text-2xl sm:mt-2 ml-2 sm:ml-4 px-2 sm:px-3 py-1 bg-gray-500 text-white font-semibold rounded-full">
                                    {citaEstado.nombre}
                                </span>
                            </div>
                        </div>
                        <div className="text-center m-4 sm:m-5">
                            <div>
                                <h1 className="text-2xl sm:text-4xl font-bold text-gray-600">Fecha:</h1>
                            </div>
                            <div>
                                {estadoModificar ? (

                                    <select value={numeroDia} onChange={(e) => { setNumeroDia(e.target.value); }} className="mt-1.5 w-full rounded-lg border-gray-300 text-gray-700 sm:text-sm"
                                    >
                                        {semanaConst.map((dia, index) => (
                                            <option key={index} value={numeroDiaLunes + index}>{dia} {numeroDiaLunes + index}</option>
                                        ))}
                                    </select>
                                ) :
                                    (<span className="inline-block font-semibold text-2xl text-gray-500  sm:mt-2 ml-2 sm:ml-4 px-2 sm:px-3  ">
                                        {fecha}
                                    </span>
                                    )}
                            </div>
                        </div>
                        <div className=" text-center m-4 sm:m-5">
                            <div>
                                <h1 className="text-2xl sm:text-4xl font-bold text-gray-600">Hora:</h1>
                            </div>
                            <div>
                                {estadoModificar ? (
                                    <div className='flex'>
                                        <select value={horaCancelar} onChange={(e) => { setHoraCancelar(e.target.value); }} id="hora" className="mt-1 w-full rounded-md border-gray-200 shadow-sm sm:text-sm">
                                            <option value={horaFija} selected>{horaFija}</option>
                                            {Array.from({ length: horaFin }, (_, i) => i + horaInicio).map(hour => (
                                                <option key={hour} value={hour.toString().padStart(2, '0')}>{hour.toString().padStart(2, '0')}</option>
                                            ))}
                                        </select>
                                        <select value={minConst} onChange={(e) => { setMinConst(e.target.value); }} id="minutos" className="mt-1 w-full rounded-md border-gray-200 shadow-sm sm:text-sm">

                                            <option value="00">00</option>
                                            <option value="20">20</option>
                                            <option value="40">40</option>
                                        </select>
                                    </div>
                                ) : (
                                    <span className="inline-block font-semibold text-2xl text-gray-500  sm:mt-2 ml-2 sm:ml-4 px-2 sm:px-3  ">
                                        {hora}
                                    </span>
                                )}
                            </div>
                        </div>
                        {grupoTrue ? (
                            <div className=" m-4 sm:m-5">
                                <div>
                                    <h1 className="text-2xl sm:text-4xl font-bold text-gray-600">Grupo:</h1>
                                </div>
                                <div>
                                    <select onChange={(e) => { setIdEquipo(e.target.value); }} id="minutos" className="mt-1 w-full rounded-md border-gray-200 shadow-sm sm:text-sm">
                                        <option selected disabled>Grupo</option>
                                        {listEquipos.map((item) => (
                                            <option key={item.id} value={item.id}>
                                                {item.codigoEquipo}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>) : null}
                    </div>
                        <div className="flex justify-center">
                            {!estadoModificar ? (
                                <>
                                    <button onClick={() => { setEstadoModificar(true); }} className="text-white xl:mt-28 h-14 py-2 px-4 w-full rounded bg-orange-400 hover:bg-orange-500 shadow hover:shadow-lg font-medium transition transform hover:-translate-y-0.5 min-w-[250px] max-w-[250px]">Modificar</button>
                                </>
                            ) : (
                                <>
                                    <button onClick={() => { modificarCita(); }} className="text-white xl:mt-20 h-14 py-2 px-4 w-full rounded bg-green-400 hover:bg-green-500 shadow hover:shadow-lg font-medium transition transform hover:-translate-y-0.5 min-w-[250px] max-w-[250px]">Confirmar</button>
                                    <button onClick={() => { setEstadoModificar(false); }} className="ml-5 text-white xl:mt-20 h-14 py-2 px-4 w-full rounded bg-red-400 hover:bg-red-500 shadow hover:shadow-lg font-medium transition transform hover:-translate-y-0.5 min-w-[250px] max-w-[250px]">Cancelar</button>
                                </>
                            )}

                        </div></>
                ) : (

                    <>
                        <div className={`p-10  grid grid-cols-1 lg:grid-cols-4 gap-4" `}>
                            <div className="text-center mt-5">
                                <div>
                                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-600">Estado:</h1>
                                </div>
                                <div className=''>
                                    <span className={`inline-block mt-1 text-2xl sm:mt-2 ml-2 sm:ml-4 px-2 sm:px-3 py-1 ${citaEstado.id == 2 ? (`bg-emerald-500`) : citaEstado.id == 1 ? (`bg-gray-500`) : citaEstado.id == 4 ? (`bg-red-500`) : citaEstado.id == 5 ? (`bg-red-500`) : citaEstado.id == 3 ? (`bg-indigo-500`) : citaEstado.id == 6 || citaEstado.id == 7 ? (`bg-orange-500`) : (null)} bg-emerald-500 text-white font-semibold rounded-full`}>
                                        {citaEstado.nombre}
                                    </span>
                                </div>
                            </div>
                            <div className="text-center mt-5">
                                <div>
                                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-600">Fecha:</h1>
                                </div>
                                <div>
                                    <span className="inline-block text-2xl text-gray-500 sm:mt-2 ml-2 sm:ml-4 font-semibold px-2 sm:px-3   ">
                                        {fecha}
                                    </span>
                                </div>
                            </div>
                            <div className="text-center mt-5">
                                <div>
                                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-600">Hora:</h1>
                                </div>
                                <div className='lg:mr-8'>
                                    <span className="text-center inline-block text-2xl text-gray-500 sm:mt-2 ml-2 sm:ml-4 font-semibold px-2 sm:px-3   ">
                                        {hora}
                                    </span>
                                </div>
                            </div>
                            <div className="text-center mt-5">
                                <div>
                                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-600">Tipo:</h1>
                                </div>
                                <div >
                                    <span className="inline-block text-2xl text-gray-500 sm:mt-2 ml-2 sm:ml-4 font-semibold px-2 sm:px-3   ">
                                        {tipoCita.nombre}
                                    </span>
                                </div>
                            </div>
                            <div className="text-center mt-5">
                                <div>
                                    {tipoCita.id == 1 ? (
                                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-600">Enlace:</h1>
                                    ) : (
                                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-600">Ubicación:</h1>
                                    )}
                                </div>
                                <div className='text-center lg:mr-8'>
                                    {tipoCita.id == 1 ? (
                                        <a href={cita.link} className="inline-block ml-5 min-w-[60px] max-w-[60px] min-h-[60px] max-h-[60px] justify-center items-center">
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
                            <div className="text-center mt-5">
                                <div>
                                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-600">Equipo:</h1>
                                </div>
                                <div>
                                    <span className="inline-block text-2xl text-gray-500 sm:mt-2 ml-2 sm:ml-4 font-semibold px-2 sm:px-3   ">
                                        {equipo.codigoEquipo}
                                    </span>
                                </div>
                            </div>
                            <div className="text-center mt-5 flex flex-col items-center">
                                <div>
                                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-600">Estudiantes:</h1>
                                </div>
                                <div className='lg:mr-8 mt-3'>
                                    <ul className="list-disc list-inside">
                                        {estudiantesEquipo && estudiantesEquipo.map((item) => (
                                            <li key={item.id} className="text-base text-gray-500 sm:mt-2 ml-2 sm:ml-4 font-semibold px-2 sm:px-3 max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl">
                                                {item.nombre}<br />
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                            {citaEstado.id == 4 ? (
                                <div className="text-center mt-5 flex flex-col items-center">
                                    <div>
                                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-600">Motivo:</h1>
                                    </div>
                                    <div className='lg:mr-8 mt-3'>
                                        <span className="inline-block  text-xl text-gray-500 sm:mt-2 ml-2 sm:ml-4 font-semibold px-2 sm:px-3   ">
                                            {motivo.nombre}
                                        </span>
                                    </div>
                                </div>
                            ) : (null)}


                        </div>
                        {citaEstado.id == 5 ? (
                            <div className="flex justify-center">
                                <button onClick={() => { router.push('/component/asesorias/visualizar/asesor/' + cita.modificaciones); }} class=" text-white xl:mt-7 h-14 py-2 px-4 w-full rounded bg-orange-400 hover:bg-orange-500 shadow hover:shadow-lg font-medium transition transform hover:-translate-y-0.5 min-w-[250px] max-w-[250px]">Nueva cita</button>
                            </div>
                        ) : (null)}
                        <div>


                            {cancelar ? (
                                <div className='justify-center  m-10 lg:mt-20 xl:mt-10'>
                                    <span className='text-2xl sm:text-4xl font-bold text-gray-600'> Seleccione la nueva fecha para su agendamiento.</span>
                                    <div className="m-4 sm:m-5 grid grid-cols-2">
                                        <div className='text-center lg:text-right'>
                                            <h1 className="text-2xl sm:text-4xl font-bold text-gray-600">Fecha:</h1>
                                        </div>
                                        <div>

                                            <select value={diaCancelar} onChange={(e) => { setDiaCancelar(e.target.value); }} className="mt-1.5 w-full rounded-lg border-gray-300 text-gray-700 sm:text-sm"
                                            >
                                                <option disabled selected value="0">Seleccione el dia</option>
                                                {semanaCancelar.map((parte, index) => (
                                                    <>
                                                        {index === 1 && <option disabled>--------- Siguiente semana ---------</option>}
                                                        {parte.map((dia, i) => (
                                                            index === 0 ? (
                                                                <option key={numeroDiaLunes + i + 1} value={numeroDiaLunes + i + 1}>{dia} {numeroDiaLunes + i + 1}</option>
                                                            ) : (
                                                                <option key={numeroDiaLunes + i + (8 - fechaPruebas.getDate())} value={numeroDiaLunes + i + (8 - fechaPruebas.getDate())}>{dia} {numeroDiaLunes + i + (8 - fechaPruebas.getDate())}</option>
                                                            )
                                                        ))}
                                                    </>
                                                ))}
                                            </select>

                                        </div>
                                    </div>
                                    <div className="mx-4 sm:mx-10 grid grid-cols-2">
                                        <div className='text-center lg:text-right'>
                                            <h1 className="text-2xl sm:text-4xl font-bold text-gray-600">Hora:</h1>
                                        </div>
                                        <div className='flex'>

                                            <><select value={horaCancelar} onChange={(e) => { setHoraCancelar(e.target.value); }} id="hora" className="mt-1 w-full rounded-md border-gray-200 shadow-sm sm:text-sm">
                                                <option value="-1" disabled selected>Hora</option>
                                                {Array.from({ length: 15 }, (_, i) => i + 6).map(hour => (
                                                    <option key={hour} value={hour.toString().padStart(2, '0')}>{hour.toString().padStart(2, '0')}</option>
                                                ))}
                                            </select>
                                                <select value={minCancelar} onChange={(e) => { setMinCancelar(e.target.value); }} id="minutos" className="mt-1 w-full rounded-md border-gray-200 shadow-sm sm:text-sm">

                                                    <option value="-1" disabled selected>Minutos</option>
                                                    <option value="00">00</option>
                                                    <option value="20">20</option>
                                                    <option value="40">40</option>
                                                </select></>

                                        </div>
                                    </div>
                                    <div className="mx-4 mt-5 sm:mx-10 grid grid-cols-2">
                                        <div className='text-center lg:text-right'>
                                            <h1 className="text-2xl sm:text-4xl font-bold text-gray-600">Motivo:</h1>
                                        </div>
                                        <div className='flex'>
                                            <select value={observacion} onChange={(e) => { setObservacion(e.target.value); }} id="minutos" className="mt-1 w-full rounded-md border-gray-200 shadow-sm sm:text-sm">
                                                <option value="-1">Seleccione el motivo</option>
                                                {motivo.map((item) => (
                                                    <option key={item.id} value={item.id}>{item.nombre}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                    <div className="flex flex-col pt-8    lg:flex-row justify-center">
                                        <button onClick={() => { cancelarCita(cita.id); }} className="text-white h-14 py-2 px-4 w-full lg:w-auto rounded bg-emerald-400 hover:bg-emerald-500 shadow hover:shadow-lg font-medium transition transform hover:-translate-y-0.5 min-w-[250px] mb-4 lg:mb-0 lg:mr-5">
                                            Confirmar
                                        </button>
                                        <button onClick={() => { setCancelar(false); }} className="text-white h-14 py-2 px-4 w-full lg:w-auto rounded bg-red-400 hover:bg-red-500 shadow hover:shadow-lg font-medium transition transform hover:-translate-y-0.5 min-w-[250px]">
                                            Cancelar
                                        </button>
                                    </div>
                                </div>) : (
                                citaEstado.id == 2 || citaEstado.id == 6 || citaEstado.id == 7 ? (
                                    <div className="flex flex-col   lg:flex-row justify-center">
                                        <button onClick={() => { verBitacora(equipo.id); }} className="text-white h-14 py-2 px-4 w-full lg:w-auto rounded bg-indigo-400 hover:bg-indigo-500 shadow hover:shadow-lg font-medium transition transform hover:-translate-y-0.5 min-w-[250px] mb-4 lg:mb-0 lg:mr-5">
                                            Ver Bitácora
                                        </button>
                                        <button onClick={() => { setCancelar(true); /*cancelarCita(cita.id)*/ }} className="text-white h-14 py-2 px-4 w-full lg:w-auto rounded bg-red-400 hover:bg-red-500 shadow hover:shadow-lg font-medium transition transform hover:-translate-y-0.5 min-w-[250px]">
                                            Cancelar
                                        </button>
                                    </div>
                                ) : (
                                    citaEstado.id == 3 ? (
                                        <div className="flex justify-center">
                                            <button onClick={() => { verAsesoria(cita.id) }} class="text-white h-14 py-2 px-4 w-full rounded bg-indigo-400 hover:bg-indigo-500 shadow hover:shadow-lg font-medium transition transform hover:-translate-y-0.5 min-w-[250px] max-w-[250px]">Ver asesoría</button>
                                        </div>
                                    ) : (null)
                                )
                            )}

                        </div></>)}


            </div>
        </div > {showAlert && (
            <div className="fixed bottom-0 right-0 mb-8 mr-8">
                <div className="flex w-96 shadow-lg rounded-lg">
                    <div className="bg-red-600 py-4 px-6 rounded-l-lg flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" className="fill-current text-white" width="20" height="20">
                            <path fillRule="evenodd" d="M4.47.22A.75.75 0 015 0h6a.75.75 0 01.53.22l4.25 4.25c.141.14.22.331.22.53v6a.75.75 0 01-.22.53l-4.25 4.25A.75.75 0 0111 16H5a.75.75 0 01-.53-.22L.22 11.53A.75.75 0 010 11V5a.75.75 0 01.22-.53L4.47.22zm.84 1.28L1.5 5.31v5.38l3.81 3.81h5.38l3.81-3.81V5.31L10.69 1.5H5.31zM8 4a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 018 4zm0 8a1 1 0 100-2 1 1 0 000 2z"></path>
                        </svg>
                    </div>
                    <div className="px-4 py-6 bg-white rounded-r-lg flex justify-between items-center w-full border border-l-transparent border-gray-200">
                        <div>Error al cargar</div>
                        <button onClick={() => { setShowAlert(!showAlert) }}>
                            <svg xmlns="http://www.w3.org/2000/svg" className="fill-current text-gray-700" viewBox="0 0 16 16" width="20" height="20">
                                <path fillRule="evenodd" d="M3.72 3.72a.75.75 0 011.06 0L8 6.94l3.22-3.22a.75.75 0 111.06 1.06L9.06 8l3.22 3.22a.75.75 0 11-1.06 1.06L8 9.06l-3.22 3.22a.75.75 0 01-1.06-1.06L6.94 8 3.72 4.78a.75.75 0 010-1.06z"></path>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        )
        }{showCamposVacios && (
            <div className="fixed bottom-0 right-0 mb-8 mr-8">
                <div className="flex w-96 shadow-lg rounded-lg">
                    <div className="bg-red-600 py-4 px-6 rounded-l-lg flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" className="fill-current text-white" width="20" height="20">
                            <path fillRule="evenodd" d="M4.47.22A.75.75 0 015 0h6a.75.75 0 01.53.22l4.25 4.25c.141.14.22.331.22.53v6a.75.75 0 01-.22.53l-4.25 4.25A.75.75 0 0111 16H5a.75.75 0 01-.53-.22L.22 11.53A.75.75 0 010 11V5a.75.75 0 01.22-.53L4.47.22zm.84 1.28L1.5 5.31v5.38l3.81 3.81h5.38l3.81-3.81V5.31L10.69 1.5H5.31zM8 4a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 018 4zm0 8a1 1 0 100-2 1 1 0 000 2z"></path>
                        </svg>
                    </div>
                    <div className="px-4 py-6 bg-white rounded-r-lg flex justify-between items-center w-full border border-l-transparent border-gray-200">
                        <div>Los campos deben ser llenados correctamente</div>
                        <button onClick={() => { setShowCamposVacios(!showCamposVacios) }}>
                            <svg xmlns="http://www.w3.org/2000/svg" className="fill-current text-gray-700" viewBox="0 0 16 16" width="20" height="20">
                                <path fillRule="evenodd" d="M3.72 3.72a.75.75 0 011.06 0L8 6.94l3.22-3.22a.75.75 0 111.06 1.06L9.06 8l3.22 3.22a.75.75 0 11-1.06 1.06L8 9.06l-3.22 3.22a.75.75 0 01-1.06-1.06L6.94 8 3.72 4.78a.75.75 0 010-1.06z"></path>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        )
        }
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
        {showACampos && (
            <div className="fixed bottom-0 right-0 mb-8 mr-8">
                <div className="flex w-96 shadow-lg rounded-lg">
                    <div className="bg-orange-600 py-4 px-6 rounded-l-lg flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" className="fill-current text-white" width="20" height="20">
                            <path fillRule="evenodd" d="M4.47.22A.75.75 0 015 0h6a.75.75 0 01.53.22l4.25 4.25c.141.14.22.331.22.53v6a.75.75 0 01-.22.53l-4.25 4.25A.75.75 0 0111 16H5a.75.75 0 01-.53-.22L.22 11.53A.75.75 0 010 11V5a.75.75 0 01.22-.53L4.47.22zm.84 1.28L1.5 5.31v5.38l3.81 3.81h5.38l3.81-3.81V5.31L10.69 1.5H5.31zM8 4a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 018 4zm0 8a1 1 0 100-2 1 1 0 000 2z"></path>
                        </svg>
                    </div>
                    <div className="px-4 py-6 bg-white rounded-r-lg flex justify-between items-center w-full border border-l-transparent border-gray-200">
                        <div>Los campos ingresados son incorrectos, la fecha o la hora no son acordes.</div>
                        <button onClick={() => { setShowACampos(!showACampos) }}>
                            <svg xmlns="http://www.w3.org/2000/svg" className="fill-current text-gray-700" viewBox="0 0 16 16" width="20" height="20">
                                <path fillRule="evenodd" d="M3.72 3.72a.75.75 0 011.06 0L8 6.94l3.22-3.22a.75.75 0 111.06 1.06L9.06 8l3.22 3.22a.75.75 0 11-1.06 1.06L8 9.06l-3.22 3.22a.75.75 0 01-1.06-1.06L6.94 8 3.72 4.78a.75.75 0 010-1.06z"></path>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        )} {showOcupado && (
            <div className="fixed bottom-0 right-0 mb-8 mr-8">
                <div className="flex w-96 shadow-lg rounded-lg">
                    <div className="bg-orange-600 py-4 px-6 rounded-l-lg flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" className="fill-current text-white" width="20" height="20">
                            <path fillRule="evenodd" d="M4.47.22A.75.75 0 015 0h6a.75.75 0 01.53.22l4.25 4.25c.141.14.22.331.22.53v6a.75.75 0 01-.22.53l-4.25 4.25A.75.75 0 0111 16H5a.75.75 0 01-.53-.22L.22 11.53A.75.75 0 010 11V5a.75.75 0 01.22-.53L4.47.22zm.84 1.28L1.5 5.31v5.38l3.81 3.81h5.38l3.81-3.81V5.31L10.69 1.5H5.31zM8 4a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 018 4zm0 8a1 1 0 100-2 1 1 0 000 2z"></path>
                        </svg>
                    </div>
                    <div className="px-4 py-6 bg-white rounded-r-lg flex justify-between items-center w-full border border-l-transparent border-gray-200">
                        <div>La fecha y hora seleccionadas se encuentran ocupadas.</div>
                        <button onClick={() => { setShowOcupado(!showOcupado) }}>
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
    </>
    )
}

export default page
