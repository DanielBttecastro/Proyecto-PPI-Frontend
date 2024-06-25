/* eslint-disable react-hooks/rules-of-hooks */
"use client"
import { split } from 'postcss/lib/list';
import React, { useState, useEffect } from 'react'
import { format } from 'date-fns';
import './css/style.css'
import CryptoJS from 'crypto-js';

function crear({ citaPendientes }) {
    const [labelCheck, setLabelCheck] = useState([])
    const [estudiantes, setEstudiantes] = useState([])
    const [showMasCitas, setShowMasCitas] = useState(false);
    const [tipoCita, setTipoCita] = useState('1')
    const [semanas, setSemanas] = useState([])
    const [showCorrecto, setShowCorrecto] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const [showHorasCompletas, setShowHorasCompletas] = useState(false);
    const [estadoCrear, setEstadoCrear] = useState(false)
    const [diaCreacion, setDiaCreacion] = useState('')
    const [filstroSemana, setFilstroSemana] = useState(false)
    const [diaSemana, setDiaSemana] = useState('');
    const [horas, setHoras] = useState([]);
    const [horasMañana, setHorasMañana] = useState([]);
    const [usuarioActual, setUsuarioActual] = useState([]);
    const [horasTarde, setHorasTarde] = useState([]);
    const [horasNoche, setHorasNoche] = useState([]);
    const [horaSeleccionadas, setHoraSeleccionadas] = useState([]);
    const [diaLunes, setDiaLunes] = useState('');
    const [showCitasPendientes, setShowCitasPendientes] = useState(false)
    const [diasNumero, setDiaNumero] = useState([]);
    const [fechaPruebas, setFechaPruebas] = useState(new Date());
    const [citasPendientes, setCitasPendientes] = useState([])
    const [horasPendientes, setHorasPendientes] = useState('');
    const [diasConst, setDiasConst] = useState(['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'])
    const [siguienteSemana, setSiguienteSemana] = useState([])
    const [cantCitasPendientes, setCantCitasPendientes] = useState()
    const diasSemana = {
        'Lunes': 1,
        'Martes': 2,
        'Miércoles': 3,
        'Jueves': 4,
        'Viernes': 5,
        'Sábado': 6,
        'Domingo': 7
    };

    const calcularNumeroDiaLunes = () => {
        const fecha = new Date(fechaPruebas);
        let diaSemanas = fecha.getDay();
        const numeroDia = fecha.getDate();
        if (fecha.getHours() >= 18) diaSemanas = diaSemanas + 1
        setDiaSemana(diaSemanas)
        setDiaLunes(numeroDia - fecha.getDay() + 1);
    };

    const obtenerHoraActual = (dia, index) => {
        setHoras([]);
        setHorasMañana([]);
        setHorasTarde([]);
        setHorasNoche([]);
        setDiaCreacion(dia[1]);
        const numeroDia = dia[1];
        const fechaActual = new Date(fechaPruebas);
        /* fechaActual.setDate(22)
         fechaActual.setHours(3);
         fechaActual.setMinutes(0);
         fechaActual.setSeconds(0);
         fechaActual.setMilliseconds(0);*/
        let hora = 0;
        //888
        if (numeroDia == fechaActual.getDate()) {
            hora = fechaActual.getHours()
            if (hora >= 1 && hora <= 2) {
                hora = 6
            }
            else {
                hora = hora + 4;
            }
        } else {
            hora = 6;
        }

        for (let i = hora; i <= 21; i++) {
            if (i < 12) {
                const dato = [`${i}:00`, `${i}:20`, `${i}:40`]
                setHorasMañana(prevState => [...prevState, dato])
            } else if (i < 18 && i >= 12) {
                const dato = [`${i}:00`, `${i}:20`, `${i}:40`]
                setHorasTarde(prevState => [...prevState, dato])
            } else if (i >= 18) {
                const dato = [`${i}:00`, `${i}:20`, `${i}:40`]
                setHorasNoche(prevState => [...prevState, dato])
            }
            const dato = [`${i}:00`, `${i}:20`, `${i}:40`]
            setHoras(prevState => [...prevState, dato])
        }
        buscarCitas(dia);

    };




    const cambiaDia = (item, index) => {
        horaSeleccionadas.map((item) => {
            const checkbox = document.getElementById(item);
            checkbox.checked = false
        })
        setHoraSeleccionadas([])
        setHoras([])
        labelCheck.map((item) => {
            const checkbox = document.getElementById(item);
            const lbCheckbox = document.getElementById(`lb${item}`);
            lbCheckbox.classList.remove("labeldsabilitado");
            checkbox.disabled = false;
        })
        const dia = split(item, ' ')
        obtenerHoraActual(dia, index);
    };
    const seleccionarHora = (hora) => {
        if (horaSeleccionadas.length !== 0) {
            if (horaSeleccionadas.some(array => array.includes(hora))) {
                const datosActualizados = horaSeleccionadas.map(array => array.filter(dato => dato !== hora));
                setHoraSeleccionadas(datosActualizados.filter(array => array.length > 0));
            } else {
                setHoraSeleccionadas(prevState => [...prevState, [hora]])
            }
        } else {
            setHoraSeleccionadas(prevState => [...prevState, [hora]])
        }
    }

    const validarHoras = async (cantHoras) => {
        const response = await fetch('https://td-g-production.up.railway.app/hora-semanal/profesor/' + usuarioActual.id);
        const data = await response.json();
        if (response.ok) {
            const horasAsignadas = data[0].horasAsignadas;
            const CantidadAsesorias = horasAsignadas * 4;
            const fechaActual = new Date(fechaPruebas);
            //fechaActual.setDate(22)
            const fechaLunes = new Date(fechaActual);
            fechaLunes.setDate(diaLunes)
            const fechaSabado = new Date(fechaActual);
            fechaLunes.setDate(fechaActual.getDate() - fechaActual.getDay() + 1);
            fechaSabado.setDate(fechaActual.getDate() - (fechaActual.getDay() - 7)); // Establece la fecha al próximo lunes
            const fechaInicio = fechaLunes.toISOString().split('T')[0];
            const fechaFin = fechaSabado.toISOString().split('T')[0];
            const response2 = await fetch(`https://td-g-production.up.railway.app/citas-asesoria-ppi/${fechaInicio}/${fechaFin}/` + usuarioActual.id);
            const data2 = await response2.json();
            if (response2.ok) {
                const asesoriasActual = data2.length + cantHoras;
                if (asesoriasActual < CantidadAsesorias) {
                    return (CantidadAsesorias - asesoriasActual);
                }
            }
        }
        return (false);
    }

    const crearCitas = async () => {
        const fecha = new Date(fechaPruebas)
        //fechaActual.setDate(22)
        let estado = false;
        fecha.setDate(diaCreacion)

        const valHoras = await validarHoras(horaSeleccionadas.length)
        if (valHoras == false) {
            setShowHorasCompletas(true)
        } else {
            setHorasPendientes(valHoras);
            for (const elemento of horaSeleccionadas) {
                try {
                    //falta el id
                    const datos = {
                        "fecha": fecha,
                        "hora": elemento[0],
                        "estadoCita": 1,
                        "link": "",
                        "modificaciones": "",
                        "usuariocitaequipo": usuarioActual.id,
                        "tipoCita": tipoCita
                    }
                    const requestOptions = {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(datos)
                    };
                    const response = await fetch('https://td-g-production.up.railway.app/citas-asesoria-ppi', requestOptions);
                    if (response.ok) {
                        estado = true;

                    } else {
                        estado = false;
                    }

                } catch (error) {
                    console.error('Error al realizar la solicitud:', error);
                    estado = false;
                }
            }
            if (estado) {
                const mensaje = "El asesor " + usuarioActual.nombre + " ha creado " + horaSeleccionadas.length + " citas"
                const datos = {
                    "mensaje": mensaje,
                    "tipo": 1,
                    "redireccion": usuarioActual.id,
                    "estado": 1
                }
                const requestOptions = {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(datos)
                };
                const response = await fetch('https://td-g-production.up.railway.app/notificaciones', requestOptions);

                setShowCorrecto(true);
                setHoraSeleccionadas([]);
                setTimeout(() => {
                    window.location.reload();
                }, 2000);

            } else {
                setShowAlert(true);
            }
        }
    }

    function formatTime(timeString) {
        const hora = timeString.split(':')[0] + ':' + timeString.split(':')[1];
        const formattedTime = format(new Date(`2000-01-01T${hora}`), 'HH:mm');
        return formattedTime.replace(/^0(\d)/, '$1');
    }
    const buscarCitas = async (dia) => {
        const fechaActual = new Date(fechaPruebas);
        //fechaActual.setDate(22)
        const fechaLunes = new Date(fechaActual);
        const fechaSabado = new Date(fechaActual); // Clona la fecha actual
        fechaLunes.setDate(fechaActual.getDate() - fechaActual.getDay() + 1);
        fechaSabado.setDate(fechaActual.getDate() - (fechaActual.getDay() - 7));
        if (fechaPruebas.getDay() >= 4) {
            fechaSabado.setDate(fechaSabado.getDate() + 7)
        }
        const fechaInicio = format(fechaLunes, "MM-dd-yyyy");
        const fechaFin = format(fechaSabado, "MM-dd-yyyy");
        const response = await fetch(`https://td-g-production.up.railway.app/citas-asesoria-ppi/${fechaInicio}/${fechaFin}/${usuarioActual.id}`);
        const data = await response.json();
        if (response.ok) {
            setLabelCheck([])
            data.map((item) => {
                const fecha = new Date(item.fecha)
                if (fecha.getDate() == dia[1]) {
                    const fecha = new Date(fechaPruebas);
                    /*fecha.setDate(22)
                    fecha.setHours(3);
                    fecha.setMinutes(0);
                    fecha.setSeconds(0);
                    fecha.setMilliseconds(0);*/
                    const fechaHoyForma = format(fechaPruebas, 'dd/MM/yyyy');
                    const fechaCitaForma = format(item.fecha, 'dd/MM/yyyy');
                    if (parseInt(item.hora.split(":")[0]) >= fecha.getHours() + 4 || fechaHoyForma != fechaCitaForma) {
                        const horas = formatTime(item.hora);
                        const checkbox = document.getElementById(horas);
                        const lbCheckbox = document.getElementById(`lb${horas}`);
                        setLabelCheck(prevState => [...prevState, [horas]])
                        lbCheckbox.classList.add("labeldsabilitado");
                        checkbox.disabled = true;
                    }
                }
            })

        } else {
            setShowAlert(true);
        }

    }

    const cambiarEstado = () => {
        citasPendientes.forEach(async (item) => {
            let Tcita = 1;
            if (item.tipoCita.id == 2) {
                Tcita = 0;
            }
            const estu = estudiantes[item.equipocita.codigoEquipo]
            let estudiant = []
            for (let index = 0; index < estu.length; index++) {
                const element = estu[index];
                estudiant.push(element.correo)
            }
            estudiant.push(usuarioActual.correo)
            const dataCrearMeet = {
                "date": format(item.fecha, 'yyyy-MM-dd'),
                "dateTime": `${item.hora.split(':')[0]}:${item.hora.split(':')[1]}:00`,
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
            const datos = {
                "estadoCita": 7,
                "link": linCita,
                "idCalendar": dataMeet.eventId
            }
            const requestOptions = {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(datos)
            };
            const response = await fetch('https://td-g-production.up.railway.app/citas-asesoria-ppi/' + item.id, requestOptions);
            if (response.ok) {
                let numSemana = 0
                for (let i = 0; i < semanas.length; i++) {
                    const semana = semanas[i];
                    const fechaInicio = new Date(semana.fechaInicio);
                    const fechaFin = new Date(semana.fechaFin);
                    if (item.fecha >= fechaInicio && item.fecha <= fechaFin) {
                        numSemana = semana.numeroSemana;
                    }
                }
                const datosSeguimiento = {
                    "fecha": item.fecha,
                    "citas": item.id,
                    "compromiso": "",
                    "observacion": "",
                    "semana": numSemana
                };
                const estudiantesAux = estudiantes[item.equipocita.codigoEquipo]
                estudiantesAux.forEach((element, index) => {
                    const name = "estudiante" + (index + 1);
                    datosSeguimiento[name] = element.id
                });

                const requestOptionsSeguimiento = {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(datosSeguimiento)
                };
                const responseSeguimiento = await fetch('https://td-g-production.up.railway.app/seguimiento-ppi/', requestOptionsSeguimiento);
                if (responseSeguimiento.ok) {
                    setShowCorrecto(true)
                    setShowCitasPendientes(false);
                }
            } else {
                setShowAlert(true)
            }
        })
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
        setCantCitasPendientes(citaPendientes)
    }, [citaPendientes]);


    useEffect(() => {

        calcularNumeroDiaLunes();
        const citasPendientes = async () => {
            const fechaActual = new Date(fechaPruebas);
            const usuarioNest = localStorage.getItem('U2FsdGVkX1');
            const bytes = CryptoJS.AES.decrypt(usuarioNest, 'PPIITYTPIJC');
            const usuarioN = JSON.parse(bytes.toString(CryptoJS.enc.Utf8))
            setUsuarioActual(usuarioN)
            //fechaActual.setDate(22)
            const fechaLunes = new Date(fechaActual);
            const fechaSabado = new Date(fechaActual);
            fechaLunes.setDate(fechaActual.getDate() - fechaActual.getDay() + 1);
            fechaSabado.setDate(fechaActual.getDate() - (fechaActual.getDay() - 7));
            const fechaInicio = format(fechaLunes, "yyyy-MM-dd")
            const fechaFin = format(fechaSabado, "yyyy-MM-dd")
            const response = await fetch(`https://td-g-production.up.railway.app/citas-asesoria-ppi/${fechaInicio}/${fechaFin}/` + usuarioN.id);
            const data = await response.json();
            if (response.ok) {
                const registrosFiltrados = data.filter(registro => registro.estadoCita.id === 6);
                if (registrosFiltrados.length != 0) {
                    setShowCitasPendientes(true)
                    setCitasPendientes(registrosFiltrados)
                } else {
                    setShowCitasPendientes(false)
                }
            }
        }
        const semanas = async () => {
            const response = await fetch('https://td-g-production.up.railway.app/semanas');
            const data = await response.json();
            if (response.ok) {
                setSemanas(data)
            }
        }
        const buscarEstudiantes = async () => {
            const response = await fetch(`https://td-g-production.up.railway.app/equipo-usuarios/estudiantes`);
            const data = await response.json();
            if (response.ok) {
                setEstudiantes(data);
            }
        }
        buscarEstudiantes()
        semanas();
        citasPendientes();
    }, []);
    useEffect(() => {
        if (showHorasCompletas) {
            const timer = setTimeout(() => {
                setShowHorasCompletas(false);
            }, 5000);

            return () => clearTimeout(timer);
        }
    }, [showHorasCompletas]);

    useEffect(() => {
        if (showCorrecto) {
            const timer = setTimeout(() => {
                setShowCorrecto(false);
            }, 2000);

            return () => clearTimeout(timer);
        }
    }, [showCorrecto]);

    useEffect(() => {
        setDiaNumero([])
        diasConst.map((item, index) => {
            if ((diaSemana - 1) <= index) {
                setDiaNumero(prevState => [...prevState, item + ' ' + (diaLunes + index)])
            }
        });
        if (fechaPruebas.getDay() >= 4) {
            setSiguienteSemana([])
            let dia = ((7 - fechaPruebas.getDay()) + fechaPruebas.getDate() + 1)
            for (let index = 0; index < diasConst.length; index++) {
                setSiguienteSemana(prevState => [...prevState, diasConst[index] + ' ' + (dia + index)])
            }
        }
    }, [diaLunes, diasConst, diaSemana]);

    useEffect(() => {
        if (horaSeleccionadas.length !== 0) {
            setEstadoCrear(true);
        } else {
            setEstadoCrear(false);
        }
    }, [horaSeleccionadas]);
    return (
        <div>

            {showCitasPendientes ? (<div className='w-full h-full'>
                <h1 className='text-3xl font-bold text-center text-gray-600'>Citas pendientes:</h1>

                <div className='mt-5'>
                    <div className='text-xl font-bold text-center text-gray-600 grid grid-cols-3'>
                        <div>Fecha</div>
                        <div>Hora</div>
                        <div>Equipo</div>
                    </div>
                    {citasPendientes.map((item) => (
                        <div key={item.id} className='text-xl font-semibold text-center text-gray-500 grid grid-cols-3'>
                            <div>{new Date(item.fecha).toISOString().split('T')[0]}</div>
                            <div>{formatTime(item.hora)}</div>
                            <div>{item.equipocita.codigoEquipo}</div>
                        </div>
                    ))}
                    <button onClick={() => { cambiarEstado() }} class="mt-6 text-white py-2 px-4 w-full rounded bg-green-400 hover:bg-green-500 shadow hover:shadow-lg font-medium transition transform hover:-translate-y-0.5">Crear</button>

                </div>
            </div>) : (
                <>
                    <div>
                        <h1 className='text-3xl font-bold text-center text-gray-600'>Selecciona la modalidad de la cita:</h1>

                        <div className=' justify-center  pt-8 flex gap-4" '>
                            <div className='px-2 py-4'>
                                <input onChange={() => { setTipoCita('1') }} defaultChecked type="radio" id='Virtual' name="Ubicacion" className=" peer hidden" />
                                <label htmlFor='Virtual' className="labelCheck select-none cursor-pointer rounded-lg border-2 border-green-500 py-3 px-10 font-bold text-green-500 transition-colors duration-200 ease-in-out peer-checked:bg-green-500 peer-checked:text-white peer-checked:border-green-500">Virtual</label>
                            </div>

                            <div className='px-2 py-4'>
                                <input onChange={() => { setTipoCita('2') }} type="radio" id='Presencial' name="Ubicacion" className=" peer hidden" />
                                <label htmlFor='Presencial' className="labelCheck select-none cursor-pointer rounded-lg border-2 border-indigo-500 py-3 px-6 font-bold text-indigo-500 transition-colors duration-200 ease-in-out peer-checked:bg-indigo-500 peer-checked:text-white peer-checked:border-indigo-500">Presencial</label>
                            </div>
                        </div>

                    </div>
                    <div className='pt-8'>
                        <h1 className='text-3xl font-bold text-center text-gray-600'>Selecciona el día de la cita:</h1>
                        <div className="grid text-center pt-8 items-center">
                            <div className="grid grid-cols-1 sm:pl-14 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:flex gap-5 justify-center">
                                {/* Primer conjunto de días de la semana */}
                                {diasNumero.map((item, index) => (
                                    <div key={item} className="px-2 py-4">
                                        <input onChange={(e) => { cambiaDia(item, index); setFilstroSemana(true) }} type="radio" id={item} name="dia-semana" className="peer hidden" />
                                        <label htmlFor={item} className="select-none cursor-pointer rounded-lg border-2 border-blue-500 py-3 px-6 font-bold text-blue-500 transition-colors duration-200 ease-in-out peer-checked:bg-blue-500 peer-checked:text-white peer-checked:border-blue-500">
                                            {item}
                                        </label>
                                    </div>
                                ))}
                            </div>
                            <div className="grid grid-cols-1 sm:pl-14 sm:grid-cols-2 mt-5 md:grid-cols-2 lg:grid-cols-3 xl:flex gap-5 justify-center">
                                {/* Segundo conjunto de días de la semana */}
                                {siguienteSemana.map((item, index) => (
                                    <div key={item} className="px-2 py-4">
                                        <input onChange={(e) => { cambiaDia(item, index); setFilstroSemana(false) }} type="radio" id={item} name="dia-semana" className="peer hidden" />
                                        <label htmlFor={item} className="select-none cursor-pointer rounded-lg border-2 border-blue-500 py-3 px-6 font-bold text-blue-500 transition-colors duration-200 ease-in-out peer-checked:bg-blue-500 peer-checked:text-white peer-checked:border-blue-500">
                                            {item}
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </div>


                    </div>
                    <div className='pt-8'>
                        <h1 className='text-3xl font-bold text-center text-gray-600'>Selecciona la hora de la cita:</h1>

                        <div className='mt-5'>
                            <div className='  grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3'>
                                {horasMañana.length != 0 ? (
                                    <div className='mb-8'>
                                        <div className='flex items-center justify-center text-center'>
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" className="w-6 h-6 text-gray-500">
                                                <path stroke-linecap="round" stroke-linejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" />
                                            </svg>
                                            <span className='text-xl font-semibold text-gray-500'>Mañana</span>
                                        </div>
                                        <div className='pt-4'>
                                            {horasMañana.map((items, index1) => (
                                                <div key={index1} className="pt-2 pl-5 grid grid-cols-3">
                                                    {items.map((item, index) => (
                                                        <div key={item} className='py-4'>
                                                            <input onClick={(e) => seleccionarHora(item)} type="checkbox" id={item} name="dia-semana" className=" peer hidden" />
                                                            <label htmlFor={item} id={`lb${item}`} className={`${item.split(":")[0] <= 9 ? ('sm:px-7 px-5') : ('sm:px-6 px-4')} labelCheck select-none cursor-pointer rounded-lg border-2 border-amarilloButtons sm:py-3 py-2 font-bold text-amarilloButtons transition-colors duration-200 ease-in-out peer-checked:bg-amarilloButtons peer-checked:text-white peer-checked:border-amarilloButtons`}>{item}</label>
                                                        </div>
                                                    ))}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ) : (null)}
                                {horasTarde.length != 0 ? (
                                    <div className='mb-8 sm:border-x-2  border-gray-400'>
                                        <div className='flex items-center justify-center text-center'>
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-gray-500"><path d="M8 12H10V14H4V12H6C6 8.68629 8.68629 6 12 6C15.3137 6 18 8.68629 18 12C18 15.3137 15.3137 18 12 18V16C14.2091 16 16 14.2091 16 12C16 9.79086 14.2091 8 12 8C9.79086 8 8 9.79086 8 12ZM6 20H15V22H6V20ZM2 16H10V18H2V16ZM11 1H13V4H11V1ZM3.51472 4.92893L4.92893 3.51472L7.05025 5.63604L5.63604 7.05025L3.51472 4.92893ZM16.9497 18.364L18.364 16.9497L20.4853 19.0711L19.0711 20.4853L16.9497 18.364ZM19.0711 3.51472L20.4853 4.92893L18.364 7.05025L16.9497 5.63604L19.0711 3.51472ZM23 11V13H20V11H23Z"></path></svg>
                                            <span className='text-xl font-semibold text-gray-500'>Tarde</span>
                                        </div>
                                        <div className='pt-4'>
                                            {horasTarde.map((items, index1) => (
                                                <div key={index1} className="pt-2 pl-5 grid grid-cols-3">
                                                    {items.map((item, index) => (
                                                        <div key={item} className='py-4'>
                                                            <input onClick={(e) => seleccionarHora(item)} type="checkbox" id={item} name="dia-semana" className=" peer hidden" />
                                                            <label htmlFor={item} id={`lb${item}`} className={`sm:px-6 px-4 labelCheck select-none cursor-pointer rounded-lg border-2 border-orange-500 sm:py-3 py-2 font-bold text-orange-500 transition-colors duration-200 ease-in-out peer-checked:bg-orange-500 peer-checked:text-white peer-checked:border-orange-500`}>{item}</label>
                                                        </div>
                                                    ))}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ) : (null)}


                                {horasNoche.length != 0 ? (
                                    <div className=''>
                                        <div className='flex items-center justify-center text-center'>
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-6 h-6 text-gray-500">
                                                <path stroke-linecap="round" stroke-linejoin="round" d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z" />
                                            </svg>
                                            <span className='text-xl font-semibold text-gray-500'>Noche</span>
                                        </div>

                                        <div className='pt-4'>
                                            {horasNoche.map((items, index1) => (
                                                <div key={index1} className="pt-2 pl-5 grid grid-cols-3">
                                                    {items.map((item, index) => (
                                                        <div key={item} className='py-4'>
                                                            <input onClick={(e) => seleccionarHora(item)} type="checkbox" id={item} name="dia-semana" className=" peer hidden" />
                                                            <label htmlFor={item} id={`lb${item}`} className="labelCheck select-none cursor-pointer rounded-lg border-2 border-sky-800 sm:py-3 py-2 sm:px-6 px-4 font-bold text-sky-800 transition-colors duration-200 ease-in-out peer-checked:bg-sky-800 peer-checked:text-white peer-checked:border-sky-800">{item}</label>
                                                        </div>
                                                    ))}
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                ) : (null)}
                            </div>
                        </div>
                    </div>
                    {estadoCrear ? (<div className='mt-5'>
                        <button onClick={() => { if ((cantCitasPendientes - horaSeleccionadas.length < 0)&&filstroSemana) setShowMasCitas(true); else crearCitas() }} class="text-white py-2 px-4 w-full rounded bg-green-400 hover:bg-green-500 shadow hover:shadow-lg font-medium transition transform hover:-translate-y-0.5">Crear</button>
                    </div>) : null}

                </>)
            }

            {showMasCitas && (<>
                <div className="fixed inset-0 z-10 bg-grey bg-opacity-10 backdrop-blur-sm flex justify-center items-center">
                    <div class="flex flex-col justify-center content-center items-center rounded-lg bg-white p-4 shadow-2xl min-w-[50vw] max-w-[50vw] border border-solid border-gray-300">
                        <h2 class="text-lg font-bold">Estás reservando citas adicionales</h2>
                        <p class="mt-2 text-sm text-gray-800">
                            Estás reservando {horaSeleccionadas.length - cantCitasPendientes} citas adicionales.
                        </p>
                        <div class="mt-4 flex flex-row flex-wrap min-w-full items-center content-center justify-center gap-2">
                            <button type="button" class="min-w-[25%] rounded-lg bg-green-200 px-4 py-2 text-sm font-medium text-green-600" onClick={() => { crearCitas(); setShowMasCitas(false) }}>
                                Confirmar
                            </button>
                            <button type="button" class="min-w-[25%] rounded-lg bg-red-200 px-4 py-2 text-sm font-medium text-red-600" onClick={() => setShowMasCitas(false)}>
                                Cancelar
                            </button>
                        </div>
                    </div>
                </div>
            </>
            )}

            {
                showAlert && (
                    <div className="fixed bottom-0 right-0 mb-8 mr-8">
                        <div className="flex w-96 shadow-lg rounded-lg">
                            <div className="bg-red-600 py-4 px-6 rounded-l-lg flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" className="fill-current text-white" width="20" height="20">
                                    <path fillRule="evenodd" d="M4.47.22A.75.75 0 015 0h6a.75.75 0 01.53.22l4.25 4.25c.141.14.22.331.22.53v6a.75.75 0 01-.22.53l-4.25 4.25A.75.75 0 0111 16H5a.75.75 0 01-.53-.22L.22 11.53A.75.75 0 010 11V5a.75.75 0 01.22-.53L4.47.22zm.84 1.28L1.5 5.31v5.38l3.81 3.81h5.38l3.81-3.81V5.31L10.69 1.5H5.31zM8 4a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 018 4zm0 8a1 1 0 100-2 1 1 0 000 2z"></path>
                                </svg>
                            </div>
                            <div className="px-4 py-6 bg-white rounded-r-lg flex justify-between items-center w-full border border-l-transparent border-gray-200">
                                <div>Error al crear</div>
                                <button onClick={() => { setShowAlert(!showAlert) }}>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="fill-current text-gray-700" viewBox="0 0 16 16" width="20" height="20">
                                        <path fillRule="evenodd" d="M3.72 3.72a.75.75 0 011.06 0L8 6.94l3.22-3.22a.75.75 0 111.06 1.06L9.06 8l3.22 3.22a.75.75 0 11-1.06 1.06L8 9.06l-3.22 3.22a.75.75 0 01-1.06-1.06L6.94 8 3.72 4.78a.75.75 0 010-1.06z"></path>
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                )
            }
            {
                showCorrecto && (
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
                )
            }
            {
                showHorasCompletas && (
                    <div className="fixed bottom-0 right-0 mb-8 mr-8">
                        <div className="flex w-96 shadow-lg rounded-lg">
                            <div className="bg-orange-600 py-4 px-6 rounded-l-lg flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" className="fill-current text-white" width="20" height="20">
                                    <path fillRule="evenodd" d="M4.47.22A.75.75 0 015 0h6a.75.75 0 01.53.22l4.25 4.25c.141.14.22.331.22.53v6a.75.75 0 01-.22.53l-4.25 4.25A.75.75 0 0111 16H5a.75.75 0 01-.53-.22L.22 11.53A.75.75 0 010 11V5a.75.75 0 01.22-.53L4.47.22zm.84 1.28L1.5 5.31v5.38l3.81 3.81h5.38l3.81-3.81V5.31L10.69 1.5H5.31zM8 4a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 018 4zm0 8a1 1 0 100-2 1 1 0 000 2z"></path>
                                </svg>
                            </div>
                            <div className="px-4 py-6 bg-white rounded-r-lg flex justify-between items-center w-full border border-l-transparent border-gray-200">
                                <div>Has reservado todas las horas disponibles para esta semana.</div>
                                <button onClick={() => { setShowHorasCompletas(!showHorasCompletas) }}>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="fill-current text-gray-700" viewBox="0 0 16 16" width="20" height="20">
                                        <path fillRule="evenodd" d="M3.72 3.72a.75.75 0 011.06 0L8 6.94l3.22-3.22a.75.75 0 111.06 1.06L9.06 8l3.22 3.22a.75.75 0 11-1.06 1.06L8 9.06l-3.22 3.22a.75.75 0 01-1.06-1.06L6.94 8 3.72 4.78a.75.75 0 010-1.06z"></path>
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                )
            }


        </div >
    )
}

export default crear
