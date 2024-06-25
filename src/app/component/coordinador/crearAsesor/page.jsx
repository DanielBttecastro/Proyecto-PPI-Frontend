"use client";
import React, { useEffect, useState } from 'react';
import './page.css';
import CryptoJS from 'crypto-js';
import { useRouter } from "next/navigation";
//import Dialog from '@mui/material/Dialog';

const Page = () => {
  const [asesores, setAsesores] = useState(Array(15).fill({ Usuario_ID: "", Usuario_Nombre: "", Rol_ID: "", Usuario_Documento: "", Usuario_Correo: "", Horas_Asesor: "", Oficina: "" }));
  const [traidosDeBD, setTraidosDeBD] = useState([]); // Almacenar los datos originales
  const [horas, setHoras] = useState([]); // Almacenar los datos originales
  const apiEndpoint = "https://td-g-production.up.railway.app/usuario/GetAsesor";
  const getAllUsers = "https://td-g-production.up.railway.app/usuario";

  const router = useRouter();


  useEffect(() => {
    fetch(apiEndpoint)
      .then(response => response.json())
      .then(data => {
        const fetchedData = data.slice(0, 15);
        const filledData = fetchedData.concat(Array(15 - fetchedData.length).fill({ Usuario_ID: "", Usuario_Nombre: "", Rol_ID: "", Usuario_Documento: "", Usuario_Correo: "" }));
        setAsesores(filledData);
        // Almacenar los datos originales
        setTraidosDeBD(fetchedData);
      })
      .catch(error => console.error('Error fetching data:', error));
    const validarRol = () => {
      const usuarioNest = localStorage.getItem('U2FsdGVkX1');
      const bytes = CryptoJS.AES.decrypt(usuarioNest, 'PPIITYTPIJC');
      const usuarioN = JSON.parse(bytes.toString(CryptoJS.enc.Utf8))
      if (usuarioN.rol.id != 4) {
        router.push('/')
      }

    }
    validarRol()
  }, []);

  const handleDelete = (index, asesores) => {
    const updatedAsesores = [...asesores];
    updatedAsesores[index] = { Usuario_ID: "", Usuario_Nombre: "", Rol_ID: "", Usuario_Documento: "", Usuario_Correo: "", Horas_Asesor: "", Oficina: "" };
    setAsesores(updatedAsesores);
  };

  const handleInputChange = (index, field, value) => {
    const updatedAsesores = [...asesores];
    updatedAsesores[index] = { ...updatedAsesores[index], [field]: value || null };

    /* Si asesor.Usuario_Documento === null || asesor.Usuario_Nombre === null || asesor.Usuario_Correo === null, volver Usuario_ID: "", Usuario_Nombre: "", Rol_ID: "", Usuario_Documento: "", Usuario_Correo: "" */
    if (updatedAsesores[index].Usuario_Documento === null && updatedAsesores[index].Usuario_Nombre === null && updatedAsesores[index].Usuario_Correo === null) {
      updatedAsesores[index] = { Usuario_ID: "", Usuario_Nombre: "", Rol_ID: "", Usuario_Documento: "", Usuario_Correo: "", Horas_Asesor: "", Oficina: "" };
    }

    setAsesores(updatedAsesores);
  };

  const handleSave = async () => {
    // Identficar registros modificados, para eso, si el asesor tiene Usuario_ID !== "", se comparan los datos originales con los actuales
    let asesoresModificados = asesores.filter((asesor) => {
      if (asesor.Usuario_ID !== "") {
        const asesorOriginal = traidosDeBD.find((asesorOriginal) => asesorOriginal.Usuario_ID === asesor.Usuario_ID);
        return asesor.Usuario_Documento !== asesorOriginal.Usuario_Documento || asesor.Usuario_Nombre !== asesorOriginal.Usuario_Nombre || asesor.Usuario_Correo !== asesorOriginal.Usuario_Correo || asesor.Horas_Asesor !== asesorOriginal.Oficina;
      }
      return true;
    });

    // Filtrar asesoresModificados para eliminar objetos con todos los campos vacíos
    const asesoresModificadosFiltrados = asesoresModificados.filter((asesor) => {
      // Verificar si todos los campos están vacíos
      return Object.values(asesor).some(value => value !== "");
    });

    // Asignar asesoresModificadosFiltrados a asesoresModificados
    asesoresModificados = asesoresModificadosFiltrados;


    // Identificar registros nuevos
    //const asesoresNuevos = asesores.filter(asesor => asesor.Usuario_ID === "" && asesor.Usuario_Documento && asesor.Usuario_Nombre && asesor.Usuario_Correo);

    const asesoresNuevos = asesores.filter(asesor => asesor.Usuario_ID === "" && asesor.Usuario_Documento && asesor.Usuario_Nombre && asesor.Usuario_Correo && asesor.Horas_Asesor && asesor.Oficina)
      .map(asesor => {
        const asesorExistente = traidosDeBD.find(a => a.Usuario_Documento === asesor.Usuario_Documento);
        if (asesorExistente) {
          if (asesorExistente.Rol_ID === 2) {
            asesor.Rol_ID = 5;
          }
        } else {
          asesor.Rol_ID = 3;
        }
        return asesor;
      });

    //console.log("Traidos de db:", traidosDeBD);
    //console.log("Asesores:", asesores);

    /* Asesores Eliminados */
    const asesoresEliminados = traidosDeBD.filter((asesorOriginal) => !asesores.some((asesor) => asesor.Usuario_ID === asesorOriginal.Usuario_ID));
    asesoresEliminados.forEach(asesor => {
      if (asesor.Rol_ID === 5) {
        asesor.Rol_ID = 2;
      } else if (asesor.Rol_ID === 3) {
        asesor.Rol_ID = 6;
      }
    });

    const dataToSend = {
      asesoresModificados,
      asesoresNuevos,
      asesoresEliminados
    };

    let dataToSend2 = asesoresModificados.concat(asesoresNuevos, asesoresEliminados);
    console.log(dataToSend2)
    //console.log("antes de filtrar: ", dataToSend2);  
    let conjunto = new Set(dataToSend2.map(JSON.stringify));
    dataToSend2 = Array.from(conjunto).map(JSON.parse);

    //  console.log("Filtrado:", dataToSend2);

    try {
      const response = await fetch('https://td-g-production.up.railway.app/usuario/crearAsesores', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(dataToSend2)
      });

      if (!response.ok) {
        throw new Error('Error al guardar cambios');
      }

      console.log('Cambios guardados correctamente');
    } catch (error) {
      console.error('Error:', error.message);
    }
  };

  return (


    <div className="ml-6 mr-6 mt-6 border   bg-white border-b flex justify-between">
      <div className='pt-8  pb-8 w-full'>
        <div className='w-full border-b-2 flex items-center sm:items-start justify-center sm:justify-start sm:pl-8 sm:h-22 pb-5 text-center sm:text-left'>
          <h1 className='text-4xl font-bold text-gray-600'>Asesores PPI</h1>
        </div>
        <div className='p-10'>
          <table className="min-w-full bg-white border border-gray-200">
            <thead>
              <tr>
                <th className="py-1 px-4 bg-transparent border-gray-200"></th>
                <th className="py-1 px-2 border-b border-gray-200 bg-green-500">Cédula</th>
                <th className="py-1 px-2 border-b border-gray-200 bg-green-500">Nombre</th>
                <th className="py-1 px-2 border-b border-gray-200 bg-green-500">Correo</th>
                <th className="py-1 px-2 border-b border-gray-200 bg-green-500">Horas Asesorías</th>
                <th className="py-1 px-2 border-b border-gray-200 bg-green-500">Oficina</th>
              </tr>
            </thead>
            <tbody>
              {asesores.map((asesor, index) => (
                <tr key={index} className="hover:bg-gray-100">
                  <td className="py-1 px-0.5 border-gray-200 text-center text-sm">
                    {(asesor.Usuario_ID !== ("" && null) && asesor.Usuario_Documento !== ("" && null) || asesor.Usuario_Nombre !== ("" && null) || asesor.Usuario_Correo !== ("" && null)) ? (
                      <button onClick={() => handleDelete(index, asesores)} className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-700 text-sm">X</button>
                    )
                      : null
                    }
                  </td>
                  <td className="p-0 border-gray-200">
                    <input
                      type="text"
                      value={asesor.Usuario_Documento || ''}
                      onChange={(e) => handleInputChange(index, 'Usuario_Documento', e.target.value)}
                      className="w-full py-1 px-2 border-gray-200"
                    />
                  </td>
                  <td className="p-0 border-gray-200" style={{ width: "35%" }}>
                    <input
                      type="text"
                      value={asesor.Usuario_Nombre || ''}
                      onChange={(e) => handleInputChange(index, 'Usuario_Nombre', e.target.value)}
                      className="w-full py-1 px-2 border-gray-200"
                    />
                  </td>
                  <td className="p-0 border-gray-200" style={{ width: "45%" }}>
                    <input
                      type="email"
                      value={asesor.Usuario_Correo || ''}
                      onChange={(e) => handleInputChange(index, 'Usuario_Correo', e.target.value)}
                      className="w-full py-1 px-2 border-gray-200"
                    />
                  </td>
                  <td className="p-0 border-gray-200" style={{ width: "45%" }}>
                    <input
                      type="email"
                      value={asesor.Horas_Asesor}
                      onChange={(e) => handleInputChange(index, 'Horas_Asesor', e.target.value)}
                      className="w-full py-1 px-2 border-gray-200"
                    />
                  </td>
                  <td className="p-0 border-gray-200" style={{ width: "45%" }}>
                    <input
                      type="email"
                      value={asesor.Oficina}
                      onChange={(e) => handleInputChange(index, 'Oficina', e.target.value)}
                      className="w-full py-1 px-2 border-gray-200"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button onClick={handleSave} className="mt-2 px-4 py-1 bg-green-500 text-white rounded hover:bg-green-700">Guardar Cambios</button>

        </div>
      </div>
    </div>

  );
};

export default Page;
