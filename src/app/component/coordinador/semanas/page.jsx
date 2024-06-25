/* eslint-disable react-hooks/rules-of-hooks */
"use client"
import { format } from 'date-fns'
import React, { useState, useEffect } from 'react'

function page() {
    const [fechaInicio, setFechaInicio] = useState("-1")//'2024-02-04'
    const [fechaFin, setFechaFin] = useState("-1")//'2024-06-09'
    const [semanas, setSemanas] = useState([])
    const [semanasActual, setSemanasActual] = useState([])
    const [edicionHabilitada, setEdicionHabilitada] = useState([]);
    const [showAlert, setshowAlert] = useState(false);
    const [estadoCrear, setEstadoCrear] = useState(false);
    const [showCorrecto, setShowCorrecto] = useState(false);
    const [showError, setShowError] = useState(false);

    const handleCheckboxChange = (index) => {
        const newEdicionHabilitada = [...edicionHabilitada];
        newEdicionHabilitada[index] = !newEdicionHabilitada[index];
        setEdicionHabilitada(newEdicionHabilitada);
    };

    const calcularSemanas = () => {
        if (fechaInicio == "-1" && fechaFin == "-1") {
            return;
        }
        const fechaInicioParts = fechaInicio.split('-');
        const fechafinParts = fechaFin.split('-');
        const fechaAuxInicio = new Date(fechaInicioParts[0], fechaInicioParts[1] - 1, fechaInicioParts[2]);
        const fechaAuxFin = new Date(fechafinParts[0], fechafinParts[1] - 1, fechafinParts[2])

        if (fechaAuxInicio > fechaAuxFin) {
            setshowAlert(true);
            return;
        }
        const fechaLunesInicio = new Date(fechaInicioParts[0], fechaInicioParts[1] - 1, fechaInicioParts[2])
        const fechaLunesFin = new Date(fechafinParts[0], fechafinParts[1] - 1, fechafinParts[2])

        if (fechaAuxInicio.getDay() != 0) {
            fechaLunesInicio.setDate(fechaAuxInicio.getDate() - fechaAuxInicio.getDay())
        }
        if (fechaAuxFin.getDay() != 0) {
            fechaLunesFin.setDate(fechaAuxFin.getDate() - fechaAuxFin.getDay());
        }


        setSemanas(obtenerSemanas(fechaLunesInicio, fechaLunesFin))
        setEstadoCrear(true)
    }

    const obtenerSemanas = (fechaInicio, fechaFin) => {
        const semanasaux = [];
        let auxLunesInicio = new Date(fechaInicio);
        while (auxLunesInicio <= fechaFin) {
            const siguienteViernes = new Date(auxLunesInicio);
            siguienteViernes.setDate(auxLunesInicio.getDate() + 6);
            semanasaux.push([new Date(auxLunesInicio), siguienteViernes]);
            auxLunesInicio.setDate(auxLunesInicio.getDate() + 7);
        }
        return semanasaux;
    };

    const modificarSemana = (actual, value, index, item) => {

        const fecha = value.split('-');
        const fechaAux = new Date(fecha[0], fecha[1] - 1, fecha[2]);
        /*if (actual > fechaAux) {
            setshowAlert(true);
            return
        }*/
        if (fechaAux.getDay() != 0) {
            fechaAux.setDate(fechaAux.getDate() - fechaAux.getDay())
        }
        const fechaViernes = new Date(fecha[0], fecha[1] - 1, fecha[2])
        fechaViernes.setDate(fechaAux.getDate() + 6);
        const nuevaSemanas = semanas.map((semana, idx) => {
            if (idx === index) {
                return [fechaAux, fechaViernes];
            }
            return semana;
        });

        setSemanas(nuevaSemanas);
    };

    useEffect(() => {
        if (showAlert) {
            const timer = setTimeout(() => {
                setshowAlert(false);
            }, 2000);

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
        if (showError) {
            const timer = setTimeout(() => {
                setShowError(false);
            }, 2000);

            return () => clearTimeout(timer);
        }
    }, [showError]);
    //https://td-g-production.up.railway.app/semanas
    useEffect(() => {
        const traerSemanas = async () => {
            try {
                const response = await fetch('https://td-g-production.up.railway.app/semanas');
                const data = await response.json()
                setSemanasActual(data)
                console.log(data)
            } catch (error) {
                setSemanasActual([])
            }
        }
        traerSemanas();
    }, []);
    const crearSemana = async () => {
        let cont = 0;
        const requestOptions = {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
        };
        const response = await fetch('https://td-g-production.up.railway.app/semanas/eliminarTodo/', requestOptions);
        if (!response.ok)
            return
        for (let index = 0; index < semanas.length; index++) {
            const datos = {
                "numeroSemana": index + 1,
                "fechaInicio": semanas[index][0],
                "fechaFin": semanas[index][1]
            }
            console.log(datos)
            const requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(datos)
            };
            const response = await fetch('https://td-g-production.up.railway.app/semanas', requestOptions);
            if (response.ok) {
                cont++;
            }
        }
        if (cont == semanas.length) {
            setShowCorrecto(true)
            setTimeout(() => {
                window.location.reload();
            }, 2000);
        }

    }
    return (
        <div className="ml-6 mr-6 mt-6 border   bg-white border-b flex justify-between">
            <div className='pt-8  pb-8 w-full'>


                <div className='w-full border-b-2 flex flex-col sm:flex-row items-center sm:items-start justify-between sm:pl-8 sm:h-22 sm:pr-5 pb-5 text-center sm:text-left'>
                    <h1 className='text-4xl font-bold text-gray-600 mb-2 sm:mb-0'>Semanas</h1>
                </div>
                <div className='p-10'>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Semana</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Inicio</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Fin</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {semanasActual.map((item, index) => (
                                    <tr key={index} className="hover:bg-gray-100">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.numeroSemana}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{format(item.fechaInicio, "dd/MM/yy")}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{format(item.fechaFin, "dd/MM/yyy")}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className='mt-5 grid grid-cols-1 sm:grid-cols-2 gap-5'>
                        <div className=''>
                            <label htmlFor="fechaInicio" className="block text-lg font-medium text-gray-700">Semana Inicio</label>
                            <input
                                type="date"
                                id="fechaInicio"
                                onChange={(e) => { setFechaInicio(e.target.value) }}
                                className="mt-1 w-full rounded-md border-gray-200 shadow-sm sm:text-sm"
                            />
                        </div>
                        <div className=''>
                            <label htmlFor="fechaFin" className="block text-lg font-medium text-gray-700">Semana Final</label>
                            <input
                                type="date"
                                id="fechaFin"
                                onChange={(e) => { setFechaFin(e.target.value) }}
                                className="mt-1 w-full rounded-md border-gray-200 shadow-sm sm:text-sm"
                            />
                        </div>
                    </div>

                    <div className="sm:m-10 mt-5">
                        <button onClick={() => { calcularSemanas(); }} class="text-white xl:mt-4 h-14 py-2 px-4 w-full rounded bg-orange-400 hover:bg-orange-500 shadow hover:shadow-lg font-medium transition transform hover:-translate-y-0.5">Calcular</button>
                    </div>
                </div>
                <div >
                    {estadoCrear ? (
                        <><div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200" >
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Modificar</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Semana</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Inicio</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Fin</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {semanas.map((item, index) => (
                                        <tr key={index}>
                                            <td className="flex justify-center items-center">
                                                <label
                                                    htmlFor={`week-checkbox-${index}`}
                                                    className="relative h-8 w-14 cursor-pointer rounded-full bg-gray-300 transition [-webkit-tap-highlight-color:_transparent] has-[:checked]:bg-green-500 flex justify-center items-center"
                                                >
                                                    <input
                                                        type="checkbox"
                                                        checked={edicionHabilitada[index]}
                                                        onChange={() => handleCheckboxChange(index)}
                                                        id={`week-checkbox-${index}`}
                                                        className="peer sr-only" />
                                                    <span className="absolute inset-y-0 start-0 m-1 size-6 rounded-full bg-white transition-all peer-checked:start-6"></span>
                                                </label>
                                            </td>
                                            <td className='text-xl font-semibold text-gray-600 text-center'>{index + 1}</td>
                                            <td className='text-xl font-semibold text-gray-600 text-center'>
                                                <input
                                                    type="date"
                                                    id={index + " " + 0}
                                                    onChange={(e) => { modificarSemana(item[0], e.target.value, index, 0) }}
                                                    value={item[0].toLocaleDateString('en-CA')}
                                                    disabled={!edicionHabilitada[index]}
                                                    className="mt-1 w-full rounded-md border-gray-200 shadow-sm sm:text-sm" />
                                            </td>
                                            <td className='text-xl font-semibold text-gray-600 text-center'>
                                                <input
                                                    type="date"
                                                    onChange={(e) => { item[1] = e.target.value }}
                                                    value={item[1].toLocaleDateString('en-CA')}
                                                    disabled={true}
                                                    className="mt-1 w-full rounded-md border-gray-200 shadow-sm sm:text-sm" />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                            <div className="sm:m-10 mt-5">
                                <button onClick={() => { crearSemana() }} className="text-white xl:mt-4 h-14 py-2 px-4 w-full rounded bg-green-400 hover:bg-green-500 shadow hover:shadow-lg font-medium transition transform hover:-translate-y-0.5">Crear</button>
                            </div>
                        </>
                    ) : null}

                </div>
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
                            <div>Las fechas están incorrectas.</div>
                            <button onClick={() => { setshowAlert(!showAlert) }}>
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

            {showError && (
                <div className="fixed bottom-0 right-0 mb-8 mr-8">
                    <div className="flex w-96 shadow-lg rounded-lg">
                        <div className="bg-red-600 py-4 px-6 rounded-l-lg flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" className="fill-current text-white" width="20" height="20">
                                <path fillRule="evenodd" d="M4.47.22A.75.75 0 015 0h6a.75.75 0 01.53.22l4.25 4.25c.141.14.22.331.22.53v6a.75.75 0 01-.22.53l-4.25 4.25A.75.75 0 0111 16H5a.75.75 0 01-.53-.22L.22 11.53A.75.75 0 010 11V5a.75.75 0 01.22-.53L4.47.22zm.84 1.28L1.5 5.31v5.38l3.81 3.81h5.38l3.81-3.81V5.31L10.69 1.5H5.31zM8 4a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 018 4zm0 8a1 1 0 100-2 1 1 0 000 2z"></path>
                            </svg>
                        </div>
                        <div className="px-4 py-6 bg-white rounded-r-lg flex justify-between items-center w-full border border-l-transparent border-gray-200">
                            <div>Error al crear.</div>
                            <button onClick={() => { setShowError(!showError) }}>
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

export default page
