"use client";
import React, { useState, useEffect } from "react";
import { FiArrowLeft } from "react-icons/fi";
import CryptoJS from 'crypto-js';

function Page() {
    const [asignaturas, setAsignaturas] = useState([]);
    const [selectedGrupo, setSelectedGrupo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [equipos, setEquipos] = useState([]);
    const [selectedEquipo, setSelectedEquipo] = useState(null);
    const [usuarios, setUsuarios] = useState({});

    useEffect(() => {
        const fetchData = async () => {
            try {

                const usuarioNest = localStorage.getItem('U2FsdGVkX1');
                const bytes = CryptoJS.AES.decrypt(usuarioNest, 'PPIITYTPIJC');
                const NestOriginal = JSON.parse(bytes.toString(CryptoJS.enc.Utf8))
                const asignaturasResponse = await fetch(
                    "https://td-g-production.up.railway.app/usuario-asignatura/GroupsDocente/" + NestOriginal.id
                ).then((res) => res.json());
                setAsignaturas(asignaturasResponse);
                setLoading(false);
            } catch (error) {
                console.error("Error al obtener datos:", error);
                setError("Error al obtener datos.");
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        const fetchUsuarios = async () => {
            try {
                const usuariosResponse = await fetch(
                    "https://td-g-production.up.railway.app/usuario"
                ).then((res) => res.json());
                const usuariosMap = {};
                usuariosResponse.forEach((usuario) => {
                    usuariosMap[usuario.id] = usuario;
                });
                setUsuarios(usuariosMap);
            } catch (error) {
                console.error("Error al obtener usuarios:", error);
                setError("Error al obtener usuarios.");
            }
        };
        fetchUsuarios();
    }, []);

    console.log(usuarios)

    useEffect(() => {
        if (selectedGrupo) {
            const fetchEquipos = async () => {
                try {
                    const equiposResponse = await fetch(
                        "https://td-g-production.up.railway.app/equipo-usuarios/GetAllGroups"
                    ).then((res) => res.json());
                    setEquipos(equiposResponse.filter(e => e.Grupo_Codigo === selectedGrupo.Grupo_Codigo));
                } catch (error) {
                    console.error("Error al obtener equipos:", error);
                    setError("Error al obtener equipos.");
                }
            };
            fetchEquipos();
        }
    }, [selectedGrupo]);

    if (loading) {
        return <div className="p-6">Cargando...</div>;
    }

    if (error) {
        return <div className="p-6 text-red-500">{error}</div>;
    }

    if (selectedGrupo) {
        return (
            <GrupoDetail
                grupo={selectedGrupo}
                setSelectedGrupo={setSelectedGrupo}
                equipos={equipos}
                setSelectedEquipo={setSelectedEquipo}
                selectedEquipo={selectedEquipo}
                usuarios={usuarios}
            />
        );
    }

    return (
        <div className="ml-6 mr-6 mt-6 border   bg-white border-b flex justify-between">
            <div className='pt-8  pb-8 w-full'>
                <div className='  h-22 pb-2 flex-col  border-b-2 flex justify-between items-center'>
                    <div className='text-center'>
                        <h1 className='ml-5 text-4xl font-bold text-gray-600'>Equipos de mis asignaturas</h1>
                    </div>
                </div>
                <div className='p-10'>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {asignaturas.map((asignatura, index) => (
                            <div
                                key={index}
                                className="border-2 rounded-lg p-4 shadow-lg cursor-pointer hover:bg-gray-100"
                                onClick={() => setSelectedGrupo(asignatura)}
                            >
                                <h2 className="text-lg font-semibold">
                                    {asignatura.Asignatura_Nombre}
                                </h2>
                                <p className="text-gray-600">Grupo: {asignatura.Grupo_Codigo}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div >

    );
}

function GrupoDetail({ grupo, setSelectedGrupo, equipos, setSelectedEquipo, selectedEquipo, usuarios }) {
    const uniqueEquipos = Array.from(new Set(equipos.map(equipo => equipo.Codigo_Equipo)))
        .map(codigo => equipos.find(equipo => equipo.Codigo_Equipo === codigo));

    // Función para convertir el texto a Capitalize
    const capitalize = (str) => {
        return str.replace(/\b\w/g, (char) => char.toUpperCase());
    };

    return (

        <div className="ml-6 mr-6 mt-6 border   bg-white border-b flex justify-between">
            <div className='pt-8  pb-8 w-full'>
                <div className='  h-22 pb-2 flex-col  border-b-2 flex justify-between items-center'>
                    <div className="flex items-center mb-4">
                        <button
                            onClick={() => setSelectedGrupo(null)}
                            className="p-2 bg-red-500 text-white rounded mr-2"
                        >
                            <FiArrowLeft />
                        </button>
                        <h1 className="text-xl font-bold text-gray-800">
                            Grupo {grupo.Grupo_Codigo} - {grupo.Asignatura_Nombre}
                        </h1>
                    </div>
                </div>
                <div className='p-10'>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {uniqueEquipos.map((equipo, index) => (
                            <div
                                key={index}
                                className="border rounded-lg p-4 shadow-lg cursor-pointer hover:bg-gray-100"
                                onClick={() => setSelectedEquipo(equipo)}
                            >
                                <h2 className="text-lg font-semibold">
                                    Equipo: {equipo.Codigo_Equipo}
                                </h2>
                                <ul className="mt-2">
                                    {equipos
                                        .filter(e => e.Codigo_Equipo === equipo.Codigo_Equipo)
                                        .map((miembro, idx) => (
                                            <li key={idx} className="text-gray-600 text-xs"> ◉ {capitalize(miembro.Usuario_Nombre.toLowerCase())}</li>
                                        ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                    {selectedEquipo && (
                        <EquipoPopup
                            equipo={equipos.filter(e => e.Codigo_Equipo === selectedEquipo.Codigo_Equipo)}
                            usuarios={usuarios}
                            onRequestClose={() => setSelectedEquipo(null)}
                        />
                    )}
                </div>
            </div >
        </div>
    );
}

function EquipoPopup({ equipo, usuarios, onRequestClose }) {
    // Función para convertir el texto a Capitalize
    const capitalize = (str) => {
        return str.replace(/\b\w/g, (char) => char.toUpperCase());
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-4xl">
                <button onClick={onRequestClose} className="p-2 bg-red-500 text-white rounded mb-4">
                    Cerrar
                </button>
                <h2 className="text-xl font-bold mb-4">Equipo: {equipo[0].Codigo_Equipo}</h2>
                <div className="overflow-auto">
                    <table className="table-auto w-full">
                        <thead>
                            <tr>
                                <th className="px-4 py-2 bg-green-500">Nombre</th>
                                <th className="px-4 py-2 bg-green-500">Cédula</th>
                                <th className="px-4 py-2 bg-green-500">Correo</th>
                            </tr>
                        </thead>
                        <tbody>
                            {equipo.map((miembro, index) => {
                                // Buscar el usuario correspondiente
                                const usuario = usuarios[miembro.Usuario_ID];
                                return (
                                    <tr key={index}>
                                        <td className="border px-4 py-2 capitalize">{capitalize(miembro.Usuario_Nombre.toLowerCase())}</td>
                                        <td className="border px-4 py-2">{usuario.documento}</td>
                                        <td className="border px-4 py-2">{usuario ? usuario.correo : 'N/A'}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default Page;
