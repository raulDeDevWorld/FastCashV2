'use client'
import { useAppContext } from '@/context/AppContext'
import React, { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'

import Loader from '@/components/Loader'
import SelectSimple from '@/components/SelectSimple'

import { useSearchParams } from 'next/navigation'
import dynamic from 'next/dynamic';
import { useTheme } from '@/context/ThemeContext';
import InputPass from '@/components/InputPass'
import Table from '@/components/Table'
// import Velocimetro from '@/components/Velocimetro'
const Velocimetro = dynamic(() => import("@/components/Velocimetro"), { ssr: false, });
import FormAddAccount from '@/components/FormAddAccount'
import FormAddMasiveAccounts from '@/components/FormAddMasiveAccounts'
import FormAddPersonalAccount from '@/components/FormAddPersonalAccount'
import FormAddPersonalData from '@/components/FormAddPersonalData'
import FormAddVerification from '@/components/FormAddVerification'
import FormAdminAccount from '@/components/FormAdminAccount'

import TableTools from '@/components/TableTools'

import Alert from '@/components/Alert'

import {
    refunds, historial,
    menuArray, filtro_1, rangesArray, cobrador, filterCliente, factura, Jumlah, estadoRembolso
} from '@/constants/index'
import { useRouter } from 'next/navigation';
import { ChatIcon, PhoneIcon, ClipboardDocumentCheckIcon, FolderPlusIcon, CurrencyDollarIcon, DocumentTextIcon, UserCircleIcon, ChatBubbleLeftEllipsisIcon } from '@heroicons/react/24/solid';
import Speedometer, {
    Background,
    Arc, DangerPath,
    Needle,
    Progress,
    Marks,
    Indicator,
} from 'react-speedometer';
import {
    encabezadoCasosDeCobranza,
    encabezadoIncurrirEnUnaEstaciónDeTrabajo,
    encabezadoGestionDeCuentasDeColección,
    encabezadoRegistroDeSMS,
    encabezadoCobroYValance,
    encabezadoRegistroHistorico,
    encabezadoMonitoreoDeTransacciones,
    encabezadoControlDeCumplimiento,
    encabezadoAuditoriaPeriodica,
    encabezadoCasosDeVerificacion,
    encabezadoListaFinal,
    encabezadoGestionDeAccesos,
} from '@/constants/TableHeaders.jsx'



export default function Home() {
    const [selectedLeft, setSelectedLeft] = useState(-1);
    const [selectedRight, setSelectedRight] = useState(-1);

    const router = useRouter()
    const [texto, setTexto] = useState('');
    const { user, userDB, setUserProfile, users, alerta, setAlerta, modal, checkedArr, setCheckedArr, setModal, loader, setLoader, setUsers, setUserSuccess, success, setUserData, postsIMG, setUserPostsIMG, divisas, setDivisas, exchange, setExchange, destinatario, setDestinatario, itemSelected, setItemSelected } = useAppContext()
    const [filter, setFilter] = useState({
        nombreProducto: 'Todo',
        ['Minimo dias vencido']: 0,
        ['Maximo dias vencido']: 10000000000,
        ['Estado de reembolso']: '',
        ['Cliente nuevo']: '',
        ['Nombre del cliente']: '',
        ['Número de teléfono']: ''
    })
    const [filter2, setFilter2] = useState({
        nombreProducto: 'Todo',
        ['Minimo dias vencido']: 0,
        ['Maximo dias vencido']: 10000000000,
        ['Estado de reembolso']: '',
        ['Cliente nuevo']: '',
        ['Nombre del cliente']: '',
        ['Número de teléfono']: ''
    })
    const [state, setState] = useState({})
    const [editItem, setEditItem] = useState(undefined)
    const [remesasDB, setRemesasDB] = useState(undefined)
    const refFirst = useRef(null);
    const [profileIMG, setProfileIMG] = useState('')
    const searchParams = useSearchParams()
    const [copied, setCopied] = useState(false);
    const { theme, toggleTheme } = useTheme();
    const seccion = searchParams.get('seccion')
    const item = searchParams.get('item')
    let menu = user?.rol ? menuArray[user.rol].filter(i => i.hash === seccion) : ''
    const [data, setData] = useState([])

    function sortArray(x, y) {
        if (x['translation']['spa']['common'].toLowerCase() < y['translation']['spa']['common'].toLowerCase()) { return -1 }
        if (x['translation']['spa']['common'].toLowerCase() > y['translation']['spa']['common'].toLowerCase()) { return 1 }
        return 0
    }
    function handlerSelect(name, i, uuid) {
        setState({ ...state, [uuid]: { [name]: i } })
    }

    function handlerSelected(position, index) {
        if (position === 'LEFT') {
            selectedLeft === index ? setSelectedLeft(-1) : setSelectedLeft(index)
        }
        if (position === 'RIGHT') {
            selectedLeft === index ? setSelectedRight(-1) : setSelectedRight(index)
        }
    }
    const prev = () => {
        requestAnimationFrame(() => {
            if (refFirst.current) {
                const scrollLeft = refFirst.current.scrollLeft;
                // console.log(scrollLeft);
                const itemWidth = screen.width - 50;
                refFirst.current.scrollLeft = scrollLeft - itemWidth;
            }
        });
    };
    const next = () => {
        requestAnimationFrame(() => {
            if (refFirst.current) {
                const scrollLeft = refFirst.current.scrollLeft;
                // console.log(scrollLeft);
                const itemWidth = screen.width - 50;
                // console.log(itemWidth);
                refFirst.current.scrollLeft = scrollLeft + itemWidth;
            }
        });
    };





    const trabajo = [
        { nombre: "taipe alejandro cristina magaly", lunes: "libre", martes: "operando", miercoles: "atraso-1", jueves: "libre", viernes: "falta", sabado: "atraso-2", domingo: "libre" },
        { nombre: "porozo aguirre brayan david", lunes: "libre", martes: "libre", miercoles: "operando", jueves: "libre", viernes: "atraso-1", sabado: "falta", domingo: "atraso-2" },
        { nombre: "abad usiña jilson vladimir", lunes: "atraso-1", martes: "libre", miercoles: "atraso-2", jueves: "operando", viernes: "libre", sabado: "falta", domingo: "libre" },
        { nombre: "castillo armas brandon alexis", lunes: "libre", martes: "atraso-2", miercoles: "libre", jueves: "operando", viernes: "atraso-1", sabado: "libre", domingo: "falta" },
        { nombre: "benavides quiroz jazmín carolina", lunes: "operando", martes: "libre", miercoles: "atraso-1", jueves: "falta", viernes: "libre", sabado: "atraso-2", domingo: "libre" },
        { nombre: "leon cuchipe lady priscila", lunes: "atraso-1", martes: "libre", miercoles: "operando", jueves: "libre", viernes: "falta", sabado: "atraso-2", domingo: "libre" },
        { nombre: "paucar alquinga andres steven", lunes: "atraso-2", martes: "operando", miercoles: "libre", jueves: "falta", viernes: "libre", sabado: "atraso-1", domingo: "libre" },
        { nombre: "arce mendez cristian santiago", lunes: "falta", martes: "libre", miercoles: "atraso-1", jueves: "operando", viernes: "libre", sabado: "atraso-2", domingo: "libre" },
        { nombre: "murillo jerez josselyne michelle", lunes: "libre", martes: "atraso-1", miercoles: "operando", jueves: "libre", viernes: "falta", sabado: "libre", domingo: "atraso-2" },
        { nombre: "alvarez puente gabriela geomar", lunes: "libre", martes: "atraso-2", miercoles: "falta", jueves: "operando", viernes: "libre", sabado: "libre", domingo: "atraso-1" },
        { nombre: "cuaspud gallegos katherine dayana", lunes: "atraso-1", martes: "libre", miercoles: "operando", jueves: "libre", viernes: "falta", sabado: "atraso-2", domingo: "libre" },
        { nombre: "bernal ceron tobias bryan", lunes: "libre", martes: "operando", miercoles: "libre", jueves: "atraso-1", viernes: "falta", sabado: "libre", domingo: "atraso-2" },
        { nombre: "jimenez espinoza byron andres", lunes: "libre", martes: "libre", miercoles: "atraso-2", jueves: "operando", viernes: "falta", sabado: "atraso-1", domingo: "libre" },
        { nombre: "ponce murillo yesika ariani", lunes: "atraso-2", martes: "falta", miercoles: "libre", jueves: "operando", viernes: "libre", sabado: "atraso-1", domingo: "libre" },
        { nombre: "quijia sotalin valeria paulina", lunes: "operando", martes: "libre", miercoles: "atraso-1", jueves: "falta", viernes: "libre", sabado: "atraso-2", domingo: "libre" },
        { nombre: "encalada quishpe david andres", lunes: "libre", martes: "atraso-1", miercoles: "operando", jueves: "libre", viernes: "falta", sabado: "libre", domingo: "atraso-2" },
        { nombre: "sigcha palango tania selena", lunes: "atraso-1", martes: "libre", miercoles: "libre", jueves: "operando", viernes: "falta", sabado: "atraso-2", domingo: "libre" },
        { nombre: "carrasco ortega bryan josue", lunes: "libre", martes: "operando", miercoles: "atraso-1", jueves: "libre", viernes: "falta", sabado: "libre", domingo: "atraso-2" },
        { nombre: "montenegro villacis alan david", lunes: "libre", martes: "atraso-1", miercoles: "operando", jueves: "falta", viernes: "libre", sabado: "atraso-2", domingo: "libre" },
        { nombre: "andrango allauca erick fabricio", lunes: "falta", martes: "libre", miercoles: "atraso-2", jueves: "operando", viernes: "libre", sabado: "atraso-1", domingo: "libre" },
        { nombre: "blasio gonzalez tito jonathan", lunes: "libre", martes: "atraso-1", miercoles: "operando", jueves: "libre", viernes: "falta", sabado: "libre", domingo: "atraso-2" },
        { nombre: "garnica robayo hernan garnica", lunes: "atraso-1", martes: "libre", miercoles: "libre", jueves: "operando", viernes: "falta", sabado: "atraso-2", domingo: "libre" },
        { nombre: "ramos sánchez janny joey", lunes: "libre", martes: "falta", miercoles: "atraso-1", jueves: "operando", viernes: "libre", sabado: "atraso-2", domingo: "libre" },
        { nombre: "lobo sanchez miguel eduardo", lunes: "libre", martes: "atraso-2", miercoles: "operando", jueves: "libre", viernes: "falta", sabado: "libre", domingo: "atraso-1" },
        { nombre: "andi andy silvana maritza", lunes: "libre", martes: "operando", miercoles: "falta", jueves: "libre", viernes: "atraso-1", sabado: "atraso-2", domingo: "libre" },
        { nombre: "pulupa cornejo katty pamela", lunes: "atraso-1", martes: "libre", miercoles: "operando", jueves: "libre", viernes: "falta", sabado: "libre", domingo: "atraso-2" },
        { nombre: "lopez morales tifany gissell", lunes: "libre", martes: "atraso-2", miercoles: "falta", jueves: "operando", viernes: "libre", sabado: "atraso-1", domingo: "libre" },
        { nombre: "riera monard dayana andrea", lunes: "libre", martes: "atraso-1", miercoles: "operando", jueves: "libre", viernes: "falta", sabado: "libre", domingo: "atraso-2" },
        { nombre: "marquez ayala marcos jeremias", lunes: "atraso-1", martes: "libre", miercoles: "falta", jueves: "operando", viernes: "libre", sabado: "atraso-2", domingo: "libre" },
        { nombre: "lizano arauz fernando daniel", lunes: "libre", martes: "operando", miercoles: "atraso-1", jueves: "libre", viernes: "falta", sabado: "libre", domingo: "atraso-2" },
        { nombre: "balderramo loor xavier sebastian", lunes: "atraso-2", martes: "libre", miercoles: "operando", jueves: "libre", viernes: "falta", sabado: "libre", domingo: "atraso-1" },
        { nombre: "choque quinteros ariana mateo", lunes: "libre", martes: "atraso-1", miercoles: "falta", jueves: "operando", viernes: "libre", sabado: "atraso-2", domingo: "libre" },
        { nombre: "sucari jara edward pablo", lunes: "atraso-1", martes: "libre", miercoles: "operando", jueves: "libre", viernes: "falta", sabado: "libre", domingo: "atraso-2" },
        { nombre: "delgado barros rafael adrian", lunes: "falta", martes: "libre", miercoles: "atraso-1", jueves: "operando", viernes: "libre", sabado: "atraso-2", domingo: "libre" },
        { nombre: "guzman tovar eric adrian", lunes: "libre", martes: "atraso-2", miercoles: "falta", jueves: "operando", viernes: "libre", sabado: "atraso-1", domingo: "libre" },
        { nombre: "velasco masi losy jazmin", lunes: "atraso-2", martes: "libre", miercoles: "operando", jueves: "falta", viernes: "libre", sabado: "atraso-1", domingo: "libre" },
        { nombre: "gonzales perez brayan diego", lunes: "libre", martes: "falta", miercoles: "libre", jueves: "operando", viernes: "atraso-1", sabado: "libre", domingo: "atraso-2" },
        { nombre: "carrasco salazar jaime roberto", lunes: "operando", martes: "atraso-1", miercoles: "falta", jueves: "libre", viernes: "libre", sabado: "atraso-2", domingo: "libre" },
        { nombre: "rivadeneira gonzalez laura", lunes: "libre", martes: "atraso-2", miercoles: "operando", jueves: "libre", viernes: "falta", sabado: "libre", domingo: "atraso-1" },
        { nombre: "campos villavicencio brayan alexander", lunes: "libre", martes: "operando", miercoles: "falta", jueves: "atraso-1", viernes: "libre", sabado: "libre", domingo: "atraso-2" },
        { nombre: "quebrada morales solymar", lunes: "atraso-2", martes: "libre", miercoles: "falta", jueves: "operando", viernes: "libre", sabado: "atraso-1", domingo: "libre" },
        { nombre: "yucra ordonez jhonny erick", lunes: "atraso-1", martes: "libre", miercoles: "operando", jueves: "libre", viernes: "falta", sabado: "atraso-2", domingo: "libre" },
        { nombre: "salazar rodriguez katherine vitory", lunes: "libre", martes: "atraso-2", miercoles: "operando", jueves: "falta", viernes: "libre", sabado: "atraso-1", domingo: "libre" },
        { nombre: "rodriguez lopez jhonnatthan", lunes: "falta", martes: "libre", miercoles: "atraso-1", jueves: "operando", viernes: "libre", sabado: "atraso-2", domingo: "libre" },
        { nombre: "aillón choque benjamin", lunes: "atraso-2", martes: "libre", miercoles: "operando", jueves: "libre", viernes: "falta", sabado: "atraso-1", domingo: "libre" },
        { nombre: "acosta ramirez emily", lunes: "libre", martes: "atraso-1", miercoles: "falta", jueves: "operando", viernes: "libre", sabado: "libre", domingo: "atraso-2" },
        { nombre: "flores veintimilla jose luis", lunes: "atraso-1", martes: "libre", miercoles: "operando", jueves: "libre", viernes: "falta", sabado: "libre", domingo: "atraso-2" },
        { nombre: "toapanta tulcan nicole", lunes: "atraso-2", martes: "libre", miercoles: "falta", jueves: "operando", viernes: "libre", sabado: "atraso-1", domingo: "libre" },
        { nombre: "moreno velasco milena", lunes: "falta", martes: "operando", miercoles: "libre", jueves: "atraso-1", viernes: "libre", sabado: "atraso-2", domingo: "libre" },
        { nombre: "verdugo lasso jhonny wilson", lunes: "atraso-1", martes: "libre", miercoles: "falta", jueves: "operando", viernes: "libre", sabado: "atraso-2", domingo: "libre" },
        { nombre: "ingacochea haro eliana", lunes: "libre", martes: "atraso-2", miercoles: "operando", jueves: "falta", viernes: "libre", sabado: "atraso-1", domingo: "libre" },
        { nombre: "zapata aguilar cristian edward", lunes: "libre", martes: "atraso-1", miercoles: "falta", jueves: "operando", viernes: "libre", sabado: "atraso-2", domingo: "libre" },
        { nombre: "de la torre muñoz luis andres", lunes: "atraso-2", martes: "libre", miercoles: "operando", jueves: "libre", viernes: "falta", sabado: "libre", domingo: "atraso-1" },
        { nombre: "rios ávila diana carolina", lunes: "libre", martes: "atraso-1", miercoles: "operando", jueves: "libre", viernes: "falta", sabado: "libre", domingo: "atraso-2" },

    ]


    const cobradores = [
        {
            id: "S0",
            nombre: "Alvarez Puente Gabriela Geomar",
            usuario: "CobradorA1",
            telefono: "5215838160069",
            extension: "88136193",
            casos: 26,
            llamadasRealizadas: 16,
            clientesContactados: 20,
            clientesSinResponder: 3,
            pagosHoy: 5,
            porcentajeHoy: "11.54%",
            ptp2pm: 7,
            ptp6pm: 5,
            porcentajePTP: "26.92%",
            llamadas3pm: 7,
            ptp10am: 6,
            porcentajeLlamadas: "26.92%",
            llamadasElDiaSiguiente: 8,
            llamadasFinales: 7,
            porcentajeFinal: "30.77%",
            tasaFinal: 12,
            porcentajeTasaFinal: "46.15%",
        },
        {
            id: "S0",
            nombre: "Benavides Quiroz Jazmín Carolina",
            usuario: "CobradorA8",
            telefono: "5215838160070",
            extension: "53828419",
            casos: 27,
            llamadasRealizadas: 16,
            clientesContactados: 22,
            clientesSinResponder: 4,
            pagosHoy: 5,
            porcentajeHoy: "14.81%",
            ptp2pm: 6,
            ptp6pm: 5,
            porcentajePTP: "22.22%",
            llamadas3pm: 8,
            ptp10am: 5,
            porcentajeLlamadas: "29.63%",
            llamadasElDiaSiguiente: 8,
            llamadasFinales: 4,
            porcentajeFinal: "29.63%",
            tasaFinal: 10,
            porcentajeTasaFinal: "37.04%",
        },
        {
            id: "S0",
            nombre: "Sigcha Palango Tania Selena",
            usuario: "CobradorA9",
            telefono: "5215838160071",
            extension: "97187966",
            casos: 26,
            llamadasRealizadas: 16,
            clientesContactados: 22,
            clientesSinResponder: 5,
            pagosHoy: 6,
            porcentajeHoy: "19.23%",
            ptp2pm: 9,
            ptp6pm: 6,
            porcentajePTP: "34.62%",
            llamadas3pm: 10,
            ptp10am: 3,
            porcentajeLlamadas: "38.46%",
            llamadasElDiaSiguiente: 11,
            llamadasFinales: 2,
            porcentajeFinal: "42.31%",
            tasaFinal: 12,
            porcentajeTasaFinal: "46.15%",
        },
        {
            id: "S0",
            nombre: "Jimenez Espinoza Byron Andres",
            usuario: "CobradorA10",
            telefono: "5215838160072",
            extension: "35625589",
            casos: 26,
            llamadasRealizadas: 16,
            clientesContactados: 24,
            clientesSinResponder: 5,
            pagosHoy: 0,
            porcentajeHoy: "19.23%",
            ptp2pm: 11,
            ptp6pm: 0,
            porcentajePTP: "42.31%",
            llamadas3pm: 11,
            ptp10am: "",
            porcentajeLlamadas: "42.31%",
            llamadasElDiaSiguiente: 13,
            llamadasFinales: 0,
            porcentajeFinal: "50.00%",
            tasaFinal: 15,
            porcentajeTasaFinal: "57.69%",
        },
        {
            id: "S0",
            nombre: "Garnica Robayo Hernan Garnica",
            usuario: "CobradorA16",
            telefono: "5215838160084",
            extension: "68942789",
            casos: 27,
            llamadasRealizadas: 16,
            clientesContactados: 19,
            clientesSinResponder: 0,
            pagosHoy: 4,
            porcentajeHoy: "0.00%",
            ptp2pm: 2,
            ptp6pm: 6,
            porcentajePTP: "7.41%",
            llamadas3pm: 4,
            ptp10am: 2,
            porcentajeLlamadas: "14.81%",
            llamadasElDiaSiguiente: 4,
            llamadasFinales: 6,
            porcentajeFinal: "14.81%",
            tasaFinal: 8,
            porcentajeTasaFinal: "29.63%",
        },
        {
            id: "S0",
            nombre: "Murillo Jerez Josselyne Michelle",
            usuario: "CobradorA17",
            telefono: "5215838160085",
            extension: "69544512",
            casos: 27,
            llamadasRealizadas: 16,
            clientesContactados: 18,
            clientesSinResponder: 9,
            pagosHoy: 6,
            porcentajeHoy: "33.33%",
            ptp2pm: 10,
            ptp6pm: 9,
            porcentajePTP: "37.04%",
            llamadas3pm: 10,
            ptp10am: 7,
            porcentajeLlamadas: "37.04%",
            llamadasElDiaSiguiente: 11,
            llamadasFinales: 6,
            porcentajeFinal: "40.74%",
            tasaFinal: 12,
            porcentajeTasaFinal: "44.44%",
        },
        {
            id: "S0",
            nombre: "Lopez Morales Tifany Gissell",
            usuario: "CobradorA18",
            telefono: "5215838160086",
            extension: "62862435",
            casos: 27,
            llamadasRealizadas: 16,
            clientesContactados: 21,
            clientesSinResponder: 2,
            pagosHoy: 3,
            porcentajeHoy: "7.41%",
            ptp2pm: 4,
            ptp6pm: 9,
            porcentajePTP: "14.81%",
            llamadas3pm: 6,
            ptp10am: 2,
            porcentajeLlamadas: "22.22%",
            llamadasElDiaSiguiente: 6,
            llamadasFinales: 6,
            porcentajeFinal: "22.22%",
            tasaFinal: 9,
            porcentajeTasaFinal: "33.33%",
        },
        {
            id: "S0",
            nombre: "Andi Andy Silvana Maritza",
            usuario: "CobradorA19",
            telefono: "5215838160087",
            extension: "71868466",
            casos: 21,
            llamadasRealizadas: 16,
            clientesContactados: 16,
            clientesSinResponder: 3,
            pagosHoy: 4,
            porcentajeHoy: "14.29%",
            ptp2pm: 5,
            ptp6pm: 4,
            porcentajePTP: "23.81%",
            llamadas3pm: 6,
            ptp10am: 4,
            porcentajeLlamadas: "28.57%",
            llamadasElDiaSiguiente: 7,
            llamadasFinales: 6,
            porcentajeFinal: "33.33%",
            tasaFinal: 10,
            porcentajeTasaFinal: "47.62%",
        },
        {
            id: "S0",
            nombre: "Carrasco Ortega Bryan Josue",
            usuario: "CobradorA20",
            telefono: "5215838160088",
            extension: "46712168",
            casos: 27,
            llamadasRealizadas: 16,
            clientesContactados: 24,
            clientesSinResponder: 1,
            pagosHoy: 6,
            porcentajeHoy: "3.70%",
            ptp2pm: 5,
            ptp6pm: 9,
            porcentajePTP: "18.52%",
            llamadas3pm: 7,
            ptp10am: 6,
            porcentajeLlamadas: "43.75%",
            llamadasElDiaSiguiente: 7,
            llamadasFinales: 5,
            porcentajeFinal: "25.93%",
            tasaFinal: 10,
            porcentajeTasaFinal: "37.04%",
        }
    ];


    function handlerSelectCheck(e, i) {
        if (e.target.checked) {
            // Si está marcado, agrega el índice al array
            setCheckedArr([...checkedArr, i]);
        } else {
            // Si no está marcado, quita el índice del array
            setCheckedArr(checkedArr.filter(item => item.usuario !== i.usuario));
        }

    }
    async function handlerFetch() {
        const res = await fetch(
            window?.location?.href?.includes('localhost')
                ? 'http://localhost:3000/api/auth/users'
                : 'https://api.fastcash-mx.com/api/auth/users')
        const data = await res.json()
        // console.log(data)
        setData(data)
    }

    // console.log(data)


    useEffect(() => {
        handlerFetch()
    }, [])


    return (
        (user?.rol === 'Admin' || user.rol === 'Super Admin' || user?.rol === 'Recursos Humanos' || user.rol === 'Manager de Cobranza' || user.rol === 'Manager de Cobranza' || user.rol === 'Manager de Auditoria' || user.rol === 'Manager de Verificación') && item === 'Reporte diario' && <table className="w-full min-w-[2000px] border-[1px] bg-white text-[14px] text-left text-gray-500 border-t-4 border-t-gray-400">
            <thead className="text-[10px] text-white uppercase bg-gray-900 sticky top-[0px] z-20">


                <tr className=' bg-gray-800'>
                    <th className='px-3 py-2'>
                        <input type="checkbox" />
                    </th>
                    <th className="px-4 py-2 text-white">SEGMENTO</th>
                    <th className="px-4 py-2 text-white">Nombres</th>

                    <th className="px-4 py-2 text-white">Cuenta</th>

                    <th className="px-4 py-2 text-white">CASOS</th>
                    <th className="px-4 py-2 text-white">Meta</th>

                    <th className="px-4 py-2 text-yellow-400 ">PAGOS 10:00 am</th>
                    <th className="px-4 py-2 text-white">PTP 10:00 am</th>
                    <th className="px-4 py-2 text-white">Tasa de recuperación</th>

                    <th className="px-4 py-2 text-yellow-400 ">PAGOS 12:00 am</th>
                    <th className="px-4 py-2 text-white">PTP 12:00 am</th>
                    <th className="px-4 py-2 text-white">Tasa de recuperación</th>

                    <th className="px-4 py-2 text-yellow-400 ">PAGOS 2:00 pm</th>
                    <th className="px-4 py-2 text-white">PTP 2:00 pm</th>
                    <th className="px-4 py-2 text-white">Tasa de recuperación</th>

                    <th className="px-4 py-2 text-yellow-400 ">PAGOS 4:00 pm</th>
                    <th className="px-4 py-2 text-white">PTP 4:00 pm</th>
                    <th className="px-4 py-2 text-white">Tasa de recuperación</th>

                    <th className="px-4 py-2 text-yellow-400 ">PAGOS 6:00 pm</th>
                    <th className="px-4 py-2 text-white">PTP 6:00 pm</th>
                    <th className="px-4 py-2 text-white">Tasa de recuperación</th>

                    <th className="px-4 py-2   text-yellow-400">Pagos total</th>
                    <th className="px-4 py-2 text-white">Tasa de recuperación</th>

                </tr>
            </thead>
            <tbody>
                {data.map((i, index) => (
                    <tr key={index} className={`bg-gray-200 border-b text-[12px] ${index % 2 === 0 ? 'bg-gray-300' : 'bg-gray-200'}`}>

                        <td className={`px-3 py-2 text-[12px] border-b ${index % 2 === 0 ? 'bg-gray-300' : 'bg-gray-200'} ${selectedLeft === 1 ? 'sticky left-0 z-10' : ''}`} >
                            <input type="checkbox" onClick={(e) => handlerSelectCheck(e, i)} />
                        </td>
                        <td className="px-4 py-2">{i.id}</td>
                        <td className="px-4 py-2">{i.cuentaPersonal}</td>
                        <td className="px-4 py-2">{i.cuenta}</td>

                        <td className="px-4 py-2">{i.casos}</td>
                        <td className="px-4 py-2">{i.llamadasRealizadas}</td>
                        <td className="px-4 py-2  bg-yellow-400">{i.clientesSinResponder}</td>
                        <td className="px-4 py-2">{i.pagosHoy}</td>
                        <td className="px-4 py-2">{i.porcentajeHoy}</td>
                        <td className="px-4 py-2 bg-yellow-400">{i.ptp2pm}</td>
                        <td className="px-4 py-2">{i.ptp6pm}</td>
                        <td className="px-4 py-2">{i.porcentajePTP}</td>
                        <td className="px-4 py-2 bg-yellow-400">{i.llamadas3pm}</td>
                        <td className="px-4 py-2">{i.ptp10am}</td>
                        <td className="px-4 py-2">{i.porcentajeLlamadas}</td>
                        <td className="px-4 py-2 bg-yellow-400">{i.llamadasFinales}</td>
                        <td className="px-4 py-2">{i.tasaFinal}</td>
                        <td className="px-4 py-2">{i.porcentajeFinal}</td>

                        <td className="px-4 py-2 bg-yellow-400">{i.porcentajeTasaFinal}</td>
                        <td className="px-4 py-2">{i.tasaFinal}</td>
                        <td className="px-4 py-2">{i.porcentajeFinal}</td>
                        <td className="px-4 py-2 bg-yellow-400">{i.tasaFinal}</td>

                        <td className="px-4 py-2">{i.porcentajeTasaFinal}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    )
}








