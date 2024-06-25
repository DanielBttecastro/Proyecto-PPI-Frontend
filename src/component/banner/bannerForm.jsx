"use client"
import { redirect } from 'next/navigation';
import React, { useState, useEffect } from 'react';

function BannerForm({ type, id }) {
    const [visible, setVisible] = useState(false);
    const [oculto, setOculto] = useState(false);
    const [banner, setBanner] = useState(false);
    const [noticia, setNoticia] = useState(false);
    const [showDanger, setShowDanger] = useState(false);
    const [showWarning, setShowWarning] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [alertMesage, setAlertMesage] = useState('');
    const [redirecting, setRedirecting] = useState(false);

    const resetCheckboxes = () => {
        if (type === 1) {
            setBanner(false);
            setNoticia(false);
            setVisible(false);
            setOculto(false);
        };
    };

    useEffect(() => {
        if (type === 2) {
            const fetchData = async () => {
                try {
                    const response = await fetch(`https://td-g-production.up.railway.app/banner/${id}`);
                    if (response.ok) {
                        const data = await response.json();
                        console.log(data);
                        document.getElementById('titulo').value = data.nombre;
                        document.getElementById('contenido').value = data.contenidoBanner;
                        document.getElementById('fechaInicio').value = data.fechaInicio;
                        document.getElementById('fechaFin').value = data.fechaFin;
                        data.estado === 1 ? setVisible(true) && setOculto(false) : setOculto(true) && setVisible(false);
                        const extension = data.urlImagen.split('.').pop();
                        const imageUrl = `https://td-g-production.up.railway.app${data.urlImagen}`;
                        const imageBlob = await fetch(imageUrl).then(res => res.blob());
                        const file = new File([imageBlob], `${data.urlImagen.split('/').pop(2)}`, { type: `image/${extension}` });
                        const fileList = new DataTransfer();
                        fileList.items.add(file);
                        const fileInput = document.getElementById('file');
                        fileInput.files = fileList.files;
                        const img = new Image();
                        img.src = imageUrl;
                        img.onload = function () {
                            const resolution = `${this.width}x${this.height}`;
                            if (resolution === '1920x500') {
                                setBanner(true);
                                setNoticia(false);
                            } else if (resolution === '1200x630') {
                                setNoticia(true);
                                setBanner(false);
                            }
                        };
                        document.getElementById('preview').src = `https://td-g-production.up.railway.app${data.urlImagen}`;
                        document.getElementById('preview').style.display = 'block';
                    } else {
                        setRedirecting(true);
                    }
                } catch (error) {
                    console.log(error);
                    setRedirecting(true);
                }
            };
            fetchData();
        }
    }, [type, id]);

    useEffect(() => {
        if (redirecting) {
            redirect('/banner/crear');
            // window.location.href = '/banner/crear';
        }
    }, [redirecting]);

    useEffect(() => {
        if (showDanger) {
            const timer = setTimeout(() => {
                setShowDanger(false);
                setAlertMesage('');
            }, 3000);

            return () => clearTimeout(timer);
        };
    }, [showDanger]);

    useEffect(() => {
        if (showWarning) {
            const timer = setTimeout(() => {
                setShowWarning(false);
                setAlertMesage('');
            }, 3000);

            return () => clearTimeout(timer);
        }
    }, [showWarning]);

    useEffect(() => {
        if (showSuccess) {
            const timer = setTimeout(() => {
                setShowSuccess(false);
                setAlertMesage('');
            }, 3000);

            return () => clearTimeout(timer);
        }
    }, [showSuccess]);


    useEffect(() => {
        if (type === 1) {
            document.getElementById('titulo').value = '';
            document.getElementById('contenido').value = '';
            document.getElementById('fechaInicio').value = '';
            document.getElementById('fechaFin').value = '';
            document.getElementById('file').value = '';
            document.getElementById('banner').value = '';
            document.getElementById('noticia').value = '';
            document.getElementById('visible').value = '';
            document.getElementById('oculto').value = '';
        };
    }, []);

    const handleTipoBannerChange = (e) => {
        const file = document.getElementById('file').files[0];
        const preview = document.getElementById('preview');
        if (!file) {
            setNoticia(false);
            setBanner(false);
            preview.style.display = 'none';
            preview.src = '';
        } else {
            const img = new Image();
            img.onload = function () {
                const resolution = `${file[0].width}x${file[0].height}`
                if (resolution === '1920x500') {
                    setBanner(true);
                    setNoticia(false);
                } else if (resolution === '1200x630') {
                    setNoticia(true);
                    setBanner(false);
                }
            }
        }
    };

    const handleVisibilidadChange = (e) => {
        const { id } = e.target;
        if (id === 'visible') {
            setVisible(true);
            setOculto(false);
        } else if (id === 'oculto') {
            setOculto(true);
            setVisible(false);
        }
    };

    const handleFileChange = (e) => {
        setBanner(false);
        setNoticia(false);
        const file = e.target.files[0];
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
        const allowedResolutions = ['1920x500', '1200x630'];
        if (!file) {
            setAlertMesage('Por favor, selecciona un archivo.');
            setShowWarning(true);
            e.target.value = ''; // Reset the input to allow selecting the same file again
            setNoticia(false);
            setBanner(false);
            preview.style.display = 'none';
            preview.src = '';
            return;
        }
        if (!allowedTypes.includes(file.type)) {
            setAlertMesage('Por favor, selecciona un archivo de imagen válido (jpg, jpeg, png, gif).');
            setShowWarning(true);
            e.target.value = '';
            setNoticia(false);
            setBanner(false);
            preview.style.display = 'none';
            preview.src = ''; // Reset the input to allow selecting the same file again
            return;
        }
        const img = new Image();
        img.onload = function () {
            const resolution = `${this.width}x${this.height}`;
            if (!allowedResolutions.includes(resolution)) {
                setAlertMesage('Por favor, selecciona una imagen con resolución 1920x500 o 1200x630.');
                setShowWarning(true);
                e.target.value = ''; // Reset the input to allow selecting the same file again
                setNoticia(false);
                setBanner(false);
                preview.style.display = 'none';
                preview.src = '';
                return
            } else {
                if (resolution === '1920x500') {
                    setBanner(true);
                    setNoticia(false);
                } else if (resolution === '1200x630') {
                    setNoticia(true);
                    setBanner(false);
                }
            }
        };
        img.src = URL.createObjectURL(file);
        preview.style.display = 'block';
        preview.src = URL.createObjectURL(file);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!event.target.titulo.value || !event.target.visible.checked && !event.target.oculto.checked || !event.target.fechaInicio.value ||
            !event.target.fechaFin.value || !event.target.banner.checked && !event.target.noticia.checked ||
            !event.target.contenido.value || !event.target.file.files[0]) {
            // //alert('Por favor, completa todos los campos');
            setAlertMesage('Por favor, completa todos los campos.');
            setShowWarning(true);
            return;
        }

        const formData = new FormData();
        formData.append('nombre', event.target.titulo.value);
        formData.append('estado', event.target.visible.checked ? 1 : 0);
        formData.append('fechaInicio', event.target.fechaInicio.value);
        formData.append('fechaFin', event.target.fechaFin.value);
        formData.append('tipoBanner', event.target.banner.checked ? 1 : 2);
        formData.append('contenidoBanner', event.target.contenido.value);
        formData.append('file', event.target.file.files[0]);

        if (type === 1) {
            try {
                const response = await fetch('https://td-g-production.up.railway.app/banner/create', {
                    method: 'POST',
                    body: formData,
                });
                if (response.ok) {
                    setAlertMesage('Contenido creado exitosamente')
                    setShowSuccess(true);
                    event.target.reset();
                    resetCheckboxes()
                    preview.style.display = 'none';
                    preview.src = '';
                } else {
                    setAlertMesage('Error al crear el contenido.');
                    setShowDanger(true);
                }
            } catch (error) {
                setAlertMesage('Error al crear el contenido.');
                setShowDanger(true);
            }
        }

        if (type === 2) {
            try {
                const response = await fetch(`https://td-g-production.up.railway.app/banner/update/${id}`, {
                    method: 'PATCH',
                    body: formData,
                });
                if (response.ok) {
                    setAlertMesage('Contenido actualizado exitosamente')
                    setShowSuccess(true);
                } else {
                    setAlertMesage('Error al actualizar el contenido.');
                    setShowDanger(true);
                }
            } catch (error) {
                setAlertMesage('Error al actualizar el contenido.');
                setShowDanger(true);
            }
        }
    };

    return (
        <>
            <form onSubmit={handleSubmit} className='ml-6 mr-6 mt-2 bg-white flex justify-between'>
                <div className='flex flex-row flex-wrap justify-evenly w-[100%]'>
                    <div className='flex flex-col w-[95%] lg:w-[45%] gap-y-4'>
                        <div className='flex flex-col'>
                            <label className='mx-1' htmlFor='titulo'>Titulo</label>
                            <input type='text' id='titulo' className='rounded-lg'></input>
                        </div>
                        <div className='flex flex-col'>
                            <label htmlFor='contenido' className='form-label'>Contenido</label>
                            <textarea className='h-[35vh] rounded-lg' name='' id='contenido' rows=''></textarea>
                        </div>
                        <div className='flex flex-row justify-between flex-wrap w-[100%]'>
                            <div className='flex flex-col w-[45%]'>
                                <label className='mx-1 text-nowrap' htmlFor='fechaInicio'>Inicio de publicación</label>
                                <input type='Date' id='fechaInicio' className='rounded-lg'></input>
                            </div>
                            <div className='flex flex-col w-[45%]'>
                                <label className='mx-1 text-nowrap' htmlFor='fechaFin'>Fin de publicación</label>
                                <input type='Date' id='fechaFin' className='rounded-lg'></input>
                            </div>
                        </div>
                    </div>
                    <div className='flex flex-col w-[95%] lg:w-[45%] gap-y-4'>
                        <div className='flex flex-col gap-y-4'>
                            <div className='flex flex-col'>
                                <label className='mx-1' htmlFor='file'>Requisitos de imagen: </label>
                                <div className='flex flex-row justify-between flex-wrap'>
                                    <label className='flex flex-row justify-start flex-wrap mx-1 text-sm' htmlFor='file'>Resoluciones(px):
                                        <div className='flex flex-col ml-1'>
                                            <span className="text-sm">1920x500</span>
                                            <span className="text-sm">1200x630</span>
                                        </div>
                                    </label>
                                    <label className='flex flex-row justify-end flex-wrap mx-1 text-sm' htmlFor='file'>Formatos:
                                        <div className='flex flex-col ml-1'>
                                            <span className="text-sm">jpg, jpeg, png, gif</span>
                                        </div>
                                    </label>
                                </div>
                            </div>
                            <div className='flex flex-col w-full text-center content-center items-center'>vista previa
                                <img className='w-[80%] hidden mt-2 rounded-lg' id="preview" src="#" alt="" />
                            </div>
                            <input type='file' id='file' onChange={handleFileChange}></input>
                        </div>

                        <div className='flex flex-row flex-wrap justify-between w-[100%]'>
                            <div className='flex flex-row w-[48%] justify-start flex-wrap'>
                                <h2>Tipo:</h2>
                                <div className='flex flex-col w-[60%]'>
                                    <div className='flex flex-row items-center justify-between'>
                                        <label className='mx-1' htmlFor='banner'>Banner</label>
                                        <input type='checkbox' id='banner' className='rounded-full' checked={banner} onChange={handleTipoBannerChange} disabled={true}></input>
                                    </div>
                                    <div className='flex flex-row items-center justify-between'>
                                        <label className='mx-1' htmlFor='noticia'>Noticia</label>
                                        <input type='checkbox' id='noticia' className='rounded-full' checked={noticia} onChange={handleTipoBannerChange} disabled={true}></input>
                                    </div>
                                </div>

                            </div>
                            <div className='flex flex-row w-[48%] justify-end flex-wrap'>
                                <h2>Visibilidad:</h2>
                                <div className='flex flex-col w-[50%]'>
                                    <div className='flex flex-row items-center justify-between'>
                                        <label className='mx-1' htmlFor='visible'>Visible</label>
                                        <input type='checkbox' id='visible' className='rounded-full' checked={visible} onChange={handleVisibilidadChange}></input>
                                    </div>
                                    <div className='flex flex-row items-center justify-between'>
                                        <label className='mx-1' htmlFor='oculto'>Oculto</label>
                                        <input type='checkbox' id='oculto' className='rounded-full' checked={oculto} onChange={handleVisibilidadChange}></input>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <button type='submit' className='text-white m-4 py-2 px-4 w-[25%] rounded bg-green-400 hover:bg-green-500 shadow hover:shadow-lg font-medium transition transform hover:-translate-y-0.5'>{type === 1 ? 'Crear' : 'Modificar'}</button>
                </div>
            </form>
            {showSuccess && (
                <div className="fixed bottom-0 right-0 mb-8 mr-8">
                    <div className="flex w-96 shadow-lg rounded-lg">
                        <div class="bg-green-600 py-4 px-6 rounded-l-lg flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" class="text-white fill-current" viewBox="0 0 16 16" width="20" height="20"><path fill-rule="evenodd" d="M13.78 4.22a.75.75 0 010 1.06l-7.25 7.25a.75.75 0 01-1.06 0L2.22 9.28a.75.75 0 011.06-1.06L6 10.94l6.72-6.72a.75.75 0 011.06 0z"></path></svg>
                        </div>
                        <div className="px-4 py-6 bg-white rounded-r-lg flex justify-between items-center w-full border border-l-transparent border-gray-200">
                            <div>{alertMesage}</div>
                            <button onClick={() => { setShowSuccess(!showSuccess) }}>
                                <svg xmlns="http://www.w3.org/2000/svg" className="fill-current text-gray-700" viewBox="0 0 16 16" width="20" height="20">
                                    <path fillRule="evenodd" d="M3.72 3.72a.75.75 0 011.06 0L8 6.94l3.22-3.22a.75.75 0 111.06 1.06L9.06 8l3.22 3.22a.75.75 0 11-1.06 1.06L8 9.06l-3.22 3.22a.75.75 0 01-1.06-1.06L6.94 8 3.72 4.78a.75.75 0 010-1.06z"></path>
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>)
            }
            {showWarning && (
                <div className="fixed bottom-0 right-0 mb-8 mr-8">
                    <div className="flex w-96 shadow-lg rounded-lg">
                        <div class="bg-yellow-600 py-4 px-6 rounded-l-lg flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" class="fill-current text-white" width="20" height="20"><path fill-rule="evenodd" d="M8.22 1.754a.25.25 0 00-.44 0L1.698 13.132a.25.25 0 00.22.368h12.164a.25.25 0 00.22-.368L8.22 1.754zm-1.763-.707c.659-1.234 2.427-1.234 3.086 0l6.082 11.378A1.75 1.75 0 0114.082 15H1.918a1.75 1.75 0 01-1.543-2.575L6.457 1.047zM9 11a1 1 0 11-2 0 1 1 0 012 0zm-.25-5.25a.75.75 0 00-1.5 0v2.5a.75.75 0 001.5 0v-2.5z"></path></svg>
                        </div>
                        <div className="px-4 py-6 bg-white rounded-r-lg flex justify-between items-center w-full border border-l-transparent border-gray-200">
                            <div>{alertMesage}</div>
                            <button onClick={() => { setShowWarning(!showWarning) }}>
                                <svg xmlns="http://www.w3.org/2000/svg" className="fill-current text-gray-700" viewBox="0 0 16 16" width="20" height="20">
                                    <path fillRule="evenodd" d="M3.72 3.72a.75.75 0 011.06 0L8 6.94l3.22-3.22a.75.75 0 111.06 1.06L9.06 8l3.22 3.22a.75.75 0 11-1.06 1.06L8 9.06l-3.22 3.22a.75.75 0 01-1.06-1.06L6.94 8 3.72 4.78a.75.75 0 010-1.06z"></path>
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>)
            }
            {showDanger && (
                <div className="fixed bottom-0 right-0 mb-8 mr-8">
                    <div className="flex w-96 shadow-lg rounded-lg">
                        <div class="bg-yellow-600 py-4 px-6 rounded-l-lg flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" class="fill-current text-white" width="20" height="20"><path fill-rule="evenodd" d="M8.22 1.754a.25.25 0 00-.44 0L1.698 13.132a.25.25 0 00.22.368h12.164a.25.25 0 00.22-.368L8.22 1.754zm-1.763-.707c.659-1.234 2.427-1.234 3.086 0l6.082 11.378A1.75 1.75 0 0114.082 15H1.918a1.75 1.75 0 01-1.543-2.575L6.457 1.047zM9 11a1 1 0 11-2 0 1 1 0 012 0zm-.25-5.25a.75.75 0 00-1.5 0v2.5a.75.75 0 001.5 0v-2.5z"></path></svg>
                        </div>
                        <div className="px-4 py-6 bg-white rounded-r-lg flex justify-between items-center w-full border border-l-transparent border-gray-200">
                            <div>{alertMesage}</div>
                            <button onClick={() => { setShowDanger(!showDanger) }}>
                                <svg xmlns="http://www.w3.org/2000/svg" className="fill-current text-gray-700" viewBox="0 0 16 16" width="20" height="20">
                                    <path fillRule="evenodd" d="M3.72 3.72a.75.75 0 011.06 0L8 6.94l3.22-3.22a.75.75 0 111.06 1.06L9.06 8l3.22 3.22a.75.75 0 11-1.06 1.06L8 9.06l-3.22 3.22a.75.75 0 01-1.06-1.06L6.94 8 3.72 4.78a.75.75 0 010-1.06z"></path>
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>)
            }
        </>
    );
}

export default BannerForm;