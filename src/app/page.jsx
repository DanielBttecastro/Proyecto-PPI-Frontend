/* eslint-disable react-hooks/rules-of-hooks */
"use client"
import React, { useState, useEffect } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation";
import Cookies from 'js-cookie';
import CryptoJS from 'crypto-js';


function page() {

    const [showAlert, setShowAlert] = useState(false);
    const [estadoSesion, setEstadoSesion] = useState(false);
    const router = useRouter();

    useEffect(() => {
        if (showAlert) {
            const timer = setTimeout(() => {
                setShowAlert(false);
            }, 5000);

            return () => clearTimeout(timer);
        }
    }, [showAlert]);

    useEffect(() => {
        const cerrarSesion = async () => {

            const response = await fetch(`https://td-g-production.up.railway.app/google/check-session`);
            if (response.ok) {
                const data = await response.json()
                setEstadoSesion(data.isSessionActive)
                if (data.isSessionActive) {
                    const response2 = await fetch(`https://td-g-production.up.railway.app/google/logout`);
                    localStorage.removeItem('U2FsdGVkX1');
                    localStorage.removeItem('U2FsdGVkX2');
                }
            }
        }
        cerrarSesion()
    }, []);

    const crearVariablesSesion = async (datosGoogle) => {
        try {
            const response2 = await fetch('https://td-g-production.up.railway.app/usuario/correos/' + datosGoogle.email);
            const usuario = await response2.json();
            console.log(usuario) 
            if (response2.ok && usuario.length != 0 && usuario.rol.id!=6) {
                const googleCifrado = CryptoJS.AES.encrypt(JSON.stringify(datosGoogle), 'PPIITYTPIJC').toString();
                const nestCifrado = CryptoJS.AES.encrypt(JSON.stringify(usuario), 'PPIITYTPIJC').toString();
                localStorage.setItem('U2FsdGVkX1', nestCifrado);
                localStorage.setItem('U2FsdGVkX2', googleCifrado);
                router.push('/component')

            } else {
                setShowAlert(true)
            }
        } catch (e) {
            setShowAlert(true)
        }
    }

    const handleLogin = async () => {
        if (!estadoSesion) {
            const response2 = await fetch(`https://td-g-production.up.railway.app/google/auth/url`);
            const data2 = await response2.json()
            const popupWindow = window.open(data2.url, 'popupWindow', 'width=600,height=600');
            if (popupWindow) {
                popupWindow.focus();
                let datosGoogle = {}
                const checkClosed = setInterval(async () => {
                    if (popupWindow.closed) {
                        clearInterval(checkClosed);
                        const response2 = await fetch(`https://td-g-production.up.railway.app/google/user-info`);
                        if (response2.ok) {
                            const data2 = await response2.json()
                            crearVariablesSesion(data2)
                        }
                    }
                }, 1000);

            } else {
                //alert('El navegador bloqueó la apertura de la ventana emergente. Por favor, habilite las ventanas emergentes para este sitio web.');
            }
        } else {
            const response2 = await fetch(`https://td-g-production.up.railway.app/google/logout`);
        }
    }
    return (<div className="relative flex flex-col items-center min-h-screen justify-center">
        <div className="flex flex-column items-center justify-self-center">
            <div className="absolute h-screen inset-0 bg-cover bg-center">
                <Image src={'/Media/img/Landing.png'} alt="" loading="eager" fill style={{ objectFit: 'cover' }} quality={100} />
            </div >
            <div className="relative container mx-auto text-gray-500">
                <div className="landscape:w-[40vw] landscape:h-[85vh] portrait:w-[80vw] portrait:h-[45vh] flex flex-col items-center justify-center">
                    <div className="rounded-xl bg-white shadow-xl w-full h-full">
                        <div className="flex flex-col gap-2 p-4 w-full h-full justify-evenly items-center">
                            <div className="relative flex flex-col items-center justify-center w-full h-[40%]">
                                <img src="/Media/img/Escudo.png" className="h-full object-scale-down" loading="eager" />
                            </div>
                            <p className="text-xl text-gray-600 font-bold text-center">Sistema de gestión del PPI</p>
                            <p className="text-sm text-gray-600 font-bold text-center">Usa tu correo institucional para iniciar sesion</p>
                            <button className="flex flex-row items-center gap-2 group h-12 px-6 border-2 border-gray-300 rounded-full transition duration-2clea00
                                     hover:border-blue-400 focus:bg-blue-50 active:bg-blue-100" onClick={handleLogin}>
                                <img src="/Media/img/G.png" className="left-0 w-5 object-scale-down" loading="eager" />
                                <span className="block w-max font-semibold tracking-wide text-gray-700 
                                            text-sm transition duration-300 group-hover:text-blue-600 sm:text-base">
                                    Iniciar con Google</span>
                            </button>
                            <div className="space-y-4 text-gray-600 text-center">
                                <p className="text-xs">Al continuar, acepta nuestros <a href="#" className="underline">Términos de uso</a>
                                    y confirma que ha leído nuestra <a href="#" className="underline">Declaración de privacidad</a>.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div >
        {
            showAlert && (
                <div className="fixed bottom-0 right-0 mb-8 mr-8">
                    <div className="flex w-96 shadow-lg rounded-lg">
                        <div className="bg-red-600 py-4 px-6 rounded-l-lg flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" className="fill-current text-white" width="20" height="20">
                                <path fillRule="evenodd" d="M4.47.22A.75.75 0 015 0h6a.75.75 0 01.53.22l4.25 4.25c.141.14.22.331.22.53v6a.75.75 0 01-.22.53l-4.25 4.25A.75.75 0 0111 16H5a.75.75 0 01-.53-.22L.22 11.53A.75.75 0 010 11V5a.75.75 0 01.22-.53L4.47.22zm.84 1.28L1.5 5.31v5.38l3.81 3.81h5.38l3.81-3.81V5.31L10.69 1.5H5.31zM8 4a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 018 4zm0 8a1 1 0 100-2 1 1 0 000 2z"></path>
                            </svg>
                        </div>
                        <div className="px-4 py-6 bg-white rounded-r-lg flex justify-between items-center w-full border border-l-transparent border-gray-200">
                            <div>La cuenta no se encuentra registrada.</div>
                            <button onClick={() => { setShowAlert(!showAlert) }}>
                                <svg xmlns="http://www.w3.org/2000/svg" className="fill-current text-gray-700" viewBox="0 0 16 16" width="20" height="20">
                                    <path fillRule="evenodd" d="M3.72 3.72a.75.75 0 011.06 0L8 6.94l3.22-3.22a.75.75 0 111.06 1.06L9.06 8l3.22 3.22a.75.75 0 11-1.06 1.06L8 9.06l-3.22 3.22a.75.75 0 01-1.06-1.06L6.94 8 3.72 4.78a.75.75 0 010-1.06z"></path>
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            )
        }
    </div >
    );
}

export default page
