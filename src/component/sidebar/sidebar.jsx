/* eslint-disable react-hooks/rules-of-hooks */
"use client"
import React, { useState, useEffect } from 'react'
import './css/sidebar.css'
import Cookies from 'js-cookie';
import { useRouter } from "next/navigation";
import CryptoJS from 'crypto-js';

function sidebar({ children }) {
  const [click, setClick] = useState(false);
  const [notificacionesPendientes, setNotificacionesPendientes] = useState([]);
  const [controlador, setControlador] = useState(0)
  const [rol, SetRol] = useState(0)
  const [imagen, setImagen] = useState()
  const [sesion, setSesion] = useState(false)
  const router = useRouter();
  const btnTextSize = 'text-sm';
  // const btnTextSize = 'text-lg';
  const btnIconSize = 'min-w-7 max-w-7 min-h-7 max-h-7';
  const profileImgSize = 'min-w-8 max-w-8 min-h-8 max-h-8';

  const showSidebar = () => {
    let slidebar = document.getElementById("slidebar");
    let acorSlidebar = document.getElementById("AcorSlidebar");
    let contSlidebar = document.getElementById("contSlidebar");
    slidebar.classList.toggle("mostrar");
    acorSlidebar.classList.toggle("ocultar");
    contSlidebar.classList.toggle("inactive");
    setClick(true);
  }
  useEffect(() => {

    const validarSesion = async () => {
      const usuarioNest = localStorage.getItem('U2FsdGVkX1');
      const usuarioGoogle = localStorage.getItem('U2FsdGVkX2');
      if (usuarioNest == null || usuarioGoogle == null) {
        router.push('/')
      } else {
        const bytes = CryptoJS.AES.decrypt(usuarioNest, 'PPIITYTPIJC');
        const NestOriginal = JSON.parse(bytes.toString(CryptoJS.enc.Utf8))
        const bytes2 = CryptoJS.AES.decrypt(usuarioGoogle, 'PPIITYTPIJC');
        const Googleoriginal = JSON.parse(bytes2.toString(CryptoJS.enc.Utf8));
        setSesion(true)
        SetRol(NestOriginal.rol.id)
        setImagen(Googleoriginal.picture)
      }
    }

    const estadoConeccionGoogle = async () => {
      const response = await fetch(`https://td-g-production.up.railway.app/google/check-session`);
      const data = await response.json()
      if (data.isSessionActive) {
        obtenerNotifications();
        validarSesion()
      } else {
        cerrarSesion()
      }
    }
    estadoConeccionGoogle()
  }, []);

  const hiddenSidebar = () => {
    let slidebar = document.getElementById("slidebar");
    let acorSlidebar = document.getElementById("AcorSlidebar");
    let contSlidebar = document.getElementById("contSlidebar");
    slidebar.classList.toggle("mostrar");
    acorSlidebar.classList.toggle("ocultar");
    contSlidebar.classList.toggle("inactive");
    setClick(false);
  }

  const obtenerNotifications = async () => {
    try {
      const response = await fetch(`https://td-g-production.up.railway.app/notificaciones/Pendientes`);
      if (response.ok) {
        const data = await response.json();
        setNotificacionesPendientes(data);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const cerrarSesion = async () => {
    const response2 = await fetch(`https://td-g-production.up.railway.app/google/logout`);
    localStorage.removeItem('U2FsdGVkX1');
    localStorage.removeItem('U2FsdGVkX2');
    router.push('/')
  }

  return (
    sesion ? (
      <>
        <div>
          {/*Control del acortador del slidebar*/}
          <div id='AcorSlidebar' className="min-h-screen flex flex-col antialiased bg-gray-50 text-gray-800">
            <div className="fixed top-0 left-0 h-[10vh] bg-white w-full border-b flex justify-between items-center">
              <div id='iconAcorSlidebar' onClick={showSidebar} className="ml-4 border rounded-md w-auto">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-9 h-9 ">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                </svg>
              </div>
              <div className="mr-4 cursor-pointer">
                <img src="https://www.politecnicojic.edu.co/images/logo/logo-negro.png" className=" h-10 w-auto marg" alt="Logo" onClick={() => { window.location.href = "/component" }} />
              </div>
            </div>
          </div>
          <div id="slidebar" className={`fixed w-65 bg-white h-[100vh] w-64 border-r ${click ? 'mostrar' : ''}`}>
            <div className="flex items-center h-[10vh] border-b px-2">
              <img className="h-[10vh] object-scale-down" src="https://www.politecnicojic.edu.co/images/logo/logo-negro.png" onClick={() => { window.location.href = "/component" }} />
            </div>
            <div className="flex flex-col h-[90vh] justify-between">
              <div className='flex flex-col'>
                <div className='border-b border-slate-200 h-[10vh]'>
                  <div className="h-full cursor-pointer relative flex flex-row items-center focus:outline-none hover:bg-gray-50 text-gray-600 hover:text-gray-800 border-l-4 border-transparent hover:border-primari pr-6 " onClick={() => { window.location.href = "/component" }} >
                    <span className={`inline-flex justify-center items-center ml-4 ${btnIconSize}`}>
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                      </svg>
                    </span>
                    <span className={`ml-2 ${btnTextSize} tracking-wide truncate`}>Inicio</span>
                  </div>
                </div>
                <ul className="flex flex-col max-h-[60vh] overflow-y-auto space-between">
                  {controlador == 0 ? (
                    <>
                      {rol != 2 ? (
                        <li>
                          <div onClick={() => { setControlador(1) }}
                            className="cursor-pointer relative flex flex-row items-center h-[10vh] focus:outline-none hover:bg-gray-50 text-gray-600 hover:text-gray-800 border-l-4 border-transparent hover:border-primari pr-6 ">
                            <span className={`inline-flex justify-center items-center ml-4 ${btnIconSize}`}>
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-8 h-8 text-gray-600">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
                              </svg>
                            </span>
                            <span className={`ml-2 ${btnTextSize} tracking-wide truncate`}>Asesorías</span>
                          </div>
                        </li>) : (null)}
                      <li>
                        <div onClick={() => { setControlador(2) }} className="cursor-pointer relative flex flex-row items-center h-[10vh] focus:outline-none hover:bg-gray-50 text-gray-600 hover:text-gray-800 border-l-4 border-transparent hover:border-primari pr-6 ">
                          <span className={`inline-flex justify-center items-center ml-4 ${btnIconSize}`}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-8 h-8 text-gray-600">
                              <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                            </svg>
                          </span>
                          <span className={`ml-2 ${btnTextSize} tracking-wide truncate`}>Bitácoras</span>
                        </div>
                      </li>
                      {rol == 4 ? (
                        <>
                          <li>
                            <div onClick={() => { setControlador(3); }} className="cursor-pointer relative flex flex-row items-center h-[10vh] focus:outline-none hover:bg-gray-50 text-gray-600 hover:text-gray-800 border-l-4 border-transparent hover:border-primari pr-6 ">
                              <span className={`inline-flex justify-center items-center ml-4 ${btnIconSize}`}>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-8 h-8 text-gray-600">
                                  <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75" />
                                </svg>
                              </span>
                              <span className={`ml-2 ${btnTextSize} tracking-wide truncate`}>Administrar</span>
                            </div>
                          </li>
                          <li>
                            <a href="/component/coordinador/notificaciones" className="cursor-pointer relative flex flex-row items-center h-[10vh] focus:outline-none hover:bg-gray-50 text-gray-600 hover:text-gray-800 border-l-4 border-transparent hover:border-primari pr-6 ">
                              <span className={`inline-flex justify-center items-center ml-4 ${btnIconSize}`}>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-8 h-8 text-gray-600">
                                  <path stroke-linecap="round" stroke-linejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
                                </svg>
                              </span>
                              <span className={`ml-2 ${btnTextSize} tracking-wide truncate`}>Notificaciones</span>
                              {notificacionesPendientes && notificacionesPendientes.length != 0 ? (
                                <span class="px-3 py-1 ml-auto text-lg font-medium tracking-wide text-green-500 bg-green-50 rounded-full">{notificacionesPendientes.length}</span>
                              ) : (
                                null
                              )}
                            </a>
                          </li>
                        </>
                      ) : (null)}
                      <><li>
                        <div onClick={() => { setControlador(4); }} className="cursor-pointer relative flex flex-row items-center h-[10vh] focus:outline-none hover:bg-gray-50 text-gray-600 hover:text-gray-800 border-l-4 border-transparent hover:border-primari pr-6 ">
                          <span className={`inline-flex justify-center items-center ml-4 ${btnIconSize}`}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="w-8 h-8 text-gray-600">
                              <path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
                            </svg>
                          </span>
                          <span className={`ml-2 ${btnTextSize} tracking-wide truncate`}>Gestión Académica</span>
                        </div>
                      </li><li>
                          <div onClick={() => { setControlador(5); }} className="cursor-pointer relative flex flex-row items-center h-[10vh] focus:outline-none hover:bg-gray-50 text-gray-600 hover:text-gray-800 border-l-4 border-transparent hover:border-primari pr-6 ">
                            <span className={`inline-flex justify-center items-center ml-4 ${btnIconSize}`}>
                              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" class="w-8 h-8 text-gray-600">
                                <path d="M14.9805 7.01562C14.9805 7.01562 15.4805 7.51562 15.9805 8.51562C15.9805 8.51562 17.5687 6.01562 18.9805 5.51562" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                <path d="M9.99485 2.02141C7.49638 1.91562 5.56612 2.20344 5.56612 2.20344C4.34727 2.29059 2.01146 2.97391 2.01148 6.9646C2.0115 10.9214 1.98564 15.7993 2.01148 17.744C2.01148 18.932 2.7471 21.7034 5.29326 21.8519C8.3881 22.0324 13.9627 22.0708 16.5205 21.8519C17.2051 21.8133 19.4846 21.2758 19.7731 18.7957C20.072 16.2264 20.0125 14.4407 20.0125 14.0157" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                <path d="M21.9999 7.01562C21.9999 9.77705 19.7591 12.0156 16.995 12.0156C14.231 12.0156 11.9902 9.77705 11.9902 7.01562C11.9902 4.2542 14.231 2.01562 16.995 2.01562C19.7591 2.01562 21.9999 4.2542 21.9999 7.01562Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
                                <path d="M6.98047 13.0156H10.9805" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
                                <path d="M6.98047 17.0156H14.9805" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
                              </svg>
                            </span>
                            <span className={`ml-2 ${btnTextSize} tracking-wide truncate`}>Gestión Documental</span>
                          </div>
                        </li></>
                    </>
                  ) : controlador == 1 ?
                    (rol == 1 ? (
                      <>
                        <li className="px-4">
                          <div className="flex flex-row items-center h-8">
                            <div className="text-sm font-light tracking-wide text-gray-500">
                              Asesorías
                            </div>
                          </div>
                        </li>
                        <li >
                          <div onClick={() => { setControlador(0); }} className="cursor-pointer relative flex flex-row items-center h-[10vh] focus:outline-none hover:bg-gray-50 text-gray-600 hover:text-gray-800 border-l-4 border-transparent hover:border-primari pr-6 ">
                            <span className={`inline-flex justify-center items-center ml-4 ${btnIconSize}`}>
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-8 h-8 text-gray-600">
                                <path stroke-linecap="round" stroke-linejoin="round" d="m11.25 9-3 3m0 0 3 3m-3-3h7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                              </svg>
                            </span>
                            <span className={`ml-2 ${btnTextSize} tracking-wide truncate`}>Atrás</span>
                          </div>
                        </li>
                        <li>
                          <a href="/component/asesorias/visualizar/estudiante" className="cursor-pointer relative flex flex-row items-center h-[10vh] focus:outline-none hover:bg-gray-50 text-gray-600 hover:text-gray-800 border-l-4 border-transparent hover:border-primari pr-6 ">
                            <span className={`inline-flex justify-center items-center ml-4 ${btnIconSize}`}>
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-8 h-8 text-gray-600">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                                <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                              </svg>
                            </span>
                            <span className={`ml-2 ${btnTextSize} tracking-wide truncate`}>Visualizar Asesorías</span>
                          </a>
                        </li>
                        <li>
                          <a href="/component/asesorias/visualizar/agendar" className="cursor-pointer relative flex flex-row items-center h-[10vh] focus:outline-none hover:bg-gray-50 text-gray-600 hover:text-gray-800 border-l-4 border-transparent hover:border-primari pr-6 ">
                            <span className={`inline-flex justify-center items-center ml-4 ${btnIconSize}`}>
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-8 h-8 text-gray-600">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                              </svg>
                            </span>
                            <span className={`ml-2 ${btnTextSize} tracking-wide truncate`}>Agendar Asesorías</span>
                          </a>
                        </li>
                      </>
                    ) :
                      rol == 3 || rol == 5 ? (
                        <>
                          <li className="px-4">
                            <div className="flex flex-row items-center h-8">
                              <div className="text-sm font-light tracking-wide text-gray-500">
                                Asesorías
                              </div>
                            </div>
                          </li><li >
                            <div onClick={() => { setControlador(0); }} className="cursor-pointer relative flex flex-row items-center h-[10vh] focus:outline-none hover:bg-gray-50 text-gray-600 hover:text-gray-800 border-l-4 border-transparent hover:border-primari pr-6 ">
                              <span className={`inline-flex justify-center items-center ml-4 ${btnIconSize}`}>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-8 h-8 text-gray-600">
                                  <path stroke-linecap="round" stroke-linejoin="round" d="m11.25 9-3 3m0 0 3 3m-3-3h7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                </svg>
                              </span>
                              <span className={`ml-2 ${btnTextSize} tracking-wide truncate`}>Atrás</span>
                            </div>
                          </li>
                          <li>
                            <a href="/component/asesorias/crear" className="cursor-pointer relative flex flex-row items-center h-[10vh] focus:outline-none hover:bg-gray-50 text-gray-600 hover:text-gray-800 border-l-4 border-transparent hover:border-primari pr-6 ">
                              <span className={`inline-flex justify-center items-center ml-4 ${btnIconSize}`}>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-8 h-8 text-gray-600">
                                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                </svg>
                              </span>
                              <span className={`ml-2 ${btnTextSize} tracking-wide truncate`}>Crear Asesorías</span>
                            </a>
                          </li>
                          <li>
                            <a href="/component/asesorias/visualizar/asesor" className="cursor-pointer relative flex flex-row items-center h-[10vh] focus:outline-none hover:bg-gray-50 text-gray-600 hover:text-gray-800 border-l-4 border-transparent hover:border-primari pr-6 ">
                              <span className={`inline-flex justify-center items-center ml-4 ${btnIconSize}`}>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-8 h-8 text-gray-600">
                                  <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                                  <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                </svg>
                              </span>
                              <span className={`ml-2 ${btnTextSize} tracking-wide truncate`}>Visualizar Asesorías</span>
                            </a>
                          </li>
                        </>) :
                        rol == 4 ? (
                          <>
                            <li className="px-4">
                              <div className="flex flex-row items-center h-8">
                                <div className="text-sm font-light tracking-wide text-gray-500">
                                  Asesorías
                                </div>
                              </div>
                            </li><li >
                              <div onClick={() => { setControlador(0); }} className="cursor-pointer relative flex flex-row items-center h-[10vh] focus:outline-none hover:bg-gray-50 text-gray-600 hover:text-gray-800 border-l-4 border-transparent hover:border-primari pr-6 ">
                                <span className={`inline-flex justify-center items-center ml-4 ${btnIconSize}`}>
                                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-8 h-8 text-gray-600">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="m11.25 9-3 3m0 0 3 3m-3-3h7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                  </svg>
                                </span>
                                <span className={`ml-2 ${btnTextSize} tracking-wide truncate`}>Atrás</span>
                              </div>
                            </li>
                            <li>
                              <a href="/component/asesorias/visualizar/coordinador" className="cursor-pointer relative flex flex-row items-center h-[10vh] focus:outline-none hover:bg-gray-50 text-gray-600 hover:text-gray-800 border-l-4 border-transparent hover:border-primari pr-6 ">
                                <span className={`inline-flex justify-center items-center ml-4 ${btnIconSize}`}>
                                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-8 h-8 text-gray-600">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                  </svg>
                                </span>
                                <span className={`ml-2 ${btnTextSize} tracking-wide truncate`}>Visualizar Asesorías</span>
                              </a>
                            </li>
                          </>) : (null)
                    )
                    : controlador == 2 ? (
                      rol == 1 ? (
                        <><li className="px-4">
                          <div className="flex flex-row items-center h-8">
                            <div className="text-sm font-light tracking-wide text-gray-500">Bitácoras</div>
                          </div>
                        </li>
                          <li onClick={() => { setControlador(0); }}>
                            <div className="cursor-pointer relative flex flex-row items-center h-[10vh] focus:outline-none hover:bg-gray-50 text-gray-600 hover:text-gray-800 border-l-4 border-transparent hover:border-primari pr-6">
                              <span className={`inline-flex justify-center items-center ml-4 ${btnIconSize}`}>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-8 h-8 text-gray-600">
                                  <path stroke-linecap="round" stroke-linejoin="round" d="m11.25 9-3 3m0 0 3 3m-3-3h7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                </svg>

                              </span>
                              <span className={`ml-2 ${btnTextSize} tracking-wide truncate`}>Atrás</span>
                            </div>
                          </li>
                          <li>
                            <a href="/component/bitacora/visualizar/estudiante" className="cursor-pointer relative flex flex-row items-center h-[10vh] focus:outline-none hover:bg-gray-50 text-gray-600 hover:text-gray-800 border-l-4 border-transparent hover:border-primari pr-6">
                              <span className={`inline-flex justify-center items-center ml-4 ${btnIconSize}`}>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-8 h-8 text-gray-600">
                                  <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                                </svg>
                              </span>
                              <span className={`ml-2 ${btnTextSize} tracking-wide truncate`}>Visualizar Bitácora</span>
                            </a>
                          </li></>
                      ) : rol == 2 || rol == 5 ? (
                        <><li className="px-4">
                          <div className="flex flex-row items-center h-8">
                            <div className="text-sm font-light tracking-wide text-gray-500">Bitácoras</div>
                          </div>
                        </li><li onClick={() => { setControlador(0); }}>
                            <div className="cursor-pointer relative flex flex-row items-center h-[10vh] focus:outline-none hover:bg-gray-50 text-gray-600 hover:text-gray-800 border-l-4 border-transparent hover:border-primari pr-6">
                              <span className={`inline-flex justify-center items-center ml-4 ${btnIconSize}`}>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-8 h-8 text-gray-600">
                                  <path stroke-linecap="round" stroke-linejoin="round" d="m11.25 9-3 3m0 0 3 3m-3-3h7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                </svg>

                              </span>
                              <span className={`ml-2 ${btnTextSize} tracking-wide truncate`}>Atrás</span>
                            </div>
                          </li>
                          <li>
                            <a href="/component/bitacora/visualizar/modSol" className="cursor-pointer relative flex flex-row items-center h-[10vh] focus:outline-none hover:bg-gray-50 text-gray-600 hover:text-gray-800 border-l-4 border-transparent hover:border-primari pr-6">
                              <span className={`inline-flex justify-center items-center ml-4 ${btnIconSize}`}>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-8 h-8 text-gray-600">
                                  <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m3.75 9v6m3-3H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                                </svg>
                              </span>
                              <span className={`ml-2 ${btnTextSize} tracking-wide truncate`}>Crear Bitácora</span>
                            </a>
                          </li>
                          <li>
                            <a href="/component/bitacora/visualizar/asesor" className="cursor-pointer relative flex flex-row items-center h-[10vh] focus:outline-none hover:bg-gray-50 text-gray-600 hover:text-gray-800 border-l-4 border-transparent hover:border-primari pr-6">
                              <span className={`inline-flex justify-center items-center ml-4 ${btnIconSize}`}>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-8 h-8 text-gray-600">
                                  <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                                </svg>
                              </span>
                              <span className={`ml-2 ${btnTextSize} tracking-wide truncate`}>Visualizar Bitácora</span>
                            </a>
                          </li>
                        </>
                      ) : rol == 3 || rol == 5 ? (
                        <><li className="px-4">
                          <div className="flex flex-row items-center h-8">
                            <div className="text-sm font-light tracking-wide text-gray-500">Bitácoras</div>
                          </div>
                        </li><li onClick={() => { setControlador(0); }}>
                            <div className="cursor-pointer relative flex flex-row items-center h-[10vh] focus:outline-none hover:bg-gray-50 text-gray-600 hover:text-gray-800 border-l-4 border-transparent hover:border-primari pr-6">
                              <span className={`inline-flex justify-center items-center ml-4 ${btnIconSize}`}>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-8 h-8 text-gray-600">
                                  <path stroke-linecap="round" stroke-linejoin="round" d="m11.25 9-3 3m0 0 3 3m-3-3h7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                </svg>

                              </span>
                              <span className={`ml-2 ${btnTextSize} tracking-wide truncate`}>Atrás</span>
                            </div>
                          </li>

                          <li>
                            <a href="/component/bitacora/visualizar/asesor" className="cursor-pointer relative flex flex-row items-center h-[10vh] focus:outline-none hover:bg-gray-50 text-gray-600 hover:text-gray-800 border-l-4 border-transparent hover:border-primari pr-6">
                              <span className={`inline-flex justify-center items-center ml-4 ${btnIconSize}`}>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-8 h-8 text-gray-600">
                                  <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                                </svg>
                              </span>
                              <span className={`ml-2 ${btnTextSize} tracking-wide truncate`}>Visualizar Bitácora</span>
                            </a>
                          </li>
                        </>
                      ) : rol == 4 ? (
                        <><li className="px-4">
                          <div className="flex flex-row items-center h-8">
                            <div className="text-sm font-light tracking-wide text-gray-500">Bitácoras</div>
                          </div>
                        </li><li onClick={() => { setControlador(0); }}>
                            <div className="cursor-pointer relative flex flex-row items-center h-[10vh] focus:outline-none hover:bg-gray-50 text-gray-600 hover:text-gray-800 border-l-4 border-transparent hover:border-primari pr-6">
                              <span className={`inline-flex justify-center items-center ml-4 ${btnIconSize}`}>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-8 h-8 text-gray-600">
                                  <path stroke-linecap="round" stroke-linejoin="round" d="m11.25 9-3 3m0 0 3 3m-3-3h7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                </svg>

                              </span>
                              <span className={`ml-2 ${btnTextSize} tracking-wide truncate`}>Atrás</span>
                            </div>
                          </li>
                          <li>
                            <a href="/component/bitacora/visualizar/asesor" className="cursor-pointer relative flex flex-row items-center h-[10vh] focus:outline-none hover:bg-gray-50 text-gray-600 hover:text-gray-800 border-l-4 border-transparent hover:border-primari pr-6">
                              <span className={`inline-flex justify-center items-center ml-4 ${btnIconSize}`}>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-8 h-8 text-gray-600">
                                  <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                                </svg>
                              </span>
                              <span className={`ml-2 ${btnTextSize} tracking-wide truncate`}>Visualizar Bitacora</span>
                            </a>
                          </li>
                        </>
                      ) : (null)
                    ) : controlador == 3 ? (
                      <><li className="px-4">
                        <div className="flex flex-row items-center h-8">
                          <div className="text-sm font-light tracking-wide text-gray-500">Administrar</div>
                        </div>
                      </li>
                        <li onClick={() => { setControlador(0) }}>
                          <div className="cursor-pointer relative flex flex-row items-center h-[10vh] focus:outline-none hover:bg-gray-50 text-gray-600 hover:text-gray-800 border-l-4 border-transparent hover:border-primari pr-6">
                            <span className={`inline-flex justify-center items-center ml-4 ${btnIconSize}`}>
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-8 h-8 text-gray-600">
                                <path stroke-linecap="round" stroke-linejoin="round" d="m11.25 9-3 3m0 0 3 3m-3-3h7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                              </svg>

                            </span>
                            <span className={`ml-2 ${btnTextSize} tracking-wide truncate`}>Atrás</span>
                          </div>
                        </li>
                        <li>
                          <a href="/component/coordinador/horasAsesores" className="cursor-pointer relative flex flex-row items-center h-[10vh] focus:outline-none hover:bg-gray-50 text-gray-600 hover:text-gray-800 border-l-4 border-transparent hover:border-primari pr-6">
                            <span className={`inline-flex justify-center items-center ml-4 ${btnIconSize}`}>
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-8 h-8 text-gray-600">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                              </svg>
                            </span>
                            <span className={`ml-2 ${btnTextSize} tracking-wide truncate`}>Horas asesores</span>
                          </a>
                        </li>
                        <li>
                          <a href="/component/coordinador/semanas" className="cursor-pointer relative flex flex-row items-center h-[10vh] focus:outline-none hover:bg-gray-50 text-gray-600 hover:text-gray-800 border-l-4 border-transparent hover:border-primari pr-6">
                            <span className={`inline-flex justify-center items-center ml-4 ${btnIconSize}`}>
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-8 h-8 text-gray-600">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5m-9-6h.008v.008H12v-.008ZM12 15h.008v.008H12V15Zm0 2.25h.008v.008H12v-.008ZM9.75 15h.008v.008H9.75V15Zm0 2.25h.008v.008H9.75v-.008ZM7.5 15h.008v.008H7.5V15Zm0 2.25h.008v.008H7.5v-.008Zm6.75-4.5h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V15Zm0 2.25h.008v.008h-.008v-.008Zm2.25-4.5h.008v.008H16.5v-.008Zm0 2.25h.008v.008H16.5V15Z" />
                              </svg>
                            </span>
                            <span className={`ml-2 ${btnTextSize} tracking-wide truncate`}>Semanas</span>
                          </a>
                        </li>
                        <li>
                          <a href="/component/banner/administrar" className="cursor-pointer relative flex flex-row items-center h-[10vh] focus:outline-none hover:bg-gray-50 text-gray-600 hover:text-gray-800 border-l-4 border-transparent hover:border-primari pr-6">
                            <span className={`inline-flex justify-center items-center ml-4 ${btnIconSize}`}>
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-8 h-8 text-gray-600">
                                <path stroke-linecap="round" stroke-linejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                              </svg>
                            </span>
                            <span className={`ml-2 ${btnTextSize} tracking-wide truncate`}>Contenido</span>
                          </a>
                        </li>
                        <li>
                          <a href="/component/bitacora/visualizar/coordinador/exportar" className="cursor-pointer relative flex flex-row items-center h-[10vh] focus:outline-none hover:bg-gray-50 text-gray-600 hover:text-gray-800 border-l-4 border-transparent hover:border-primari pr-6">
                            <span className={`inline-flex justify-center items-center ml-4 ${btnIconSize}`}>
                              <svg xmlns="http://www.w3.org/2000/svg" stroke="currentColor" class="w-8 h-8 text-gray-600" viewBox="0 0 50 50">
                                <path d="M 28.875 0 C 28.855469 0.0078125 28.832031 0.0195313 28.8125 0.03125 L 0.8125 5.34375 C 0.335938 5.433594 -0.0078125 5.855469 0 6.34375 L 0 43.65625 C -0.0078125 44.144531 0.335938 44.566406 0.8125 44.65625 L 28.8125 49.96875 C 29.101563 50.023438 29.402344 49.949219 29.632813 49.761719 C 29.859375 49.574219 29.996094 49.296875 30 49 L 30 44 L 47 44 C 48.09375 44 49 43.09375 49 42 L 49 8 C 49 6.90625 48.09375 6 47 6 L 30 6 L 30 1 C 30.003906 0.710938 29.878906 0.4375 29.664063 0.246094 C 29.449219 0.0546875 29.160156 -0.0351563 28.875 0 Z M 28 2.1875 L 28 6.53125 C 27.867188 6.808594 27.867188 7.128906 28 7.40625 L 28 42.8125 C 27.972656 42.945313 27.972656 43.085938 28 43.21875 L 28 47.8125 L 2 42.84375 L 2 7.15625 Z M 30 8 L 47 8 L 47 42 L 30 42 L 30 37 L 34 37 L 34 35 L 30 35 L 30 29 L 34 29 L 34 27 L 30 27 L 30 22 L 34 22 L 34 20 L 30 20 L 30 15 L 34 15 L 34 13 L 30 13 Z M 36 13 L 36 15 L 44 15 L 44 13 Z M 6.6875 15.6875 L 12.15625 25.03125 L 6.1875 34.375 L 11.1875 34.375 L 14.4375 28.34375 C 14.664063 27.761719 14.8125 27.316406 14.875 27.03125 L 14.90625 27.03125 C 15.035156 27.640625 15.160156 28.054688 15.28125 28.28125 L 18.53125 34.375 L 23.5 34.375 L 17.75 24.9375 L 23.34375 15.6875 L 18.65625 15.6875 L 15.6875 21.21875 C 15.402344 21.941406 15.199219 22.511719 15.09375 22.875 L 15.0625 22.875 C 14.898438 22.265625 14.710938 21.722656 14.5 21.28125 L 11.8125 15.6875 Z M 36 20 L 36 22 L 44 22 L 44 20 Z M 36 27 L 36 29 L 44 29 L 44 27 Z M 36 35 L 36 37 L 44 37 L 44 35 Z"></path>
                              </svg>
                            </span>
                            <span className={`ml-2 ${btnTextSize} tracking-wide truncate`}>Exportar</span>
                          </a>
                        </li>
                        <li>
                          <a href="/component/coordinador/limpiarSistema" className="cursor-pointer relative flex flex-row items-center h-[10vh] focus:outline-none hover:bg-gray-50 text-gray-600 hover:text-gray-800 border-l-4 border-transparent hover:border-primari pr-6">
                            <span className={`inline-flex justify-center items-center ml-4 ${btnIconSize}`}>
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-8 h-8 text-gray-600">
                                <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                              </svg>
                            </span>
                            <span className={`ml-2 ${btnTextSize} tracking-wide truncate`}>Limpiar sistema</span>
                          </a>
                        </li>
                      </>
                    ) : controlador == 4 ? (
                      <>
                        {rol == 1 ? (
                          <><li className="px-4">
                            <div className="flex flex-row items-center h-8">
                              <div className="text-sm font-light tracking-wide text-gray-500">Gestión Académica</div>
                            </div>
                          </li><li onClick={() => { setControlador(0); }}>
                              <div className="cursor-pointer relative flex flex-row items-center h-[10vh] focus:outline-none hover:bg-gray-50 text-gray-600 hover:text-gray-800 border-l-4 border-transparent hover:border-primari pr-6">
                                <span className={`inline-flex justify-center items-center ml-4 ${btnIconSize}`}>
                                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-8 h-8 text-gray-600">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="m11.25 9-3 3m0 0 3 3m-3-3h7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                  </svg>

                                </span>
                                <span className={`ml-2 ${btnTextSize} tracking-wide truncate`}>Atrás</span>
                              </div>
                            </li><li>
                              <a href="/component/estudiante/verNotas" className="cursor-pointer relative flex flex-row items-center h-[10vh] focus:outline-none hover:bg-gray-50 text-gray-600 hover:text-gray-800 border-l-4 border-transparent hover:border-primari pr-6">
                                <span className={`inline-flex justify-center items-center ml-4 ${btnIconSize}`}>
                                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" class="w-8 h-8 text-gray-600" fill="none">
                                    <path d="M7.50304 4C7.48421 3.62851 7.55185 3.34156 7.73579 3.1C8.19267 2.5 9.12335 2.5 10.9847 2.5H13.0153C14.8766 2.5 15.8073 2.5 16.2642 3.1C16.4481 3.34156 16.5158 3.62851 16.497 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                    <path d="M5 8C5.03784 7.74037 5.12478 7.51593 5.26968 7.31431C5.85493 6.5 7.0681 6.5 9.49444 6.5H14.5056C16.9319 6.5 18.1451 6.5 18.7303 7.31431C18.8752 7.51593 18.9622 7.74037 19 8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                    <path d="M3.81753 15.7128L4.53641 18.016C5.43193 20.8852 6.19729 21.5 9.21027 21.5H14.7897C17.8027 21.5 18.5681 20.8852 19.4636 18.016L20.1825 15.7128C20.9261 13.3303 21.2979 12.139 20.7101 11.3195C20.1223 10.5 18.896 10.5 16.4434 10.5H7.55662C5.104 10.5 3.8777 10.5 3.28988 11.3195C2.70207 12.139 3.07389 13.3303 3.81753 15.7128Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                    <path d="M15 14C15 15.1046 14.1046 16 13 16H11C9.89543 16 9 15.1046 9 14" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />

                                  </svg>
                                </span>
                                <span className={`ml-2 ${btnTextSize} tracking-wide truncate`}>Ver Notas</span>
                              </a>
                            </li>
                          </>
                        ) : rol == 3 || rol == 5 ? (<>
                          <li className="px-4">
                            <div className="flex flex-row items-center h-8">
                              <div className="text-sm font-light tracking-wide text-gray-500">Gestión Académica</div>
                            </div>
                          </li><li onClick={() => { setControlador(0); }}>
                            <div className="cursor-pointer relative flex flex-row items-center h-[10vh] focus:outline-none hover:bg-gray-50 text-gray-600 hover:text-gray-800 border-l-4 border-transparent hover:border-primari pr-6">
                              <span className={`inline-flex justify-center items-center ml-4 ${btnIconSize}`}>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-8 h-8 text-gray-600">
                                  <path stroke-linecap="round" stroke-linejoin="round" d="m11.25 9-3 3m0 0 3 3m-3-3h7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                </svg>

                              </span>
                              <span className={`ml-2 ${btnTextSize} tracking-wide truncate`}>Atrás</span>
                            </div>
                          </li><li>
                            <a href="/component/asesor/calificarEntregas" className="cursor-pointer relative flex flex-row items-center h-[10vh] focus:outline-none hover:bg-gray-50 text-gray-600 hover:text-gray-800 border-l-4 border-transparent hover:border-primari pr-6">
                              <span className={`inline-flex justify-center items-center ml-4 ${btnIconSize}`}>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" class="w-8 h-8 text-gray-600">
                                  <path d="M11.0215 6.78662V19.7866" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
                                  <path d="M11 19.5C10.7777 19.5 10.3235 19.2579 9.41526 18.7738C8.4921 18.2818 7.2167 17.7922 5.5825 17.4849C3.74929 17.1401 2.83268 16.9678 2.41634 16.4588C2 15.9499 2 15.1347 2 13.5044V7.09655C2 5.31353 2 4.42202 2.6487 3.87302C3.29741 3.32401 4.05911 3.46725 5.5825 3.75372C8.58958 4.3192 10.3818 5.50205 11 6.18114C11.6182 5.50205 13.4104 4.3192 16.4175 3.75372C17.9409 3.46725 18.7026 3.32401 19.3513 3.87302C20 4.42202 20 5.31353 20 7.09655V10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                  <path d="M20.8638 12.9393L21.5589 13.6317C22.147 14.2174 22.147 15.1672 21.5589 15.7529L17.9171 19.4485C17.6306 19.7338 17.2642 19.9262 16.8659 20.0003L14.6088 20.4883C14.2524 20.5653 13.9351 20.2502 14.0114 19.895L14.4919 17.6598C14.5663 17.2631 14.7594 16.8981 15.0459 16.6128L18.734 12.9393C19.3222 12.3536 20.2757 12.3536 20.8638 12.9393Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                </svg>
                              </span>
                              <span className={`ml-2 ${btnTextSize} tracking-wide truncate`}>Calificar Entregas</span>
                            </a>
                          </li><li>
                            <a href="/component/asesor/calificarAsesoria" className="cursor-pointer relative flex flex-row items-center h-[10vh] focus:outline-none hover:bg-gray-50 text-gray-600 hover:text-gray-800 border-l-4 border-transparent hover:border-primari pr-6">
                              <span className={`inline-flex justify-center items-center ml-4 ${btnIconSize}`}>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" class="w-8 h-8 text-gray-600">
                                  <path d="M14.5995 20.4737L7.63427 21.7672C6.2983 22.0153 5.63031 22.1393 5.24549 21.7545C4.86067 21.3697 4.98471 20.7016 5.2328 19.3656L6.52621 12.4001C6.73362 11.2831 6.83732 10.7246 7.20549 10.3872C7.57365 10.0497 8.24697 9.98389 9.59359 9.85218C10.8915 9.72524 12.1197 9.28032 13.4 8L19 13.6005C17.7197 14.8808 17.2746 16.1083 17.1474 17.4062C17.0155 18.753 16.9495 19.4264 16.6121 19.7945C16.2747 20.1626 15.7163 20.2663 14.5995 20.4737Z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round" />
                                  <path d="M13 16.2105C12.4405 16.1197 11.9289 15.8763 11.5263 15.4737M11.5263 15.4737C11.1237 15.0711 10.8803 14.5595 10.7895 14M11.5263 15.4737L6 21" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
                                  <path d="M13.5 8C14.1332 7.06586 15.4907 5.16107 16.7613 5.00976C17.6287 4.90648 18.3472 5.62499 19.7842 7.06202L19.938 7.2158C21.375 8.65283 22.0935 9.37135 21.9902 10.2387C21.8389 11.5092 19.9341 12.8668 19 13.5" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round" />
                                  <path d="M5 8L5 2M2 5H8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
                                </svg>
                              </span>
                              <span className={`ml-2 ${btnTextSize} tracking-wide truncate`}>Calificar Asesoría</span>
                            </a>
                          </li><li>
                            <a href="/component/asesor/verNotas" className="cursor-pointer relative flex flex-row items-center h-[10vh] focus:outline-none hover:bg-gray-50 text-gray-600 hover:text-gray-800 border-l-4 border-transparent hover:border-primari pr-6">
                              <span className={`inline-flex justify-center items-center ml-4 ${btnIconSize}`}>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="#000000" fill="none">
                                  <path d="M17 2V4M12 2V4M7 2V4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                  <path d="M3.5 10C3.5 6.70017 3.5 5.05025 4.52513 4.02513C5.55025 3 7.20017 3 10.5 3H13.5C16.7998 3 18.4497 3 19.4749 4.02513C20.5 5.05025 20.5 6.70017 20.5 10V15C20.5 18.2998 20.5 19.9497 19.4749 20.9749C18.4497 22 16.7998 22 13.5 22H10.5C7.20017 22 5.55025 22 4.52513 20.9749C3.5 19.9497 3.5 18.2998 3.5 15V10Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                  <path d="M13.5 16H17" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
                                  <path d="M13.5 9H17" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
                                  <path d="M7 10C7 10 7.5 10 8 11C8 11 9.58824 8.5 11 8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                  <path d="M7 17C7 17 7.5 17 8 18C8 18 9.58824 15.5 11 15" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                </svg>
                              </span>
                              <span className={`ml-2 ${btnTextSize} tracking-wide truncate`}>Ver Notas</span>
                            </a>
                          </li></>) : rol == 2 || rol == 5 ? (<>
                            <li className="px-4">
                              <div className="flex flex-row items-center h-8">
                                <div className="text-sm font-light tracking-wide text-gray-500">Gestión Académica</div>
                              </div>
                            </li><li onClick={() => { setControlador(0); }}>
                              <div className="cursor-pointer relative flex flex-row items-center h-[10vh] focus:outline-none hover:bg-gray-50 text-gray-600 hover:text-gray-800 border-l-4 border-transparent hover:border-primari pr-6">
                                <span className={`inline-flex justify-center items-center ml-4 ${btnIconSize}`}>
                                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-8 h-8 text-gray-600">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="m11.25 9-3 3m0 0 3 3m-3-3h7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                  </svg>

                                </span>
                                <span className={`ml-2 ${btnTextSize} tracking-wide truncate`}>Atrás</span>
                              </div>
                            </li><li>
                              <a href="/component/docente/calificarEntregas" className="cursor-pointer relative flex flex-row items-center h-[10vh] focus:outline-none hover:bg-gray-50 text-gray-600 hover:text-gray-800 border-l-4 border-transparent hover:border-primari pr-6">
                                <span className={`inline-flex justify-center items-center ml-4 ${btnIconSize}`}>
                                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" class="w-8 h-8 text-gray-600">
                                    <path d="M11.0215 6.78662V19.7866" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
                                    <path d="M11 19.5C10.7777 19.5 10.3235 19.2579 9.41526 18.7738C8.4921 18.2818 7.2167 17.7922 5.5825 17.4849C3.74929 17.1401 2.83268 16.9678 2.41634 16.4588C2 15.9499 2 15.1347 2 13.5044V7.09655C2 5.31353 2 4.42202 2.6487 3.87302C3.29741 3.32401 4.05911 3.46725 5.5825 3.75372C8.58958 4.3192 10.3818 5.50205 11 6.18114C11.6182 5.50205 13.4104 4.3192 16.4175 3.75372C17.9409 3.46725 18.7026 3.32401 19.3513 3.87302C20 4.42202 20 5.31353 20 7.09655V10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                    <path d="M20.8638 12.9393L21.5589 13.6317C22.147 14.2174 22.147 15.1672 21.5589 15.7529L17.9171 19.4485C17.6306 19.7338 17.2642 19.9262 16.8659 20.0003L14.6088 20.4883C14.2524 20.5653 13.9351 20.2502 14.0114 19.895L14.4919 17.6598C14.5663 17.2631 14.7594 16.8981 15.0459 16.6128L18.734 12.9393C19.3222 12.3536 20.2757 12.3536 20.8638 12.9393Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                  </svg>
                                </span>
                                <span className={`ml-2 ${btnTextSize} tracking-wide truncate`}>Calificar Entregas</span>
                              </a>
                            </li>

                          </>) : rol == 4 ? (
                            <><li className="px-4">
                              <div className="flex flex-row items-center h-8">
                                <div className="text-sm font-light tracking-wide text-gray-500">Gestión Académica</div>
                              </div>
                            </li><li onClick={() => { setControlador(0); }}>
                                <div className="cursor-pointer relative flex flex-row items-center h-[10vh] focus:outline-none hover:bg-gray-50 text-gray-600 hover:text-gray-800 border-l-4 border-transparent hover:border-primari pr-6">
                                  <span className={`inline-flex justify-center items-center ml-4 ${btnIconSize}`}>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-8 h-8 text-gray-600">
                                      <path stroke-linecap="round" stroke-linejoin="round" d="m11.25 9-3 3m0 0 3 3m-3-3h7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                    </svg>

                                  </span>
                                  <span className={`ml-2 ${btnTextSize} tracking-wide truncate`}>Atrás</span>
                                </div>
                              </li>
                              <li>
                                <a href="/component/coordinador/calificarEntregas" className="cursor-pointer relative flex flex-row items-center h-[10vh] focus:outline-none hover:bg-gray-50 text-gray-600 hover:text-gray-800 border-l-4 border-transparent hover:border-primari pr-6">
                                  <span className={`inline-flex justify-center items-center ml-4 ${btnIconSize}`}>
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" class="w-8 h-8 text-gray-600" fill="none">
                                      <path d="M11.0215 6.78662V19.7866" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
                                      <path d="M11 19.5C10.7777 19.5 10.3235 19.2579 9.41526 18.7738C8.4921 18.2818 7.2167 17.7922 5.5825 17.4849C3.74929 17.1401 2.83268 16.9678 2.41634 16.4588C2 15.9499 2 15.1347 2 13.5044V7.09655C2 5.31353 2 4.42202 2.6487 3.87302C3.29741 3.32401 4.05911 3.46725 5.5825 3.75372C8.58958 4.3192 10.3818 5.50205 11 6.18114C11.6182 5.50205 13.4104 4.3192 16.4175 3.75372C17.9409 3.46725 18.7026 3.32401 19.3513 3.87302C20 4.42202 20 5.31353 20 7.09655V10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                      <path d="M20.8638 12.9393L21.5589 13.6317C22.147 14.2174 22.147 15.1672 21.5589 15.7529L17.9171 19.4485C17.6306 19.7338 17.2642 19.9262 16.8659 20.0003L14.6088 20.4883C14.2524 20.5653 13.9351 20.2502 14.0114 19.895L14.4919 17.6598C14.5663 17.2631 14.7594 16.8981 15.0459 16.6128L18.734 12.9393C19.3222 12.3536 20.2757 12.3536 20.8638 12.9393Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                    </svg>
                                  </span>
                                  <span className={`ml-2 ${btnTextSize} tracking-wide truncate`}>Calificar Entregas</span>
                                </a>
                              </li>
                              <li>
                                <a href="/component/coordinador/verNotas" className="cursor-pointer relative flex flex-row items-center h-[10vh] focus:outline-none hover:bg-gray-50 text-gray-600 hover:text-gray-800 border-l-4 border-transparent hover:border-primari pr-6">
                                  <span className={`inline-flex justify-center items-center ml-4 ${btnIconSize}`}>
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" class="w-8 h-8 text-gray-600" fill="none">
                                      <path d="M2 16C2 13.6611 2 12.4917 2.53647 11.6379C2.81621 11.1927 3.19267 10.8162 3.63789 10.5365C4.49167 10 5.66111 10 8 10H16C18.3389 10 19.5083 10 20.3621 10.5365C20.8073 10.8162 21.1838 11.1927 21.4635 11.6379C22 12.4917 22 13.6611 22 16C22 18.3389 22 19.5083 21.4635 20.3621C21.1838 20.8073 20.8073 21.1838 20.3621 21.4635C19.5083 22 18.3389 22 16 22H8C5.66111 22 4.49167 22 3.63789 21.4635C3.19267 21.1838 2.81621 20.8073 2.53647 20.3621C2 19.5083 2 18.3389 2 16Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                      <path d="M20 10C20 8.59987 20 7.8998 19.7275 7.36502C19.4878 6.89462 19.1054 6.51217 18.635 6.27248C18.1002 6 17.4001 6 16 6H8C6.59987 6 5.8998 6 5.36502 6.27248C4.89462 6.51217 4.51217 6.89462 4.27248 7.36502C4 7.8998 4 8.59987 4 10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                      <path d="M18 6C18 4.11438 18 3.17157 17.4142 2.58579C16.8284 2 15.8856 2 14 2H10C8.11438 2 7.17157 2 6.58579 2.58579C6 3.17157 6 4.11438 6 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                      <path d="M15 14C15 15.1046 14.1046 16 13 16H11C9.89543 16 9 15.1046 9 14" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
                                    </svg>
                                  </span>
                                  <span className={`ml-2 ${btnTextSize} tracking-wide truncate`}>Ver Notas</span>
                                </a>
                              </li>
                            </>
                          ) : (null)}

                      </>
                    ) : controlador == 5 ? (
                      <>
                        {rol == 1 ? (
                          <><li className="px-4">
                            <div className="flex flex-row items-center h-8">
                              <div className="text-sm font-light tracking-wide text-gray-500">Gestión Documental</div>
                            </div>
                          </li><li onClick={() => { setControlador(0); }}>
                              <div className="cursor-pointer relative flex flex-row items-center h-[10vh] focus:outline-none hover:bg-gray-50 text-gray-600 hover:text-gray-800 border-l-4 border-transparent hover:border-primari pr-6">
                                <span className={`inline-flex justify-center items-center ml-4 ${btnIconSize}`}>
                                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-8 h-8 text-gray-600">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="m11.25 9-3 3m0 0 3 3m-3-3h7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                  </svg>

                                </span>
                                <span className={`ml-2 ${btnTextSize} tracking-wide truncate`}>Atrás</span>
                              </div>
                            </li><li>
                              <a href="/component/estudiante/cargarEntrega" className="cursor-pointer relative flex flex-row items-center h-[10vh] focus:outline-none hover:bg-gray-50 text-gray-600 hover:text-gray-800 border-l-4 border-transparent hover:border-primari pr-6">
                                <span className={`inline-flex justify-center items-center ml-4 ${btnIconSize}`}>
                                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" class="w-8 h-8 text-gray-600" fill="none">
                                    <path d="M2.5 12C2.5 7.52166 2.5 5.28249 3.89124 3.89124C5.28249 2.5 7.52166 2.5 12 2.5C16.4783 2.5 18.7175 2.5 20.1088 3.89124C21.5 5.28249 21.5 7.52166 21.5 12C21.5 16.4783 21.5 18.7175 20.1088 20.1088C18.7175 21.5 16.4783 21.5 12 21.5C7.52166 21.5 5.28249 21.5 3.89124 20.1088C2.5 18.7175 2.5 16.4783 2.5 12Z" stroke="currentColor" stroke-width="1.5" />
                                    <path d="M11.9702 17.0386L11.9702 9.98823M11.9702 9.98823C11.6441 9.98389 11.3224 10.208 11.085 10.4816L9.49553 12.2643M11.9702 9.98823C12.2847 9.99242 12.6034 10.2154 12.8553 10.4816L14.454 12.2643M15.9863 7.03857L7.98633 7.03857" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
                                  </svg>
                                </span>
                                <span className={`ml-2 ${btnTextSize} tracking-wide truncate`}>Cargar Entregas</span>
                              </a>
                            </li>
                          </>
                        ) : rol == 3 || rol == 5 ? (<>
                          <li className="px-4">
                            <div className="flex flex-row items-center h-8">
                              <div className="text-sm font-light tracking-wide text-gray-500">Gestión Documental</div>
                            </div>
                          </li><li onClick={() => { setControlador(0); }}>
                            <div className="cursor-pointer relative flex flex-row items-center h-[10vh] focus:outline-none hover:bg-gray-50 text-gray-600 hover:text-gray-800 border-l-4 border-transparent hover:border-primari pr-6">
                              <span className={`inline-flex justify-center items-center ml-4 ${btnIconSize}`}>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-8 h-8 text-gray-600">
                                  <path stroke-linecap="round" stroke-linejoin="round" d="m11.25 9-3 3m0 0 3 3m-3-3h7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                </svg>

                              </span>
                              <span className={`ml-2 ${btnTextSize} tracking-wide truncate`}>Atrás</span>
                            </div>
                          </li><li>
                            <a href="/component/asesor/calificarEntregas" className="cursor-pointer relative flex flex-row items-center h-[10vh] focus:outline-none hover:bg-gray-50 text-gray-600 hover:text-gray-800 border-l-4 border-transparent hover:border-primari pr-6">
                              <span className={`inline-flex justify-center items-center ml-4 ${btnIconSize}`}>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" class="w-8 h-8 text-gray-600">
                                  <path d="M11.0215 6.78662V19.7866" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
                                  <path d="M11 19.5C10.7777 19.5 10.3235 19.2579 9.41526 18.7738C8.4921 18.2818 7.2167 17.7922 5.5825 17.4849C3.74929 17.1401 2.83268 16.9678 2.41634 16.4588C2 15.9499 2 15.1347 2 13.5044V7.09655C2 5.31353 2 4.42202 2.6487 3.87302C3.29741 3.32401 4.05911 3.46725 5.5825 3.75372C8.58958 4.3192 10.3818 5.50205 11 6.18114C11.6182 5.50205 13.4104 4.3192 16.4175 3.75372C17.9409 3.46725 18.7026 3.32401 19.3513 3.87302C20 4.42202 20 5.31353 20 7.09655V10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                  <path d="M20.8638 12.9393L21.5589 13.6317C22.147 14.2174 22.147 15.1672 21.5589 15.7529L17.9171 19.4485C17.6306 19.7338 17.2642 19.9262 16.8659 20.0003L14.6088 20.4883C14.2524 20.5653 13.9351 20.2502 14.0114 19.895L14.4919 17.6598C14.5663 17.2631 14.7594 16.8981 15.0459 16.6128L18.734 12.9393C19.3222 12.3536 20.2757 12.3536 20.8638 12.9393Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                </svg>
                              </span>
                              <span className={`ml-2 ${btnTextSize} tracking-wide truncate`}>Calificar Entregas</span>
                            </a>
                          </li><li>
                            <a href="/component/asesor/calificarAsesoria" className="cursor-pointer relative flex flex-row items-center h-[10vh] focus:outline-none hover:bg-gray-50 text-gray-600 hover:text-gray-800 border-l-4 border-transparent hover:border-primari pr-6">
                              <span className={`inline-flex justify-center items-center ml-4 ${btnIconSize}`}>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" class="w-8 h-8 text-gray-600">
                                  <path d="M14.5995 20.4737L7.63427 21.7672C6.2983 22.0153 5.63031 22.1393 5.24549 21.7545C4.86067 21.3697 4.98471 20.7016 5.2328 19.3656L6.52621 12.4001C6.73362 11.2831 6.83732 10.7246 7.20549 10.3872C7.57365 10.0497 8.24697 9.98389 9.59359 9.85218C10.8915 9.72524 12.1197 9.28032 13.4 8L19 13.6005C17.7197 14.8808 17.2746 16.1083 17.1474 17.4062C17.0155 18.753 16.9495 19.4264 16.6121 19.7945C16.2747 20.1626 15.7163 20.2663 14.5995 20.4737Z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round" />
                                  <path d="M13 16.2105C12.4405 16.1197 11.9289 15.8763 11.5263 15.4737M11.5263 15.4737C11.1237 15.0711 10.8803 14.5595 10.7895 14M11.5263 15.4737L6 21" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
                                  <path d="M13.5 8C14.1332 7.06586 15.4907 5.16107 16.7613 5.00976C17.6287 4.90648 18.3472 5.62499 19.7842 7.06202L19.938 7.2158C21.375 8.65283 22.0935 9.37135 21.9902 10.2387C21.8389 11.5092 19.9341 12.8668 19 13.5" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round" />
                                  <path d="M5 8L5 2M2 5H8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
                                </svg>
                              </span>
                              <span className={`ml-2 ${btnTextSize} tracking-wide truncate`}>Calificar Asesoría</span>
                            </a>
                          </li></>) : rol == 2 || rol == 5 ? (<>
                            <li className="px-4">
                              <div className="flex flex-row items-center h-8">
                                <div className="text-sm font-light tracking-wide text-gray-500">Gestión Documental</div>
                              </div>
                            </li>
                            <li onClick={() => { setControlador(0); }}>
                              <div className="cursor-pointer relative flex flex-row items-center h-[10vh] focus:outline-none hover:bg-gray-50 text-gray-600 hover:text-gray-800 border-l-4 border-transparent hover:border-primari pr-6">
                                <span className={`inline-flex justify-center items-center ml-4 ${btnIconSize}`}>
                                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-8 h-8 text-gray-600">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="m11.25 9-3 3m0 0 3 3m-3-3h7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                  </svg>

                                </span>
                                <span className={`ml-2 ${btnTextSize} tracking-wide truncate`}>Atrás</span>
                              </div>
                            </li><li>
                              <a href="/component/docente/verEquipos" className="cursor-pointer relative flex flex-row items-center h-[10vh] focus:outline-none hover:bg-gray-50 text-gray-600 hover:text-gray-800 border-l-4 border-transparent hover:border-primari pr-6">
                                <span className={`inline-flex justify-center items-center ml-4 ${btnIconSize}`}>
                                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" class="w-8 h-8 text-gray-600" fill="none">
                                    <path d="M20.774 18C21.5233 18 22.1193 17.5285 22.6545 16.8691C23.7499 15.5194 21.9513 14.4408 21.2654 13.9126C20.568 13.3756 19.7894 13.0714 19 13M18 11C19.3807 11 20.5 9.88071 20.5 8.5C20.5 7.11929 19.3807 6 18 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
                                    <path d="M3.22596 18C2.47666 18 1.88067 17.5285 1.34555 16.8691C0.250089 15.5194 2.04867 14.4408 2.73465 13.9126C3.43197 13.3756 4.21058 13.0714 5 13M5.5 11C4.11929 11 3 9.88071 3 8.5C3 7.11929 4.11929 6 5.5 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
                                    <path d="M8.0838 15.1112C7.06203 15.743 4.38299 17.0331 6.0147 18.6474C6.81178 19.436 7.69952 20 8.81563 20H15.1844C16.3005 20 17.1882 19.436 17.9853 18.6474C19.617 17.0331 16.938 15.743 15.9162 15.1112C13.5201 13.6296 10.4799 13.6296 8.0838 15.1112Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                    <path d="M15.5 7.5C15.5 9.433 13.933 11 12 11C10.067 11 8.5 9.433 8.5 7.5C8.5 5.567 10.067 4 12 4C13.933 4 15.5 5.567 15.5 7.5Z" stroke="currentColor" stroke-width="1.5" />
                                  </svg>
                                </span>
                                <span className={`ml-2 ${btnTextSize} tracking-wide truncate`}>Ver Equipos</span>
                              </a>
                            </li><li>
                              <a href="/component/docente/crearGrupos" className="cursor-pointer relative flex flex-row items-center h-[10vh] focus:outline-none hover:bg-gray-50 text-gray-600 hover:text-gray-800 border-l-4 border-transparent hover:border-primari pr-6">
                                <span className={`inline-flex justify-center items-center ml-4 ${btnIconSize}`}>
                                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" class="w-8 h-8 text-gray-600" fill="none">
                                    <path d="M3.78879 9.03708C3.0814 9.42 1.22668 10.2019 2.35633 11.1803C2.90815 11.6582 3.52275 12 4.29543 12H8.70457C9.47725 12 10.0918 11.6582 10.6437 11.1803C11.7733 10.2019 9.9186 9.42 9.21121 9.03708C7.55241 8.13915 5.44759 8.13915 3.78879 9.03708Z" stroke="currentColor" stroke-width="1.5" />
                                    <path d="M8.75 4.27273C8.75 5.52792 7.74264 6.54545 6.5 6.54545C5.25736 6.54545 4.25 5.52792 4.25 4.27273C4.25 3.01753 5.25736 2 6.5 2C7.74264 2 8.75 3.01753 8.75 4.27273Z" stroke="currentColor" stroke-width="1.5" />
                                    <path d="M4 15C4 18.3171 6.68286 21 10 21L9.14286 19.2857" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                    <path d="M20 9C20 5.68286 17.3171 3 14 3L14.8571 4.71429" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                    <path d="M14.7888 19.0371C14.0814 19.42 12.2267 20.2019 13.3563 21.1803C13.9082 21.6582 14.5227 22 15.2954 22H19.7046C20.4773 22 21.0918 21.6582 21.6437 21.1803C22.7733 20.2019 20.9186 19.42 20.2112 19.0371C18.5524 18.1392 16.4476 18.1392 14.7888 19.0371Z" stroke="currentColor" stroke-width="1.5" />
                                    <path d="M19.75 14.2727C19.75 15.5279 18.7426 16.5455 17.5 16.5455C16.2574 16.5455 15.25 15.5279 15.25 14.2727C15.25 13.0175 16.2574 12 17.5 12C18.7426 12 19.75 13.0175 19.75 14.2727Z" stroke="currentColor" stroke-width="1.5" />
                                  </svg>
                                </span>
                                <span className={`ml-2 ${btnTextSize} tracking-wide truncate`}>Crear Equipos</span>
                              </a>
                            </li></>) : rol == 4 ? (
                              <><li className="px-4">
                                <div className="flex flex-row items-center h-8">
                                  <div className="text-sm font-light tracking-wide text-gray-500">Gestión Documental</div>
                                </div>
                              </li><li onClick={() => { setControlador(0); }}>
                                  <div className="cursor-pointer relative flex flex-row items-center h-[10vh] focus:outline-none hover:bg-gray-50 text-gray-600 hover:text-gray-800 border-l-4 border-transparent hover:border-primari pr-6">
                                    <span className={`inline-flex justify-center items-center ml-4 ${btnIconSize}`}>
                                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-8 h-8 text-gray-600">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="m11.25 9-3 3m0 0 3 3m-3-3h7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                      </svg>

                                    </span>
                                    <span className={`ml-2 ${btnTextSize} tracking-wide truncate`}>Atrás</span>
                                  </div>
                                </li>
                                <li>
                                  <a href="/component/coordinador/usuarios" className="cursor-pointer relative flex flex-row items-center h-[10vh] focus:outline-none hover:bg-gray-50 text-gray-600 hover:text-gray-800 border-l-4 border-transparent hover:border-primari pr-6">
                                    <span className={`inline-flex justify-center items-center ml-4 ${btnIconSize}`}>
                                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" class="w-8 h-8 text-gray-600" fill="none">
                                        <path d="M12.5 22H6.59087C5.04549 22 3.81631 21.248 2.71266 20.1966C0.453365 18.0441 4.1628 16.324 5.57757 15.4816C7.67837 14.2307 10.1368 13.7719 12.5 14.1052C13.3575 14.2261 14.1926 14.4514 15 14.7809" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                        <path d="M16.5 6.5C16.5 8.98528 14.4853 11 12 11C9.51472 11 7.5 8.98528 7.5 6.5C7.5 4.01472 9.51472 2 12 2C14.4853 2 16.5 4.01472 16.5 6.5Z" stroke="currentColor" stroke-width="1.5" />
                                        <path d="M18.5 22L18.5 15M15 18.5H22" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
                                      </svg>
                                    </span>
                                    <span className={`ml-2 ${btnTextSize} tracking-wide truncate`}>Cargar Usuarios</span>
                                  </a>
                                </li>
                                <li>
                                  <a href="/component/coordinador/crearAsesor" className="cursor-pointer relative flex flex-row items-center h-[10vh] focus:outline-none hover:bg-gray-50 text-gray-600 hover:text-gray-800 border-l-4 border-transparent hover:border-primari pr-6">
                                    <span className={`inline-flex justify-center items-center ml-4 ${btnIconSize}`}>
                                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" class="w-8 h-8 text-gray-600" fill="none">
                                        <path d="M12 22L10 16H2L4 22H12ZM12 22H16" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                        <path d="M12 13V12.5C12 10.6144 12 9.67157 11.4142 9.08579C10.8284 8.5 9.88562 8.5 8 8.5C6.11438 8.5 5.17157 8.5 4.58579 9.08579C4 9.67157 4 10.6144 4 12.5V13" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                        <path d="M19 13C19 14.1046 18.1046 15 17 15C15.8954 15 15 14.1046 15 13C15 11.8954 15.8954 11 17 11C18.1046 11 19 11.8954 19 13Z" stroke="currentColor" stroke-width="1.5" />
                                        <path d="M10 4C10 5.10457 9.10457 6 8 6C6.89543 6 6 5.10457 6 4C6 2.89543 6.89543 2 8 2C9.10457 2 10 2.89543 10 4Z" stroke="currentColor" stroke-width="1.5" />
                                        <path d="M14 17.5H20C21.1046 17.5 22 18.3954 22 19.5V20C22 21.1046 21.1046 22 20 22H19" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
                                      </svg>
                                    </span>
                                    <span className={`ml-2 ${btnTextSize} tracking-wide truncate`}>Crear Asesor</span>
                                  </a>
                                </li>
                                <li>
                                  <a href="/component/coordinador/configurarEntregas" className="cursor-pointer relative flex flex-row items-center h-[10vh] focus:outline-none hover:bg-gray-50 text-gray-600 hover:text-gray-800 border-l-4 border-transparent hover:border-primari pr-6">
                                    <span className={`inline-flex justify-center items-center ml-4 ${btnIconSize}`}>
                                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" class="w-8 h-8 text-gray-600" fill="none">
                                        <path d="M8 16L16 8M10 9C10 9.55228 9.55228 10 9 10C8.44772 10 8 9.55228 8 9C8 8.44772 8.44772 8 9 8C9.55228 8 10 8.44772 10 9ZM16 14.8284C16 15.3807 15.5523 15.8284 15 15.8284C14.4477 15.8284 14 15.3807 14 14.8284C14 14.2761 14.4477 13.8284 15 13.8284C15.5523 13.8284 16 14.2761 16 14.8284Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
                                        <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="1.5" />
                                      </svg>
                                    </span>
                                    <span className={`ml-2 ${btnTextSize} tracking-wide truncate`}>Configurar Entregas</span>
                                  </a>
                                </li>
                              </>
                            ) : (null)
                        }

                      </>
                    ) : (null)}
                </ul>
              </div >

              <div className='h-[20vh]'>
                <div className='border-t border-t-slate-200 hide-on-desktop'>
                  <a href="/component/perfil" className="cursor-pointer relative flex flex-row items-center h-[10vh] focus:outline-none hover:bg-gray-50 text-gray-600 hover:text-gray-800 border-l-4 border-transparent hover:border-primari pr-6 " >
                    <span className={`inline-flex justify-center items-center ml-4 ${btnIconSize}`}>
                      <img src={imagen} className={`${profileImgSize} rounded-full`} />
                    </span>
                    <span className={`ml-2 ${btnTextSize} tracking-wide truncate`}>Perfil</span>
                  </a>
                </div>
                <div onClick={() => { cerrarSesion() }} className="cursor-pointer relative flex flex-row items-center h-[10vh] focus:outline-none hover:bg-gray-50 text-gray-600 hover:text-gray-800 border-l-4 border-transparent hover:border-primari pr-6 hide-on-desktop">
                  <span className={`inline-flex justify-center items-center ml-4 ${btnIconSize}`}>
                    <svg viewBox="0 0 24 24" id="_24x24_On_Light_Session-Leave" data-name="24x24/On Light/Session-Leave" xmlns="http://www.w3.org/2000/svg" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <rect id="view-box" width="24" height="24" fill="none"></rect> <path id="Shape" d="M2.95,17.5A2.853,2.853,0,0,1,0,14.75v-12A2.854,2.854,0,0,1,2.95,0h8.8a.75.75,0,0,1,0,1.5H2.95A1.362,1.362,0,0,0,1.5,2.75v12A1.363,1.363,0,0,0,2.95,16h8.8a.75.75,0,0,1,0,1.5Zm9.269-4.219a.751.751,0,0,1,0-1.061L14.939,9.5H5.75a.75.75,0,0,1,0-1.5h9.19L12.219,5.28A.75.75,0,1,1,13.28,4.22l4,4a.749.749,0,0,1,0,1.06l-4,4a.751.751,0,0,1-1.061,0Z" transform="translate(3.25 3.25)" fill="#141124"></path> </g></svg>
                  </span>
                  <span className={`ml-2 ${btnTextSize} tracking-wide truncate`}>Cerrar Sesión</span>
                </div>
              </div>
            </div >
          </div >
          <div className='h-[100vh] w-[100vw] bg-gray-50' onMouseOver={click ? hiddenSidebar : null} onClick={click ? hiddenSidebar : null}>
            <div className="flex justify-end pr-4">
              <div className="flex space-x-1">
                <div className='border-t border-t-slate-200 hide-on-mobile'>
                  <a href="/component/perfil" className="cursor-pointer relative flex flex-row items-center h-[10vh] focus:outline-none hover:bg-gray-50 text-gray-600 hover:text-gray-800 border-l-4 border-transparent hover:border-primari pr-2">
                    <span className={`inline-flex justify-center items-center ml-4 ${btnIconSize}`}>
                      <img src={imagen} className={`${profileImgSize} rounded-full`} />
                    </span>
                    <span className={`ml-2 ${btnTextSize} tracking-wide truncate`}>Perfil</span>
                  </a>
                </div>
                <div onClick={() => { cerrarSesion() }}
                  className="cursor-pointer relative flex flex-row items-center h-[10vh] focus:outline-none hover:bg-gray-50 text-gray-600 hover:text-gray-800 border-l-4 border-transparent hover:border-primari pr-6 hide-on-mobile">
                  <span className={`inline-flex justify-center items-center ml-4 ${btnIconSize}`}>
                    <svg viewBox="0 0 24 24" id="_24x24_On_Light_Session-Leave" data-name="24x24/On Light/Session-Leave" xmlns="http://www.w3.org/2000/svg" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <rect id="view-box" width="24" height="24" fill="none"></rect> <path id="Shape" d="M2.95,17.5A2.853,2.853,0,0,1,0,14.75v-12A2.854,2.854,0,0,1,2.95,0h8.8a.75.75,0,0,1,0,1.5H2.95A1.362,1.362,0,0,0,1.5,2.75v12A1.363,1.363,0,0,0,2.95,16h8.8a.75.75,0,0,1,0,1.5Zm9.269-4.219a.751.751,0,0,1,0-1.061L14.939,9.5H5.75a.75.75,0,0,1,0-1.5h9.19L12.219,5.28A.75.75,0,1,1,13.28,4.22l4,4a.749.749,0,0,1,0,1.06l-4,4a.751.751,0,0,1-1.061,0Z" transform="translate(3.25 3.25)" fill="#141124"></path> </g></svg>
                  </span>
                  <span className={`ml-2 ${btnTextSize} tracking-wide truncate`}>Cerrar Sesión</span>
                </div>
              </div>
            </div>
            <div id='contSlidebar' className={`md:!ml-[16rem] min-h-full flex flex-col flex-auto flex-shrink-0 antialiased justify-center bg-gray-50 text-gray-800 ${click ? 'hidden' : 'flex'}`}>
              {children}
            </div>
          </div>
        </div >
      </>
    ) : (null)
  )
}

export default sidebar
