"use client"
import React, { useState } from 'react';
import * as XLSX from 'xlsx';

function Page() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [showMessage, setShowMessage] = useState(false);
    const [showSecondMessage, setShowSecondMessage] = useState(false);
    const [showTMessage, setShowTMessage] = useState(false);

    const fetchDataAndExportExcel = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch('https://td-g-production.up.railway.app/entrega-equipo-ppi/equipos-mora');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const result = await response.json();
            setData(result);
            exportToExcel(result);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const fetchDataAndExportAnotherExcel = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch('https://td-g-production.up.railway.app/entrega-equipo-ppi/docentes-mora');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const result = await response.json();
            setData(result);
            exportToAnotherExcel(result);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const fetchDataAndExportNewExcel = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch('https://td-g-production.up.railway.app/entrega-equipo-ppi/asesorias-mora');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const result = await response.json();
            setData(result);
            exportToNewExcel(result);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const exportToExcel = (data) => {
        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

        const currentDate = new Date().toLocaleString("es-CO", { timeZone: "America/Bogota" });
        const [date, time] = currentDate.split(', ');
        const formattedDate = date.replace(/-/g, '/');
        const formattedTime = time.replace(/:/g, '-').replace(' ', ' ');
        const filename = `Equipos con Mora | ${formattedDate} ${formattedTime}.xlsx`;

        XLSX.writeFile(workbook, filename);
    };

    const exportToAnotherExcel = (data) => {
        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

        const currentDate = new Date().toLocaleString("es-CO", { timeZone: "America/Bogota" });
        const [date, time] = currentDate.split(', ');
        const formattedDate = date.replace(/-/g, '/');
        const formattedTime = time.replace(/:/g, '-').replace(' ', ' ');
        const filename = `Docentes con Mora | ${formattedDate} ${formattedTime}.xlsx`;

        XLSX.writeFile(workbook, filename);
    };

    const exportToNewExcel = (data) => {
        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

        const currentDate = new Date().toLocaleString("es-CO", { timeZone: "America/Bogota" });
        const [date, time] = currentDate.split(', ');
        const formattedDate = date.replace(/-/g, '/');
        const formattedTime = time.replace(/:/g, '-').replace(' ', ' ');
        const filename = `Estudiantes sin Asesoría | ${formattedDate} ${formattedTime}.xlsx`;

        XLSX.writeFile(workbook, filename);
    };

    return (
        <div className="ml-2 mr-6 mt-6 border bg-white border-b rounded-lg shadow-lg">
            <div className='pt-8 pb-8 w-full text-center'> 
                <div className='pt-5 w-full border-b-2 flex items-center sm:items-start justify-center sm:justify-start sm:pl-8 sm:h-22 pb-5 text-center sm:text-left'>
                    <h1 className='text-4xl font-bold text-gray-600'>Generación de Reportes</h1>
                </div>
                <br />
                <div className="p-4">
                    <p className="text-justify">Selecciona el reporte que deseas generar:</p>
                </div>
                <div className='p-4 flex flex-col items-center'>
                    <div className="flex space-x-4">
                        <button
                            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                            onClick={fetchDataAndExportExcel}
                            onMouseEnter={() => setShowMessage(true)}
                            onMouseLeave={() => setShowMessage(false)}
                        >
                            Equipos con Mora
                        </button>
                        <button
                            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                            onClick={fetchDataAndExportAnotherExcel}
                            onMouseEnter={() => setShowSecondMessage(true)}
                            onMouseLeave={() => setShowSecondMessage(false)}
                        >
                            Docentes con Mora
                        </button>
                        <button
                            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                            onClick={fetchDataAndExportNewExcel}
                            onMouseEnter={() => setShowTMessage(true)}
                            onMouseLeave={() => setShowTMessage(false)}
                        >
                            Estudiantes sin Asesoría
                        </button> 
                    </div>
                    {showMessage && <p className="text-sm text-gray-500 mt-2">Genera un reporte que especifica cuáles entregas no han sido cargadas por los estudiantes.</p>}
                    {showSecondMessage && <p className="text-sm text-gray-500 mt-2">Genera un reporte que especifica cuáles entregas no han sido calificadas por los docentes.</p>}
                    {showTMessage && <p className="text-sm text-gray-500 mt-2">Genera un reporte que especifica cuáles estudiantes no han recibido su nota total de asesorías.</p>}
                </div>
                <div className='p-4'>
                    {loading && <p>Cargando...</p>}
                    {error && <p>Error: {error}</p>}
                </div>
            </div>
        </div>
    );
}

export default Page;
