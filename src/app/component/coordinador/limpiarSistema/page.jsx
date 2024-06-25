/* eslint-disable react-hooks/rules-of-hooks */
"use client"
import React, { useState, useEffect } from 'react';
import { useRouter } from "next/navigation";
import axios from 'axios';
import * as XLSX from 'xlsx';

function Page() {
    const [showAlertDelete, setShowAlertDelete] = useState(false);
    const [showCorrecto, setShowCorrecto] = useState(false);
    const [downloading, setDownloading] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [data, setData] = useState(null);
    const router = useRouter();

    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1;
    const semester = currentMonth >= 1 && currentMonth <= 6 ? 1 : 2;
    const fileName = `Backup PPI ${currentYear} - ${semester}.zip`;

    const exportToExcel = (data, prefix) => {
        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

        const currentDate = new Date().toLocaleString("es-CO", { timeZone: "America/Bogota" });
        const [date, time] = currentDate.split(', ');
        const formattedDate = date.replace(/\//g, '-');
        const formattedTime = time.replace(/:/g, '-').replace(' ', '');
        const filename = `${prefix} | ${formattedDate} ${formattedTime}.xlsx`;

        XLSX.writeFile(workbook, filename);
    };

    const fetchDataAndExportExcel = async (url, prefix) => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error('Network response was not ok');
            const result = await response.json();
            setData(result);
            exportToExcel(result, prefix);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const Limpiar = async () => {
        setShowAlertDelete(false);

        try {
            setDownloading(true);
            const response = await axios.get(
                "https://td-g-production.up.railway.app/backup/download-and-clean-bucket",
                {
                    responseType: "blob",
                }
            );

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", fileName);
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
            setDownloading(false);
        } catch (error) {
            console.error("Error:", error);
            setDownloading(false);
        }
    };

    useEffect(() => {
        if (showCorrecto) {
            const timer = setTimeout(() => {
                setShowCorrecto(false);
            }, 2000);

            return () => clearTimeout(timer);
        }
    }, [showCorrecto]);

    return (
        <div className="ml-6 mr-6 mt-6 border bg-white border-b flex justify-between">
            <div className='pt-8 pb-8 w-full'>
                <div className='h-22 pb-2 flex-col border-b-2 flex justify-between items-center'>
                    <div>
                        <h1 className='ml-5 text-4xl font-bold text-gray-600'>Limpiar Sistema</h1>
                    </div>
                </div>
                <div className='p-10'>
                    <div className='text-xl text-gray-500'>
                        <span>Para poder eliminar información del sistema, se debe tener en cuenta que, cuando se realice esta acción, se eliminará la siguiente información:</span>
                        <ul className="list-disc ml-10">
                            <li className="py-2">Citas de asesorías</li>
                            <li className="py-2">Bitácoras</li>
                            <li className="py-2">Semanas</li>
                            <li className="py-2">Notificaciones</li>
                        </ul>
                        <button onClick={() => setShowAlertDelete(true)} className="mt-6 text-white py-2 px-4 w-full rounded bg-red-400 hover:bg-red-500 shadow hover:shadow-lg font-medium transition transform hover:-translate-y-0.5 flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-8 h-8 text-white">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9L14.394 18H9.606L9.26 9M18.228 5.79C18.57 5.842 18.91 5.897 19.25 5.956M18.228 5.79L16.16 19.673A2.25 2.25 0 0113.916 21.75H8.084A2.25 2.25 0 015.84 19.673L3.772 5.79M18.228 5.79A48.108 48.108 0 0014.75 5.393M3.772 5.79C3.432 5.731 3.092 5.676 2.75 5.617M3.772 5.79A48.11 48.11 0 017.25 5.393M9.75 5.393V4.477C9.75 3.297 8.84 2.313 7.66 2.276A51.964 51.964 0 004.34 2.276C3.16 2.313 2.25 3.297 2.25 4.477V5.393M9.75 5.393A48.667 48.667 0 007.25 5.393" />
                            </svg>
                            Limpiar Sistema
                        </button>
                    </div>
                </div>
            </div>
            {showAlertDelete && (
                <div className="fixed inset-0 z-10 bg-grey bg-opacity-10 backdrop-blur-sm flex justify-center items-center">
                    <div className="flex flex-col justify-center content-center items-center rounded-lg bg-white p-4 shadow-2xl min-w-[50vw] max-w-[50vw] border border-solid border-gray-300">
                        <h2 className="text-lg font-bold">¿Deseas limpiar el sistema?</h2>
                        <p className="mt-2 text-sm text-gray-800">
                            Está seguro de que desea limpiar el sistema, al limpiar el sistema se exportaran la información.
                        </p>
                        <div className="mt-4 flex flex-row flex-wrap min-w-full items-center content-center justify-center gap-2">
                            <button type="button" className="min-w-[25%] rounded-lg bg-green-400 px-4 py-2 text-sm font-medium text-white hover:bg-green-500" onClick={Limpiar}>
                                Confirmar
                            </button>
                            <button type="button" className="min-w-[25%] rounded-lg bg-red-400 px-4 py-2 text-sm font-medium text-white hover:bg-red-500" onClick={() => setShowAlertDelete(false)}>
                                Cancelar
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {showCorrecto && (
                <div className="fixed inset-0 z-10 bg-grey bg-opacity-10 backdrop-blur-sm flex justify-center items-center">
                    <div className="flex flex-col justify-center content-center items-center rounded-lg bg-white p-4 shadow-2xl min-w-[50vw] max-w-[50vw] border border-solid border-gray-300">
                        <h2 className="text-lg font-bold">Sistema limpiado correctamente</h2>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Page;
