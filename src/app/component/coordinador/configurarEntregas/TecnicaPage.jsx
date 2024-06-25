"use client";
import React, { useState, useEffect } from 'react';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { registerLocale } from "react-datepicker";
import es from 'date-fns/locale/es';
import { addHours } from 'date-fns';
import './Page.css';

registerLocale('es', es);

function TecnicaPage() {
    const [entregas, setEntregas] = useState([]);
    const [fechaEntrega, setFechaEntrega] = useState({});
    const [fechaCalificacion, setFechaCalificacion] = useState({});
    const [rolSeleccionado, setRolSeleccionado] = useState({});
    const [porcentajeIngresado, setPorcentajeIngresado] = useState({});
    const [popupVisible, setPopupVisible] = useState(false); // Estado para controlar la visibilidad del popup

    useEffect(() => {
        const fetchEntregasAndSettings = async () => {
            try {
                // Obtener todas las entregas
                const responseEntregas = await fetch('https://td-g-production.up.railway.app/tipo-entrega/GetAllEntregas');
                if (!responseEntregas.ok) {
                    throw new Error('Error al obtener las entregas');
                }
                const dataEntregas = await responseEntregas.json();
                setEntregas(dataEntregas);

                // Obtener las configuraciones de entrega
                const responseSettings = await fetch('https://td-g-production.up.railway.app/configuracion-entrega/AllEntregaSettings');
                if (!responseSettings.ok) {
                    throw new Error('Error al obtener las configuraciones de entrega');
                }
                const dataSettings = await responseSettings.json();

                // Mapear las configuraciones de entrega a las entregas correspondientes
                const updatedFechaEntrega = {};
                const updatedFechaCalificacion = {};
                const updatedPorcentajeIngresado = {};
                const updatedRolSeleccionado = {};
                dataEntregas.forEach(entrega => {
                    const setting = dataSettings.find(setting => setting.nombre === entrega.nombre);
                    if (setting) {
                        updatedFechaEntrega[entrega.id] = setting.fechaentrega ? new Date(setting.fechaentrega) : null;
                        updatedFechaCalificacion[entrega.id] = setting.fechacalificacion ? new Date(setting.fechacalificacion) : null;
                        updatedPorcentajeIngresado[entrega.id] = setting.porcentaje;
                        updatedRolSeleccionado[entrega.id] = setting.rol;
                    } else {
                        updatedFechaEntrega[entrega.id] = null;
                        updatedFechaCalificacion[entrega.id] = null;
                        updatedPorcentajeIngresado[entrega.id] = '';
                        updatedRolSeleccionado[entrega.id] = '';
                    }
                });

                setFechaEntrega(updatedFechaEntrega);
                setFechaCalificacion(updatedFechaCalificacion);
                setPorcentajeIngresado(updatedPorcentajeIngresado);
                setRolSeleccionado(updatedRolSeleccionado);
            } catch (error) {
                console.error(error);
            }
        };

        fetchEntregasAndSettings();
    }, []);

    const handlePorcentajeChange = (event, entregaId) => {
        const value = parseInt(event.target.value);
        if (value < 1 || value > 100 || isNaN(value)) {
            alert('El porcentaje de entrega debe ser un número entre 1 y 100.');
        } else {
            setPorcentajeIngresado(prevState => ({
                ...prevState,
                [entregaId]: value
            }));
        }
    };

    const handleFechaEntregaChange = (date, entregaId) => {
        setFechaEntrega(prevState => ({
            ...prevState,
            [entregaId]: date
        }));
    };

    const handleFechaCalificacionChange = (date, entregaId) => {
        // Verificar si hay una fecha de entrega asociada a esta entregaId
        if (fechaEntrega[entregaId]) {
            // Comprobar si la fecha y hora de calificación es mayor que la fecha y hora de entrega
            if (date > fechaEntrega[entregaId]) {
                // Si es válida, actualizar el estado
                setFechaCalificacion(prevState => ({
                    ...prevState,
                    [entregaId]: date
                }));
            } else {
                // Si no es válida, mostrar un mensaje de error o realizar alguna acción adecuada
                alert('La fecha y hora de calificación debe ser mayor que la fecha y hora de entrega.');
            }
        } else {
            // Si no hay fecha de entrega asociada, simplemente actualizar el estado
            setFechaCalificacion(prevState => ({
                ...prevState,
                [entregaId]: date
            }));
        }
    };

    const validarPorcentajes = () => {
        // Calcular la suma de todos los valores ingresados en el campo de porcentaje
        const sumaPorcentajes = entregas.reduce((total, entrega) => {
            const porcentaje = parseInt(porcentajeIngresado[entrega.id] || 0);
            return total + porcentaje;
        }, 0);

        // Verificar si la suma de los porcentajes es igual a 100
        if (sumaPorcentajes !== 100) {
            alert('Configuración fallida, la suma de todos los porcentajes debe ser 100.');
            return false; // No se permite guardar las entregas
        }

        return true; // Se permite guardar las entregas
    };

    const handleGuardarEntregas = async () => {
        try {
            // Validar los porcentajes antes de guardar las entregas
            if (!validarPorcentajes()) {
                return; // Salir si la validación falla
            }

            // Obtener solo los datos de las entregas para enviar al servidor
            const entregasData = entregas.map(entrega => ({
                id: entrega.id,
                nombre: entrega.nombre,
                rol: rolSeleccionado[entrega.id],
                porcentaje: porcentajeIngresado[entrega.id],
                fechaEntrega: fechaEntrega[entrega.id],
                fechaCalificacion: fechaCalificacion[entrega.id]
            }));

            // Realizar la solicitud POST al endpoint
            const response = await fetch('https://td-g-production.up.railway.app/configuracion-entrega/SetEntregaSettings', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(entregasData)
            });

            if (!response.ok) {
                throw new Error('Error al guardar las entregas');
            }

            // Si la solicitud fue exitosa, mostrar el popup y esperar 1300 milisegundos antes de refrescar la página
            setPopupVisible(true);
            setTimeout(() => {
                setPopupVisible(false);
                window.location.reload();
            }, 1300);
        } catch (error) {
            console.error(error);
            // En caso de error, mostrar un mensaje de error
            alert('Error al guardar las entregas');
        }
    };

    const fechaActualColombia = addHours(new Date(), -5);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 768) {
                alert('Para llenar la tabla por completo, tendrás que desplazarte de manera horizontal dentro de ella. Te recomendamos llenar esta información desde un computador para más facilidad.');
            }
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return (
        <div className="ml-6 mr-6 mt-6 border bg-white border-b flex justify-between">
            <div className='pt-1 pb-8 w-full'>
                <div className='md:h-22 lg:h-22 xl:h-22 sm:h-22 border-b-2 pl-2 pb-0 pr-52 flex justify-between items-center'>
                    <div>
                        <h1 className='text-2xl p-1 font-bold text-gray-600'>Configurar Entregas Técnica</h1>
                    </div>
                </div>
                <div className='p-2'>
                    <div className="mt-2">
                        <div className="table-container">
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th
                                            title='Estas son las entregas que tendrá el semestre.'
                                            style={{ cursor: 'pointer' }}
                                            onClick={(e) => e.preventDefault()}
                                        >
                                            Entrega
                                        </th>
                                        <th
                                            title='Usa este desplegable para definir quién va a calificar esta entrega. Puedes escoger entre Asesor, Docente y Coordinador.'
                                            style={{ cursor: 'pointer' }}
                                            onClick={(e) => e.preventDefault()}
                                        >
                                            Rol
                                        </th>
                                        <th
                                            title='Usa esta casilla para definir cuánto valdrá esta entrega en el semestre, el valor debe ir de 1 a 100 y la suma de todos los valores debe dar 100.'
                                            style={{ cursor: 'pointer' }}
                                            onClick={(e) => e.preventDefault()}
                                        >
                                            Porcentaje
                                        </th>
                                        <th
                                            title='Usa esta casilla para definir la fecha y hora máxima que tendrán los estudiantes para cargar el archivo que corresponde a esta entrega al sistema, una vez pasada esta fecha, la entrega no recibirá más archivos.'
                                            style={{ cursor: 'pointer' }}
                                            onClick={(e) => e.preventDefault()}
                                        >
                                            Fecha de Entrega
                                        </th>
                                        <th
                                            title='Usa esta casilla para definir la fecha y hora máxima que tendrán los docentes para cargar la calificación de esta entrega al sistema, una vez pasada esta fecha, la entrega no recibirá más calificaciones.'
                                            style={{ cursor: 'pointer' }}
                                            onClick={(e) => e.preventDefault()}
                                        >
                                            Fecha de Calificación
                                        </th>
                                    </tr>

                                </thead>
                                <tbody>
                                    {entregas.map(entrega => (
                                        <tr key={entrega.id}>
                                            <td className="pr-4">{entrega.nombre}</td>
                                            <td className="pr-4">
                                                <select
                                                    id={`rol-${entrega.id}`}
                                                    className="border border-gray-300 rounded-md py-1 px-2 focus:outline-none focus:border-blue-500 custom-select"
                                                    value={rolSeleccionado[entrega.id] || ''}
                                                    onChange={(event) => setRolSeleccionado(prevState => ({ ...prevState, [entrega.id]: event.target.value }))}
                                                >
                                                    <option value="" disabled>Seleccionar Rol</option>
                                                    <option value="3">Asesor</option>
                                                    <option value="2">Docente</option>
                                                    <option value="4">Coordinador</option>
                                                </select>
                                            </td>
                                            <td className="pr-4">
                                                <input
                                                    type="text"
                                                    className="border border-gray-300 rounded-md py-1 px-2 focus:outline-none focus:border-blue-500"
                                                    style={{ maxWidth: '50px' }}
                                                    pattern="[1-9][0-9]?|100"
                                                    value={porcentajeIngresado[entrega.id] || ''}
                                                    onChange={(event) => handlePorcentajeChange(event, entrega.id)}
                                                    inputMode="numeric"
                                                />
                                            </td>
                                            <td className="pr-4">
                                                {entrega.id !== 8 && (
                                                    <DatePicker
                                                        selected={fechaEntrega[entrega.id]}
                                                        onChange={date => handleFechaEntregaChange(date, entrega.id)}
                                                        showTimeSelect
                                                        timeIntervals={15}
                                                        timeFormat="HH:mm"
                                                        dateFormat="MMMM d, yyyy h:mm aa"
                                                        timeCaption="Hora"
                                                        placeholderText="Asignar Fecha y Hora"
                                                        locale="es"
                                                        minDate={fechaActualColombia}
                                                        className="border border-gray-300 rounded-md py-1 px-2 focus:outline-none focus:border-blue-500"
                                                    />
                                                )}
                                            </td>
                                            <td className="pr-4">
                                                <DatePicker
                                                    selected={fechaCalificacion[entrega.id]}
                                                    onChange={date => handleFechaCalificacionChange(date, entrega.id)}
                                                    showTimeSelect
                                                    timeIntervals={15}
                                                    timeFormat="HH:mm"
                                                    dateFormat="MMMM d, yyyy h:mm aa"
                                                    timeCaption="Hora"
                                                    placeholderText="Asignar Fecha y Hora"
                                                    locale="es"
                                                    minDate={fechaActualColombia}
                                                    className="border border-gray-300 rounded-md py-1 px-2 focus:outline-none focus:border-blue-500"
                                                />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="text-center mt-4">
                            <button onClick={handleGuardarEntregas} className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
                                Guardar Entregas
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            {/* Popup */}
            {popupVisible && (
                <div className="fixed z-10 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
                    <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>
                        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
                        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full" role="dialog" aria-modal="true" aria-labelledby="modal-headline">
                            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                <div className="sm:flex sm:items-start">
                                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                                        <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-headline">
                                            ¡Carga Exitosa!
                                        </h3>
                                        <div className="mt-2">
                                            <p className="text-sm text-gray-500">
                                                Las entregas han sido configuradas correctamente.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default TecnicaPage;
