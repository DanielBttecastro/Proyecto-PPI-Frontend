"use client"
/* eslint-disable react-hooks/rules-of-hooks */
import React, { useEffect, useState } from 'react'
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import Select from 'react-select';

function page({ params }) {

    const [asesor, setAsesor] = useState([])
    const [auxCitas, setAuxCitas] = useState([])
    const [estudiantes, setEstudiantes] = useState([])
    const [auxCitasSemanas, setAuxCitasSemanas] = useState([])
    const [auxCitas2, setAuxCitas2] = useState([])
    const [semana, setSemana] = useState([])
    const [semanaSelect, setSemanaSelect] = useState([])
    const [horas, setHoras] = useState([])
    const [citas, setCitas] = useState([])
    const [filtroRadio, setFiltroRario] = useState(false)
    const [currentPage, setCurrentPage] = useState(0);
    const [semanaSeleccionada, setSemanaSeleccionada] = useState([])
    const [semanaSeleccionadaAux, setSemanaSeleccionadaAux] = useState([])

    const capitalizeFirstLetter = (str) => {
        return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    }

    const filtrarInput = (valor) => {
        if (valor === "" || valor.length === 0) {
            if (filtroRadio) {
                setAuxCitas(auxCitasSemanas)
            }
            else {
                setAuxCitas(auxCitasSemanas);
            }
        } else {
            const resultadosFiltrados = auxCitas.filter(dato => {
                const buscarEnObjeto = (objeto, termino) => {
                    for (const clave in objeto) {
                        if (typeof objeto[clave] === "object") {
                            if (buscarEnObjeto(objeto[clave], termino)) {
                                return true;
                            }
                        } else if (typeof objeto[clave] === "string") {
                            if (objeto[clave].toLowerCase().includes(termino.toLowerCase())) {
                                return true;
                            }
                        }
                    }
                    return false;
                };
                return buscarEnObjeto(dato, valor.toLowerCase());
            });
            setAuxCitas(resultadosFiltrados);
        }
    }

    const filtrarInput2 = (valor) => {
        if (valor === "" || valor.length === 0) {
            setAuxCitas(auxCitasSemanas);
        } else {
            const resultadosFiltrados = auxCitas.filter(dato => {
                const buscarEnObjeto = (objeto, termino) => {
                    for (const clave in objeto) {
                        if (typeof objeto[clave] === "object") {
                            if (buscarEnObjeto(objeto[clave], termino)) {
                                return true;
                            }
                        } else if (typeof objeto[clave] === "string") {
                            if (objeto[clave].toLowerCase().includes(termino.toLowerCase())) {
                                return true;
                            }
                        }
                    }
                    return false;
                };
                return buscarEnObjeto(dato, valor.toLowerCase());
            });
            setAuxCitas(resultadosFiltrados);
        }
    }

    const filtroSemana = (valor) => {
        setFiltroRario(false)
        if (valor == 0) {
            setAuxCitas(citas)
            setAuxCitasSemanas(citas)
            setSemanaSeleccionada(null)
            return
        }
        const fecha = semana.filter(item => item.numeroSemana == valor)[0];
        setSemanaSeleccionada(fecha)
        const auxiliar = []
        const fechaInicio = new Date(fecha.fechaInicio)
        const fechaFin = new Date(fecha.fechaFin)
        for (const element of citas) {
            const fechaBuscar = new Date(element.fecha)
            if (fechaInicio < fechaBuscar && fechaFin > fechaBuscar) {
                auxiliar.push(element)
            }
        }
        setAuxCitas(auxiliar)
        setAuxCitasSemanas(auxiliar)
    }
    const goToPage = (page) => {
        if (page >= Math.ceil(auxCitasSemanas.length / 10))
            return

        if (page == -1)
            return
        setCurrentPage(page);
    };

    const filtroRadioOp = (valor) => {
        if (valor == 0) {
            setAuxCitas(auxCitasSemanas)
        } else if (valor == 1) {
            const auxiliar = []
            for (const element of auxCitasSemanas) {
                if (element.estadoCita.id != null && element.estadoCita.id == 1) {
                    auxiliar.push(element)
                }
            }
            setAuxCitas(auxiliar)
            setAuxCitas2(auxiliar)
        } else if (valor == 2) {
            const auxiliar = []
            for (const element of auxCitasSemanas) {
                if (element.estadoCita.id != null && element.estadoCita.id == 2) {
                    auxiliar.push(element)
                }
            } setAuxCitas(auxiliar)
            setAuxCitas2(auxiliar)
        } else if (valor == 3) {
            const auxiliar = []
            for (const element of auxCitasSemanas) {
                if (element.estadoCita.id != null && element.estadoCita.id == 3) {
                    auxiliar.push(element)
                }
            } setAuxCitas(auxiliar)
            setAuxCitas2(auxiliar)
        } else if (valor == 4 || valor == 5) {
            const auxiliar = []
            for (const element of auxCitasSemanas) {
                if (element.estadoCita.id != null && (element.estadoCita.id == 4 || element.estadoCita.id == 5)) {
                    auxiliar.push(element)
                }
            } setAuxCitas(auxiliar)
            setAuxCitas2(auxiliar)
        } else if (valor == 6) {
            const auxiliar = []
            for (const element of auxCitasSemanas) {
                if (element.estadoCita.id != null && (element.estadoCita.id == 6 || element.estadoCita.id == 7)) {
                    auxiliar.push(element)
                }
            } setAuxCitas(auxiliar)
            setAuxCitas2(auxiliar)
        }


    }

    useEffect(() => {
        const cargarAsesor = async () => {
            const response = await fetch('https://td-g-production.up.railway.app/usuario/' + params.id);
            const data = await response.json()
            if (response.ok) {
                setAsesor(data)
                setHoras(data.hora[0])
            }



            const response3 = await fetch('https://td-g-production.up.railway.app/semanas');
            const data3 = await response3.json()
            let fechaSelec = []
            for (let index = 0; index < data3.length; index++) {
                const element = data3[index];
                const fecha = new Date()
                const fechaInicio = new Date(element.fechaInicio)
                const fechaFin = new Date(element.fechaFin)
                if (fechaInicio < fecha && fechaFin > fecha) {
                    fechaSelec = element
                    setSemanaSeleccionada(element)
                    setSemanaSeleccionadaAux(element)
                }
            }
            const dataAux = []
            dataAux.push({ value: -1, label: "Todos " })
            data3.forEach(element => {
                dataAux.push({ value: element.numeroSemana, label: "Semana " + element.numeroSemana })
            });
            setSemanaSelect(dataAux)
            setSemana(data3)

            const response2 = await fetch('https://td-g-production.up.railway.app/citas-asesoria-ppi/asesor/' + params.id);
            const data2 = await response2.json()
            if (response2.ok) {
                data2.sort((a, b) => new Date(a.fecha) - new Date(b.fecha));
                const auxiliar = []
                const fechaInicio = new Date(fechaSelec.fechaInicio)
                const fechaFin = new Date(fechaSelec.fechaFin)
                for (const element of data2) {
                    const fechaBuscar = new Date(element.fecha)
                    if (fechaInicio < fechaBuscar && fechaFin > fechaBuscar) {
                        auxiliar.push(element)
                    }
                }
                for (let index = 0; index < data2.length; index++) {
                    const element = data2[index];
                    data2[index]["dia"] = format(element.fecha, 'EEEE dd', { locale: es })
                    for (let index2 = 0; index2 < data3.length; index2++) {
                        const item = data3[index2];
                        const fecha = new Date(element.fecha)
                        const fechaInicio = new Date(item.fechaInicio)
                        const fechaFin = new Date(item.fechaFin)
                        if (fechaInicio < fecha && fechaFin > fecha) {
                            data2[index]["semana"] = (item.numeroSemana)
                        }
                    }
                }


                ////88888
                console.log(data2)
                setCitas(data2)
                setAuxCitas(auxiliar)
                setAuxCitasSemanas(data2)
            }
        }
        const fetchData = async () => {
            const response2 = await fetch('https://td-g-production.up.railway.app/equipo-usuarios/Estudiantes');
            const data2 = await response2.json();
            if (response2.ok) {
                setEstudiantes(data2);
            }
        };
        fetchData();
        cargarAsesor()
    }, []);
    return (
        <div className="ml-6 mr-6 mt-6 border   bg-white border-b flex justify-between">
            <div className='pt-8  pb-8 w-full'>
                <div className='sm:px-8 border-b-2 pb-5'>
                    <div className='grid grid-cols-1 sm:grid-cols-3 sm:gap-4'>
                        <div className="flex flex-col text-center mb-4 sm:mb-0">
                            <h1 className='text-3xl font-bold text-gray-600'>Asesor:</h1>
                            <span className="text-2xl text-gray-500 font-semibold px-3 sm:px-0 sm:pt-1">
                                {asesor.nombre}
                            </span>
                        </div>
                        <div className="flex flex-col text-center mb-4 sm:mb-0">
                            <h1 className="text-3xl font-bold text-gray-600">Horas Semanales:</h1>
                            <span className="text-3xl text-gray-500 font-semibold pl-1 sm:pl-0 sm:pt-1">
                                {horas.horasAsignadas}
                            </span>
                        </div>
                        <div className="flex flex-col text-center">
                            <h1 className="text-3xl font-bold text-gray-600">Citas Semanales:</h1>
                            <span className="text-3xl text-gray-500 font-semibold pl-1 sm:pl-0 sm:pt-1">
                                {horas.horasAsignadas * 3}
                            </span>
                        </div>
                    </div>
                </div>


                <div className='p-10'>
                    <div className=''>
                        <div className="text-center">
                            {semanaSeleccionada != null ? (
                                <div>
                                    <span className="text-2xl font-bold text-gray-600 mb-2">Semana {semanaSeleccionada.numeroSemana}: </span>
                                    <span className="text-xl font-semibold text-gray-500 mb-2">Desde {new Date(semanaSeleccionada.fechaInicio).toLocaleDateString()} </span>
                                    <span className="text-xl font-semibold text-gray-500 mb-2">Hasta {new Date(semanaSeleccionada.fechaFin).toLocaleDateString()} </span>

                                </div>
                            ) : (
                                null
                            )}
                        </div>
                        <div className='flex flex-wrap gap-3 mt-5'>


                            <Select
                                className="basic-single w-52"
                                classNamePrefix="select"
                                isDisabled={false}
                                isLoading={false}
                                isClearable={true}
                                isRtl={false}
                                isSearchable={true}
                                name="Semana"
                                options={semanaSelect}
                                onChange={(option) => { if (option != null) filtroSemana(option.value); else filtroSemana(semanaSeleccionadaAux.numeroSemana) }}
                            />

                            {/*
                                semana.map((item) => (
                                    <div key={item.id} className='sm:pt-2'>
                                        {semanaSeleccionada && item.numeroSemana === semanaSeleccionada.numeroSemana ? (
                                            <input defaultChecked type="radio" id={`semana${item.numeroSemana}`} onChange={() => { filtroSemana(item.numeroSemana) }} name="filtroSemana" className=" peer hidden" />
                                        ) : (
                                            <input type="radio" id={`semana${item.numeroSemana}`} onChange={() => { filtroSemana(item.numeroSemana) }} name="filtroSemana" className=" peer hidden" />
                                        )}
                                        <label htmlFor={`semana${item.numeroSemana}`} className=" cursor-pointer rounded-lg text-sm border-2 border-violet-500 py-2 px-5 font-bold text-violet-500 transition-colors duration-200 ease-in-out peer-checked:bg-violet-500 peer-checked:text-white peer-checked:border-violet-500">Semana {item.numeroSemana}</label>
                                    </div>
                                ))
                            */}

                        </div>
                        <div className=" mt-5 flex items-center w-full">
                            <div onClick={() => { setFiltroRario(!filtroRadio); setAuxCitas(auxCitasSemanas) }} className={`cursor-pointer  flex justify-center items-center border-2 rounded-md  p-1.5 ${filtroRadio ? ('bg-red-400 border-red-400') : ('border-gray-300')}`}>
                                {filtroRadio ? (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="white" class="w-6 h-6">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
                                </svg>
                                ) : (<svg xmlns="http://www.w3.org/2000/svg" fill="none" width="24" height="24" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 0 1-.659 1.591l-5.432 5.432a2.25 2.25 0 0 0-.659 1.591v2.927a2.25 2.25 0 0 1-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 0 0-.659-1.591L3.659 7.409A2.25 2.25 0 0 1 3 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0 1 12 3Z" />
                                </svg>)}
                            </div>

                            <div className="relative flex items-center flex-grow ml-3">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" className="absolute left-0 top-1/2 transform -translate-y-1/2 ml-3" style={{ fill: 'rgb(75 85 99)' }}>
                                    <path d="M19.023 16.977a35.13 35.13 0 0 1-1.367-1.384c-.372-.378-.596-.653-.596-.653l-2.8-1.337A6.962 6.962 0 0 0 16 9c0-3.859-3.14-7-7-7S2 5.141 2 9s3.14 7 7 7c1.763 0 3.37-.66 4.603-1.739l1.337 2.8s.275.224.653.596c.387.363.896.854 1.384 1.367l1.358 1.392.604.646 2.121-2.121-.646-.604c-.379-.372-.885-.866-1.391-1.36zM9 14c-2.757 0-5-2.243-5-5s2.243-5 5-5 5 2.243 5 5-2.243 5-5 5z"></path>
                                </svg>
                                <input
                                    type="email"
                                    onChange={(e) => { if (filtroRadio) { filtrarInput2(e.target.value) } else { filtrarInput(e.target.value) } }}
                                    id="UserEmail"
                                    placeholder="Buscar"
                                    className="pl-10 pr-4 py-2 w-full border-2 rounded-md border-gray-300 shadow-sm sm:text-sm"
                                />
                            </div>
                        </div>
                        {
                            filtroRadio ? (<div className='flex flex-wrap gap-3 mt-2'>
                                <div className=' sm:py-4'>
                                    <input defaultChecked type="radio" onChange={() => { filtroRadioOp(0) }} id='TodosRadio' name="FiltroRadio" className=" peer hidden" />
                                    <label htmlFor='TodosRadio' className=" cursor-pointer rounded-lg border-2 text-sm border-gray-500 py-2 px-5 font-bold text-slate-950 transition-colors duration-200 ease-in-out peer-checked:bg-slate-950 peer-checked:text-white peer-checked:border-slate-950">Todos</label>
                                </div>

                                <div className=' sm:py-4'>
                                    <input type="radio" id='Disponible' onChange={() => { filtroRadioOp(1) }} name="FiltroRadio" className=" peer hidden" />
                                    <label htmlFor='Disponible' className=" cursor-pointer rounded-lg text-sm border-2 border-gray-500 py-2 px-5 font-bold text-gray-500 transition-colors duration-200 ease-in-out peer-checked:bg-gray-500 peer-checked:text-white peer-checked:border-gray-500">Disponible</label>
                                </div>
                                <div className=' sm:py-4'>
                                    <input type="radio" id='Reservado' name="FiltroRadio" onChange={() => { filtroRadioOp(2) }} className=" peer hidden" />
                                    <label htmlFor='Reservado' className=" cursor-pointer rounded-md text-sm border-2 border-emerald-500 py-2 px-5    font-bold text-emerald-500 transition-colors duration-200 ease-in-out peer-checked:bg-emerald-500 peer-checked:text-white peer-checked:border-emerald-500">Reservado</label>
                                </div>
                                <div className=' sm:py-4'>
                                    <input type="radio" id='Cumplida' name="FiltroRadio" onChange={() => { filtroRadioOp(3) }} className=" peer hidden" />
                                    <label htmlFor='Cumplida' className=" cursor-pointer rounded-md text-sm border-2 border-indigo-500 py-2 px-5    font-bold text-indigo-500 transition-colors duration-200 ease-in-out peer-checked:bg-indigo-500 peer-checked:text-white peer-checked:border-indigo-500">Cumplida</label>
                                </div>
                                <div className=' sm:py-4'>
                                    <input type="radio" id='Cancelada' name="FiltroRadio" onChange={() => { filtroRadioOp(4) }} className=" peer hidden" />
                                    <label htmlFor='Cancelada' className=" cursor-pointer rounded-md text-sm border-2 border-red-500 py-2 px-5    font-bold text-red-500 transition-colors duration-200 ease-in-out peer-checked:bg-red-500 peer-checked:text-white peer-checked:border-red-500">Cancelada</label>
                                </div>
                                <div className=' sm:py-4'>
                                    <input type="radio" id='Pendiente' name="FiltroRadio" onChange={() => { filtroRadioOp(6) }} className=" peer hidden" />
                                    <label htmlFor='Pendiente' className=" cursor-pointer rounded-md text-sm border-2 border-amber-500 py-2 px-5    font-bold text-amber-500 transition-colors duration-200 ease-in-out peer-checked:bg-amber-500 peer-checked:text-white peer-checked:border-amber-500">Pendiente</label>
                                </div>
                            </div>) : (null)
                        }

                        <div className="mt-5 w-full border-t border-gray-400">
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y-2 divide-gray-200 border-b-2 border-gray-400 bg-white text-sm">
                                    <thead className="ltr:text-left rtl:text-right">
                                        <tr>
                                            <th class="whitespace-nowrap px-4 py-2 font-bold text-gray-600">Semana</th>
                                            <th class="whitespace-nowrap px-4 py-2 font-bold text-gray-600">Fecha</th>
                                            <th class="whitespace-nowrap px-4 py-2 font-bold text-gray-600">Hora</th>
                                            <th class="whitespace-nowrap px-4 py-2 font-bold text-gray-600">Estudiantes</th>
                                            <th class="whitespace-nowrap px-4 py-2 font-bold text-gray-600">Estado</th>
                                            <th class="whitespace-nowrap px-4 py-2 font-bold text-gray-600">Bitácora</th>
                                            <th class="whitespace-nowrap px-4 py-2 font-bold text-gray-600">Visualizar</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {auxCitas.map((item, index) => {
                                            let equipo = [];
                                            //const equipo = estudiantes[item.equipocita]
                                            if (item.equipocita) {
                                                equipo = estudiantes[item.equipocita.codigoEquipo]
                                            }
                                            if (index >= currentPage * 10 && index < (currentPage + 1) * 10) {
                                                return (
                                                    <tr key={item.id}>
                                                        <td className="whitespace-nowrap px-4 py-2 font-semibold text-center text-gray-500">{item.semana}</td>
                                                        <td className="whitespace-nowrap px-4 py-2 font-semibold text-center text-gray-500"> {capitalizeFirstLetter(item.dia)}</td>
                                                        <td className="whitespace-normal text-center font-semibold px-4 py-2 text-gray-500">{item.hora.split(':')[0]}:{item.hora.split(':')[1]} </td>
                                                        <td className="whitespace-nowrap px-4 py-2 font-semibold text-gray-400 text-center">
                                                            {equipo.length != 0 ?
                                                                (equipo.map((item) => (
                                                                    <>{item.nombre}<br /></>
                                                                ))) : (<span className='font-semibold text-gray-400'>No resgistrado</span>)
                                                            }
                                                        </td>
                                                        <td className="whitespace-normal text-center font-semibold px-4 py-2 text-gray-500">
                                                            <span className={`py-2 px-8 rounded-xl text-white ${item.estadoCita.id === 1 ? 'bg-gray-500' : item.estadoCita.id === 2 ? 'bg-emerald-500' : item.estadoCita.id === 3 ? 'bg-indigo-500' : item.estadoCita.id === 6 || item.estadoCita.id === 7 ? 'bg-orange-500' : 'bg-red-500'}`}>{item.estadoCita.nombre}</span>
                                                        </td>
                                                        <td className="whitespace-nowrap px-4 py-2 font-semibold text-center text-gray-500">
                                                            {item.equipocita != null ? (
                                                                <a href={'/component/bitacora/visualizar/asesor/' + item.equipocita.id} className=' flex items-center justify-center'>
                                                                    <div className='p-3 rounded-full bg-gray-600'>
                                                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" class="w-6 h-6">
                                                                            <path fill-rule="evenodd" d="M5.625 1.5c-1.036 0-1.875.84-1.875 1.875v17.25c0 1.035.84 1.875 1.875 1.875h12.75c1.035 0 1.875-.84 1.875-1.875V12.75A3.75 3.75 0 0 0 16.5 9h-1.875a1.875 1.875 0 0 1-1.875-1.875V5.25A3.75 3.75 0 0 0 9 1.5H5.625ZM7.5 15a.75.75 0 0 1 .75-.75h7.5a.75.75 0 0 1 0 1.5h-7.5A.75.75 0 0 1 7.5 15Zm.75 2.25a.75.75 0 0 0 0 1.5H12a.75.75 0 0 0 0-1.5H8.25Z" clip-rule="evenodd" />
                                                                            <path d="M12.971 1.816A5.23 5.23 0 0 1 14.25 5.25v1.875c0 .207.168.375.375.375H16.5a5.23 5.23 0 0 1 3.434 1.279 9.768 9.768 0 0 0-6.963-6.963Z" />
                                                                        </svg>

                                                                    </div>
                                                                </a>
                                                            ) : (null)
                                                            }

                                                        </td>
                                                        <td className="whitespace-nowrap px-4 py-2 font-semibold text-center text-gray-400">

                                                            <a href={'/component/asesorias/visualizar/coordinador/' + item.id} className=' flex items-center justify-center'>
                                                                <div className='p-3 rounded-full bg-gray-600'>
                                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="white" class="w-6 h-6">
                                                                        <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                                                                        <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                                                    </svg>


                                                                </div>
                                                            </a>

                                                        </td>
                                                    </tr>
                                                )
                                            } else {
                                                return null;
                                            }
                                        })}



                                    </tbody>
                                </table>

                                <div class="inline-flex justify-center gap-1">
                                    <button
                                        onClick={() => goToPage(currentPage - 1)}
                                        class="inline-flex size-8 items-center justify-center rounded border border-gray-100 bg-white text-gray-900 rtl:rotate-180"
                                    >
                                        <span class="sr-only">Prev Page</span>
                                        <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                                            <path
                                                fill-rule="evenodd"
                                                d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                                                clip-rule="evenodd"
                                            />
                                        </svg>
                                    </button>

                                    <div>
                                        <label for="PaginationPage" class="sr-only">Page</label>

                                        <input
                                            type="number"
                                            class="h-8 w-12 rounded border border-gray-100 bg-white p-0 text-center text-xs font-medium text-gray-900 [-moz-appearance:_textfield] [&::-webkit-inner-spin-button]:m-0 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:m-0 [&::-webkit-outer-spin-button]:appearance-none"
                                            min="1"
                                            value={currentPage + 1}
                                            id="PaginationPage"
                                        />
                                    </div>

                                    <button
                                        onClick={() => goToPage(currentPage + 1)}
                                        class="inline-flex size-8 items-center justify-center rounded border border-gray-100 bg-white text-gray-900 rtl:rotate-180"
                                    >
                                        <span class="sr-only">Next Page</span>
                                        <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                                            <path
                                                fill-rule="evenodd"
                                                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                                                clip-rule="evenodd"
                                            />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div >
                </div>
            </div>
        </div >
    )
}

export default page
