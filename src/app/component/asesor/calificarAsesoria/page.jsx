"use client";
import React, { useState, useEffect } from 'react';
import './page.css';
import CountdownTimer from '@/utils/timer'; 

function Page() {
    const [grupos, setGrupos] = useState([]);
    const [fechacalificacion, setFechacalificacion] = useState('');

    useEffect(() => {
        async function fetchGrupos() {
            try {
                const response = await fetch('https://td-g-production.up.railway.app/equipo-usuarios/GetAllGroups');
                if (response.ok) {
                    const data = await response.json();
                    setGrupos(data); 
                } else {
                    console.error('Error al obtener los datos de grupos');
                }
            } catch (error) {
                console.error('Error al obtener los datos de grupos:', error);
            }
        }

        async function fetchFechacalificacion() {
            try {
                const response = await fetch('https://td-g-production.up.railway.app/configuracion-entrega/AllEntregaSettings');
                if (response.ok) {
                    const data = await response.json();
                    const asesoriasConfig = data.find(config => config.id === 8);
                    if (asesoriasConfig && asesoriasConfig.fechacalificacion) {
                        setFechacalificacion(asesoriasConfig.fechacalificacion);
                    }
                } else {
                    console.error('Error al obtener los datos de configuración de entrega');
                }
            } catch (error) {
                console.error('Error al obtener los datos de configuración de entrega:', error);
            }
        }

        if (window.innerWidth <= 768) {
            alert("Para visualizar esta tabla de calificar asesorías en móvil, tendrás que desplazarte de manera horizontal dentro de la tabla. Te recomendamos visitar esta sección desde un computador para mayor comodidad.");
        }

        fetchGrupos();
        fetchFechacalificacion();
    }, []);

    const isPastDeadline = () => {
        const currentTime = new Date().toLocaleString('en-US', { timeZone: 'America/Bogota' });
        const deadline = new Date(fechacalificacion).toLocaleString('en-US', { timeZone: 'America/Bogota' });
        return new Date(currentTime) > new Date(deadline);
    };

    const handleSaveNotes = async () => {
        try {
            const notas = grupos.map(grupo => {
                const valorNota = document.getElementById(`nota_${grupo.Usuario_Nombre}`).value.replace(',', '.');
                const nota = valorNota === '' ? null : parseFloat(valorNota);
                return {
                    Usuario_ID: grupo.Usuario_ID,
                    Codigo_Equipo: grupo.Codigo_Equipo,
                    Nota_Asesoria_Definitiva_Individual: nota,
                };
            });
    
            // Validar que todas las notas sean null o estén entre 0 y 5
            for (const nota of notas) {
                if (nota.Nota_Asesoria_Definitiva_Individual !== '' && (isNaN(nota.Nota_Asesoria_Definitiva_Individual) || nota.Nota_Asesoria_Definitiva_Individual < 0 || nota.Nota_Asesoria_Definitiva_Individual > 5)) {
                    alert('Los valores de las notas son incorrectos. Deben estar entre 0 y 5.');
                    return; // Detener la ejecución si hay un valor incorrecto
                }
            }
    
            const response = await fetch('https://td-g-production.up.railway.app/equipo-usuarios/guardar-notas', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(notas)
            });
    
            if (response.ok) {
                const data = await response.json();
                console.log(data); // Maneja la respuesta según tus necesidades
                alert('Valores de notas actualizados correctamente.');
            } else {
                console.error('Error al guardar las notas:', response.status);
            }
        } catch (error) {
            console.error('Error al guardar las notas:', error);
        }
    };
    
    

    return (
        <div className="ml-6 mr-6 mt-6 border bg-white border-b">
            <div className='pt-4 pb-8 w-full text-center'>
                <div className='md:h-22 lg:h-22 xl:h-22 sm:h-22 border-b-2 pl-8 pb-5 flex justify-between items-center'>
                    <div>
                        <h1 className='text-2xl font-bold text-gray-600'>Calificación de asesorías</h1>
                    </div>
                </div>
                <div className='pr-5 pl-5'>
                    <div>
                        {/*<p>Esta es la ventana de Calificar Asesorías. Aquí podrás registrar la nota final de Asesorías para cada uno de los estudiantes.</p>
                        <p>Una vez hagas click en el botón de Guardar Notas, deberás esperar a que salga la alerta de confirmación de guardado.</p>*/}
                    </div>
                    <br />
                    {grupos.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-green-700">
                                    <tr>
                                        <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-100 uppercase tracking-wider">
                                            Estudiante
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-100 uppercase tracking-wider">
                                            Equipo - Grupo
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-100 uppercase tracking-wider">
                                            Plazo
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-100 uppercase tracking-wider">
                                            Calificación
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {grupos.map((grupo, index) => {
                                        const fechaFormateada = new Date(fechacalificacion).toLocaleString('es-CO', {
                                            timeZone: 'America/Bogota',
                                            day: '2-digit',
                                            month: '2-digit',
                                            year: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit',
                                            hour12: true
                                        });

                                        const plazoPasado = isPastDeadline();

                                        return (
                                            <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                                <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-500 text-center">
                                                    {grupo.Usuario_Nombre}
                                                </td>
                                                <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-500 text-center">
                                                    {grupo.Codigo_Equipo + ' - ' + grupo.Grupo_Codigo}
                                                </td>
                                                <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-500 text-center">
                                                    {fechaFormateada}<br></br>
                                                    {plazoPasado ? 'Plazo expirado' : <CountdownTimer deadline={fechacalificacion} ></CountdownTimer>}
                                                </td>
                                                <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-500 text-center">
                                                    <input
                                                        type="text"
                                                        className={`text-center border-gray-300  ${isPastDeadline() ? 'cursor-not-allowed' : ''}`}
                                                        size="4"
                                                        pattern="^(0(\.[0-9])?|1(\.0)?|2(\.0)?|3(\.0)?|4(\.0)?|5(\.0)?)$"
                                                        title="Debe ser un número entre 0 y 5, opcionalmente seguido de un decimal separado por punto."
                                                        defaultValue={grupo.Nota_Asesoria_Definitiva_Individual !== null ? grupo.Nota_Asesoria_Definitiva_Individual : ''}
                                                        disabled={isPastDeadline()}
                                                        id={`nota_${grupo.Usuario_Nombre}`}
                                                    />
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <p className="text-center mt-4 text-gray-500">No hay estudiantes en equipos, si consideras que es un error, comunícate de inmediato con el Coordinador del PPI.</p>
                    )}
                </div>
                <div className="text-center mt-4">
                    <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded" onClick={handleSaveNotes}>
                        Guardar Notas
                    </button>

                </div>
            </div>
        </div>
    );
}

export default Page;