"use client"
import React, { useState, useEffect } from "react"
import { Zoom } from "react-slideshow-image"
import "react-slideshow-image/dist/styles.css"

const ContentModal = (newContent, newTitle, newImg, type, visible, onClose) => {
    if (!visible) return null
    return (
        <div className="fixed inset-0 z-10 bg-grey bg-opacity-10 backdrop-blur-sm flex justify-center items-center">
            <div className="flex flex-col bg-white p-2 rounded-lg max-h-[80vh] w-[70vw] border border-solid border-gray-300">
                <div className="flex flex-row w-[100%] gap-x-2 justify-between items-start">
                    <h1 className="text-2xl font-bold p-2">{newTitle}</h1>
                    <button className="p-2" onClick={onClose}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
                        </svg>
                    </button>

                </div>
                <div className='flex flex-col gap-2 overflow-x-auto'>
                    <div className="flex flex-col min-w-full max-w-full justify-center items-center" >
                        <div className={`flex ${type === 1 ? 'md:w-[70%] w-full' : 'md:w-[50%] w-full'} justify-center items-center`}>
                            <img src={newImg} alt="" className="w-full object-cover rounded-lg" />
                        </div>
                    </div>
                    <p className="text-justify p-2">{newContent}</p>
                </div>
            </div>
        </div>
    )
}

const NewCard = ({ key, newTitle, newContent, newImage }) => {
    const [showContentModal, setShowContentModal] = useState(false);
    const handleOnClose = () => setShowContentModal(false);
    return (
        <>
            <div key={key} className="flex flex-col md:w-[30%] w-[45%] aspect-[1/.85] p-2 rounded-lg border border-solid border-gray-300 bg-slate-50 cursor-pointer" onClick={() => setShowContentModal(true)}>
                <div className="rounded-lg bg-cover bg-center w-full">
                    <img className="rounded-lg object-scale-down"
                        src={newImage} loading="eager" quality={100} alt="" />
                </div>
                <h2 className="text-base text-ellipsis text-left overflow-y-auto h-[30%] my-2 px-1" style={{
                    scrollbarColor: "whitegrey white",
                    scrollbarWidth: "thin",
                    msScrollbarShadowColor: "whitegrey",
                    msScrollbarTrackShadowColor: "whitegrey",
                    msScrollbarTrackColor: "whitegrey",
                }}>{newTitle}</h2>
            </div>
            {showContentModal && ContentModal(newContent, newTitle, newImage, 2, showContentModal, handleOnClose)}
        </>
    )
};

const SlideBanner = () => {
    const [banners, setBanners] = useState([]);
    const [selectedBanner, setSelectedBanner] = useState(null);

    useEffect(() => {
        const fetchBanners = async () => {
            try {
                const response = await fetch('https://td-g-production.up.railway.app/banner/tipo/1');
                const data = await response.json();
                setBanners(data);
            } catch (error) {
                return `Error en la consulta de banners: ${error}`;
            }
        };

        fetchBanners();
    }, []);

    const zoomInPropieties = {
        indicators: true,
        scale: 1,
        duration: 8000,
        trasitionDuration: 10,
        infinite: true,
        pauseOnHover: true,
        prevArrow: (
            <div className="flex items-center content-center justify-center min-w-[30px] min-h-[30px] rounded-full bg-slate-100 m-1">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
                </svg>

            </div>
        ),
        nextArrow: (
            <div className="flex items-center content-center justify-center min-w-[30px] min-h-[30px] rounded-full bg-slate-100 m-1">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                </svg>
            </div>
        ),
    };

    const openModal = (banner) => {
        setSelectedBanner(banner);
    };

    const closeModal = () => {
        setSelectedBanner(null);
    };

    if (banners.length > 0) {
        if (banners.length === 1) {
            return (
                <>
                    <img src={`https://td-g-production.up.railway.app${banners[0].urlImagen}`} className="object-cover min-w-[100%] rounded-lg" loading="eager" alt="" onClick={() => openModal(banners[0])} />
                    {selectedBanner && ContentModal(selectedBanner.contenidoBanner, selectedBanner.nombre, `https://td-g-production.up.railway.app${selectedBanner.urlImagen}`, 1, true, closeModal)}
                </>
            )
        }
        return (
            <>
                <Zoom {...zoomInPropieties}>
                    {banners.map((banner, index) => (
                        <img key={index} src={`https://td-g-production.up.railway.app${banner.urlImagen}`} className="object-cover min-w-[100%]" loading="eager" alt="" onClick={() => openModal(banner)} />
                    ))}
                </Zoom>
                {selectedBanner && ContentModal(selectedBanner.contenidoBanner, selectedBanner.nombre, `https://td-g-production.up.railway.app${selectedBanner.urlImagen}`, 1, true, closeModal)}
            </>
        );
    } else {
        return (
            <img className='w-[50%] m-4 rounded-lg' src="https://www.politecnicojic.edu.co/images/logo/logo-negro.png" alt="" />
        )
    }
};


const SlideNewsCard = () => {
    const [news, setNews] = useState([]);

    useEffect(() => {
        const fetchNews = async () => {
            try {
                const response = await fetch('https://td-g-production.up.railway.app/banner/tipo/2');
                const data = await response.json();
                setNews(data);
            } catch (error) {
                console.error('Error en la consulta de noticias:', error);
            }
        };
        fetchNews();
    }, []);

    if (news.length > 0) {
        return (
            <div class="flex flex-row md:flex-nowrap flex-wrap p-2 w-full h-max md:justify-start justify-evenly overflow-x-auto md:gap-x-4 gap-4">
                {news.map((each, index) => (
                    <NewCard key={index} newTitle={each.nombre} newContent={each.contenidoBanner} newImage={`https://td-g-production.up.railway.app${each.urlImagen}`} />
                ))}
            </div>
        )
    } else {
        return (
            <div className="text-center">
                No hay novedades en el momento!
            </div>
        )
    }
}

export { SlideBanner, SlideNewsCard }
