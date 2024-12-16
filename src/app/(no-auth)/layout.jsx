'use client'
import Wifi from '@/components/Wifi'
import { useAppContext } from '@/context/AppContext'
import { useTheme } from '@/context/ThemeContext';

// import LoaderWithLogo from '@/components/LoaderWithLogo'
import { useState, useEffect } from 'react'
// import style from './Medico.module.css'
import { useRouter } from 'next/navigation';
import Link from 'next/link'
import { usePathname } from 'next/navigation'
// import BottomNavigation from '@/components/BottomNavigation'
import Navbar from '@/components/Navbar'
import TimeDisplay from '@/components/TimeDisplay'
// import VideoClient from '@/components/Vide'
import { Turret_Road } from 'next/font/google'
// import Whatsapp from '@/components/Whatsapp'
import { MoonIcon, SunIcon, WindowIcon } from '@heroicons/react/24/solid';

function Home({ children }) {
    const router = useRouter()
    const { user, setUser, userDB, setUserDB, setUserProfile,
        fondoPrimario, setFondoPrimario,
        fondoSecundario, setFondoSecundario,
        fondoTerciario, setFondoTerciario, setUserCart, isOpen, setIsOpen, isOpen2, setIsOpen2, businessData, idioma, setIdioma, setUserProduct, setRecetaDB, precioJustoPDB, setPrecioJustoPDB, whatsapp, setWhatsapp, setUserData, filter, setFilter, nav, setNav, modal, setModal, cart, introClientVideo, setIntroClientVideo, recetaDBP, setRecetaDBP, productDB, search, setSearch, videoClientRef, setFilterQR, webScann, setWebScann, setTienda, setBusinessData, isBack, setBack } = useAppContext()

    const { theme, toggleTheme } = useTheme();


    const pathname = usePathname()




    useEffect(() => {
        const fetchProfile = async () => {
            const token = sessionStorage.getItem('token'); // Obtener el JWT desde sessionStorage
            // // console.log(token)

            try {
                const response = await fetch(window?.location?.href.includes('localhost')
                    ? 'http://localhost:3000/api/auth/validate'
                    : 'https://api.fastcash-mx.com/api/auth/validate', {
                    method: 'GET',
                    headers: {
                        'Authorization': token,  // Enviar el JWT en el encabezado de autorización
                    },
                });

                if (response.ok) {

                    const data = await response.json();
                    // // console.log(data)
                    setUser({ rol: data.user.tipoDeGrupo })
                    setUserDB(data.user)
                    pathname !== '/Newslater' && router.replace('/Home')

                } else {
                    // // console.log('No autorizado o sesión expirada');
                }
            } catch (error) {
                // // console.log('Error al cargar el perfil');
            }
        };
        fetchProfile();
    }, []);

    // useEffect(() => {
    //     user?.rol && user?.rol !== undefined
    //         ? pathname !== '/Newslater' && router.replace('/Home')
    //         : pathname !== '/PersonalAccount' && router.replace('/')
    // }, [user])

    return (
        <div>
            {children}
        </div>
    )
}






export default Home


