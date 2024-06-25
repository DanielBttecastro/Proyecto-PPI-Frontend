"use client"
import React, { useState, useEffect } from "react"
// import { format } from 'date-fns';
import { format } from 'date-fns-tz';

function BannerTable() {
    const [banners, setBanners] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [showAlert, setShowAlert] = useState(false);
    const [selectedId, setSelectedId] = useState('');
    const [showImg, setShowImg] = useState(false);
    const [selectedImg, setSelectedImg] = useState('');
    const [reloadBanners, setReloadBanners] = useState(false);

    const handleShowAlert = (id) => {
        setShowAlert(true);
        setSelectedId(id);
    };

    const handleConfirm = (confirm) => {
        if (confirm) {
            handleDelete(selectedId)
        }
        setShowAlert(false);
    };

    const handleShowImg = (url) => {
        setSelectedImg(url);
        setShowImg(true);
    };

    const goToPage = (page) => {
        if (page == Math.ceil(banners.length / 5))
            return

        if (page == -1)
            return
        setCurrentPage(page);
    };

    useEffect(() => {
        const fetchBanners = async () => {
            try {
                const response = await fetch('https://td-g-production.up.railway.app/banner');
                const data = await response.json();
                setBanners(data);
            } catch (error) {
                return `Error en la consulta de banners: ${error}`;
            }
        };
        fetchBanners();
    }, [reloadBanners]);

    const handleDelete = async (id) => {
        const response = await fetch(`https://td-g-production.up.railway.app/banner/delete/${id}`, {
            method: 'DELETE',
        });
        setReloadBanners(!reloadBanners);
    };

    const handleToggleVisibility = async (id, currentState) => {
        const response = await fetch(`https://td-g-production.up.railway.app/banner/visible/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ estado: currentState === 0 ? 1 : 0 }),
        });
        setReloadBanners(!reloadBanners);
    };

    function formatDate(dateString) {
        const [year, month, day] = dateString.split('-');
        return `${day}/${month}/${year}`;
    }

    return (
        <div className="w-full mt-5 border-t border-gray-400">
            <div className="w-full overflow-y-auto overflow-x-auto">
                <table className="w-full divide-y-2 divide-gray-200 border-b-2 border-gray-400 bg-white text-sm">
                    <thead className="ltr:text-left rtl:text-right sticky top-0 bg-white">
                        <tr>
                            <th class="whitespace-nowrap px-4 py-2 font-bold text-gray-600">ID</th>
                            <th class="whitespace-nowrap px-4 py-2 font-bold text-gray-600">Titulo</th>
                            <th class="whitespace-nowrap px-4 py-2 font-bold text-gray-600">Contenido</th>
                            <th class="whitespace-nowrap px-4 py-2 font-bold text-gray-600">Tipo</th>
                            <th class="whitespace-nowrap px-4 py-2 font-bold text-gray-600">Inicio</th>
                            <th class="whitespace-nowrap px-4 py-2 font-bold text-gray-600">Fin</th>
                            <th class="whitespace-nowrap px-4 py-2 font-bold text-gray-600">Imagen</th>
                            <th class="whitespace-nowrap px-4 py-2 font-bold text-gray-600"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {banners.map((item, index) => {
                            const timeNow = new Date();
                            const currentDate = format(timeNow, 'yyyy-MM-dd', { timeZone: 'America/Bogota' });
                            const startDate = item.fechaInicio;
                            const endDate = item.fechaFin;
                            console.log(startDate, currentDate, endDate);
                            let trBgClass = item.estado === 0 ? 'bg-slate-100' : '';
                            if (index >= currentPage * 5 && index < (currentPage + 1) * 5) {
                                return (
                                    <tr key={item.id} className={`${trBgClass}`}>
                                        <td className="min-w-[8vw] max-w-[8vw]  whitespace-nowrap overflow-hidden text-ellipsis px-4 py-2 font-semibold text-center text-gray-500">{item.id}</td>
                                        <td className="min-w-[8vw] max-w-[8vw] whitespace-nowrap overflow-hidden text-ellipsis px-4 py-2 font-semibold text-left text-gray-500 ">{item.nombre}</td>
                                        <td className="min-w-[8vw] max-w-[8vw] whitespace-nowrap overflow-hidden text-ellipsis px-4 py-2 font-semibold text-left text-gray-500">{item.contenidoBanner}</td>
                                        <td className="min-w-[8vw] max-w-[8vw] whitespace-nowrap overflow-hidden text-ellipsis px-4 py-2 font-semibold text-center text-gray-500">{item.tipoBanner === 1 ? 'Banner' : 'Noticia'}</td>
                                        <td className={`min-w-[8vw] max-w-[8vw] whitespace-nowrap overflow-hidden text-ellipsis px-4 py-2 font-semibold text-center text-gray-500 ${currentDate >= startDate ? null : 'line-through'}`}>{formatDate(item.fechaInicio)}</td>
                                        <td className={`min-w-[8vw] max-w-[8vw] whitespace-nowrap overflow-hidden text-ellipsis px-4 py-2 font-semibold text-center text-gray-500 ${currentDate <= endDate ? null : 'line-through'}`}>{formatDate(item.fechaFin)}</td>
                                        <td className="min-w-[8vw] max-w-[8vw] whitespace-nowrap overflow-hidden text-ellipsis px-4 py-2 font-semibold text-center text-gray-500 cursor-zoom-in"
                                            onClick={() => handleShowImg(`https://td-g-production.up.railway.app${item.urlImagen}`)}>
                                            <div className="flex flex-col content-center items-center ">
                                                <img src={`https://td-g-production.up.railway.app${item.urlImagen}`} alt="Imagen" style={{ width: '50px' }} />
                                            </div>
                                        </td>
                                        <td className="flex flex-col px-4 py-2">
                                            <div className="flex flex-row items-center gap-x-2">
                                                <button className="p-1 rounded-full bg-gray-600" onClick={() => handleToggleVisibility(item.id, item.estado)}>
                                                    {item.estado === 1 ?
                                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="white" className="w-6 h-6">
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
                                                        </svg>
                                                        : <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="white" className="w-6 h-6">
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                                        </svg>
                                                    }
                                                </button>
                                                <a href={`https://frontend.dbcpolijic2024.online/component/banner/modificar/${item.id}`} className="">
                                                    <div className="p-1 rounded-full bg-gray-600">
                                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="white" className="w-6 h-6">
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                                                        </svg>
                                                    </div>
                                                </a>
                                                {/* {item.estado === 0 ? ( */}
                                                <button className="p-1 rounded-full bg-gray-600" onClick={() => handleShowAlert(item.id)}>
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="white" className="w-6 h-6">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                                    </svg>
                                                </button>
                                                {/* ) : (null)} */}
                                            </div>
                                        </td>
                                    </tr>)
                            } else {
                                return null;
                            }
                        })}
                    </tbody>
                </table>
            </div>
            <div className="w-full flex flex-col items-center justify-center content-center">
                <button className='text-white m-4 py-2 px-4 w-[25%] rounded bg-green-400 hover:bg-green-500 shadow hover:shadow-lg font-medium transition transform hover:-translate-y-0.5 flex justify-center' onClick={() => window.location.href = 'https://frontend.dbcpolijic2024.online/component/banner/crear'}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                </button>
                <div class="inline-flex justify-center gap-1">
                    <button
                        onClick={() => goToPage(currentPage - 1)}
                        class="inline-flex size-8 items-center justify-center rounded border border-gray-100 bg-white text-gray-900 rtl:rotate-180"
                    >
                        <span class="sr-only">Prev Page</span>
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                            <path
                                fill-rule="evenodd"
                                d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                                clip-rule="evenodd"
                            />
                        </svg>
                    </button>

                    <div>
                        <label for="PaginationPage" class="sr-only">Page</label>
                        <input
                            type="number"
                            class="h-8 w-12 rounded border border-gray-100 bg-white p-0 text-center text-xs font-medium text-gray-900 [-moz-appearance:_textfield] [&::-webkit-inner-spin-button]:m-0 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:m-0 [&::-webkit-outer-spin-button]:appearance-none"
                            min="1"
                            value={currentPage + 1}
                            id="PaginationPage"
                        />
                    </div>

                    <button
                        onClick={() => goToPage(currentPage + 1)}
                        class="inline-flex size-8 items-center justify-center rounded border border-gray-100 bg-white text-gray-900 rtl:rotate-180">
                        <span class="sr-only">Next Page</span>
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                            <path
                                fill-rule="evenodd"
                                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                                clip-rule="evenodd"
                            />
                        </svg>
                    </button>
                </div>
            </div>
            {showAlert && (<>
                <div className="fixed inset-0 z-10 bg-grey bg-opacity-10 backdrop-blur-sm flex justify-center items-center">
                    <div class="flex flex-col justify-center content-center items-center rounded-lg bg-white p-4 shadow-2xl min-w-[50vw] max-w-[50vw] border border-solid border-gray-300">
                        <h2 class="text-lg font-bold">¿Deseas eliminar este contenido?</h2>
                        <p class="mt-2 text-sm text-gray-800">
                            Esta acción puede implicar una perdidad irreversible de dicha información, ¿desea continuar?.
                        </p>
                        <div class="mt-4 flex flex-row flex-wrap min-w-full items-center content-center justify-center gap-2">
                            <button type="button" class="min-w-[25%] rounded-lg bg-green-200 px-4 py-2 text-sm font-medium text-green-600" onClick={() => handleConfirm(true)}>
                                Confirmar
                            </button>
                            <button type="button" class="min-w-[25%] rounded-lg bg-red-200 px-4 py-2 text-sm font-medium text-red-600" onClick={() => handleConfirm(false)}>
                                Cancelar
                            </button>
                        </div>
                    </div>
                </div>
            </>
            )}
            {showImg && (<>
                <div className="fixed inset-0 z-10 bg-grey bg-opacity-10 backdrop-blur-sm flex justify-center items-center">
                    <div class="rounded-lg bg-white shadow-2xl min-w-[50vw] max-w-[50vw] border border-solid border-gray-300 p-2">
                        <div className="flex flex-col min-w-full max-w-full justify-between items-start px-1 pb-1">
                            <div className="flex flex-row justify-between min-w-full max-w-full">
                                <h1 className="text-2xl font-bold">Vista amplida</h1>
                                <button className="" onClick={() => setShowImg(false)}>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                        <img src={selectedImg} className="rounded-lg min-w-full max-w-full" alt="Imagen" />
                    </div>
                </div>
            </>
            )}
        </div>
    );
}

export default BannerTable;
