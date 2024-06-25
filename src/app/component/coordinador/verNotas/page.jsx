"use client";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import dynamic from 'next/dynamic';
import { FiArrowLeft } from "react-icons/fi";

const ReactHTMLTableToExcel = dynamic(() => import('react-html-table-to-excel'), { ssr: false });

function Page() {
    const [equiposConNotas, setEquiposConNotas] = useState({});
    const [selectedEquipo, setSelectedEquipo] = useState(null);
    const [usuarios, setUsuarios] = useState({});
    const [entregas, setEntregas] = useState([]);
    const [ubicacionesEntrega, setUbicacionesEntrega] = useState({});

    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1;
    const semester = currentMonth >= 1 && currentMonth <= 6 ? 1 : 2;
    const fileName = `Notas PPI ${currentYear} - ${semester}`;

    useEffect(() => {
        const fetchUsuarios = async () => {
            try {
                const response = await axios.get('https://td-g-production.up.railway.app/usuario');
                const usuariosMap = {};
                response.data.forEach(usuario => {
                    usuariosMap[usuario.id] = usuario;
                });
                setUsuarios(usuariosMap);
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };

        const fetchEquipos = async () => {
            try {
                const response = await axios.get('https://td-g-production.up.railway.app/equipo-usuarios/GetAllGroups');
                const equiposAgrupados = response.data.reduce((acc, equipo) => {
                    if (!acc[equipo.Codigo_Equipo]) {
                        acc[equipo.Codigo_Equipo] = [];
                    }
                    acc[equipo.Codigo_Equipo].push(equipo);
                    return acc;
                }, {});
                setEquiposConNotas(equiposAgrupados);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        const fetchEntregas = async () => {
            try {
                const response = await axios.get('https://td-g-production.up.railway.app/tipo-entrega/GetAllEntregas');
                setEntregas(response.data);
            } catch (error) {
                console.error('Error fetching entregas:', error);
            }
        };

        const fetchUbicacionesEntrega = async () => {
            try {
                const response = await fetch("https://td-g-production.up.railway.app/entrega-equipo-ppi/GetPPIEntregaByID");
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                const entregasData = await response.json();

                console.log("Data: ", entregasData)

                const ubicaciones = {};
                entregasData.forEach(entrega => {
                    if (!ubicaciones[entrega.Codigo_Equipo]) {
                        ubicaciones[entrega.Codigo_Equipo] = {};
                    }
                    ubicaciones[entrega.Codigo_Equipo][entrega.Tipo_Entrega_ID] = entrega.Ubicacion_Entrega;
                });

                setUbicacionesEntrega(ubicaciones);
            } catch (error) {
                console.error("Fetch error: ", error);
            }
        };

        fetchUsuarios();
        fetchEquipos();
        fetchEntregas();
        fetchUbicacionesEntrega();
    }, []);


    const handleEquipoClick = (codigoEquipo) => {
        const equipoSeleccionado = equiposConNotas[codigoEquipo];
        setSelectedEquipo(equipoSeleccionado);
    };

    const capitalize = (str) => {
        const str2 = str.toLowerCase();
        return str2.replace(/\b\w/g, (char) => char.toUpperCase());
    };

    const fetchCalificaciones = async (idUsuario) => {
        try {
            const response = await axios.get(`https://backend.dbcpolijic2024.online/usuario-calificacion/${idUsuario}`);
            return response.data;
        } catch (error) {
            console.error(`Error fetching calificaciones for user ${idUsuario}:`, error);
            return [];
        }
    };

    useEffect(() => {
        const asignarCalificaciones = async () => {
            const calificacionesUsuarios = {};
            await Promise.all(
                Object.keys(usuarios).map(async (idUsuario) => {
                    const calificaciones = await fetchCalificaciones(idUsuario);
                    calificacionesUsuarios[idUsuario] = calificaciones;
                })
            );
            setEquiposConNotas((prevState) => {
                return Object.keys(prevState).reduce((acc, codigoEquipo) => {
                    acc[codigoEquipo] = prevState[codigoEquipo].map((integrante) => {
                        const calificacionesUsuario = calificacionesUsuarios[integrante.Usuario_ID] || [];
                        let definitiva = 0;
                        calificacionesUsuario.forEach((calificacion) => {
                            const entregaID = calificacion.entrega;
                            const porcentaje = entregas.find(entrega => entrega.id === entregaID)?.Porcentaje_Entrega || 0;
                            definitiva += (calificacion.calificacion) * (porcentaje / 100);
                            integrante[entregaID] = calificacion.calificacion;
                        });
                        const notaAsesorias = parseFloat(integrante.Nota_Asesoria_Definitiva_Individual) || 0;
                        const porcentajeAsesorias = entregas.find(entrega => entrega.id === 8)?.Porcentaje_Entrega || 0;
                        definitiva += (notaAsesorias) * (porcentajeAsesorias / 100);
                        integrante.Definitiva = definitiva.toFixed(2);
                        return integrante;
                    });
                    return acc;
                }, {});
            });
        };

        if (Object.keys(usuarios).length > 0) {
            asignarCalificaciones();
        }
    }, [usuarios, entregas]);

    return (
        <div className="ml-2 mr-6 mt-6 border bg-white border-b">
            <div className='pt-8 pb-8 w-full text-center'>
                <div className='pt-5 w-full border-b-2 flex items-center sm:items-start justify-center sm:justify-start sm:pl-8 sm:h-22 pb-5 text-center sm:text-left'>
                    <h1 className='text-4xl font-bold text-gray-600'>Tabla de Notas</h1>
                </div>
                <br />
                <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
                    <ReactHTMLTableToExcel
                        id="test-table-xls-button"
                        className="download-table-xls-button"
                        table="tabla-notas"
                        filename={fileName}
                        sheet={fileName}
                        buttonText="Exportar a Excel"
                    />
                </button>
                <div className='p-4'>
                    <div className="table-wrapper overflow-x-auto table-responsive">
                        <div className="table-scroll">
                            <table id="tabla-notas" className="min-w-full min-h-full bg-white shadow-md rounded">
                                <thead>
                                    <tr className="bg-gray-200">
                                        <th className="border border-gray-300 text-sm px-2 py-1">Equipo</th>
                                        <th className="border border-gray-300 text-sm px-2 py-1">Cédula</th>
                                        {entregas.map((entrega) => (
                                            <th key={entrega.id} className="border text-sm border-gray-300 px-2 py-1">
                                                {entrega.nombre} ({entrega.Porcentaje_Entrega}%)
                                            </th>
                                        ))}
                                        <th className="border text-sm border-gray-300 px-2 py-1">Definitiva (100%)</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {Object.entries(equiposConNotas).map(([codigoEquipo, integrantes]) => (
                                        <React.Fragment key={codigoEquipo}>
                                            {integrantes.map((integrante, idx) => {
                                                const usuario = usuarios[integrante.Usuario_ID];
                                                return (
                                                    <tr key={idx}>
                                                        {idx === 0 && (
                                                            <td
                                                                className="border border-gray-300 text-sm px-4 py-2 font-bold cursor-pointer text-decoration-line: underline"
                                                                rowSpan={integrantes.length}
                                                                onClick={() => handleEquipoClick(codigoEquipo)}
                                                            >
                                                                {codigoEquipo}
                                                            </td>
                                                        )}
                                                        <td className="border border-gray-300 text-sm px-4 py-2">{usuario?.documento}</td>

                                                        {entregas.map((entrega) => {
                                                            const ubicacion = ubicacionesEntrega[codigoEquipo]?.[entrega.id];
                                                            return (
                                                                <td key={entrega.id} className="border border-gray-300 text-sm px-4 py-2 text-decoration-line: underline">
                                                                    {entrega.id === 8 ? integrante.Nota_Asesoria_Definitiva_Individual : (
                                                                        <a href={ubicacion} target="_blank" rel="noopener noreferrer">
                                                                            {integrante[entrega.id]}
                                                                        </a>
                                                                    )}
                                                                </td>
                                                            );
                                                        })}
                                                        <td className={`border border-gray-300 font-bold text-sm px-4 py-2 ${integrante.Definitiva < 3 ? 'bg-red-100' : 'bg-green-100'}`}>
                                                            {integrante.Definitiva}
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </React.Fragment>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {selectedEquipo && (
                    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
                        <div className="bg-white p-6 rounded-md w-full max-w-3xl">
                            <h2 className="text-xl font-bold mb-4">Detalles del Equipo</h2>
                            <table className="min-w-full bg-white">
                                <thead>
                                    <tr>
                                        <th className="border px-4 py-2 bg-green-500">Cédula</th>
                                        <th className="border px-4 py-2  bg-green-500">Nombre</th>
                                        <th className="border px-4 py-2  bg-green-500">Correo</th>
                                        <th className="border px-4 py-2  bg-green-500">Grupo</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {selectedEquipo.map((integrante, idx) => (
                                        <tr key={idx}>
                                            <td className="border px-4 py-2">{usuarios[integrante.Usuario_ID]?.documento}</td>
                                            <td className="border px-4 py-2">{capitalize(usuarios[integrante.Usuario_ID]?.nombre)}</td>
                                            <td className="border px-4 py-2">{usuarios[integrante.Usuario_ID]?.correo}</td>
                                            <td className="border px-4 py-2">{integrante.Grupo_Codigo}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <button
                                className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                                onClick={() => setSelectedEquipo(null)}
                            >
                                <FiArrowLeft className="inline-block mr-2" />
                                Volver
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}


export default Page;
