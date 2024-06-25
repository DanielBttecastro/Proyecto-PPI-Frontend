/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/rules-of-hooks */
"use client"
import { data } from 'autoprefixer';
import React, { useEffect, useState } from 'react'

export default function asesor() {

  const [bitacoras, setBitacoras] = useState([])
  const [auxBitacoras, setAuxBitacoras] = useState([])
  const [estudiantes, setEstudiantes] = useState([])

  const filtrarBitacora = (valor) => {
    if (valor == "" || valor.leght == 0) {
      setAuxBitacoras(bitacoras)
    }

    const resultadosFiltrados = bitacoras.filter(dato => {
      const dataString = Object.values(dato).join('').toLowerCase();
      return dataString.includes(valor.toLowerCase());
    });
    setAuxBitacoras(resultadosFiltrados)
  }

  useEffect(() => {
    const traerBitacoras = async () => {
      const response = await fetch('https://td-g-production.up.railway.app/equipo-ppi');
      const data = await response.json();
      if (response.ok) {
        setBitacoras(data)
        setAuxBitacoras(data)
      }
    }

    traerBitacoras()
  }, []), [];

  useEffect(() => {
    const fetchData = async () => {
      const response2 = await fetch('https://td-g-production.up.railway.app/equipo-usuarios/Estudiantes');
      const data2 = await response2.json();
      setEstudiantes(data2)
    };

    fetchData();
  }, [bitacoras]);
  return (
    <div>
      <div className="flex items-center w-full">
        <div className="relative w-full">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" className="absolute left-0 top-1/2  transform -translate-y-1/2 ml-3" style={{ fill: 'rgb(75 85 99)' }}>
            <path d="M19.023 16.977a35.13 35.13 0 0 1-1.367-1.384c-.372-.378-.596-.653-.596-.653l-2.8-1.337A6.962 6.962 0 0 0 16 9c0-3.859-3.14-7-7-7S2 5.141 2 9s3.14 7 7 7c1.763 0 3.37-.66 4.603-1.739l1.337 2.8s.275.224.653.596c.387.363.896.854 1.384 1.367l1.358 1.392.604.646 2.121-2.121-.646-.604c-.379-.372-.885-.866-1.391-1.36zM9 14c-2.757 0-5-2.243-5-5s2.243-5 5-5 5 2.243 5 5-2.243 5-5 5z"></path>
          </svg>
          <input
            type="email"
            onChange={(e) => { filtrarBitacora(e.target.value) }}
            id="UserEmail"
            placeholder="Buscar"
            className="mt-1 pl-10 pr-4 py-2 w-full border-2 rounded-md border-gray-300 shadow-sm sm:text-sm"
          />
        </div>
      </div>
      <div className='grid mt-5 grid-cols-1'>
        {auxBitacoras.map((item) => (
          <a key={item.id} href={'/component/bitacora/visualizar/asesor/' + item.id}>
            <div className='px-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 items-center cursor-pointer border-2 my-2 border-gray-300 rounded-lg shadow-md hover:shadow-lg p-4'>
              <div className='grid grid-cols-1 sm:grid-cols-2 items-center'>
                <div className='mb-4 sm:mb-0 sm:mr-4 text-center'>
                  <span className='text-xl font-bold text-gray-600'>Equipo:</span>
                  <span className='ml-2 text-xl font-semibold text-gray-400'>{item.codigoEquipo}</span>
                </div>
                <div className='mb-4 sm:mb-0 sm:mr-4 text-center'>
                  <div className='flex text-center justify-center items-center'>
                    <p className='text-xl font-bold text-gray-600'>Nombre Proyecto:</p>
                  </div>
                  <div>
                    <span className='ml-2 text-center text-xl font-semibold text-gray-400'>{item.nombre}</span>
                  </div>
                </div>
              </div>
              <div className='grid grid-cols-1 col-span-1 xl:col-span-1 xl:ml-5'>
                <div className='flex justify-center items-center'>
                  <p className='text-xl font-bold text-gray-600'>Estudiantes:</p>
                </div>
                <div className='flex justify-center items-center'>
                  <ul className='text-base ml-2 font-semibold text-gray-400 list-disc'>
                    {
                      Object.entries(estudiantes).map(([codigo, estudiantesArray]) => {
                        if (item.codigoEquipo == codigo) {
                          return estudiantesArray.map(estudiante => (
                            <li key={estudiante.id}>{estudiante.nombre}<br /></li>
                          ));
                        } else {
                          return null; // Retorna null si no se cumple la condición
                        }
                      })
                    }
                  </ul>
                </div>
              </div>
            </div>

          </a>
        ))}
      </div>



    </div>
  )
}
