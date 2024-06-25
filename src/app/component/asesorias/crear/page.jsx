/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/rules-of-hooks */
"use client"
import React, { useEffect, useState } from 'react';
import Crear from '@/component/asesorias/crear/crear';
import CryptoJS from 'crypto-js';
import { format } from 'date-fns';

function page() {
    const [fechaPruebas, setFechaPruebas] = useState(new Date());
    const dia = fechaPruebas.getDate()
    const monthIndex = fechaPruebas.getMonth();
    const options = { month: 'long' };
    const monthName = new Date(2000, monthIndex).toLocaleString('es-ES', options);
    const [horasPendientes, setHorasPendientes] = useState('');
    const [citasPendiente, setCitasPendientes] = useState([]);
    const [citasActuales, setCitasActuales] = useState([]);
    const [semanaSeleccionada, setSemanaSeleccionada] = useState([])


    const validarHoras = async () => {
        try {
            const usuarioNest = localStorage.getItem('U2FsdGVkX1');
            const bytes = CryptoJS.AES.decrypt(usuarioNest, 'PPIITYTPIJC');
            const usuarioN = JSON.parse(bytes.toString(CryptoJS.enc.Utf8))
            const fecha = fechaPruebas;
            let diaSemanas = fecha.getDay();
            const numeroDia = fecha.getDate();
            if (fecha.getHours() >= 18) diaSemanas = diaSemanas + 1;
            const diaLunes = numeroDia - fecha.getDay() + 1;
            const response = await fetch('https://td-g-production.up.railway.app/hora-semanal/profesor/' + usuarioN.id);
            const data = await response.json();
            if (response.ok) {
                const horasAsignadas = data[0].horasAsignadas;
                const CantidadAsesorias = horasAsignadas * 3;
                const fechaActual = fechaPruebas;
                const fechaLunes = new Date(fechaActual);
                fechaLunes.setDate(diaLunes);
                const fechaSabado = new Date(fechaActual);
                fechaSabado.setDate(fechaActual.getDate() - (fechaActual.getDay() - 7));
                const fechaInicio = format(fechaLunes, "yyyy-MM-dd")
                const fechaFin = format(fechaSabado, "yyyy-MM-dd")
                const response2 = await fetch(`https://td-g-production.up.railway.app/citas-asesoria-ppi/${fechaInicio}/${fechaFin}/` + usuarioN.id);
                const data2 = await response2.json();
                if (response2.ok) {
                    const registrosFiltrados = data2.filter(registro => registro.estadoCita.id === 2 || registro.estadoCita.id === 3 || registro.estadoCita.id === 1);
                    const asesoriasActual = registrosFiltrados.length;
                    if (asesoriasActual < CantidadAsesorias) {
                        let citasActual = 0;
                        setCitasActuales([])
                        setCitasPendientes([])
                        data2.forEach(item => {
                            if (item.estadoCita.id !== 6 && item.estadoCita.id !== 5) {
                                setCitasActuales(prev => [...prev, item]);
                                citasActual = citasActual + 1
                            } else {
                                if (item.estadoCita.id == 6)
                                    setCitasPendientes(prev => [...prev, item]);
                            }
                        });
                        return CantidadAsesorias - citasActual;
                    }
                }
            }
            return false;

        } catch (error) {
            return false;
        }
    };
    useEffect(() => {
        const obtenerHorasPendientes = async () => {
            try {
                const resultadoValidacion = await validarHoras();
                setHorasPendientes(resultadoValidacion);
            } catch (error) {
                console.error("Error al obtener las horas pendientes:", error);
            }
        };
        const cargarsemana = async () => {
            try {
                const response = await fetch(`https://td-g-production.up.railway.app/semanas`);
                const data = await response.json();
                if (response.ok) {
                    let fechaSelec = []
                    for (let index = 0; index < data.length; index++) {
                        const element = data[index];
                        const fecha = fechaPruebas
                        const fechaInicio = new Date(element.fechaInicio)
                        const fechaFin = new Date(element.fechaFin)
                        if (fechaInicio <= fecha && fechaFin >= fecha) {
                            fechaSelec = element
                            setSemanaSeleccionada(element)
                        }
                    }
                }

            } catch (error) {
                setSemanaSeleccionada()
            }
        }

        obtenerHorasPendientes();
        cargarsemana()
    }, []);
    return (
        <div className="ml-6 mr-6 mt-6 border   bg-white border-b flex justify-between">
            <div className='pt-8  pb-8 w-full'>
                <div className='  h-22 pb-2 flex-col  border-b-2 flex justify-between items-center'>
                    <div className='text-center'>
                        <h1 className='ml-5 text-4xl font-bold text-gray-600'>Crear citas de asesorías</h1>
                    </div>
                    <div className='text-gray-600 text-center h-14 sm:h-10 '>
                        {!horasPendientes ? (
                            <div className="text-xl sm:mt-2">
                                <span className='font-semibold'>Semana {semanaSeleccionada.numeroSemana}, {monthName.charAt(0).toUpperCase() + monthName.slice(1)} {dia}</span>, Citas pendientes <span className='bg-green-500 rounded-xl text-white py-1 px-2'>0</span>
                            </div>
                        ) : (
                            <div className="text-xl sm:mt-2 "> {/* Añadida clase sm:mt-2 para separación en pantallas pequeñas */}
                                <span className='font-semibold'>Semana {semanaSeleccionada.numeroSemana}, {monthName.charAt(0).toUpperCase() + monthName.slice(1)} {dia}</span> Citas pendientes <span className='bg-indigo-500 rounded-xl text-white py-1 px-2'>{horasPendientes}</span>
                                {citasPendiente.length != 0 ? (<>Citas que se deben <span className='bg-amber-500 rounded-xl text-white py-1 px-2'>{citasPendiente.length}</span></>) : (null)}
                            </div>
                        )}
                    </div>
                </div>

                <div className='p-10'>
                   <Crear citaPendientes={horasPendientes} />
                </div>
            </div>
        </div >
    )
}

export default page
