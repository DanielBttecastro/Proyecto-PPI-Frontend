"use client";
import React, { useState, useEffect } from 'react';
import axios from "axios";

function Page() {
    const [downloading, setDownloading] = useState(false);

    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1;
  
    let semester;
    if (currentMonth >= 1 && currentMonth <= 6) {
      semester = 1;
    } else {
      semester = 2;
    }
  
    const fileName = `Backup PPI ${currentYear} - ${semester}.zip`;
  
    const handleDownload = async () => {
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
    }

    return (
        <div className="ml-2 mr-6 mt-6 border bg-white border-b">
            <div className='pt-8 pb-8 w-full text-center'>
                <div className='md:h-22 lg:h-22 xl:h-22 sm:h-22 border-b-2 pl-8 pb-5 pr-52 flex justify-between items-center'>
                    <div>
                        <h1 className='text-4xl font-bold text-gray-600'>Reiniciar Aplicación</h1>
                    </div>
                </div>
                <br />
                <div className="p-4">
                    <p style={{ textAlign: 'justify' }}>
                        En esta sección, usted podrá descargar todos los archivos almacenados en la nube hasta la fecha. Luego, podrá limpiar la aplicación, eliminando los equipos, calificaciones y entregables, dejando todo listo para el próximo semestre.<br />
                        Esta acción es irreversible, está diseñada para realizarse una vez el semestre ya haya finalizado en su totalidad y no se requiera ninguna de sus funcionalidades.<br />
                        Recomendamos usar esta opción <strong>ÚNICAMENTE</strong> al inicio de cada semestre.
                    </p>
                    <br />
                    <button onClick={handleDownload} disabled={downloading} className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-700">
                        {downloading ? "Procesando..." : "Reiniciar Aplicación"}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Page;
