"use client";
import React, { useState, useEffect } from 'react';
import moment from 'moment';
import axios from 'axios';
import 'moment/locale/es';
import './Page.css';
import { uploadFileToS3, createFolderInS3 } from '@/utils/awsS3';
import CryptoJS from 'crypto-js';

function Page() {
    const [equipoUsuarios, setEquipoUsuarios] = useState([]);
    const [bitacora, setBitacora] = useState([]);
    const [entregaSettings, setEntregaSettings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedFiles, setSelectedFiles] = useState({});
    const [entregaByID, setEntregaByID] = useState([]);
    const [showLoadingModal, setShowLoadingModal] = useState(false);
    const [isMobile, setIsMobile] = useState(false); // Variable para determinar si es móvil

    useEffect(() => {
        // Función para verificar si el ancho de la ventana indica un dispositivo móvil
        const checkIsMobile = () => {
            setIsMobile(window.innerWidth <= 768); // Establece isMobile como verdadero si el ancho de la ventana es menor o igual a 768 (valor para dispositivos móviles)
        };

        // Verificar inicialmente si es móvil
        checkIsMobile();

        // Agregar un event listener para cambiar la variable isMobile cuando el tamaño de la ventana cambie
        window.addEventListener('resize', checkIsMobile);

        // Retirar el event listener cuando el componente se desmonte para evitar memory leaks
        return () => window.removeEventListener('resize', checkIsMobile);
    }, []);

    const openLoadingModal = () => {
        setShowLoadingModal(true);
    };

    const closeLoadingModal = () => {
        setShowLoadingModal(false);
    };

    useEffect(() => {
        moment.locale('es');
    }, []);

    useEffect(() => {
        const fetchEquipoUsuarios = async () => {

            const usuarioNest = localStorage.getItem('U2FsdGVkX1');
            const bytes = CryptoJS.AES.decrypt(usuarioNest, 'PPIITYTPIJC');
            const NestOriginal = JSON.parse(bytes.toString(CryptoJS.enc.Utf8))
            try {
                const response = await fetch('https://td-g-production.up.railway.app/equipo-usuarios/GetGroupById/' + NestOriginal.id);
                if (response.ok) {
                    const data = await response.json();
                    setEquipoUsuarios(data);
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
        if (equipoUsuarios.length > 0) {
            const fetchBitacora = async () => {
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
            };

            fetchBitacora();
        }
    }, [equipoUsuarios]);

    useEffect(() => {
        const fetchEntregaSettings = async () => {
            try {
                const response = await fetch('https://td-g-production.up.railway.app/configuracion-entrega/AllEntregaSettings');
                if (response.ok) {
                    const data = await response.json();
                    const newData = data.map((item, index) => ({ ...item, configuracionEntregaId: item.Configuracion_Entrega_ID }));
                    // Excluir los tipos de entrega con ID 8 y 9
                    const filteredData = newData.filter(item => item.id !== 8 && item.id !== 9);

                    setEntregaSettings(filteredData);
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
        const fetchEntregaByID = async () => {
            try {
                const codigoEquipo = equipoUsuarios[0].Codigo_Equipo;
                const response = await fetch(`https://td-g-production.up.railway.app/entrega-equipo-ppi/GetPPIEntregaByID/${codigoEquipo}`);
                if (response.ok) {
                    const data = await response.json();
                    setEntregaByID(data);
                } else {
                    setEntregaByID([]);
                }
            } catch (error) {
                console.error('Error fetching entrega by ID:', error);
            }
        };

        if (equipoUsuarios.length > 0) {
            fetchEntregaByID();
        }
    }, [equipoUsuarios]);

    const isEntregado = (nombreEntrega) => {
        return entregaByID.some(entrega => entrega.Tipo_Entrega_Descripcion === nombreEntrega);
    };

    const handleFileChange = (event, entregaId, nombreEntrega) => {
        setSelectedFiles(prevState => ({
            ...prevState,
            [entregaId]: event.target.files[0]
        }));
    };    

    const handleFileUpload = async (entregaId, nombreEntrega, configuracionEntregaId, bitacoraPpiId) => {
        try {
            const codigoEquipo = bitacora[0].Codigo_Equipo;
            const primerNumeroCodigoEquipo = parseInt(codigoEquipo.toString()[0]);
            let rutaDestinoS3 = '';
            switch (primerNumeroCodigoEquipo) {
                case 1:
                case 2:
                case 3:
                case 4:
                    rutaDestinoS3 = `PPI/Tecnica/S${primerNumeroCodigoEquipo}/`;
                    break;
                case 5:
                case 6:
                    rutaDestinoS3 = `PPI/Tecnologia/S${primerNumeroCodigoEquipo}/`;
                    break;
                default:
                    throw new Error('El código de equipo no es válido.');
            }
            openLoadingModal();
            await createFolderInS3(`${rutaDestinoS3}${codigoEquipo}`);
            const fileName = selectedFiles[entregaId].name;
            const fileExtension = fileName.split('.').pop();
            const uploadedFileData = await uploadFileToS3(selectedFiles[entregaId], rutaDestinoS3 + codigoEquipo, `${nombreEntrega} - Equipo ${codigoEquipo}.${fileExtension}`);
            await axios.post('https://td-g-production.up.railway.app/entrega-equipo-ppi/UploadPPIEntregaFile', {
                ubicacion: uploadedFileData.Location,
                bitacoraPpiId,
                configuracionEntregaId,
            });
            closeLoadingModal();
            alert(
                "¡Archivo cargado exitosamente!"
            );
            location.reload();
        } catch (error) {
            console.error('Error en la carga de archivos:', error);
            closeLoadingModal();
        }
    };

    const formatDate = (dateString) => {
        const formattedDate = moment.utc(dateString).utcOffset(-5).format('DD-MM-YYYY HH:mm A');
        return formattedDate;
    };

    const determineStatus = (fechaEntrega) => {
        const fechaEntregaUTC5 = moment.utc(fechaEntrega).utcOffset(-5);
        const fechaActualUTC5 = moment().utcOffset(-5);
        if (fechaActualUTC5.isBefore(fechaEntregaUTC5)) {
            return "A Tiempo";
        } else {
            return "Plazo Vencido";
        }
    };

    const getStatusStyle = (status, isDelivered) => {
        if (isDelivered) {
            return 'status-blue'; // Clase CSS para fondo azul
        }
        return status === 'A Tiempo' ? 'status-green' : 'status-red';
    };

    const equipoCodigo = equipoUsuarios.length > 0 ? equipoUsuarios[0].Codigo_Equipo : '';
    const aliasProyecto = bitacora.length > 0 ? bitacora[0].Alias_Proyecto : '';

    return (
        <div className="ml-6 mr-6 mt-6 border bg-white border-b flex justify-between">
            <div className='pt-8 pb-8 w-full text-center'>
                <div className='md:h-22 lg:h-22 xl:h-22 sm:h-22 border-b-2 pl-5 pb-5 pr-5 flex justify-between items-center'>
                    <div>
                        <h1 className={`text-2xl font-bold text-gray-600 md:text-left ${isMobile && 'text-center-mobile'}`}>
                            Entregas: {equipoCodigo && `Equipo ${equipoCodigo}`} {aliasProyecto && `- ${aliasProyecto}`}
                        </h1>
                    </div>
                </div>
                <div className='pl-5 pr-5'>
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
                                            <ul>

                                            </ul>
                                        </div>
                                    )}
                                </div>
                            )}
                            <div>
                                {entregaSettings.length === 0 ? (
                                    <p>El coordinador no ha configurado las entregas, intenta después.</p>
                                ) : (
                                    <div>
                                        <br />
                                        <div className="table-responsive">
                                            <table>
                                                <thead>
                                                    <tr>
                                                        <th>Nombre</th>
                                                        <th>Porcentaje</th>
                                                        <th>Plazo</th>
                                                        <th>Estado</th>
                                                        <th className="table-header-adjuntos">Adjuntos</th>
                                                        <th className="table-header-accion">Acción</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {entregaSettings.map(setting => {
                                                        const status = determineStatus(setting.fechaentrega);
                                                        const isDelivered = isEntregado(setting.nombre);
                                                        return (
                                                            <tr key={setting.id}>
                                                                <td
                                                                    data-label="Nombre"
                                                                    onClick={() => {
                                                                        const ubicacion = entregaByID.find(entrega => entrega.Tipo_Entrega_Descripcion === setting.nombre)?.Ubicacion_Entrega;
                                                                        if (ubicacion) {
                                                                            window.location.href = ubicacion;
                                                                        } else {
                                                                            alert("Esta entrega no tiene un archivo adjunto.");
                                                                        }
                                                                    }}
                                                                    className="link-green"
                                                                >
                                                                    {setting.nombre}
                                                                </td>
                                                                <td data-label="Porcentaje">{setting.porcentaje}</td>
                                                                <td data-label="Plazo">{formatDate(setting.fechaentrega)}</td>
                                                                <td data-label="Estado" className={getStatusStyle(status, isDelivered)}>
                                                                    {isDelivered ? <span>Entregado</span> : status}
                                                                </td>
                                                                {status !== 'Plazo Vencido' && (
                                                                    <>
                                                                        <td data-label="Adjuntos" className="text-center">
                                                                            {isDelivered ? (
                                                                                <div>
                                                                                    {status === 'A Tiempo' && (
                                                                                        <input className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400" type="file" onChange={(event) => handleFileChange(event, setting.id, setting.nombre)} acceptLanguage="es" />
                                                                                    )}
                                                                                </div>
                                                                            ) : (
                                                                                status !== 'Plazo Vencido' && (
                                                                                    <input className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400" type="file" onChange={(event) => handleFileChange(event, setting.id, setting.nombre)} acceptLanguage="es" />
                                                                                )
                                                                            )}
                                                                        </td>
                                                                        <td data-label="Acción">
                                                                            {(status === 'A Tiempo' || isDelivered) && (
                                                                                <button className="upload-button" onClick={() => handleFileUpload(setting.id, setting.nombre, setting.configuracionEntregaId, bitacora[0].Bitacora_PPI_ID)}>Cargar</button>
                                                                            )}
                                                                        </td>
                                                                    </>
                                                                )}
                                                            </tr>
                                                        );
                                                    })}
                                                </tbody>
                                            </table>
                                        </div>

                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
            {showLoadingModal && (
                <div className="modal-overlay">
                    <div className="modal">
                        <div className="modal-content">
                            <p>Subiendo archivo...</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Page;