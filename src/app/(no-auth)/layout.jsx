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
    const { user, setUser, userDB, setUserDB, setUserProfile } = useAppContext()
    const { theme, toggleTheme } = useTheme();
    const pathname = usePathname()

    useEffect(() => {
        const fetchProfile = async () => {
            const token = sessionStorage.getItem('token'); // Obtener el JWT desde sessionStorage
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

                    if (data.user.codificacionDeRoles === 'Cuenta Personal') {
                        setUser({ ...data.user, rol: data.user.codificacionDeRoles })
                            (pathname === '/PersonalAccount' || pathname === '/') && router.replace('/Account')
                    } else {
                        setUserDB(data.user)

                        if (data.user?.emailPersonal) {

                            const res = await fetch(window?.location?.href.includes('localhost')
                                ? `http://localhost:3000/api/auth/personalAccounts?emailPersonal=${data.user?.emailPersonal}`
                                : `https://api.fastcash-mx.com/api/auth/personalAccounts?emailPersonal=${data.user?.emailPersonal}`)
                            const resData = await res.json()
                            setUser({ ...resData[0], rol: data.user.tipoDeGrupo })
                                (pathname === '/PersonalAccount' || pathname === '/') && router.replace('/Home')

                        } else {
                            setUser({ rol: data.user.tipoDeGrupo })
                                (pathname === '/PersonalAccount' || pathname === '/') && router.replace('/Home')
                        }
                    }
                } else {
                    setUser({ rol: undefined })
                }
            } catch (error) {
                // // console.log('Error al cargar el perfil');
            }
        };
        fetchProfile();
    }, []);
    console.log(user)
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


