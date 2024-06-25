"use client";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import dynamic from 'next/dynamic';
import { FiArrowLeft } from "react-icons/fi";

function Page() {
    const [selectedEquipo, setSelectedEquipo] = useState(null);
    const [entregas, setEntregas] = useState([]);
    const [ubicacionesEntrega, setUbicacionesEntrega] = useState({});
    const [equiposConNotas, setEquiposConNotas] = useState([]); // Estado para almacenar los equipos y sus notas
    const [usuarios, setUsuarios] = useState({}); // Estado para almacenar los usuarios
    const [notas, setNotas] = useState([]);


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
                const response = await axios.get('https://td-g-production.up.railway.app/configuracion-entrega/AllEntregaSettings');
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

    /*Equipos:
    console.log("EQUIPOS: ", equiposConNotas);
    //Usuarios:
    console.log("USUARIOS: ", usuarios);
    //Entregas:
    console.log("ENTREGAS: ", entregas);
    //UbicacionesEntrega:
    console.log("UBICACIONES ENTREGAS: ", ubicacionesEntrega);
    */

    const handleEquipoClick = (codigoEquipo) => {
        const equipoSeleccionado = equiposConNotas[codigoEquipo];
        setSelectedEquipo(equipoSeleccionado);
    };

    const capitalize = (str) => {
        const str2 = str.toLowerCase();
        return str2.replace(/\b\w/g, (char) => char.toUpperCase());
    };

    /*actualizar-calificaciones https://td-g-production.up.railway.app/usuario-calificacion/actualizar-calificaciones
    [
        {
          "user": numero,
          "entrega": numero,
          "calificacion": numero
        },
        {
          "user": numero,
          "entrega": numero,
          "calificacion": numero
        }
       ]
    */
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

    const handleGuardarNotas = () => {
        // Validar que todas las notas estén entre 0 y 5
        const notasValidas = notas.every(nota => nota.calificacion >= 0 && nota.calificacion <= 5);

        if (!notasValidas) {
            alert("¡Todos los números deben estar entre 0 y 5!");
            return;
        }

        // Crear el arreglo de objetos para enviar al endpoint
        const notasParaEnviar = notas.map(nota => ({
            user: nota.user,
            entrega: nota.entrega,
            calificacion: parseFloat(nota.calificacion?.replace(',', '.'))
        }));

        //Llamar al endpoint POST para guardar las calificaciones
        fetch('https://td-g-production.up.railway.app/usuario-calificacion/actualizar-calificaciones', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(notasParaEnviar)
        })
            .then(response => {
                if (response.ok) {
                    alert("¡Las notas se guardaron correctamente!");
                    window.location.reload(); // Recargar la página
                } else {
                    throw new Error("Error al guardar las notas");
                }
            })
            .catch(error => {
                console.error("Error:", error);
                alert("Hubo un error al intentar guardar las notas.");
            });
    };

    const handleInputChange = (userId, entregaId, calificacion) => {
        const notaIndex = notas.findIndex(nota => nota.user === userId && nota.entrega === entregaId);
        if (notaIndex !== -1) {
            const nuevasNotas = [...notas];
            nuevasNotas[notaIndex].calificacion = calificacion;
            setNotas(nuevasNotas);
        } else {
            setNotas([...notas, { user: userId, entrega: entregaId, calificacion }]);
        }
    };

    return (
        <div className="ml-2 mr-6 mt-6 border bg-white border-b">
            <div className='pt-3 pb-3 w-full text-center'>
                <div className='pt-3 w-full border-b-2 flex items-center sm:items-start justify-center sm:justify-start sm:pl-8 sm:h-22 pb-5 text-center sm:text-left'>
                    <h1 className='text-4xl font-bold text-gray-600'>Calificación de entregas PPI</h1>
                </div>
                <div className="flex items-center m-4">
                    Para conocer la fecha de calificación de las entregas de PPI, coloque su cursor sobre el titulo de cada entrega.<br />
                </div>

                <div className='p-4'>
                    <div className="table-wrapper overflow-x-auto table-responsive">
                        <div className="table-scroll">
                            <table id="tabla-notas" className="min-w-full min-h-full bg-white shadow-md rounded">
                                <thead>
                                    <tr className="bg-gray-200">
                                        <th className="border border-gray-300 text-sm px-2 py-1">Equipo</th>
                                        <th className="border border-gray-300 text-sm px-2 py-1">Cédula</th>
                                        {entregas.map((entrega) => {
                                            const fechaCalificacion = new Date(entrega.fechacalificacion);
                                            {/*const currentDate = new Date();
                                            const isPast = fechaCalificacion < currentDate;

                                            const textStyle = {
                                                color: isPast ? 'red' : 'green'
                                            };*/}

                                            return (
                                                <th
                                                    key={entrega.id}
                                                    className="border text-sm border-gray-300 px-2 py-1"
                                                    title={fechaCalificacion.toLocaleString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' })}
                                                //style={textStyle}
                                                >
                                                    {entrega.nombre} ({entrega.porcentaje}%)
                                                </th>
                                            );
                                        })}
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
                                                            /*const isPastFechaCalificacion = new Date(entrega.fechacalificacion) < new Date();
                                                            const fechaCalificacion = new Date(entrega.fechacalificacion).toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
                                                            const message = "La fecha de calificación de esta entrega ya pasó, fue el: " + fechaCalificacion;*/

                                                            return (
                                                                <td key={entrega.id} className="border border-gray-300 text-sm px-4 py-2 text-decoration-line: underline">
                                                                    <div className="flex items-center">
                                                                        {ubicacion && ubicacion !== "" && entrega.id !== 8 && (
                                                                            <a href={ubicacion} target="_blank" rel="noopener noreferrer">
                                                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" color="#000000" fill="none">
                                                                                    <path d="M20.4593 17.5153C20.8198 17.9308 21 18.1385 21 18.5C21 18.8615 20.8198 19.0692 20.4593 19.4847C19.5612 20.5199 17.9381 22 16 22C14.0619 22 12.4388 20.5199 11.5407 19.4847C11.1802 19.0692 11 18.8615 11 18.5C11 18.1385 11.1802 17.9308 11.5407 17.5153C12.4388 16.4801 14.0619 15 16 15C17.9381 15 19.5612 16.4801 20.4593 17.5153Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
                                                                                    <path d="M20 13.0032V7.81989C20 6.12616 20 5.27928 19.732 4.60291C19.3012 3.51554 18.3902 2.65784 17.2352 2.25228C16.5168 2 15.6173 2 13.8182 2C10.6698 2 9.09563 2 7.83836 2.44148C5.81714 3.15122 4.22281 4.6522 3.46894 6.55509C3 7.73875 3 9.22077 3 12.1848V14.731C3 17.8013 3 19.3364 3.8477 20.4025C4.09058 20.708 4.37862 20.9792 4.70307 21.2078C5.61506 21.8506 6.85019 21.9757 9 22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                                                    <path d="M3 12C3 10.1591 4.49238 8.66667 6.33333 8.66667C6.99912 8.66667 7.78404 8.78333 8.43137 8.60988C9.00652 8.45576 9.45576 8.00652 9.60988 7.43136C9.78333 6.78404 9.66667 5.99912 9.66667 5.33333C9.66667 3.49238 11.1591 2 13 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                                                    <path d="M15.9922 18.5H16.0012" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                                                </svg>
                                                                            </a>
                                                                        )}
                                                                        <input
                                                                            type="number"
                                                                            defaultValue={integrante[entrega.id]}
                                                                            className="ml-2 border border-gray-300 px-2 py-1 rounded"
                                                                            style={{ width: "7ch", "-moz-appearance": "textfield", "appearance": "textfield", textAlign: "center" }}
                                                                            onChange={(e) => handleInputChange(integrante.Usuario_ID, entrega.id, e.target.value)}
                                                                        // disabled={isPastFechaCalificacion} // Deshabilitar el input si la fecha de calificación ya pasó
                                                                        //title={isPastFechaCalificacion ? message : null} // Mostrar mensaje si la fecha ya pasó
                                                                        />
                                                                    </div>
                                                                </td>
                                                            );
                                                        })}
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

                {/*Detalles del equipo*/}
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
                {/*Detalles del equipo*/}

            </div>

            <div className='flex justify-center'>

                <button
                    className=" bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4"
                    onClick={handleGuardarNotas}
                >
                    Guardar notas
                </button>
            </div>

        </div>
    );
}


export default Page;
