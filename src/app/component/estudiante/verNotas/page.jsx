"use client";
import React, { useState, useEffect } from 'react';
import moment from 'moment';
import 'moment/locale/es';
import './Page.css';
import CryptoJS from 'crypto-js';

function Page() {
    const [equipoUsuarios, setEquipoUsuarios] = useState([]);
    const [bitacora, setBitacora] = useState([]);
    const [entregaSettings, setEntregaSettings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [notaAsesoriaDefinitiva, setNotaAsesoriaDefinitiva] = useState(null);
    const [calificacionesUsuario, setCalificacionesUsuario] = useState([]);

    useEffect(() => {
        moment.locale('es');
    }, []);

    useEffect(() => {
        const fetchEquipoUsuarios = async () => {
            try {
                const usuarioNest = localStorage.getItem('U2FsdGVkX1');
                const bytes = CryptoJS.AES.decrypt(usuarioNest, 'PPIITYTPIJC');
                const NestOriginal = JSON.parse(bytes.toString(CryptoJS.enc.Utf8))
                const response = await fetch('https://td-g-production.up.railway.app/equipo-usuarios/GetGroupById/' + NestOriginal.id);
                if (response.ok) {
                    const data = await response.json();
                    setEquipoUsuarios(data);
                    const notaAsesoriaDefinitiva = data.length > 0 ? data[0].Nota_Asesoria_Definitiva_Individual : null;
                    setNotaAsesoriaDefinitiva(notaAsesoriaDefinitiva);
                } else {
                    setEquipoUsuarios([]);
                }
                setLoading(false);
            } catch (error) {
                console.error('Error fetching equipo usuarios:', error);
                setLoading(false);
            }
        };

        fetchEquipoUsuarios();
    }, []);

    useEffect(() => {
        const fetchBitacora = async () => {
            if (equipoUsuarios.length > 0) {
                try {
                    const codigoEquipo = equipoUsuarios[0].Codigo_Equipo;
                    const response = await fetch(`https://td-g-production.up.railway.app/equipo-ppi/GetBitacoraByCode/${codigoEquipo}`);
                    if (response.ok) {
                        const data = await response.json();
                        if (data.length > 0) {
                            const bitacoraPpiId = data[0].Bitacora_PPI_ID;
                            setBitacora(data);
                        } else {
                            setBitacora([]);
                        }
                    } else {
                        setBitacora([]);
                    }
                } catch (error) {
                    console.error('Error fetching bitacora:', error);
                }
            }
        };

        fetchBitacora();
    }, [equipoUsuarios]);

    useEffect(() => {
        const fetchEntregaSettings = async () => {
            try {
                const response = await fetch('https://td-g-production.up.railway.app/configuracion-entrega/AllEntregaSettings');
                if (response.ok) {
                    const data = await response.json();
                    const newData = data.map((item, index) => ({ ...item, configuracionEntregaId: item.Configuracion_Entrega_ID }));
                    setEntregaSettings(newData);
                } else {
                    setEntregaSettings([]);
                }
            } catch (error) {
                console.error('Error fetching entrega settings:', error);
            }
        };

        fetchEntregaSettings();
    }, []);

    useEffect(() => {
        const fetchCalificacionesUsuario = async () => {
            try {
                const usuarioNest = localStorage.getItem('U2FsdGVkX1');
                const bytes = CryptoJS.AES.decrypt(usuarioNest, 'PPIITYTPIJC');
                const NestOriginal = JSON.parse(bytes.toString(CryptoJS.enc.Utf8))
                const response = await fetch('https://backend.dbcpolijic2024.online/usuario-calificacion/' + NestOriginal.id);
                if (response.ok) {
                    const data = await response.json();
                    setCalificacionesUsuario(data);
                } else {
                    setCalificacionesUsuario([]);
                }
            } catch (error) {
                console.error('Error fetching user ratings:', error);
            }
        };

        fetchCalificacionesUsuario();
    }, []);

    const isEntregado = (nombreEntrega) => {
        return nombreEntrega !== "Asesorías" && calificacionesUsuario.some(calificacion => calificacion.entrega === entregaSettings.find(setting => setting.nombre === nombreEntrega).id);
    };

    const calificacionesDisponibles = entregaSettings.map(setting => {
        if (setting.nombre === "Asesorías") {
            return notaAsesoriaDefinitiva;
        } else {
            const calificacion = calificacionesUsuario.find(calificacion => calificacion.entrega === setting.id)?.calificacion;
            return calificacion !== undefined && !isNaN(calificacion) ? parseFloat(calificacion) : 0;
        }
    });

    const sumaMultiplicaciones = calificacionesDisponibles.reduce((accumulator, calificacion, index) => {
        const porcentajeDecimal = entregaSettings[index].porcentaje / 100;
        accumulator += calificacion * porcentajeDecimal;
        return accumulator;
    }, 0);

    const notaDefinitivaPPI = isNaN(sumaMultiplicaciones) ? '-' : sumaMultiplicaciones.toFixed(2);


    const getIconoCalificacion = (calificacion) => {
        if (calificacion && calificacion !== '-') {
            return calificacion < 3 ?
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="#d0021b" fill="none">
                    <path d="M19.0005 4.99988L5.00045 18.9999M5.00045 4.99988L19.0005 18.9999" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg> :
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="#7ed321" fill="none">
                    <path d="M5 14L8.5 17.5L19 6.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>;
        } else {
            return null;
        }
    };

    const getCalificacion = (nombreEntrega) => {
        if (nombreEntrega === "Asesorías") {
            return notaAsesoriaDefinitiva !== null ? notaAsesoriaDefinitiva : '-';
        } else {
            const setting = entregaSettings.find(setting => setting.nombre === nombreEntrega);
            const calificacion = calificacionesUsuario.find(calificacion => calificacion.entrega === setting.id)?.calificacion;
            return calificacion !== undefined ? calificacion : '-';
        }
    };

    const codigoEquipo = equipoUsuarios.length > 0 ? equipoUsuarios[0].Codigo_Equipo : 'N/A';
    const aliasProyecto = bitacora.length > 0 ? bitacora[0].Alias_Proyecto : 'N/A';


    return (
        <div className="ml-6 mr-6 mt-6 border bg-white border-b flex justify-between">
            <div className='pt-8 pb-8 w-full text-center'>
                <div className='md:h-22 lg:h-22 xl:h-22 sm:h-22 border-b-2 pl-5 pb-5 pr-5 flex justify-between items-center'>
                    <div>
                        <h1 className='text-2xl font-bold text-gray-600'>
                            Notas: Equipo {codigoEquipo} - {aliasProyecto}
                        </h1>
                    </div>
                </div>
                <div className='p-2'>
                    {loading ? (
                        <p>Cargando...</p>
                    ) : (
                        <div>
                            {equipoUsuarios.length === 0 ? (
                                <p>Ups! No tienes un equipo asociado para este semestre, si consideras que es un error, comunícate de inmediato con el Coordinador del PPI.</p>
                            ) : (
                                <div>
                                    {bitacora.length === 0 ? (
                                        <p>No tienes bitácora todavía.</p>
                                    ) : (
                                        <div>
                                        </div>
                                    )}
                                </div>
                            )}
                            <div>
                                {entregaSettings.length === 0 ? (
                                    <p>El coordinador no ha configurado las entregas, intenta después.</p>
                                ) : (
                                    <div>
                                        <table>
                                            <thead>
                                                <tr>
                                                    <th>Nombre</th>
                                                    <th>Porcentaje</th>
                                                    <th className="calificacion-header">Calificación</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {entregaSettings.map(setting => (
                                                    <tr key={setting.id}>
                                                        <td>{setting.nombre}</td>
                                                        <td>{setting.porcentaje}%</td>
                                                        <td className="calificacion-container">
                                                            {getIconoCalificacion(getCalificacion(setting.nombre))}
                                                            {' '}
                                                            <span>
                                                                {getCalificacion(setting.nombre)}
                                                            </span>
                                                        </td>
                                                    </tr>
                                                ))}

                                                <tr>
                                                    <td><b>Nota Definitiva PPI</b></td>
                                                    <td><b>100%</b></td>
                                                    <td className="nota-container">
                                                        {getIconoCalificacion(sumaMultiplicaciones)}
                                                        {' '}
                                                        <span>
                                                            <b>{sumaMultiplicaciones.toFixed(2)}</b>
                                                        </span>
                                                    </td>
                                                </tr>
                                            </tbody>

                                        </table>
                                    </div>
                                )}
                            </div>

                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Page;