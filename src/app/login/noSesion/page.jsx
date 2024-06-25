"use client"
/* eslint-disable react-hooks/rules-of-hooks */
import React,{useEffect} from 'react'

function page() {

    useEffect(() => { 
        window.history.pushState(null, null, window.location.pathname); 
        window.addEventListener('popstate', onBackButtonEvent); 
        function onBackButtonEvent(e) {
            e.preventDefault();
            window.history.forward();  
        }
 
        return () => {
            window.removeEventListener('popstate', onBackButtonEvent);
        };
    }, []);

    return (
        <div>incia sesion home</div>
    )
}

export default page