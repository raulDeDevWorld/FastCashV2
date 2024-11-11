'use client';
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



export default function Home() {
    const [selectedLeft, setSelectedLeft] = useState(-1);
    const [selectedRight, setSelectedRight] = useState(-1);

    const router = useRouter()
    const [texto, setTexto] = useState('');
    const { user, userDB, setUserProfile, users, modal, setModal, setUsers, setUserSuccess, success, setUserData, postsIMG, setUserPostsIMG, divisas, setDivisas, exchange, setExchange, destinatario, setDestinatario } = useAppContext()
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
    function handlerSelectClick(name, i, uuid) {
        setFilter({ ...filter, [name]: i })
    }
    // console.log(filter)
    function onChangeHandler(e) {
        // console.log(e.target.value)
        setFilter({ ...filter, [e.target.name]: e.target.value })
    }
    function formatDate(date) {
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();

        return `${day}/${month}/${year}`;
    }
    function getDay(dias) {
        var dt = new Date();


        const diasSemana = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado",];

        // // console.log('Fecha Actual: ' + dt);
        //restando los dias deseados
        const dat = dt.setDate(dt.getDate() + dias);
        const index = new Date(dat).getDay()
        //mostrando el resultado
        return { val: formatDate(dt), day: diasSemana[index] }
    }
    //fecha actual
    const [value, setValue] = useState('Por favor elige')
    const [value2, setValue2] = useState('Por favor elige')

    function handlerSelectClick2(name, i, uuid) {
        setValue(i)
    }
    function handlerSelectClick3(name, i, uuid) {
        setValue2(i)
    }
    const [selectedCheckbox, setSelectedCheckbox] = useState(null);

    function handleCheckboxChange(index) {
        setSelectedCheckbox(index);
    };
    const [isGreen, setIsGreen] = useState(true);
    const handleClick = () => {
        setIsGreen(!isGreen);
    };
    const optionsArray = [
        "Por favor elige",
        "Sin contactar",
        "No contactable",
        "Contactado",
        "Propósito de retrasar",
        "Propósito de pagar",
        "Promete a pagar",
        "Pagará pronto"
    ];

    // console.log(filter)

    const copyToClipboard = (textToCopy) => {
        navigator.clipboard.writeText(textToCopy).then(() => {
            setCopied(textToCopy);
            setTimeout(() => setCopied(false), 3000); // Ocultar el mensaje después de 2 segundos
        });
    };
    const marks = Array.from({ length: 11 }, (_, i) => i * 10); // Genera marcas cada 10 unidades
    const radius = 100; // Radio del arco del velocímetro
    const manejarCambio = (event) => {
        setTexto(event.target.value);
    };







    const [password, setPassword] = useState('');

    const generarContrasena = () => {
        const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+[]{}|;:,.<>?';
        let contrasenaGenerada = '';
        const longitud = 16; // Longitud de la contraseña

        for (let i = 0; i < longitud; i++) {
            const indice = Math.floor(Math.random() * caracteres.length);
            contrasenaGenerada += caracteres[indice];
        }

        setPassword(contrasenaGenerada);
    };

    function onChangePass(e) {
        setPassword(e.target.value)
    }




    const [showPassword, setShowPassword] = useState(false)
    // console.log(selectedLeft)






    {/* ---------------------------------COLECCION DE CASOS--------------------------------- */ }

    const encabezadoCasosDeCobranza = !user?.rol?.includes('Usuario')
        ? [
            "Contactos",
            "Seleccionar",
            "Número de préstamo",
            "ID de sub-factura",
            "Estado de reembolso",
            "Nombre del cliente",
            "Número de teléfono móvil",
            "Clientes nuevos",
            "Importe reembolsable (Rp)",
            "Importe pagado (Rp)",
            "Registro de notas",
            "Nombre del producto",
            "Fecha de reembolso",
            "Días Vencidos",
            "Fecha de cancelación a cuenta",
            "Fecha de creación de la tarea",
            "Fecha de tramitación del caso",
            "Nombre de la empresa",
            "Apodo de usuario de cobro",
            "Operar"
        ]
        : [
            "Contactos",
            "Seleccionar",
            "Número de préstamo",
            "ID de sub-factura",
            "Estado de reembolso",
            "Nombre del cliente",
            "Número de teléfono móvil",
            "Clientes nuevos",
            "Importe reembolsable (Rp)",
            "Importe pagado (Rp)",
            "Registro de notas",
            "Nombre del producto",
            "Fecha de reembolso",
            "Días Vencidos",
            "Fecha de cancelación a cuenta",
            "Fecha de creación de la tarea",
            "Fecha de tramitación del caso",
            "Nombre de la empresa",
            "Operar"
        ]
        ;
    const encabezadoIncurrirEnUnaEstaciónDeTrabajo = [
        "Contactos",
        "Seleccionar",
        "Número de préstamo",
        "ID de sub-factura",
        "Estado de reembolso",
        "Nombre del cliente",
        "Número de teléfono móvil",
        "Clientes nuevos",
        "Importe adeudado (MXN)",
        "Importe pagado (MXN)",
        "Registro de notas",
        "Código de producto",
        "Fecha de reembolso",
        "Días Vencidos",
        "Fecha de cancelación a cuenta",
        "Fecha de creación de la tarea",
        "Fecha de tramitación del caso",
        "Nombre de la empresa",
        "Apodo de usuario de cobro",
        "Operar"
    ];
    const encabezadoGestionDeCuentasDeColección = [
        "Cuenta de usuario",
        "Apodo del usuario",
        "Codigo del producto",
        "Codificación de roles",
        "Tanda Koleksi",
        "Nombre del rol",
        "Situación laboral",
        "Nombre del grupo",
        "Origen de la cuenta",
        "Fecha de creación",
        "Operar"
    ];

    const encabezadoRegistroDeSMS = [
        "Seleccionar",
        "Remitente de sms",
        "número de teléfono móvil",
        "Canal de envío",
        "Código de producto",
        "Contenido",
        "Fecha de envío",
        "Estado de envío de SMS",
        'Estado de llegada por SMS'
    ]
    const encabezadoCobroYValance = [
        "Seleccionar",
        "ID de pedido",
        "ID de préstamo",
        "Cantidad prestada",
        "Cantidad recibida",
        "Código del proyecto",
        "número de tarjeta",
        "Nombre del banco",
        "Titular de la tarjeta",
        "Estado final"
    ];

    {/* ---------------------------------AUDITORIA Y CONTROL DE CALIDAD--------------------------------- */ }


    const encabezadoRegistroHistorico = [
        "Descripción de la excepción",
        "Apodo del usuario",
        "Código del producto",
        "Código de operación",
        "Contenido de la operación",
        "Resultados de la operación",
        "Tiempo de operación"
      ];
    const encabezadoMonitoreoDeTransacciones = [
        "Seleccionar",
        "ID de pedido",
        "ID de préstamo",
        "Cantidad prestada",
        "Cantidad recibida",
        "Código del proyecto",
        "número de tarjeta",
        "Nombre del banco",
        "Titular de la tarjeta",
        "Estado final"
    ];

    const encabezadoControlDeCumplimiento = [
        "Nombres y apellidos",
        "Apodo de Usuario Cobrador",
        "Seleccionar",
        "DNI del Cobrador",
        "Casos Asignados al Cobrador",
        "Reporte",
        "Telefono",
        "Operaciones"

    ];

    const encabezadoAuditoriaPeriodica = [
        "Seleccionar",
        "ID auditor",
        "Nombre del auditor",
        "Usuario designado",
        "Nombre del operador",
        "Observación",
        "Amonestacion",
        "Valor de multa",
        "Estado de multa",
        "Fecha de creacion",
        "Operar"
    ];



    {/* --------------------------------- VERIFICACION DE CREDITOS--------------------------------- */ }

    const encabezadoCasosDeVerificacion = !user?.rol?.includes('Usuario')
        ? [
            "Contactos",
            "Seleccionar",
            "Número de préstamo",
            "ID de sub-factura",
            "Estado de credito",
            "Nombre del cliente",
            "Número de teléfono móvil",
            "Clientes nuevos",
            "Valor solicitado (VS)",
            "Valor enviado (VE)",
            "Registro de notas",
            "Nombre del producto",
            "Fecha de reembolso",
            "Fecha de creación de la tarea",
            "Fecha de tramitación del caso",
            "Nombre de la empresa",
            "Apodo de usuario de cobro",
            "Operar"
        ]
        : [
            "Contactos",
            "Seleccionar",
            "Número de préstamo",
            "ID de sub-factura",
            "Estado de credito",
            "Nombre del cliente",
            "Número de teléfono móvil",
            "Clientes nuevos",
            "Valor solicitado (VS)",
            "Valor enviado (VE)",
            "Registro de notas",
            "Nombre del producto",
            "Fecha de reembolso",
            "Fecha de creación de la tarea",
            "Fecha de tramitación del caso",
            "Nombre de la empresa",
            "Operar"
        ]
    const encabezadoListaFinal = [
        "Numero de Whatsapp *",
        "Seleccionar",
        "Numero de Prestamos",
        "Estado de Solicitud",
        "Nombre del Cliente",
        "Numero de Telefono *",
        "Producto",
        "Usuario Verificador",
        "Comentario",
        "Fecha"
    ];

    {/* --------------------------------- GESTION DE ACCESOS--------------------------------- */ }

    const encabezadoGestionDeAccesos = [
        "Seleccionar",
        "Nombre completo",
        "DNI",
        "Telefono",
        "Email",
        "Usuario Asignado",
        "Rol",
        "Operaciones"
    ];













    
    const encabezadoGestionDeCuentasPersonales = [
        "Seleccionar",
        "Nombre completo",
        "DNI",
        "Telefono",
        "Email",
        "Usuario Asignado",
        "Operaciones"
    ];
    const encabezadoAccesos = [
        "Seleccionar",
        "Nombre completo",
        "DNI",
        "Telefono",
        "Email",
        "Usuario Asignado",
        "Rol",
        "Operaciones"
    ]
    const gestionDeRoles = {
        ['Manager de Auditoria']: ['Asesor de Auditoria'],
        ['Admin']: ['Manager de Auditoria', 'Manager de Cobranza', 'Manager de Verificación', 'Asesor de Auditoria', 'Asesor de Cobranza', 'Asesor de Verificación'],
        ['Recursos Humanos']: ['Admin', 'Manager de Auditoria', 'Manager de Cobranza', 'Manager de Verificación', 'Asesor de Auditoria', 'Asesor de Cobranza', 'Asesor de Verificación'],
        ['Super Admin']: ['RH', 'Admin', 'Manager de Auditoria', 'Manager de Cobranza', 'Manager de Verificación', 'Asesor de Auditoria', 'Asesor de Cobranza', 'Asesor de Verificación']
    }



    const encabezadoResgistroDeUsuarios = [
        "Nombres y apellidos",
        "Apodo de Usuario Cobrador",
        "Seleccionar",
        "DNI del Cobrador",
        "Casos Asignados al Cobrador",
        "Reporte",
        "Telefono",
        "Operaciones"

    ];


    const mensajes = [
        "Seleccionar",
        "Remitente de sms",
        "número de teléfono móvil",
        "Canal de envío",
        "Código de producto",
        "Contenido",
        "Fecha de envío",
        "Estado de envío de SMS",
        'Estado de llegada por SMS'
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


    const getBackgroundClass = (estado) => {
        switch (estado) {
            case 'operando':
                return 'bg-green-400';
            case 'atraso-1':
                return 'bg-yellow-400';
            case 'atraso-2':
                return 'bg-orange-400';
            case 'falta':
                return 'bg-red-500';
            case 'libre':
                return 'bg-gray-300';
            default:
                return '';
        }
    };
    const liquidacion = [
        "Seleccionar",
        "ID de pedido",
        "ID de préstamo",
        "Cantidad prestada",
        "Cantidad recibida",
        "Código del proyecto",
        "número de tarjeta",
        "Nombre del banco",
        "Titular de la tarjeta",
        "Estado final"
    ];
    const liquidacion2 = [
        "16184477",
        "3036428",
        "2,800",
        "1,820",
        "AMC",
        "4152313918161022",
        "BBVA BANCOMER",
        "JOSE EDUARDO",
        "Ha llegado a la cuenta"
    ];
    const auditoriaPeriodica = [
        "Seleccionar",
        "ID auditor",
        "Nombre del auditor",
        "Usuario designado",
        "Nombre del operador",
        "Observación",
        "Amonestacion",
        "Valor de multa",
        "Estado de multa",
        "Fecha de creacion",
        "Operar"
    ];
    const auditoriaPeriodica2 = [
        "16184477",
        "Alan Montenegro",
        "Alan001",
        "Kiara Palacios",
        "Con observacion",
        "Operativa",
        "$ 10.00",
        "Aprobado",
        "12/12/2024 12:00 pm"
    ];



    useEffect(() => {
        user === undefined && router.push('/')
    }, [])
    return (
        user?.rol && <main className={` h-full pt-[20px] `}>
            {
                modal === 'Registrar' && <div className='fixed flex justify-center items-center top-0 left-0 bg-[#0000007c] h-screen w-screen z-50' onClick={() => setModal('')}>
                    <div className='relative flex flex-col items-center justify-center bg-gray-200 w-[400px] h-[300px] p-5 space-y-5 rounded-[5px]' onClick={(e) => e.stopPropagation()}>
                        <button
                            className="absolute top-5 right-5 flex items-center justify-center w-12 h-6 bg-red-500 text-white rounded-[5px] hover:bg-red-600 focus:outline-none"
                            onClick={() => setModal('')}
                        >
                            X
                        </button>

                        <h4>Registro de cobro</h4>
                        <div className='relative flex justify-between w-[300px]'>

                            <label htmlFor="" className={`mr-5 text-[10px] ${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-white`}>
                                Estado de reembolso:
                            </label>
                            <SelectSimple arr={optionsArray} name='Estado de reembolso' click={handlerSelectClick2} defaultValue={value} uuid='123' label='Filtro 1' position='absolute left-0 top-[25px]' bg={`${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-white`} required />
                        </div>
                        <div className='relative flex justify-between w-[300px]'>

                            <label htmlFor="" className={`mr-5 text-[10px] ${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-white`}>
                                Registro por:
                            </label>
                            <textarea name="" className='text-[10px] p-2 w-[200px] focus:outline-none bg-gray-200 border-[1px] border-gray-300 rounded-[5px]' id=""></textarea>                        </div>


                        <button type="button" class="w-[300px] text-white bg-gradient-to-br from-blue-600 to-blue-400 hover:bg-gradient-to-bl foco-4 focus:outline-none foco-blue-300 dark:foco-blue-800 font-medium rounded-lg text-[10px] px-5 py-1.5 text-center me-2 mb-2" onClick={() => setModal('Registro de cobro')}>Registro de cobro</button>

                    </div>

                </div>
            }


            {
                modal === 'Registrar Usuario' && <div className='fixed flex justify-center items-center top-0 left-0 bg-[#0000007c] h-screen w-screen z-50' onClick={() => setModal('')}>
                    <div className='relative flex flex-col items-center justify-center bg-gray-200 w-[400px] h-[300px] p-5 space-y-5 rounded-[5px]' onClick={(e) => e.stopPropagation()}>
                        <button
                            className="absolute top-5 right-5 flex items-center justify-center w-12 h-6 bg-red-500 text-white rounded-[5px] hover:bg-red-600 focus:outline-none"
                            onClick={() => setModal('')}
                        >
                            X
                        </button>

                        <h4>Registro de Usuario</h4>
                        <div className='relative flex justify-between w-[300px]'>
                            <label htmlFor="" className={`mr-5 text-[10px] ${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-white`}>
                                Estado de usuario:
                            </label>
                            <SelectSimple arr={['Activo', 'Inactivo']} name='Estado de reembolso' click={handlerSelectClick2} defaultValue={value} uuid='123' label='Filtro 1' position='absolute left-0 top-[25px]' bg={`${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-white`} required />
                        </div>
                        <div className='relative flex justify-between w-[300px]'>

                            <label htmlFor="" className={`mr-5 text-[10px] ${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-white`}>
                                Acotación:
                            </label>
                            <textarea name="" className='text-[10px] p-2 w-[200px] focus:outline-none bg-gray-200 border-[1px] border-gray-300 rounded-[5px]' id=""></textarea>                        </div>


                        <button type="button" class="w-[300px] text-white bg-gradient-to-br from-blue-600 to-blue-400 hover:bg-gradient-to-bl foco-4 focus:outline-none foco-blue-300 dark:foco-blue-800 font-medium rounded-lg text-[10px] px-5 py-1.5 text-center me-2 mb-2" onClick={() => setModal('Registrar')}>Registrar</button>

                    </div>

                </div>
            }
            {
                modal === 'Registrar Multa' && <div className='fixed flex justify-center items-center top-0 left-0 bg-[#0000007c] h-screen w-screen z-50' onClick={() => setModal('')}>
                    <div className='relative flex flex-col items-center justify-center bg-gray-200 w-[400px] h-[300px] p-5 space-y-5 rounded-[5px]' onClick={(e) => e.stopPropagation()}>
                        <button
                            className="absolute top-5 right-5 flex items-center justify-center w-12 h-6 bg-red-500 text-white rounded-[5px] hover:bg-red-600 focus:outline-none"
                            onClick={() => setModal('')}
                        >
                            X
                        </button>

                        <h4>Registro de Usuario</h4>



                        <div className='relative flex justify-between w-[300px]'>
                            <label htmlFor="" className={`mr-5 text-[10px] ${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-white`}>
                                Cuenta Auditora:
                            </label>
                            <SelectSimple arr={['Activo', 'Inactivo']} name='Estado de reembolso' click={handlerSelectClick2} defaultValue={value} uuid='123' label='Filtro 1' position='absolute left-0 top-[25px]' bg={`${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-white`} required />
                        </div>

                        <div className='relative flex justify-between w-[300px]'>
                            <label htmlFor="" className={`mr-5 text-[10px] ${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-white`}>
                                Id Auditor:
                            </label>
                            <SelectSimple arr={['Activo', 'Inactivo']} name='Estado de reembolso' click={handlerSelectClick2} defaultValue={value} uuid='123' label='Filtro 1' position='absolute left-0 top-[25px]' bg={`${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-white`} required />
                        </div>
                        <div className='relative flex justify-between w-[300px]'>
                            <label htmlFor="" className={`mr-5 text-[10px] ${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-white`}>
                                Tipo de multa:
                            </label>
                            <SelectSimple arr={['Activo', 'Inactivo']} name='Estado de reembolso' click={handlerSelectClick2} defaultValue={value} uuid='123' label='Filtro 1' position='absolute left-0 top-[25px]' bg={`${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-white`} required />
                        </div>
                        <div className='relative flex justify-between w-[300px]'>
                            <label htmlFor="" className={`mr-5 text-[10px] ${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-white`}>
                                Valor:
                            </label>
                            <SelectSimple arr={['Activo', 'Inactivo']} name='Estado de reembolso' click={handlerSelectClick2} defaultValue={value} uuid='123' label='Filtro 1' position='absolute left-0 top-[25px]' bg={`${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-white`} required />
                        </div>
                        <div className='relative flex justify-between w-[300px]'>

                            <label htmlFor="" className={`mr-5 text-[10px] ${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-white`}>
                                Acotación:
                            </label>
                            <textarea name="" className='text-[10px] p-2 w-[200px] focus:outline-none bg-gray-200 border-[1px] border-gray-300 rounded-[5px]' id=""></textarea>                        </div>


                        <button type="button" class="w-[300px] text-white bg-gradient-to-br from-blue-600 to-blue-400 hover:bg-gradient-to-bl foco-4 focus:outline-none foco-blue-300 dark:foco-blue-800 font-medium rounded-lg text-[10px] px-5 py-1.5 text-center me-2 mb-2" onClick={() => setModal('Registrar')}>Registrar</button>

                    </div>

                </div>
            }

            {
                modal === 'Registrar Multa' && <div className='fixed flex justify-center items-center top-0 left-0 bg-[#0000007c] h-screen w-screen z-50' onClick={() => setModal('')}>
                    <div className='relative flex flex-col items-center justify-center bg-gray-200 w-[400px] h-[300px] p-5 space-y-5 rounded-[5px]' onClick={(e) => e.stopPropagation()}>
                        <button
                            className="absolute top-5 right-5 flex items-center justify-center w-12 h-6 bg-red-500 text-white rounded-[5px] hover:bg-red-600 focus:outline-none"
                            onClick={() => setModal('')}
                        >
                            X
                        </button>

                        <h4>Registro Multa</h4>



                        <div className='relative flex justify-between w-[300px]'>
                            <label htmlFor="" className={`mr-5 text-[10px] ${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-black`}>
                                Cuenta Auditora:
                            </label>
                            1323132132
                        </div>

                        <div className='relative flex justify-between w-[300px]'>
                            <label htmlFor="" className={`mr-5 text-[10px] ${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-black`}>
                                Id Auditor:
                            </label>
                            123132322
                        </div>
                        <div className='relative flex justify-between w-[300px]'>
                            <label htmlFor="" className={`mr-5 text-[10px] ${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-black`}>
                                Tipo de multa:
                            </label>
                            <SelectSimple arr={['Activo', 'Inactivo']} name='Estado de reembolso' click={handlerSelectClick2} defaultValue={value} uuid='123' label='Filtro 1' position='absolute left-0 top-[25px]' bg={`${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-black`} required />
                        </div>
                        <div className='relative flex justify-between w-[300px]'>
                            <label htmlFor="" className={`mr-5 text-[10px] ${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-black`}>
                                Valor:
                            </label>
                            <SelectSimple arr={['Activo', 'Inactivo']} name='Estado de reembolso' click={handlerSelectClick2} defaultValue={value} uuid='123' label='Filtro 1' position='absolute left-0 top-[25px]' bg={`${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-black`} required />
                        </div>
                        <div className='relative flex justify-between w-[300px]'>

                            <label htmlFor="" className={`mr-5 text-[10px] ${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-black`}>
                                Acotación:
                            </label>
                            <textarea name="" className='text-[10px] p-2 w-[200px] focus:outline-none bg-gray-200 border-[1px] border-gray-300 rounded-[5px]' id=""></textarea>                        </div>


                        <button type="button" class="w-[300px] text-white bg-gradient-to-br from-blue-600 to-blue-400 hover:bg-gradient-to-bl foco-4 focus:outline-none foco-blue-300 dark:foco-blue-800 font-medium rounded-lg text-[10px] px-5 py-1.5 text-center me-2 mb-2" onClick={() => setModal('Registrar')}>Registrar</button>

                    </div>

                </div>
            }
            {
                editItem && modal === 'Editar Usuario' && <div className='fixed flex justify-center items-center top-0 left-0 bg-[#0000007c] h-screen w-screen z-50' onClick={() => setModal('')}>
                    <div className='relative flex flex-col items-center justify-center bg-gray-200 w-[400px] h-[300px] p-5 space-y-5 rounded-[5px]' onClick={(e) => e.stopPropagation()}>
                        <button
                            className="absolute top-5 right-5 flex items-center justify-center w-12 h-6 bg-red-500 text-white rounded-[5px] hover:bg-red-600 focus:outline-none"
                            onClick={() => setModal('')}
                        >
                            X
                        </button>

                        <h4>Editar</h4>
                        <div className='relative flex justify-between w-[300px]'>
                            <label htmlFor="" className={`mr-5 text-[10px] ${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-black`}>
                                Estado de usuario:
                            </label>
                            <SelectSimple arr={['Activo', 'Inactivo']} name='Estado de reembolso' click={handlerSelectClick2} defaultValue={value} uuid='123' label='Filtro 1' position='absolute left-0 top-[25px]' bg={`${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-black`} required />
                        </div>
                        {/* <div className='relative flex justify-between w-[300px]'>
                            <label htmlFor="" className={`mr-5 text-[10px] ${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-black`}>
                                Rol:
                            </label>
                            <SelectSimple arr={gestionDeRoles?.[user?.rol]} name='Rol' click={handlerSelectClick3} defaultValue={value} uuid='123456789' label='Filtro 4' position='absolute left-0 top-[25px]'  bg={`${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-black`} required />
                        </div> */}
                        <div className='relative flex justify-between w-[300px]'>

                            <label htmlFor="" className={`mr-5 text-[10px] ${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-black`}>
                                Acotación:
                            </label>
                            <textarea name="" className='text-[10px] p-2 w-[200px] focus:outline-none bg-gray-200 border-[1px] border-gray-300 rounded-[5px]' id=""></textarea>                        </div>


                        <button type="button" class="w-[300px] text-white bg-gradient-to-br from-blue-600 to-blue-400 hover:bg-gradient-to-bl foco-4 focus:outline-none foco-blue-300 dark:foco-blue-800 font-medium rounded-lg text-[10px] px-5 py-1.5 text-center me-2 mb-2" onClick={() => setModal('Registrar')}>Registrar</button>

                    </div>

                </div>
            }
            {
                modal === 'Solicitud a Manager' && <div className='fixed flex justify-center items-center top-0 left-0 bg-[#0000007c] h-screen w-screen z-50' onClick={() => setModal('')}>
                    <div className='relative flex flex-col items-center justify-center bg-gray-200 w-[400px] h-[300px] p-5 space-y-5 rounded-[5px]' onClick={(e) => e.stopPropagation()}>
                        <button
                            className="absolute top-5 right-5 flex items-center justify-center w-12 h-6 bg-red-500 text-white rounded-[5px] hover:bg-red-600 focus:outline-none"
                            onClick={() => setModal('')}
                        >
                            X
                        </button>

                        <h4>Solicitud de Información a Manager</h4>
                        <div className='relative flex justify-between w-[300px]'>

                            <label htmlFor="" className={`mr-5 text-[10px] ${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-black`}>
                                Categoria:
                            </label>
                            <SelectSimple arr={['Nuemeros telefonicos']} name='Estado de reembolso' click={handlerSelectClick2} defaultValue={value} uuid='123' label='Filtro 1' position='absolute left-0 top-[25px]' bg={`${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-black`} required />
                        </div>
                        <div className='relative flex justify-between w-[300px]'>

                            <label htmlFor="" className={`mr-5 text-[10px] ${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-black`}>
                                Acotación:
                            </label>
                            <textarea name="" className='text-[10px] p-2 w-[200px] focus:outline-none bg-gray-200 border-[1px] border-gray-300 rounded-[5px]' id=""></textarea>                        </div>


                        <button type="button" class="w-[300px] text-white bg-gradient-to-br from-blue-600 to-blue-400 hover:bg-gradient-to-bl foco-4 focus:outline-none foco-blue-300 dark:foco-blue-800 font-medium rounded-lg text-[10px] px-5 py-1.5 text-center me-2 mb-2" onClick={() => setModal('Registro de cobro')}>Solicitar</button>

                    </div>

                </div>
            }
            {
                modal === 'Registrar Verificacion' && <div className='fixed flex justify-center items-center top-0 left-0 bg-[#0000007c] h-screen w-screen z-50' onClick={() => setModal('')}>
                    <div className='relative flex flex-col items-center justify-center bg-gray-200 w-[400px] h-[300px] p-5 space-y-5 rounded-[5px]' onClick={(e) => e.stopPropagation()}>
                        <button
                            className="absolute top-5 right-5 flex items-center justify-center w-12 h-6 bg-red-500 text-white rounded-[5px] hover:bg-red-600 focus:outline-none"
                            onClick={() => setModal('')}
                        >
                            X
                        </button>

                        <h4>Registro de Verificación</h4>
                        <div className='relative flex justify-between w-[300px]'>
                            <label htmlFor="" className={`mr-5 text-[10px] ${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-black`}>
                                Estado de Verificación:
                            </label>
                            <SelectSimple arr={['Aprobado', 'Reprobado']} name='Estado de reembolso' click={handlerSelectClick2} defaultValue={value} uuid='123' label='Filtro 1' position='absolute left-0 top-[25px]'
                                bg={`${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-black`} required />
                        </div>
                        <div className='relative flex justify-between w-[300px]'>

                            <label htmlFor="" className={`mr-5 text-[10px] ${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-black`}>
                                Acotación:
                            </label>
                            <textarea name="" className='text-[10px] p-2 w-[200px] focus:outline-none bg-gray-200 border-[1px] border-gray-300 rounded-[5px]' id=""></textarea>                        </div>


                        <button type="button" class="w-[300px] text-white bg-gradient-to-br from-blue-600 to-blue-400 hover:bg-gradient-to-bl foco-4 focus:outline-none foco-blue-300 dark:foco-blue-800 font-medium rounded-lg text-[10px] px-5 py-1.5 text-center me-2 mb-2" onClick={() => setModal('Registro de cobro')}>Registrar</button>

                    </div>

                </div>
            }
            {
                modal === 'Registrar Auditor' && <div className='fixed flex justify-center items-center top-0 left-0 bg-[#0000007c] h-screen w-screen z-50' onClick={() => setModal('')}>
                    <div className='relative flex flex-col items-center justify-center bg-gray-200 w-[400px] h-[300px] p-5 space-y-5 rounded-[5px]' onClick={(e) => e.stopPropagation()}>
                        <button
                            className="absolute top-5 right-5 flex items-center justify-center w-12 h-6 bg-red-500 text-white rounded-[5px] hover:bg-red-600 focus:outline-none"
                            onClick={() => setModal('')}
                        >
                            X
                        </button>

                        <h4>Registro Auditor</h4>
                        <div className='relative flex justify-between w-[300px]'>
                            <label htmlFor="" className={`mr-5 text-[10px] ${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-black`}>
                                Categoria:
                            </label>
                            <SelectSimple arr={['Con Observación', 'Sin Observacion']} name='Estado de reembolso' click={handlerSelectClick2} defaultValue={value} uuid='123' label='Filtro 1' position='absolute left-0 top-[25px]' bg={`${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-black`} required />
                        </div>
                        <div className='relative flex justify-between w-[300px]'>

                            <label htmlFor="" className={`mr-5 text-[10px] ${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-black`}>
                                Acotación:
                            </label>
                            <textarea name="" className='text-[10px] p-2 w-[200px] focus:outline-none bg-gray-200 border-[1px] border-gray-300 rounded-[5px]' id=""></textarea>                        </div>


                        <button type="button" class="w-[300px] text-white bg-gradient-to-br from-blue-600 to-blue-400 hover:bg-gradient-to-bl foco-4 focus:outline-none foco-blue-300 dark:foco-blue-800 font-medium rounded-lg text-[10px] px-5 py-1.5 text-center me-2 mb-2" onClick={() => setModal('Registro de cobro')}>Registrar</button>

                    </div>

                </div>
            }
            {
                modal === 'SMS' && <div className='fixed flex justify-center items-center top-0 left-0 bg-[#0000007c] h-screen w-screen z-50' onClick={() => setModal('')}>
                    <div className='relative flex flex-col items-center justify-center bg-gray-200 w-[400px] h-[300px] p-5 space-y-5 rounded-[5px]' onClick={(e) => e.stopPropagation()}>
                        <button
                            className="absolute top-5 right-5 flex items-center justify-center w-12 h-6 bg-red-500 text-white rounded-[5px] hover:bg-red-600 focus:outline-none"
                            onClick={() => setModal('')}
                        >
                            X
                        </button>

                        <h4>Enviar SMS</h4>

                        <div className='relative flex flex-col w-full'>

                            <label htmlFor="" className="mr-5 text-[10px] pb-2">
                                Contenido {texto.length}/50

                            </label>
                            <textarea name="" maxLength={50} className='text-[10px] p-2 w-full focus:outline-none bg-gray-200 border-[1px] border-gray-300 rounded-[5px]' onChange={manejarCambio} id=""></textarea>                        </div>


                        <button type="button" class="w-[300px] text-white bg-gradient-to-br from-blue-600 to-blue-400 hover:bg-gradient-to-bl foco-4 focus:outline-none foco-blue-300 dark:foco-blue-800 font-medium rounded-lg text-[10px] px-5 py-1.5 text-center me-2 mb-2" onClick={() => setModal('Registro de cobro')}>Enviar SMS</button>

                    </div>

                </div>
            }



            {modal === 'Añadir cuenta' && <div className='fixed flex justify-center items-center top-0 left-0 bg-[#0000007c] h-screen w-screen z-50' onClick={() => setModal('')}>
                <div className='relative flex flex-col items-start justify-center bg-gray-200 w-[450px] h-[450px] p-5 px-12 space-y-3 rounded-[5px]' onClick={(e) => e.stopPropagation()}>
                    <button
                        className="absolute top-5 right-5 flex items-center justify-center w-12 h-6 bg-red-500 text-white rounded-[5px] hover:bg-red-600 focus:outline-none"
                        onClick={() => setModal('')}
                    >
                        X
                    </button>

                    <h4 className='w-full text-center'>Añadir cuenta</h4>



                    <div className='flex justify-between'>
                        <label htmlFor="" className={`mr-5 text-[10px] ${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-white`}>
                            Cuenta:
                        </label>
                        <input className={`h-[25px] max-w-[173px] w-full px-3 border border-[#cfcfcf] rounded-[5px] text-[10px]  ${theme === 'light' ? ' text-gray-950 bg-gray-200' : ' text-white bg-gray-200'} dark:text-white  dark:bg-transparent`} arr={['Opción 1', 'Opción 2']} onChange={onChangeHandler} placeholder='Mathew' uuid='123' label='Filtro 1' position='absolute left-0 top-[25px]' bg={`${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-white`} required />
                    </div>

                    <div className='flex justify-between items-center space-x-2'>

                        <label htmlFor="" className={`mr-5 text-[10px] ${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-white`}>
                            Contraseña:
                        </label>
                        <span className='relative inline-block '>
                            <input
                                type={showPassword ? 'text' : 'password'}
                                className={`h-[25px] max-w-[173px] w-full px-3 border border-[#cfcfcf] rounded-[5px] text-[10px]  ${theme === 'light' ? ' text-gray-950 bg-gray-200' : ' text-white bg-gray-200'} dark:text-white  dark:bg-transparent`}
                                placeholder={'**********'}
                                required
                                value={password}
                                onChange={onChangePass}
                            />
                            {<span className="flex items-center absolute cursor-pointer top-0 right-2 bottom-0  my-auto" onClick={() => setShowPassword(!showPassword)}>
                                <svg width="12" height="12" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M9 16.0833C13.1421 16.0833 16.5 12.6158 16.5 10.25C16.5 7.88417 13.1421 4.41667 9 4.41667C4.85792 4.41667 1.5 7.88667 1.5 10.25C1.5 12.6133 4.85792 16.0833 9 16.0833Z" stroke="#00000080" strokeWidth="2" strokeLinejoin="round" />
                                    <path d="M9 12.75C9.66304 12.75 10.2989 12.4866 10.7678 12.0178C11.2366 11.5489 11.5 10.913 11.5 10.25C11.5 9.58696 11.2366 8.95107 10.7678 8.48223C10.2989 8.01339 9.66304 7.75 9 7.75C8.33696 7.75 7.70107 8.01339 7.23223 8.48223C6.76339 8.95107 6.5 9.58696 6.5 10.25C6.5 10.913 6.76339 11.5489 7.23223 12.0178C7.70107 12.4866 8.33696 12.75 9 12.75Z" stroke="#00000080" strokeWidth="2" strokeLinejoin="round" />
                                    <path d="M4.52686 3.69417L5.60769 5.2025M13.8439 3.87917L12.7627 5.3875M9.00394 1.91667V4.41667" stroke="#00000080" strokeWidth="2" strokeLinecap="round" />
                                </svg>
                                {showPassword == false && <span className='absolute bg-[#ffffff] border-x-[.5px] border-gray-50 right-[3px] transform rotate-45 w-[4px] h-[30px]'></span>}
                            </span>}
                        </span>
                        <button
                            onClick={generarContrasena}
                            class="w- text-white bg-gradient-to-br from-blue-600 to-blue-400 hover:bg-gradient-to-bl foco-4 focus:outline-none foco-blue-300 dark:foco-blue-800 font-medium rounded-lg text-[10px] px-5 py-1.5 text-center "
                        >
                            Generar
                        </button>
                    </div>

                    <div className='flex justify-between'>
                        <label htmlFor="" className={`mr-5 text-[10px] ${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-white`}>
                            Apodo:
                        </label>
                        <input
                            className={`h-[25px] max-w-[173px] w-full px-3 border border-[#cfcfcf] rounded-[5px] text-[10px]  ${theme === 'light' ? ' text-gray-950 bg-gray-200' : ' text-white bg-gray-200'} dark:text-white  dark:bg-transparent`}
                            arr={['Opción 1', 'Opción 2']} onChange={onChangeHandler} placeholder='user123' uuid='123' label='Filtro 1' position='absolute left-0 top-[25px]' bg={`${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-white`} required />
                    </div>
                    <div className='flex justify-between'>
                        <label htmlFor="" className={`mr-5 text-[10px] ${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-white`}>
                            Email:
                        </label>
                        <input
                            type='email'
                            className={`h-[25px] max-w-[173px] w-full px-3 border border-[#cfcfcf] rounded-[5px] text-[10px]  ${theme === 'light' ? ' text-gray-950 bg-gray-200' : ' text-white bg-gray-200'} dark:text-white  dark:bg-transparent`}
                            name='Email' onChange={onChangeHandler} placeholder='example@gmail.com' uuid='123' label='Filtro 1' position='absolute left-0 top-[25px]' bg={`${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-white`} required />
                    </div>
                    <div className='relative flex justify-between w-[300px]'>

                        <label htmlFor="" className={`mr-5 text-[10px] ${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-white`}>
                            Origen de la cuenta:
                        </label>
                        <SelectSimple arr={['Por favor elige', 'Compañia', 'Socio 1', 'Socio 2']} name='Origen' click={handlerSelectClick2} defaultValue={value} uuid='123' label='Filtro 1' position='absolute left-0 top-[25px]' bg={`${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-white`} required />
                    </div>

                    <div className='relative flex justify-between w-[300px]'>

                        <label htmlFor="" className={`mr-5 text-[10px] ${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-white`}>
                            Codificación de roles:
                        </label>
                        <SelectSimple arr={['Por favor elige', 'Compañia', 'Socio 1', 'Socio 2']} name='Codificación' click={handlerSelectClick2} defaultValue={value} uuid='123' label='Filtro 1' position='absolute left-0 top-[25px]' bg={`${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-white`} required />
                    </div>

                    <div className='relative flex justify-between w-[300px]'>

                        <label htmlFor="" className={`mr-5 text-[10px] ${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-white`}>
                            Tipo de grupo:
                        </label>
                        <SelectSimple arr={['Por favor elige', 'Compañia', 'Socio 1', 'Socio 2']} name='Tipo' click={handlerSelectClick2} defaultValue={value} uuid='123' label='Filtro 1' position='absolute left-0 top-[25px]' bg={`${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-white`} required />
                    </div>

                    <div className="flex  space-x-2"><span className='text-[10px] pr-5'>Situacion laboral:</span>
                        {['En el trabajo', 'Dimitir', 'Reposo'].map((num, index) => (
                            <label key={index} className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    checked={selectedCheckbox === num}
                                    onChange={() => handleCheckboxChange(num)}
                                    className="form-checkbox h-3 w-3 text-blue-600"
                                />
                                <span className='text-[10px] '>{num}</span>
                            </label>
                        ))}
                    </div>
                    <button type="button"
                        class="w-[300px] relative left-0 right-0 mx-auto text-white bg-gradient-to-br from-blue-600 to-blue-400 hover:bg-gradient-to-bl foco-4 focus:outline-none foco-blue-300 dark:foco-blue-800 font-medium rounded-lg text-[10px] px-5 py-1.5 text-center  mb-2"
                        onClick={() => setModal('Registro de cobro')}>Registro de cobro</button>

                </div>

            </div>}
            <nav className='fixed left-0 top-[60px] w-full px-5 bg-gray-900 z-20 py-1'>
                {menu.length === 1 && <ul className='flex justify-around space-x-5'>
                    {menu[0].options.map((i, index) => {
                        return <li className='text-gray-300 flex items-center text-[12px] cursor-pointer' onClick={() => router.replace(`/Home?seccion=${menu[0].hash}&item=${i.subtitle}`)}
                        >
                            <span
                                className={`inline-block w-[8px] h-[8px] mr-2 rounded-full cursor-pointer transition-colors duration-300 ${i.subtitle === item ? 'bg-green-500' : 'bg-gray-500'}`}
                            ></span>
                            <span className={` ${i.subtitle === item ? 'text-green-400' : 'text-gray-200'}`}>{i.subtitle}</span> </li>
                    })}
                </ul>}

            </nav>



            {modal === 'Guardando...' && <Loader> {modal} </Loader>}


            <button className='fixed text-[20px] text-gray-500 h-[50px] w-[50px] rounded-full inline-block left-[0px] top-0 bottom-0 my-auto bg-[#00000010] z-30 lg:left-[8px]' onClick={prev}>{'<'}</button>
            <button className='fixed text-[20px] text-gray-500 h-[50px] w-[50px] rounded-full inline-block right-[0px] top-0 bottom-0 my-auto bg-[#00000010] z-30 lg:right-[8px]' onClick={next}>{'>'}</button>

            {item === 'Casos de Cobranza' &&
                <div>
                    {/* <div className='flex min-w-[90vw] flex-wrap justify-around relative top-[-25px]'>
                        <div className='px-2'>
                            <Velocimetro></Velocimetro>
                            <h4 className={`text-center text-[14px]  m-0 p-0 pb-2 ${theme === 'light' ? ' text-[steelblue]' : ' text-[#55abf1] '} dark:text-text-[#55abf1]`}>Tasa de finalizacion hoy</h4>
                            <div className='grid grid-cols-3 w-[300px]'>
                                <p className={`col-span-2 text-center text-[10px] ${theme === 'light' ? ' text-gray-500' : ' text-gray-500 '} dark:text-white`}>0 <br />El número de recordatorios en el dia que se asigna en el día.</p>
                                <p className={`col-span-1 text-center text-[10px] ${theme === 'light' ? ' text-gray-500' : ' text-gray-500 '} dark:text-white`}>0 <br />Añadir el número hoy.</p>
                            </div>
                        </div>
                        <div className=' px-2'>
                            <Velocimetro></Velocimetro>
                            <h4 className={`text-center text-[14px]  m-0 p-0 pb-2 ${theme === 'light' ? ' text-[steelblue]' : ' text-[#55abf1] '} dark:text-text-[#55abf1]`}>Tasa de recuperación de caso</h4>
                            <div className='grid grid-cols-3 w-[300px]'>
                                <p className={`col-span-2 text-center text-[10px] ${theme === 'light' ? ' text-gray-500' : ' text-gray-500 '} dark:text-white`}>0 <br />Cobro de hoy.</p>
                                <p className={`col-span-1 text-center text-[10px] ${theme === 'light' ? ' text-gray-500' : ' text-gray-500 '} dark:text-white`}>0 <br /> Número total de casos.</p>
                            </div>
                        </div>
                        <div className=' px-2'>
                            <Velocimetro></Velocimetro>
                            <h4 className={`text-center text-[14px]  m-0 p-0 pb-2 ${theme === 'light' ? ' text-[steelblue]' : ' text-[#55abf1] '} dark:text-text-[#55abf1]`}>Tasa de recuperación de grupo</h4>
                            <h4 className='text-center text-[14px] text-green-600  m-0 p-0 pb-2'> <span className='bg-green-600 mr-2 w-[10px] h-[10px] inline-block'></span>Tasa de recuperación de grupos</h4>

                        </div>
                        <div className=' p-2 border my-5 flex flex-col justify-between'>
                            <h4 className={`text-center text-[14px]  m-0 p-0 pb-2 ${theme === 'light' ? ' text-[steelblue]' : ' text-[#55abf1] '} dark:text-text-[#55abf1]`}>Ranking de hoy</h4>
                            <br />
                            <div className='grid grid-cols-2 gap-2'>
                                <div>
                                    <h4 className='text-center text-[18px] text-[steelblue] m-0 p-0 pb-2'>NO.0</h4>
                                    <p className='col-span-2 text-center text-[12px] text-gray-500'>Ranking Individual <br /> por Equipos</p>

                                </div>
                                <div>
                                    <h4 className='text-center text-[18px] text-[steelblue] m-0 p-0 pb-2'>0.00</h4>
                                    <p className='col-span-2 text-center text-[12px] text-gray-500'>Monto del cobro</p>

                                </div>

                            </div>
                            <br />

                            <h4 className='text-center text-[18px] text-[steelblue] m-0 p-0 pb-2'>0.00</h4>


                            <p className='col-span-2 text-center text-[12px] text-gray-500'>Monto del cobro</p>


                        </div>
                    </div> */}
                    <div className="w-full   relative  overflow-auto  scroll-smooth mb-2 lg:overflow-hidden">
                        <div className='grid grid-cols-3 gap-x-5 gap-y-2 w-[1050px]'>
                            <div className='w-[330px] space-y-2'>
                                <div className='flex justify-between'>
                                    <label htmlFor="" className={`mr-5 text-[10px] ${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-white`}>
                                        Codigo del producto:
                                    </label>
                                    <SelectSimple arr={filtro_1} name='nombreProducto' click={handlerSelectClick} defaultValue={filter['nombreProducto']} uuid='123' label='Filtro 1' position='absolute left-0 top-[25px]' bg={`${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-white`} required />
                                </div>
                                <div className='flex justify-between'>
                                    <label htmlFor="" className={`mr-5 text-[10px] ${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-white`}>
                                        Cobrador:
                                    </label>
                                    <div className='grid grid-cols-2 gap-2'>
                                        <SelectSimple arr={rangesArray} name='Cobrador 1' click={handlerSelectClick} defaultValue={filter['Cobrador 1']} uuid='123' label='Filtro 1' position='absolute left-0 top-[25px]' bg={`${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-white`} required />
                                        <SelectSimple arr={cobrador} name='Cobrador 2' click={handlerSelectClick} defaultValue={filter['Cobrador 2']} uuid='123' label='Filtro 1' position='absolute left-0 top-[25px]' bg={`${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-white`} required />
                                    </div>
                                </div>
                                <div className='flex justify-between'>
                                    <label htmlFor="" className={`mr-5 text-[10px] ${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-white`}>
                                        Dias vencidos:
                                    </label>
                                    <div className='grid grid-cols-2 gap-2'>
                                        <input className={`h-[25px] max-w-[173px] w-full px-3 border border-[#cfcfcf] rounded-[5px] text-[10px]  ${theme === 'light' ? ' text-gray-950 bg-gray-200' : ' text-white bg-gray-200'} dark:text-white  dark:bg-transparent`} arr={['Opción 1', 'Opción 2']} name='Minimo dias vencido' onChange={onChangeHandler} placeholder='Minimo' defaultValue={filter['Nombre del cliente']} uuid='123' label='Filtro 1' position='absolute left-0 top-[25px]' bg={`${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-white`} required />
                                        <input className={`h-[25px] max-w-[173px] w-full px-3 border border-[#cfcfcf] rounded-[5px] text-[10px]  ${theme === 'light' ? ' text-gray-950 bg-gray-200' : ' text-white bg-gray-200'} dark:text-white  dark:bg-transparent`} arr={['Opción 1', 'Opción 2']} name='Maximo dias vencido' onChange={onChangeHandler} placeholder='Maximo' defaultValue={filter['Nombre del cliente']} uuid='123' label='Filtro 1' position='absolute left-0 top-[25px]' bg={`${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-white`} required />
                                    </div>
                                </div>
                                <div className='flex justify-between'>
                                    <label htmlFor="" className={`mr-5 text-[10px] ${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-white`}>
                                        Clientes nuevos y antiguos:
                                    </label>
                                    <SelectSimple arr={filterCliente} name='Clientes nuevos y antiguos' click={handlerSelectClick} defaultValue={filter['Cliente nuevo']} uuid='123' label='Filtro 1' position='absolute left-0 top-[25px]' bg={`${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-white`} required />
                                </div>
                                <button type="button" class="w-full text-white bg-gradient-to-r from-cyan-400 via-cyan-500 to-cyan-600 hover:bg-gradient-to-br foco-4 focus:outline-none foco-cyan-300 dark:foco-cyan-800 font-medium rounded-lg text-[10px] px-5 py-2 text-center me-2 mb-2">Distribuir</button>

                            </div>
                            <div className='w-[300px] space-y-2'>
                                <div className='flex justify-between'>
                                    <label htmlFor="" className={`mr-5 text-[10px] ${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-white`}>
                                        Número de teléfono:
                                    </label>
                                    <input className={`h-[25px] max-w-[173px] w-full px-3 border border-[#cfcfcf] rounded-[5px] text-[10px]  ${theme === 'light' ? ' text-gray-950 bg-gray-200' : ' text-white bg-gray-200'} dark:text-white  dark:bg-transparent`} arr={['Opción 1', 'Opción 2']} name='Número de teléfono' onChange={onChangeHandler} defaultValue={filter['Número de teléfono']} uuid='123' label='Filtro 1' position='absolute left-0 top-[25px]' bg={`${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-white`} required />
                                </div>

                                <div className='flex justify-between'>
                                    <label htmlFor="" className={`mr-5 text-[10px] ${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-white`}>
                                        Factura a plazos:
                                    </label>
                                    <SelectSimple arr={factura} name='Factura a plazos' click={handlerSelectClick} defaultValue={filter['Factura a plazos']} uuid='123' label='Filtro 1' position='absolute left-0 top-[25px]' bg={`${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-white`} required />
                                </div>
                                <div className='flex justify-between'>
                                    <label htmlFor="" className={`mr-5 text-[10px] ${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-white`}>
                                        Numero de páginas:
                                    </label>
                                    <input
                                        className={`h-[25px] max-w-[173px] w-full px-3 border border-[#cfcfcf] rounded-[5px] text-[10px] 
                                         ${theme === 'light' ? ' text-gray-950 bg-gray-200' : ' text-white bg-gray-200'} dark:text-white  dark:bg-transparent`}
                                        arr={['Opción 1', 'Opción 2']} name='Numero de páginas' onChange={onChangeHandler} defaultValue={filter['Numero de páginas']} uuid='123' label='Numero de páginas' position='absolute left-0 top-[25px]' bg={`${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-white`} required />
                                </div>

                                <div className='flex justify-between'>
                                    <label htmlFor="" className={`mr-5 text-[10px] ${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-white`}>
                                        Jumiah periode:
                                    </label>
                                    <SelectSimple arr={Jumlah} name='Jumiah periode' click={handlerSelectClick} defaultValue={filter['Jumiah periode']} uuid='123' label='Filtro 1' position='absolute left-0 top-[25px]' bg={`${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-white`} required />
                                </div>
                            </div>
                            <div className='w-[300px] space-y-2'>

                                <div className='flex justify-between'>
                                    <label htmlFor="" className={`mr-5 text-[10px] ${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-white`}>
                                        Estado de reembolso:
                                    </label>
                                    <SelectSimple arr={estadoRembolso} name='Estado de reembolso' click={handlerSelectClick} defaultValue={filter['Estado de reembolso']} uuid='123' label='Filtro 1' position='absolute left-0 top-[25px]' bg={`${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-white`} required />
                                </div>
                                <div className='flex justify-between'>
                                    <label htmlFor="" className={`mr-5 text-[10px] ${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-white`}>
                                        Fecha de rembolso:
                                    </label>
                                    <div className='grid grid-cols-2 gap-2'>
                                        <input type='date' className="h-[25px] max-w-[173px] w-full px-2 border border-[#cfcfcf] rounded-[5px] text-[10px]  " arr={['Opción 1', 'Opción 2']} name='Nombre del cliente' click={handlerSelectClick} defaultValue={filter['Nombre del cliente']} uuid='123' label='Filtro 1' position='absolute left-0 top-[25px]' bg={`${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-white`} required />
                                        <input type='date' className="h-[25px] max-w-[173px] w-full px-2 border border-[#cfcfcf] rounded-[5px] text-[10px]  " arr={['Opción 1', 'Opción 2']} name='Nombre del cliente' click={handlerSelectClick} defaultValue={filter['Nombre del cliente']} uuid='123' label='Filtro 1' position='absolute left-0 top-[25px]' bg={`${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-white`} required />
                                    </div>

                                </div>



                                <div className='flex justify-between flex space-x-3'>
                                    <button type="button" class="w-full text-white bg-gradient-to-br from-blue-600 to-blue-400 hover:bg-gradient-to-bl foco-4 focus:outline-none foco-blue-300 dark:foco-blue-800 font-medium rounded-lg text-[10px] px-5 py-1.5 text-center me-2 mb-2">Consultar</button>
                                    <button type="button" class="w-full text-white bg-gradient-to-r from-cyan-400 via-cyan-500 to-cyan-600 hover:bg-gradient-to-br foco-4 focus:outline-none foco-cyan-300 dark:foco-cyan-800 font-medium rounded-lg text-[10px] px-5 py-2 text-center me-2 mb-2">Restablecer</button>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>

            }
            *-
            {item === 'Incurrir en una estación de trabajo' &&
                <div>
                    <div className='flex flex-wrap justify-around relative top-[-25px]'>
                        <div className='px-2'>
                            <Velocimetro></Velocimetro>
                            <h4 className={`text-center text-[14px]  m-0 p-0 pb-2 ${theme === 'light' ? ' text-[steelblue]' : ' text-[#55abf1] '} dark:text-text-[#55abf1]`}>Tasa de finalizacion hoy</h4>
                            <div className='grid grid-cols-3 w-[300px]'>
                                <p className={`col-span-2 text-center text-[10px] ${theme === 'light' ? ' text-gray-500' : ' text-gray-500 '} dark:text-white`}>0 <br />El número de recordatorios en el dia que se asigna en el día.</p>
                                <p className={`col-span-1 text-center text-[10px] ${theme === 'light' ? ' text-gray-500' : ' text-gray-500 '} dark:text-white`}>0 <br />Añadir el número hoy.</p>
                            </div>
                        </div>
                        <div className=' px-2'>
                            <Velocimetro></Velocimetro>
                            <h4 className={`text-center text-[14px]  m-0 p-0 pb-2 ${theme === 'light' ? ' text-[steelblue]' : ' text-[#55abf1] '} dark:text-text-[#55abf1]`}>Tasa de recuperación de caso</h4>
                            <div className='grid grid-cols-3 w-[300px]'>
                                <p className={`col-span-2 text-center text-[10px] ${theme === 'light' ? ' text-gray-500' : ' text-gray-500 '} dark:text-white`}>0 <br />Cobro de hoy.</p>
                                <p className={`col-span-1 text-center text-[10px] ${theme === 'light' ? ' text-gray-500' : ' text-gray-500 '} dark:text-white`}>0 <br /> Número total de casos.</p>
                            </div>
                        </div>
                        <div className=' px-2'>
                            <Velocimetro></Velocimetro>
                            <h4 className={`text-center text-[14px]  m-0 p-0 pb-2 ${theme === 'light' ? ' text-[steelblue]' : ' text-[#55abf1] '} dark:text-text-[#55abf1]`}>Tasa de recuperación de grupo</h4>
                            <h4 className='text-center text-[14px] text-green-600  m-0 p-0 pb-2'> <span className='bg-green-600 mr-2 w-[10px] h-[10px] inline-block'></span>Tasa de recuperación de grupos</h4>

                        </div>
                        <div className=' p-2 border my-5 flex flex-col justify-between'>
                            <h4 className={`text-center text-[14px]  m-0 p-0 pb-2 ${theme === 'light' ? ' text-[steelblue]' : ' text-[#55abf1] '} dark:text-text-[#55abf1]`}>Ranking de hoy</h4>
                            <br />
                            <div className='grid grid-cols-2 gap-2'>
                                <div>
                                    <h4 className='text-center text-[18px] text-[steelblue] m-0 p-0 pb-2'>NO.0</h4>
                                    <p className='col-span-2 text-center text-[12px] text-gray-500'>Ranking Individual <br /> por Equipos</p>

                                </div>
                                <div>
                                    <h4 className='text-center text-[18px] text-[steelblue] m-0 p-0 pb-2'>0.00</h4>
                                    <p className='col-span-2 text-center text-[12px] text-gray-500'>Monto del cobro</p>

                                </div>

                            </div>
                            <br />

                            <h4 className='text-center text-[18px] text-[steelblue] m-0 p-0 pb-2'>0.00</h4>


                            <p className='col-span-2 text-center text-[12px] text-gray-500'>Monto del cobro</p>


                        </div>
                    </div>

                    <div className='flex space-x-12 w-[1150px]   mb-0'>
                        <div className='w-[300px] space-y-2'>
                            <div className='flex justify-between'>
                                <label htmlFor="" className={`mr-5 text-[10px] ${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-white`}>
                                    Producto del proyecto:
                                </label>
                                <SelectSimple arr={['Opción 1', 'Opción 2']} name='Producto del proyecto' defaultValue={filter['Producto del proyecto']} uuid='123' label='Filtro 1' position='absolute left-0 top-[25px]' bg={`${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-white`} required />
                            </div>
                            <div className='flex justify-between'>
                                <label htmlFor="" className={`mr-5 text-[10px] ${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-white`}>
                                    Número de teléfono:
                                </label>
                                <input className={`h-[25px] max-w-[173px] w-full px-3 border border-[#cfcfcf] rounded-[5px] text-[10px]  ${theme === 'light' ? ' text-gray-950 bg-gray-200' : ' text-white bg-gray-200'} dark:text-white  dark:bg-transparent`} arr={['Opción 1', 'Opción 2']} name='Número de teléfono' onChange={onChangeHandler} defaultValue={filter['Número de teléfono']} uuid='123' label='Filtro 1' position='absolute left-0 top-[25px]' bg={`${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-white`} required />
                            </div>
                            <div className='flex justify-between'>
                                <label htmlFor="" className={`mr-5 text-[10px] ${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-white`}>
                                    Estado de reembolso:
                                </label>
                                <SelectSimple arr={[...estadoRembolso, 'Reembolso Parcial']} name='Estado de reembolso' click={handlerSelectClick} defaultValue={filter['Estado de reembolso']} uuid='123' label='Filtro 1' position='absolute left-0 top-[25px]' bg={`${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-white`} required />
                            </div>
                            <div className='flex justify-between'>
                                <label htmlFor="" className={`mr-5 text-[10px] ${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-white`}>
                                    Angsuran:
                                </label>
                                <SelectSimple arr={['Por favor elige', 'Si', 'No']} name='Clientes nuevos y antiguos' click={handlerSelectClick} defaultValue={filter['Clientes nuevos y antiguos']} uuid='123' label='Filtro 1' position='absolute left-0 top-[25px]' bg={`${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-white`} required />
                            </div>
                            <div className='flex justify-between flex space-x-3'>
                                <button type="button" class="w-full text-white bg-gradient-to-br from-blue-600 to-blue-400 hover:bg-gradient-to-bl foco-4 focus:outline-none foco-blue-300 dark:foco-blue-800 font-medium rounded-lg text-[10px] px-5 py-1.5 text-center me-2 mb-2">Consultar</button>
                                <button type="button" class="w-full text-white bg-gradient-to-r from-cyan-400 via-cyan-500 to-cyan-600 hover:bg-gradient-to-br foco-4 focus:outline-none foco-cyan-300 dark:foco-cyan-800 font-medium rounded-lg text-[10px] px-5 py-2 text-center me-2 mb-2">Restablecer</button>
                            </div>
                        </div>
                        <div className='w-[320px] space-y-2'>
                            <div className='flex justify-between'>
                                <label htmlFor="" className={`mr-5 text-[10px] ${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-white`}>
                                    Número de prestamo:
                                </label>
                                <input className={`h-[25px] max-w-[173px] w-full px-3 border border-[#cfcfcf] rounded-[5px] text-[10px]  ${theme === 'light' ? ' text-gray-950 bg-gray-200' : ' text-white bg-gray-200'} dark:text-white  dark:bg-transparent`} arr={['Opción 1', 'Opción 2']} name=' Número de prestamo' onChange={onChangeHandler} defaultValue={filter['Número de teléfono']} uuid='123' label='Filtro 1' position='absolute left-0 top-[25px]' bg={`${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-white`} required />
                            </div>

                            <div className='flex justify-between'>
                                <label htmlFor="" className={`mr-5 text-[10px] ${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-white`}>
                                    Nombre del cliente:
                                </label>
                                <input className={`h-[25px] max-w-[173px] w-full px-3 border border-[#cfcfcf] rounded-[5px] text-[10px]  ${theme === 'light' ? ' text-gray-950 bg-gray-200' : ' text-white bg-gray-200'} dark:text-white  dark:bg-transparent`} arr={['Opción 1', 'Opción 2']} name='Nombre del cliente' onChange={onChangeHandler} defaultValue={filter['Nombre del cliente']} uuid='123' label='Filtro 1' position='absolute left-0 top-[25px]' bg={`${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-white`} required />
                            </div>
                            <div className='flex justify-between'>
                                <label htmlFor="" className={`mr-5 text-[10px] ${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-white`}>
                                    Fecha de cancelación a cuenta:
                                </label>
                                <div className='grid grid-cols-2 gap-2'>
                                    <input type='date' className="h-[25px] max-w-[173px] w-full px-2 border border-[#cfcfcf] rounded-[5px] text-[10px]  " arr={['Opción 1', 'Opción 2']} name='Nombre del cliente' click={handlerSelectClick} defaultValue={filter['Nombre del cliente']} uuid='123' label='Filtro 1' position='absolute left-0 top-[25px]' bg={`${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-white`} required />
                                    <input type='date' className="h-[25px] max-w-[173px] w-full px-2 border border-[#cfcfcf] rounded-[5px] text-[10px]  " arr={['Opción 1', 'Opción 2']} name='Nombre del cliente' click={handlerSelectClick} defaultValue={filter['Nombre del cliente']} uuid='123' label='Filtro 1' position='absolute left-0 top-[25px]' bg={`${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-white`} required />
                                </div>
                            </div>
                            <div className='flex justify-between'>
                                <label htmlFor="" className={`mr-5 text-[10px] ${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-white`}>
                                    Número de etapas:
                                </label>
                                <SelectSimple arr={['Por favor elige', '1', '2']} name='Número de etapas' click={handlerSelectClick} defaultValue={filter['Número de etapas']} uuid='123' label='Filtro 1' position='absolute left-0 top-[25px]' bg={`${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-white`} required />
                            </div>
                        </div>
                        <div className='w-[350px] space-y-2'>
                            <div className='flex justify-between'>
                                <label htmlFor="" className={`mr-5 text-[10px] ${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-white`}>
                                    ID de sub-factura:
                                </label>
                                <input className={`h-[25px] max-w-[173px] w-full px-3 border border-[#cfcfcf] rounded-[5px] text-[10px]  ${theme === 'light' ? ' text-gray-950 bg-gray-200' : ' text-white bg-gray-200'} dark:text-white  dark:bg-transparent`} arr={['Opción 1', 'Opción 2']} name='filtro' click={handlerSelectClick} defaultValue={filter['filtro']} uuid='123' label='Filtro 1' position='absolute left-0 top-[25px]' bg={`${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-white`} required />
                            </div>
                            <div className='flex justify-between'>
                                <label htmlFor="" className={`mr-5 text-[10px] ${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-white`}>
                                    Dias vencidos:
                                </label>
                                <div className='grid grid-cols-2 gap-2'>
                                    <input className={`h-[25px] max-w-[173px] w-full px-3 border border-[#cfcfcf] rounded-[5px] text-[10px]  ${theme === 'light' ? ' text-gray-950 bg-gray-200' : ' text-white bg-gray-200'} dark:text-white  dark:bg-transparent`} arr={['Opción 1', 'Opción 2']} name='Minimo dias vencido' onChange={onChangeHandler} placeholder='Minimo' defaultValue={filter['Nombre del cliente']} uuid='123' label='Filtro 1' position='absolute left-0 top-[25px]' bg={`${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-white`} required />
                                    <input className={`h-[25px] max-w-[173px] w-full px-3 border border-[#cfcfcf] rounded-[5px] text-[10px]  ${theme === 'light' ? ' text-gray-950 bg-gray-200' : ' text-white bg-gray-200'} dark:text-white  dark:bg-transparent`} arr={['Opción 1', 'Opción 2']} name='Maximo dias vencido' onChange={onChangeHandler} placeholder='Maximo' defaultValue={filter['Nombre del cliente']} uuid='123' label='Filtro 1' position='absolute left-0 top-[25px]' bg={`${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-white`} required />
                                </div>
                            </div>
                            <div className='flex justify-between'>
                                <label htmlFor="" className={`mr-5 text-[10px] ${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-white`}>
                                    Fecha de asignación:
                                </label>
                                <div className='grid grid-cols-2 gap-2'>
                                    <input type='date' className="h-[25px] max-w-[173px] w-full px-2 border border-[#cfcfcf] rounded-[5px] text-[10px]  " arr={['Opción 1', 'Opción 2']} name='Nombre del cliente' click={handlerSelectClick} defaultValue={filter['Nombre del cliente']} uuid='123' label='Filtro 1' position='absolute left-0 top-[25px]' bg={`${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-white`} required />
                                    <input type='date' className="h-[25px] max-w-[173px] w-full px-2 border border-[#cfcfcf] rounded-[5px] text-[10px]  " arr={['Opción 1', 'Opción 2']} name='Nombre del cliente' click={handlerSelectClick} defaultValue={filter['Nombre del cliente']} uuid='123' label='Filtro 1' position='absolute left-0 top-[25px]' bg={`${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-white`} required />
                                </div>
                            </div>
                            <div className='flex justify-between'>
                                <label htmlFor="" className={`mr-5 text-[10px] ${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-white`}>
                                    Collected employee ID:
                                </label>
                                <SelectSimple arr={['Opción 1', 'Opción 2']} name='Collected employee ID' click={handlerSelectClick} defaultValue={filter['Collected employee ID']} uuid='123' label='Filtro 1' position='absolute left-0 top-[25px]' bg={`${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-white`} required />
                            </div>

                        </div>
                    </div>
                </div>}

            {item === 'Gestión de cuentas de Colección' && <div>
                <div className='grid grid-cols-3 gap-x-[50px] gap-y-2 w-[950px]'>
                    <div className='w-[300px] space-y-2'>
                        <div className='flex justify-between'>
                            <label htmlFor="" className={`mr-5 text-[10px] ${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-white`}>
                                Cuenta:
                            </label>
                            <input className={`h-[25px] max-w-[173px] w-full px-3 border border-[#cfcfcf] rounded-[5px] text-[10px]  ${theme === 'light' ? ' text-gray-950 bg-gray-200' : ' text-white bg-gray-200'} dark:text-white  dark:bg-transparent`} arr={['Opción 1', 'Opción 2']} onChange={onChangeHandler} defaultValue={filter['Número de teléfono']} uuid='123' label='Filtro 1' position='absolute left-0 top-[25px]' bg={`${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-white`} required />
                        </div>
                        <div className='flex justify-between'>
                            <label htmlFor="" className={`mr-5 text-[10px] ${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-white`}>
                                Situación laboral:
                            </label>
                            <SelectSimple arr={['Por favor elige', 'En el trabajo', 'Dimitir', 'Reposo']} name='Cobrador 1' click={handlerSelectClick} defaultValue={filter['Cobrador 1']} uuid='123' label='Filtro 1' position='absolute left-0 top-[25px]' bg={`${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-white`} required />
                        </div>

                    </div>
                    <div className='w-[300px] space-y-2'>


                        <div className='flex justify-between'>
                            <label htmlFor="" className={`mr-5 text-[10px] ${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-white`}>
                                Nombre del cliente:
                            </label>
                            <input className={`h-[25px] max-w-[173px] w-full px-3 border border-[#cfcfcf] rounded-[5px] text-[10px]  ${theme === 'light' ? ' text-gray-950 bg-gray-200' : ' text-white bg-gray-200'} dark:text-white  dark:bg-transparent`} arr={['Opción 1', 'Opción 2']} onChange={onChangeHandler} defaultValue={filter['Número de teléfono']} uuid='123' label='Filtro 1' position='absolute left-0 top-[25px]' bg={`${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-white`} required />
                        </div>
                        <div className='flex justify-between'>
                            <label htmlFor="" className={`mr-5 text-[10px] ${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-white`}>
                                Tipo de agrupación:
                            </label>
                            <SelectSimple arr={['Agrupación vencida', 'Agrupación de recordatorios']} name='Fecha de cancelación a cuenta 1' click={handlerSelectClick} defaultValue={filter['Fecha de cancelación a cuenta 1']} uuid='123' label='Filtro 1' position='absolute left-0 top-[25px]' bg={`${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-white`} required />

                        </div>

                    </div>
                    <div className='w-[300px] space-y-2'>
                        <div className='flex justify-between'>
                            <label htmlFor="" className={`mr-5 text-[10px] ${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-white`}>
                                Nombre del rol:
                            </label>
                            <SelectSimple arr={['Super Administrador', 'Manager', 'Lider', 'Agente de cobro', 'Auditor', 'Cliente']} name='ID de sub-factura' click={handlerSelectClick} defaultValue={filter['ID de sub-factura']} uuid='123' label='Filtro 1' position='absolute left-0 top-[25px]' bg={`${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-white`} required />
                        </div>

                        <div className='flex justify-between'>
                            <label htmlFor="" className={`mr-5 text-[10px] ${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-white`}>
                                Lista de grupos:                            </label>
                            <SelectSimple arr={['Opción 1', 'Opción 2']} name='Collected employee ID' click={handlerSelectClick} defaultValue={filter['Collected employee ID']} uuid='123' label='Filtro 1' position='absolute left-0 top-[25px]' bg={`${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-white`} required />
                        </div>
                    </div>
                </div>
                <div className='pt-3 flex space-x-3'>
                    {/* <div className='flex justify-between flex space-x-3'>
                        <button type="button"
                            class="w-full text-white bg-gradient-to-br from-blue-600 to-blue-400 hover:bg-gradient-to-bl foco-4 focus:outline-none foco-blue-300 dark:foco-blue-800 font-medium rounded-lg text-[10px] px-5 py-1.5 text-center me-2 mb-2">Consultar</button>
                        <button type="button"
                            class="w-full text-white bg-gradient-to-r from-cyan-400 via-cyan-500 to-cyan-600 hover:bg-gradient-to-br foco-4 focus:outline-none foco-cyan-300 dark:foco-cyan-800 font-medium rounded-lg text-[10px] px-5 py-2 text-center me-2 mb-2">
                            Restablecer</button>
                    </div> */}


                    <button type="button"
                        class="w- text-white bg-gradient-to-br from-blue-600 to-blue-400 hover:bg-gradient-to-bl foco-4 focus:outline-none foco-blue-300 dark:foco-blue-800 font-medium rounded-lg text-[10px] px-5 py-1.5 text-center me-2 mb-2">

                        Consultar
                    </button>
                    <button class="relative text-[10px] px-5 inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-[10px]font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-purple-200  to-blue-100 foco-4 focus:outline-none foco-blue-300 dark:foco-blue-800">
                        Restablecimiento
                    </button>
                    <button type="button" onClick={() => setModal('Añadir cuenta')}
                        class="w- text-white bg-gradient-to-r from-cyan-400 via-cyan-500 to-cyan-600 hover:bg-gradient-to-br foco-4 focus:outline-none foco-cyan-300 dark:foco-cyan-800 font-medium rounded-lg text-[10px] px-5 py-2 text-center me-2 mb-2">
                        Añadir cuenta</button>

                </div>


                <div className='pb- flex space-x-3'>
                    <button type="button" class="text-white bg-gradient-to-r from-cyan-400 via-cyan-500 to-cyan-600 hover:bg-gradient-to-br foco-4 focus:outline-none foco-cyan-300 dark:foco-cyan-800 font-medium rounded-lg text-[10px] px-5 py-2 text-center me-2 mb-2">-------------</button>
                    <button type="button" class="text-white bg-gradient-to-r from-red-600 via-red-500 to-red-600 hover:bg-gradient-to-br foco-4 focus:outline-none foco-red-300 dark:foco-red-800 font-medium rounded-lg text-[10px] px-5 py-2 text-center me-2 mb-2">Eliminar cuentas por lotes</button>
                    <button type="button" class="text-white bg-gradient-to-r from-red-600 via-red-500 to-red-600 hover:bg-gradient-to-br foco-4 focus:outline-none foco-red-300 dark:foco-red-800 font-medium rounded-lg text-[10px] px-5 py-2 text-center me-2 mb-2">Restablecimiento masivo de contraseñas</button>
                </div>

            </div>}


            {item === 'Registro Histórico' &&
                <div className="w-full   relative  overflow-auto  scroll-smooth mb-2 lg:overflow-hidden">
                    <div className='flex space-x-12 w-[1050px]'>
                        <div className='w-[330px] space-y-2'>
                            <div className='flex justify-between'>
                                <label htmlFor="" className={`mr-5 text-[10px] ${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-white`}>
                                    Producto del proyecto:
                                </label>
                                <SelectSimple arr={filtro_1} name='nombreProducto' click={handlerSelectClick} defaultValue={filter['nombreProducto']} uuid='123' label='Filtro 1' position='absolute left-0 top-[25px]' bg={`${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-white`} required />
                            </div>

                            <div className='flex justify-between'>
                                <label htmlFor="" className={`mr-5 text-[10px] ${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-white`}>
                                    Fecha de la consulta:
                                </label>
                                <div className='grid grid-cols-2 gap-2'>
                                    <input type='date' className="h-[25px] max-w-[173px] w-full px-2 border border-[#cfcfcf] rounded-[5px] text-[10px]  " arr={['Opción 1', 'Opción 2']} name='Nombre del cliente' click={handlerSelectClick} defaultValue={filter['Nombre del cliente']} uuid='123' label='Filtro 1' position='absolute left-0 top-[25px]' bg={`${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-white`} required />
                                    <input type='date' className="h-[25px] max-w-[173px] w-full px-2 border border-[#cfcfcf] rounded-[5px] text-[10px]  " arr={['Opción 1', 'Opción 2']} name='Nombre del cliente' click={handlerSelectClick} defaultValue={filter['Nombre del cliente']} uuid='123' label='Filtro 1' position='absolute left-0 top-[25px]' bg={`${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-white`} required />
                                </div>

                            </div>

                        </div>
                        <div className='w-[300px] space-y-2'>
                            <div className='flex justify-between'>
                                <label htmlFor="" className={`mr-5 text-[10px] ${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-white`}>
                                    Nombre del cliente:
                                </label>
                                <input className={`h-[25px] max-w-[173px] w-full px-3 border border-[#cfcfcf] rounded-[5px] text-[10px]  ${theme === 'light' ? ' text-gray-950 bg-gray-200' : ' text-white bg-gray-200'} dark:text-white  dark:bg-transparent`} arr={['Opción 1', 'Opción 2']} name='Número de ' onChange={onChangeHandler} defaultValue={filter['Número de teléfono']} uuid='123' label='Filtro 1' position='absolute left-0 top-[25px]' bg={`${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-white`} required />
                            </div>

                            <div className='flex justify-between flex space-x-3'>
                                <button type="button" class="w-full text-white bg-gradient-to-br from-blue-600 to-blue-400 hover:bg-gradient-to-bl foco-4 focus:outline-none foco-blue-300 dark:foco-blue-800 font-medium rounded-lg text-[10px] px-5 py-1.5 text-center me-2 mb-2">Consultar</button>
                                <button type="button" class="w-full text-white bg-gradient-to-r from-cyan-400 via-cyan-500 to-cyan-600 hover:bg-gradient-to-br foco-4 focus:outline-none foco-cyan-300 dark:foco-cyan-800 font-medium rounded-lg text-[10px] px-5 py-2 text-center me-2 mb-2">Restablecer</button>
                            </div>

                        </div>
                        <div className='w-[300px] space-y-2'>

                            <div className='flex justify-between'>
                                <label htmlFor="" className={`mr-5 text-[10px] ${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-white`}>
                                    Nombre del cliente:
                                </label>
                                <input className={`h-[25px] max-w-[173px] w-full px-3 border border-[#cfcfcf] rounded-[5px] text-[10px]  ${theme === 'light' ? ' text-gray-950 bg-gray-200' : ' text-white bg-gray-200'} dark:text-white  dark:bg-transparent`} arr={['Opción 1', 'Opción 2']} name='Número de ' onChange={onChangeHandler} defaultValue={filter['Número de teléfono']} uuid='123' label='Filtro 1' position='absolute left-0 top-[25px]' bg={`${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-white`} required />
                            </div>
                        </div>
                    </div>
                </div>
            }


            {item === 'Recolección y Validación de Datos' &&
                <div>
                    <div className='flex min-w-[90vw] flex-wrap justify-around relative top-[-25px]'>
                        <div className='px-2'>
                            <Velocimetro></Velocimetro>
                            <h4 className={`text-center text-[14px]  m-0 p-0 pb-2 ${theme === 'light' ? ' text-[steelblue]' : ' text-[#55abf1] '} dark:text-text-[#55abf1]`}>Tasa de finalizacion hoy</h4>
                            <div className='grid grid-cols-3 w-[300px]'>
                                <p className={`col-span-2 text-center text-[10px] ${theme === 'light' ? ' text-gray-500' : ' text-gray-500 '} dark:text-white`}>0 <br />El número de recordatorios en el dia que se asigna en el día.</p>
                                <p className={`col-span-1 text-center text-[10px] ${theme === 'light' ? ' text-gray-500' : ' text-gray-500 '} dark:text-white`}>0 <br />Añadir el número hoy.</p>
                            </div>
                        </div>
                        <div className=' px-2'>
                            <Velocimetro></Velocimetro>
                            <h4 className={`text-center text-[14px]  m-0 p-0 pb-2 ${theme === 'light' ? ' text-[steelblue]' : ' text-[#55abf1] '} dark:text-text-[#55abf1]`}>Tasa de recuperación de caso</h4>
                            <div className='grid grid-cols-3 w-[300px]'>
                                <p className={`col-span-2 text-center text-[10px] ${theme === 'light' ? ' text-gray-500' : ' text-gray-500 '} dark:text-white`}>0 <br />Cobro de hoy.</p>
                                <p className={`col-span-1 text-center text-[10px] ${theme === 'light' ? ' text-gray-500' : ' text-gray-500 '} dark:text-white`}>0 <br /> Número total de casos.</p>
                            </div>
                        </div>
                        <div className=' px-2'>
                            <Velocimetro></Velocimetro>
                            <h4 className={`text-center text-[14px]  m-0 p-0 pb-2 ${theme === 'light' ? ' text-[steelblue]' : ' text-[#55abf1] '} dark:text-text-[#55abf1]`}>Tasa de recuperación de grupo</h4>
                            <h4 className='text-center text-[14px] text-green-600  m-0 p-0 pb-2'> <span className='bg-green-600 mr-2 w-[10px] h-[10px] inline-block'></span>Tasa de recuperación de grupos</h4>

                        </div>
                        <div className=' p-2 border my-5 flex flex-col justify-between'>
                            <h4 className={`text-center text-[14px]  m-0 p-0 pb-2 ${theme === 'light' ? ' text-[steelblue]' : ' text-[#55abf1] '} dark:text-text-[#55abf1]`}>Ranking de hoy</h4>
                            <br />
                            <div className='grid grid-cols-2 gap-2'>
                                <div>
                                    <h4 className='text-center text-[18px] text-[steelblue] m-0 p-0 pb-2'>NO.0</h4>
                                    <p className='col-span-2 text-center text-[12px] text-gray-500'>Ranking Individual <br /> por Equipos</p>

                                </div>
                                <div>
                                    <h4 className='text-center text-[18px] text-[steelblue] m-0 p-0 pb-2'>0.00</h4>
                                    <p className='col-span-2 text-center text-[12px] text-gray-500'>Monto del cobro</p>

                                </div>

                            </div>
                            <br />

                            <h4 className='text-center text-[18px] text-[steelblue] m-0 p-0 pb-2'>0.00</h4>


                            <p className='col-span-2 text-center text-[12px] text-gray-500'>Monto del cobro</p>


                        </div>
                    </div>

                    <div className="w-full   relative  overflow-auto  scroll-smooth mb-2 lg:overflow-hidden">
                        <div className='grid grid-cols-3 gap-x-5 gap-y-2 w-[1050px]'>
                            <div className='w-[330px] space-y-2'>
                                <div className='flex justify-between'>
                                    <label htmlFor="" className={`mr-5 text-[10px] ${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-white`}>
                                        Codigo del producto:
                                    </label>
                                    <SelectSimple arr={filtro_1} name='nombreProducto' click={handlerSelectClick} defaultValue={filter['nombreProducto']} uuid='123' label='Filtro 1' position='absolute left-0 top-[25px]' bg={`${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-white`} required />
                                </div>
                                {/* <div className='flex justify-between'>
                                    <label htmlFor="" className={`mr-5 text-[10px] ${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-white`}>
                                        Cobrador:
                                    </label>
                                    <div className='grid grid-cols-2 gap-2'>
                                        <SelectSimple arr={rangesArray} name='Cobrador 1' click={handlerSelectClick} defaultValue={filter['Cobrador 1']} uuid='123' label='Filtro 1' position='absolute left-0 top-[25px]'  bg={`${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-white`} required />
                                        <SelectSimple arr={cobrador} name='Cobrador 2' click={handlerSelectClick} defaultValue={filter['Cobrador 2']} uuid='123' label='Filtro 1' position='absolute left-0 top-[25px]'  bg={`${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-white`} required />
                                    </div>
                                </div> */}
                                {/* <div className='flex justify-between'>
                                    <label htmlFor="" className={`mr-5 text-[10px] ${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-white`}>
                                        Dias vencidos:
                                    </label>
                                    <div className='grid grid-cols-2 gap-2'>
                                        <input className={`h-[25px] max-w-[173px] w-full px-3 border border-[#cfcfcf] rounded-[5px] text-[10px]  ${theme === 'light' ? ' text-gray-950 bg-gray-200' : ' text-white bg-gray-200'} dark:text-white  dark:bg-transparent`}   arr={['Opción 1', 'Opción 2']} name='Minimo dias vencido' onChange={onChangeHandler} placeholder='Minimo' defaultValue={filter['Nombre del cliente']} uuid='123' label='Filtro 1' position='absolute left-0 top-[25px]'  bg={`${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-white`} required />
                                        <input className={`h-[25px] max-w-[173px] w-full px-3 border border-[#cfcfcf] rounded-[5px] text-[10px]  ${theme === 'light' ? ' text-gray-950 bg-gray-200' : ' text-white bg-gray-200'} dark:text-white  dark:bg-transparent`}   arr={['Opción 1', 'Opción 2']} name='Maximo dias vencido' onChange={onChangeHandler} placeholder='Maximo' defaultValue={filter['Nombre del cliente']} uuid='123' label='Filtro 1' position='absolute left-0 top-[25px]'  bg={`${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-white`} required />
                                    </div>
                                </div> */}
                                <div className='flex justify-between'>
                                    <label htmlFor="" className={`mr-5 text-[10px] ${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-white`}>
                                        Clientes nuevos y antiguos:
                                    </label>
                                    <SelectSimple arr={filterCliente} name='Clientes nuevos y antiguos' click={handlerSelectClick} defaultValue={filter['Cliente nuevo']} uuid='123' label='Filtro 1' position='absolute left-0 top-[25px]' bg={`${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-white`} required />
                                </div>
                                {user?.rol === 'Manager de Verificación' && <button type="button" class="w-full text-white bg-gradient-to-r from-cyan-400 via-cyan-500 to-cyan-600 hover:bg-gradient-to-br foco-4 focus:outline-none foco-cyan-300 dark:foco-cyan-800 font-medium rounded-lg text-[10px] px-5 py-2 text-center me-2 mb-2">Distribuir</button>
                                }
                            </div>
                            <div className='w-[300px] space-y-2'>
                                <div className='flex justify-between'>
                                    <label htmlFor="" className={`mr-5 text-[10px] ${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-white`}>
                                        Número de teléfono:
                                    </label>
                                    <input className={`h-[25px] max-w-[173px] w-full px-3 border border-[#cfcfcf] rounded-[5px] text-[10px]  ${theme === 'light' ? ' text-gray-950 bg-gray-200' : ' text-white bg-gray-200'} dark:text-white  dark:bg-transparent`} arr={['Opción 1', 'Opción 2']} name='Número de teléfono' onChange={onChangeHandler} defaultValue={filter['Número de teléfono']} uuid='123' label='Filtro 1' position='absolute left-0 top-[25px]' bg={`${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-white`} required />
                                </div>

                                <div className='flex justify-between'>
                                    <label htmlFor="" className={`mr-5 text-[10px] ${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-white`}>
                                        Factura a plazos:
                                    </label>
                                    <SelectSimple arr={factura} name='Factura a plazos' click={handlerSelectClick} defaultValue={filter['Factura a plazos']} uuid='123' label='Filtro 1' position='absolute left-0 top-[25px]' bg={`${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-white`} required />
                                </div>
                                <div className='flex justify-between'>
                                    <label htmlFor="" className={`mr-5 text-[10px] ${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-white`}>
                                        Numero de páginas:
                                    </label>
                                    <input className={`h-[25px] max-w-[173px] w-full px-3 border border-[#cfcfcf] rounded-[5px] text-[10px]  ${theme === 'light' ? ' text-gray-950 bg-gray-200' : ' text-white bg-gray-200'} dark:text-white  dark:bg-transparent`} arr={['Opción 1', 'Opción 2']} name='Numero de páginas' onChange={onChangeHandler} defaultValue={filter['Numero de páginas']} uuid='123' label='Numero de páginas' position='absolute left-0 top-[25px]' bg={`${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-white`} required />
                                </div>

                                <div className='flex justify-between'>
                                    <label htmlFor="" className={`mr-5 text-[10px] ${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-white`}>
                                        Jumiah periode:
                                    </label>
                                    <SelectSimple arr={Jumlah} name='Jumiah periode' click={handlerSelectClick} defaultValue={filter['Jumiah periode']} uuid='123' label='Filtro 1' position='absolute left-0 top-[25px]' bg={`${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-white`} required />
                                </div>
                            </div>
                            <div className='w-[300px] space-y-2'>

                                <div className='flex justify-between'>
                                    <label htmlFor="" className={`mr-5 text-[10px] ${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-white`}>
                                        Estado de reembolso:
                                    </label>
                                    <SelectSimple arr={['Aprobado', 'Reprobado']} name='Estado de reembolso' click={handlerSelectClick} defaultValue={filter['Estado de reembolso']} uuid='123' label='Filtro 1' position='absolute left-0 top-[25px]' bg={`${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-white`} required />
                                </div>
                                <div className='flex justify-between'>
                                    <label htmlFor="" className={`mr-5 text-[10px] ${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-white`}>
                                        Fecha de rembolso:
                                    </label>
                                    <div className='grid grid-cols-2 gap-2'>
                                        <input type='date' className="h-[25px] max-w-[173px] w-full px-2 border border-[#cfcfcf] rounded-[5px] text-[10px]  " arr={['Opción 1', 'Opción 2']} name='Nombre del cliente' click={handlerSelectClick} defaultValue={filter['Nombre del cliente']} uuid='123' label='Filtro 1' position='absolute left-0 top-[25px]' bg={`${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-white`} required />
                                        <input type='date' className="h-[25px] max-w-[173px] w-full px-2 border border-[#cfcfcf] rounded-[5px] text-[10px]  " arr={['Opción 1', 'Opción 2']} name='Nombre del cliente' click={handlerSelectClick} defaultValue={filter['Nombre del cliente']} uuid='123' label='Filtro 1' position='absolute left-0 top-[25px]' bg={`${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-white`} required />
                                    </div>

                                </div>



                                <div className='flex justify-between flex space-x-3'>
                                    <button type="button" class="w-full text-white bg-gradient-to-br from-blue-600 to-blue-400 hover:bg-gradient-to-bl foco-4 focus:outline-none foco-blue-300 dark:foco-blue-800 font-medium rounded-lg text-[10px] px-5 py-1.5 text-center me-2 mb-2">Consultar</button>
                                    <button type="button" class="w-full text-white bg-gradient-to-r from-cyan-400 via-cyan-500 to-cyan-600 hover:bg-gradient-to-br foco-4 focus:outline-none foco-cyan-300 dark:foco-cyan-800 font-medium rounded-lg text-[10px] px-5 py-2 text-center me-2 mb-2">Restablecer</button>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>

            }


            {item === 'Lista final' &&
                <div>


                    <div className="w-full   relative  overflow-auto  scroll-smooth mb-2 lg:overflow-hidden">
                        <div className='grid grid-cols-3 gap-x-5 gap-y-2 w-[1050px]'>
                            <div className='w-[330px] space-y-2'>
                                <div className='flex justify-between'>
                                    <label htmlFor="" className={`mr-5 text-[10px] ${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-white`}>
                                        Codigo del producto:
                                    </label>
                                    <SelectSimple arr={filtro_1} name='nombreProducto' click={handlerSelectClick} defaultValue={filter['nombreProducto']} uuid='123' label='Filtro 1' position='absolute left-0 top-[25px]' bg={`${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-white`} required />
                                </div>
                                {/* <div className='flex justify-between'>
                                    <label htmlFor="" className={`mr-5 text-[10px] ${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-white`}>
                                        Cobrador:
                                    </label>
                                    <div className='grid grid-cols-2 gap-2'>
                                        <SelectSimple arr={rangesArray} name='Cobrador 1' click={handlerSelectClick} defaultValue={filter['Cobrador 1']} uuid='123' label='Filtro 1' position='absolute left-0 top-[25px]'  bg={`${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-white`} required />
                                        <SelectSimple arr={cobrador} name='Cobrador 2' click={handlerSelectClick} defaultValue={filter['Cobrador 2']} uuid='123' label='Filtro 1' position='absolute left-0 top-[25px]'  bg={`${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-white`} required />
                                    </div>
                                </div> */}
                                {/* <div className='flex justify-between'>
                                    <label htmlFor="" className={`mr-5 text-[10px] ${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-white`}>
                                        Dias vencidos:
                                    </label>
                                    <div className='grid grid-cols-2 gap-2'>
                                        <input className={`h-[25px] max-w-[173px] w-full px-3 border border-[#cfcfcf] rounded-[5px] text-[10px]  ${theme === 'light' ? ' text-gray-950 bg-gray-200' : ' text-white bg-gray-200'} dark:text-white  dark:bg-transparent`}   arr={['Opción 1', 'Opción 2']} name='Minimo dias vencido' onChange={onChangeHandler} placeholder='Minimo' defaultValue={filter['Nombre del cliente']} uuid='123' label='Filtro 1' position='absolute left-0 top-[25px]'  bg={`${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-white`} required />
                                        <input className={`h-[25px] max-w-[173px] w-full px-3 border border-[#cfcfcf] rounded-[5px] text-[10px]  ${theme === 'light' ? ' text-gray-950 bg-gray-200' : ' text-white bg-gray-200'} dark:text-white  dark:bg-transparent`}   arr={['Opción 1', 'Opción 2']} name='Maximo dias vencido' onChange={onChangeHandler} placeholder='Maximo' defaultValue={filter['Nombre del cliente']} uuid='123' label='Filtro 1' position='absolute left-0 top-[25px]'  bg={`${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-white`} required />
                                    </div>
                                </div> */}

                                {/* <button type="button" class="w-full text-white bg-gradient-to-r from-cyan-400 via-cyan-500 to-cyan-600 hover:bg-gradient-to-br foco-4 focus:outline-none foco-cyan-300 dark:foco-cyan-800 font-medium rounded-lg text-[10px] px-5 py-2 text-center me-2 mb-2">Distribuir</button> */}

                            </div>
                            <div className='w-[300px] space-y-2'>
                                <div className='flex justify-between'>
                                    <label htmlFor="" className={`mr-5 text-[10px] ${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-white`}>
                                        Número de teléfono:
                                    </label>
                                    <input className={`h-[25px] max-w-[173px] w-full px-3 border border-[#cfcfcf] rounded-[5px] text-[10px]  ${theme === 'light' ? ' text-gray-950 bg-gray-200' : ' text-white bg-gray-200'} dark:text-white  dark:bg-transparent`} arr={['Opción 1', 'Opción 2']} name='Número de teléfono' onChange={onChangeHandler} defaultValue={filter['Número de teléfono']} uuid='123' label='Filtro 1' position='absolute left-0 top-[25px]' bg={`${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-white`} required />
                                </div>


                                <div className='flex justify-between'>
                                    <label htmlFor="" className={`mr-5 text-[10px] ${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-white`}>
                                        Numero de páginas:
                                    </label>
                                    <input className={`h-[25px] max-w-[173px] w-full px-3 border border-[#cfcfcf] rounded-[5px] text-[10px]  ${theme === 'light' ? ' text-gray-950 bg-gray-200' : ' text-white bg-gray-200'} dark:text-white  dark:bg-transparent`} arr={['Opción 1', 'Opción 2']} name='Numero de páginas' onChange={onChangeHandler} defaultValue={filter['Numero de páginas']} uuid='123' label='Numero de páginas' position='absolute left-0 top-[25px]' bg={`${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-white`} required />
                                </div>
                                {/* 
                                <div className='flex justify-between'>
                                    <label htmlFor="" className={`mr-5 text-[10px] ${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-white`}>
                                        Jumiah periode:
                                    </label>
                                    <SelectSimple arr={Jumlah} name='Jumiah periode' click={handlerSelectClick} defaultValue={filter['Jumiah periode']} uuid='123' label='Filtro 1' position='absolute left-0 top-[25px]'  bg={`${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-white`} required />
                                </div> */}
                            </div>
                            <div className='w-[300px] space-y-2'>

                                <div className='flex justify-between'>
                                    <label htmlFor="" className={`mr-5 text-[10px] ${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-white`}>
                                        Estado de reembolso:
                                    </label>
                                    <SelectSimple arr={['Aprobado', 'Reprobado']} name='Estado de reembolso' click={handlerSelectClick} defaultValue={filter['Estado de reembolso']} uuid='123' label='Filtro 1' position='absolute left-0 top-[25px]' bg={`${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-white`} required />
                                </div>
                                <div className='flex justify-between'>
                                    <label htmlFor="" className={`mr-5 text-[10px] ${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-white`}>
                                        Fecha de rembolso:
                                    </label>
                                    <div className='grid grid-cols-2 gap-2'>
                                        <input type='date' className="h-[25px] max-w-[173px] w-full px-2 border border-[#cfcfcf] rounded-[5px] text-[10px]  " arr={['Opción 1', 'Opción 2']} name='Nombre del cliente' click={handlerSelectClick} defaultValue={filter['Nombre del cliente']} uuid='123' label='Filtro 1' position='absolute left-0 top-[25px]' bg={`${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-white`} required />
                                        <input type='date' className="h-[25px] max-w-[173px] w-full px-2 border border-[#cfcfcf] rounded-[5px] text-[10px]  " arr={['Opción 1', 'Opción 2']} name='Nombre del cliente' click={handlerSelectClick} defaultValue={filter['Nombre del cliente']} uuid='123' label='Filtro 1' position='absolute left-0 top-[25px]' bg={`${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-white`} required />
                                    </div>

                                </div>



                                <div className='flex justify-between flex space-x-3'>
                                    <button type="button" class="w-full text-white bg-gradient-to-br from-blue-600 to-blue-400 hover:bg-gradient-to-bl foco-4 focus:outline-none foco-blue-300 dark:foco-blue-800 font-medium rounded-lg text-[10px] px-5 py-1.5 text-center me-2 mb-2">Consultar</button>
                                    <button type="button" class="w-full text-white bg-gradient-to-r from-cyan-400 via-cyan-500 to-cyan-600 hover:bg-gradient-to-br foco-4 focus:outline-none foco-cyan-300 dark:foco-cyan-800 font-medium rounded-lg text-[10px] px-5 py-2 text-center me-2 mb-2">Restablecer</button>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            }
            {(item === 'Usuarios de verificación' || item === 'Usuarios de Cobranza' || item === 'Usuarios de Auditoria') &&
                <div>


                    <div className="w-full   relative  overflow-auto  scroll-smooth mb-2 lg:overflow-hidden">
                        <div className='grid grid-cols-3 gap-x-5 gap-y-2 w-[1050px]'>
                            <div className='w-[330px] space-y-2'>
                                {/* <div className='flex justify-between'>
                                    <label htmlFor="" className={`mr-5 text-[10px] ${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-white`}>
                                        Codigo del producto:
                                    </label>
                                    <SelectSimple arr={filtro_1} name='nombreProducto' click={handlerSelectClick} defaultValue={filter['nombreProducto']} uuid='123' label='Filtro 1' position='absolute left-0 top-[25px]'  bg={`${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-white`} required />
                                </div> */}
                                {/* <div className='flex justify-between'>
                                    <label htmlFor="" className={`mr-5 text-[10px] ${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-white`}>
                                        Cobrador:
                                    </label>
                                    <div className='grid grid-cols-2 gap-2'>
                                        <SelectSimple arr={rangesArray} name='Cobrador 1' click={handlerSelectClick} defaultValue={filter['Cobrador 1']} uuid='123' label='Filtro 1' position='absolute left-0 top-[25px]'  bg={`${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-white`} required />
                                        <SelectSimple arr={cobrador} name='Cobrador 2' click={handlerSelectClick} defaultValue={filter['Cobrador 2']} uuid='123' label='Filtro 1' position='absolute left-0 top-[25px]'  bg={`${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-white`} required />
                                    </div>
                                </div> */}
                                {/* <div className='flex justify-between'>
                                    <label htmlFor="" className={`mr-5 text-[10px] ${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-white`}>
                                        Dias vencidos:
                                    </label>
                                    <div className='grid grid-cols-2 gap-2'>
                                        <input className={`h-[25px] max-w-[173px] w-full px-3 border border-[#cfcfcf] rounded-[5px] text-[10px]  ${theme === 'light' ? ' text-gray-950 bg-gray-200' : ' text-white bg-gray-200'} dark:text-white  dark:bg-transparent`}   arr={['Opción 1', 'Opción 2']} name='Minimo dias vencido' onChange={onChangeHandler} placeholder='Minimo' defaultValue={filter['Nombre del cliente']} uuid='123' label='Filtro 1' position='absolute left-0 top-[25px]'  bg={`${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-white`} required />
                                        <input className={`h-[25px] max-w-[173px] w-full px-3 border border-[#cfcfcf] rounded-[5px] text-[10px]  ${theme === 'light' ? ' text-gray-950 bg-gray-200' : ' text-white bg-gray-200'} dark:text-white  dark:bg-transparent`}   arr={['Opción 1', 'Opción 2']} name='Maximo dias vencido' onChange={onChangeHandler} placeholder='Maximo' defaultValue={filter['Nombre del cliente']} uuid='123' label='Filtro 1' position='absolute left-0 top-[25px]'  bg={`${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-white`} required />
                                    </div>
                                </div> */}
                                <div className='flex justify-between'>
                                    <label htmlFor="" className={`mr-5 text-[10px] ${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-white`}>
                                        Buscar por Usuario:
                                    </label>
                                    <input className={`h-[25px] max-w-[173px] w-full px-3 border border-[#cfcfcf] rounded-[5px] text-[10px]  ${theme === 'light' ? ' text-gray-950 bg-gray-200' : ' text-white bg-gray-200'} dark:text-white  dark:bg-transparent`} arr={['Opción 1', 'Opción 2']} name='Número de teléfono' onChange={onChangeHandler} defaultValue={filter['Número de teléfono']} uuid='123' label='Filtro 1' position='absolute left-0 top-[25px]' bg={`${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-white`} required />
                                </div>
                                <div className='flex justify-between'>
                                    <label htmlFor="" className={`mr-5 text-[10px] ${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-white`}>
                                        Buscar por nombre:
                                    </label>
                                    <input className={`h-[25px] max-w-[173px] w-full px-3 border border-[#cfcfcf] rounded-[5px] text-[10px]  ${theme === 'light' ? ' text-gray-950 bg-gray-200' : ' text-white bg-gray-200'} dark:text-white  dark:bg-transparent`} arr={['Opción 1', 'Opción 2']} name='Número de teléfono' onChange={onChangeHandler} defaultValue={filter['Número de teléfono']} uuid='123' label='Filtro 1' position='absolute left-0 top-[25px]' bg={`${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-white`} required />
                                </div>
                                <button type="button" class="w-full text-white bg-gradient-to-r from-cyan-400 via-cyan-500 to-cyan-600 hover:bg-gradient-to-br foco-4 focus:outline-none foco-cyan-300 dark:foco-cyan-800 font-medium rounded-lg text-[10px] px-5 py-2 text-center me-2 mb-2">Crear Usuarios</button>

                            </div>
                            <div className='w-[300px] space-y-2'>
                                <div className='flex justify-between'>
                                    <label htmlFor="" className={`mr-5 text-[10px] ${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-white`}>
                                        Número de teléfono:
                                    </label>
                                    <input className={`h-[25px] max-w-[173px] w-full px-3 border border-[#cfcfcf] rounded-[5px] text-[10px]  ${theme === 'light' ? ' text-gray-950 bg-gray-200' : ' text-white bg-gray-200'} dark:text-white  dark:bg-transparent`} arr={['Opción 1', 'Opción 2']} name='Número de teléfono' onChange={onChangeHandler} defaultValue={filter['Número de teléfono']} uuid='123' label='Filtro 1' position='absolute left-0 top-[25px]' bg={`${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-white`} required />
                                </div>


                                <div className='flex justify-between'>
                                    <label htmlFor="" className={`mr-5 text-[10px] ${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-white`}>
                                        Numero de páginas:
                                    </label>
                                    <input className={`h-[25px] max-w-[173px] w-full px-3 border border-[#cfcfcf] rounded-[5px] text-[10px]  ${theme === 'light' ? ' text-gray-950 bg-gray-200' : ' text-white bg-gray-200'} dark:text-white  dark:bg-transparent`} arr={['Opción 1', 'Opción 2']} name='Numero de páginas' onChange={onChangeHandler} defaultValue={filter['Numero de páginas']} uuid='123' label='Numero de páginas' position='absolute left-0 top-[25px]' bg={`${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-white`} required />
                                </div>
                                {/* 
                                <div className='flex justify-between'>
                                    <label htmlFor="" className={`mr-5 text-[10px] ${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-white`}>
                                        Jumiah periode:
                                    </label>
                                    <SelectSimple arr={Jumlah} name='Jumiah periode' click={handlerSelectClick} defaultValue={filter['Jumiah periode']} uuid='123' label='Filtro 1' position='absolute left-0 top-[25px]'  bg={`${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-white`} required />
                                </div> */}
                            </div>
                            <div className='w-[300px] space-y-2'>

                                <div className='flex justify-between'>
                                    <label htmlFor="" className={`mr-5 text-[10px] ${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-white`}>
                                        Estado de Usuario:
                                    </label>
                                    <SelectSimple arr={['Activo', 'Inactivo']} name='Estado de reembolso' click={handlerSelectClick} defaultValue={filter['Estado de reembolso']} uuid='123' label='Filtro 1' position='absolute left-0 top-[25px]' bg={`${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-white`} required />
                                </div>
                                {/* <div className='flex justify-between'>
                                    <label htmlFor="" className={`mr-5 text-[10px] ${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-white`}>
                                        Fecha de rembolso:
                                    </label>
                                    <div className='grid grid-cols-2 gap-2'>
                                        <input type='date' className="h-[25px] max-w-[173px] w-full px-2 border border-[#cfcfcf] rounded-[5px] text-[10px]  " arr={['Opción 1', 'Opción 2']} name='Nombre del cliente' click={handlerSelectClick} defaultValue={filter['Nombre del cliente']} uuid='123' label='Filtro 1' position='absolute left-0 top-[25px]'  bg={`${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-white`} required />
                                        <input type='date' className="h-[25px] max-w-[173px] w-full px-2 border border-[#cfcfcf] rounded-[5px] text-[10px]  " arr={['Opción 1', 'Opción 2']} name='Nombre del cliente' click={handlerSelectClick} defaultValue={filter['Nombre del cliente']} uuid='123' label='Filtro 1' position='absolute left-0 top-[25px]'  bg={`${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-white`} required />
                                    </div>

                                </div> */}



                                <div className='flex justify-between flex space-x-3'>
                                    <button type="button" class="w-full text-white bg-gradient-to-br from-blue-600 to-blue-400 hover:bg-gradient-to-bl foco-4 focus:outline-none foco-blue-300 dark:foco-blue-800 font-medium rounded-lg text-[10px] px-5 py-1.5 text-center me-2 mb-2">Consultar</button>
                                    <button type="button" class="w-full text-white bg-gradient-to-r from-cyan-400 via-cyan-500 to-cyan-600 hover:bg-gradient-to-br foco-4 focus:outline-none foco-cyan-300 dark:foco-cyan-800 font-medium rounded-lg text-[10px] px-5 py-2 text-center me-2 mb-2">Restablecer</button>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            }

            {(item === 'Gestión de RH' || item === 'Gestión de administradores' || item === 'Gestión de managers' || item === 'Gestión de asesores') &&
                <div>


                    <div className="w-full   relative  overflow-auto  scroll-smooth mb-2 lg:overflow-hidden">
                        <div className='grid grid-cols-3 gap-x-5 gap-y-2 w-[1050px]'>
                            <div className='w-[330px] space-y-2'>
                                {/* <div className='flex justify-between'>
                                    <label htmlFor="" className={`mr-5 text-[10px] ${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-white`}>
                                        Codigo del producto:
                                    </label>
                                    <SelectSimple arr={filtro_1} name='nombreProducto' click={handlerSelectClick} defaultValue={filter['nombreProducto']} uuid='123' label='Filtro 1' position='absolute left-0 top-[25px]'  bg={`${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-white`} required />
                                </div> */}
                                {/* <div className='flex justify-between'>
                                    <label htmlFor="" className={`mr-5 text-[10px] ${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-white`}>
                                        Cobrador:
                                    </label>
                                    <div className='grid grid-cols-2 gap-2'>
                                        <SelectSimple arr={rangesArray} name='Cobrador 1' click={handlerSelectClick} defaultValue={filter['Cobrador 1']} uuid='123' label='Filtro 1' position='absolute left-0 top-[25px]'  bg={`${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-white`} required />
                                        <SelectSimple arr={cobrador} name='Cobrador 2' click={handlerSelectClick} defaultValue={filter['Cobrador 2']} uuid='123' label='Filtro 1' position='absolute left-0 top-[25px]'  bg={`${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-white`} required />
                                    </div>
                                </div> */}
                                {/* <div className='flex justify-between'>
                                    <label htmlFor="" className={`mr-5 text-[10px] ${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-white`}>
                                        Dias vencidos:
                                    </label>
                                    <div className='grid grid-cols-2 gap-2'>
                                        <input className={`h-[25px] max-w-[173px] w-full px-3 border border-[#cfcfcf] rounded-[5px] text-[10px]  ${theme === 'light' ? ' text-gray-950 bg-gray-200' : ' text-white bg-gray-200'} dark:text-white  dark:bg-transparent`}   arr={['Opción 1', 'Opción 2']} name='Minimo dias vencido' onChange={onChangeHandler} placeholder='Minimo' defaultValue={filter['Nombre del cliente']} uuid='123' label='Filtro 1' position='absolute left-0 top-[25px]'  bg={`${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-white`} required />
                                        <input className={`h-[25px] max-w-[173px] w-full px-3 border border-[#cfcfcf] rounded-[5px] text-[10px]  ${theme === 'light' ? ' text-gray-950 bg-gray-200' : ' text-white bg-gray-200'} dark:text-white  dark:bg-transparent`}   arr={['Opción 1', 'Opción 2']} name='Maximo dias vencido' onChange={onChangeHandler} placeholder='Maximo' defaultValue={filter['Nombre del cliente']} uuid='123' label='Filtro 1' position='absolute left-0 top-[25px]'  bg={`${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-white`} required />
                                    </div>
                                </div> */}
                                <div className='flex justify-between'>
                                    <label htmlFor="" className={`mr-5 text-[10px] ${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-white`}>
                                        Buscar por Usuario:
                                    </label>
                                    <input className={`h-[25px] max-w-[173px] w-full px-3 border border-[#cfcfcf] rounded-[5px] text-[10px]  ${theme === 'light' ? ' text-gray-950 bg-gray-200' : ' text-white bg-gray-200'} dark:text-white  dark:bg-transparent`} arr={['Opción 1', 'Opción 2']} name='Número de teléfono' onChange={onChangeHandler} defaultValue={filter['Número de teléfono']} uuid='123' label='Filtro 1' position='absolute left-0 top-[25px]' bg={`${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-white`} required />
                                </div>
                                <div className='flex justify-between'>
                                    <label htmlFor="" className={`mr-5 text-[10px] ${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-white`}>
                                        Buscar por nombre:
                                    </label>
                                    <input className={`h-[25px] max-w-[173px] w-full px-3 border border-[#cfcfcf] rounded-[5px] text-[10px]  ${theme === 'light' ? ' text-gray-950 bg-gray-200' : ' text-white bg-gray-200'} dark:text-white  dark:bg-transparent`} arr={['Opción 1', 'Opción 2']} name='Número de teléfono' onChange={onChangeHandler} defaultValue={filter['Número de teléfono']} uuid='123' label='Filtro 1' position='absolute left-0 top-[25px]' bg={`${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-white`} required />
                                </div>
                                <button type="button" class="w-full text-white bg-gradient-to-r from-cyan-400 via-cyan-500 to-cyan-600 hover:bg-gradient-to-br foco-4 focus:outline-none foco-cyan-300 dark:foco-cyan-800 font-medium rounded-lg text-[10px] px-5 py-2 text-center me-2 mb-2">Crear Usuarios</button>

                            </div>
                            <div className='w-[300px] space-y-2'>
                                <div className='flex justify-between'>
                                    <label htmlFor="" className={`mr-5 text-[10px] ${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-white`}>
                                        Número de teléfono:
                                    </label>
                                    <input className={`h-[25px] max-w-[173px] w-full px-3 border border-[#cfcfcf] rounded-[5px] text-[10px]  ${theme === 'light' ? ' text-gray-950 bg-gray-200' : ' text-white bg-gray-200'} dark:text-white  dark:bg-transparent`} arr={['Opción 1', 'Opción 2']} name='Número de teléfono' onChange={onChangeHandler} defaultValue={filter['Número de teléfono']} uuid='123' label='Filtro 1' position='absolute left-0 top-[25px]' bg={`${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-white`} required />
                                </div>


                                <div className='flex justify-between'>
                                    <label htmlFor="" className={`mr-5 text-[10px] ${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-white`}>
                                        Numero de páginas:
                                    </label>
                                    <input className={`h-[25px] max-w-[173px] w-full px-3 border border-[#cfcfcf] rounded-[5px] text-[10px]  ${theme === 'light' ? ' text-gray-950 bg-gray-200' : ' text-white bg-gray-200'} dark:text-white  dark:bg-transparent`} arr={['Opción 1', 'Opción 2']} name='Numero de páginas' onChange={onChangeHandler} defaultValue={filter['Numero de páginas']} uuid='123' label='Numero de páginas' position='absolute left-0 top-[25px]' bg={`${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-white`} required />
                                </div>
                                {/* 
                                <div className='flex justify-between'>
                                    <label htmlFor="" className={`mr-5 text-[10px] ${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-white`}>
                                        Jumiah periode:
                                    </label>
                                    <SelectSimple arr={Jumlah} name='Jumiah periode' click={handlerSelectClick} defaultValue={filter['Jumiah periode']} uuid='123' label='Filtro 1' position='absolute left-0 top-[25px]'  bg={`${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-white`} required />
                                </div> */}
                            </div>
                            <div className='w-[300px] space-y-2'>

                                <div className='flex justify-between'>
                                    <label htmlFor="" className={`mr-5 text-[10px] ${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-white`}>
                                        Estado de Usuario:
                                    </label>
                                    <SelectSimple arr={['Activo', 'Inactivo']} name='Estado de reembolso' click={handlerSelectClick} defaultValue={filter['Estado de reembolso']} uuid='123' label='Filtro 1' position='absolute left-0 top-[25px]' bg={`${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-white`} required />
                                </div>
                                {/* <div className='flex justify-between'>
                                    <label htmlFor="" className={`mr-5 text-[10px] ${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-white`}>
                                        Fecha de rembolso:
                                    </label>
                                    <div className='grid grid-cols-2 gap-2'>
                                        <input type='date' className="h-[25px] max-w-[173px] w-full px-2 border border-[#cfcfcf] rounded-[5px] text-[10px]  " arr={['Opción 1', 'Opción 2']} name='Nombre del cliente' click={handlerSelectClick} defaultValue={filter['Nombre del cliente']} uuid='123' label='Filtro 1' position='absolute left-0 top-[25px]'  bg={`${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-white`} required />
                                        <input type='date' className="h-[25px] max-w-[173px] w-full px-2 border border-[#cfcfcf] rounded-[5px] text-[10px]  " arr={['Opción 1', 'Opción 2']} name='Nombre del cliente' click={handlerSelectClick} defaultValue={filter['Nombre del cliente']} uuid='123' label='Filtro 1' position='absolute left-0 top-[25px]'  bg={`${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-white`} required />
                                    </div>

                                </div> */}



                                <div className='flex justify-between flex space-x-3'>
                                    <button type="button" class="w-full text-white bg-gradient-to-br from-blue-600 to-blue-400 hover:bg-gradient-to-bl foco-4 focus:outline-none foco-blue-300 dark:foco-blue-800 font-medium rounded-lg text-[10px] px-5 py-1.5 text-center me-2 mb-2">Consultar</button>
                                    <button type="button" class="w-full text-white bg-gradient-to-r from-cyan-400 via-cyan-500 to-cyan-600 hover:bg-gradient-to-br foco-4 focus:outline-none foco-cyan-300 dark:foco-cyan-800 font-medium rounded-lg text-[10px] px-5 py-2 text-center me-2 mb-2">Restablecer</button>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            }







            {(user?.rol === 'Admin' || user.rol === 'Super Admin' || user?.rol === 'Recursos Humanos' || user.rol === 'Manager de Cobranza' || user.rol === 'Manager de Auditoria' || user.rol === 'Manager de Verificación') && item === 'Asistencia' &&
                <div>


                    <div className="w-full   relative  overflow-auto  scroll-smooth mb-2 lg:overflow-hidden">
                        <div className='grid grid-cols-3 gap-x-5 gap-y-2 w-[1050px]'>
                            <div className='w-[330px] space-y-2'>

                                <div className='flex justify-between'>
                                    <label htmlFor="" className={`mr-5 text-[10px] ${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-white`}>
                                        Buscar por Asesor:
                                    </label>
                                    <input className={`h-[25px] max-w-[173px] w-full px-3 border border-[#cfcfcf] rounded-[5px] text-[10px]  ${theme === 'light' ? ' text-gray-950 bg-gray-200' : ' text-white bg-gray-200'} dark:text-white  dark:bg-transparent`} arr={['Opción 1', 'Opción 2']} name='Número de teléfono' onChange={onChangeHandler} defaultValue={filter['Número de teléfono']} uuid='123' label='Filtro 1' position='absolute left-0 top-[25px]' bg={`${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-white`} required />
                                </div>





                            </div>
                            <div className='w-[330px] space-y-2'>

                                <div className='flex justify-between'>
                                    <label htmlFor="" className={`mr-5 text-[10px] ${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-white`}>
                                        buscar por Fecha :
                                    </label>
                                    <input type='date' className="h-[25px] max-w-[173px] w-full px-2 border border-[#cfcfcf] rounded-[5px] text-[10px]  " arr={['Opción 1', 'Opción 2']} name='Nombre del cliente' click={handlerSelectClick} defaultValue={filter['Nombre del cliente']} uuid='123' label='Filtro 1' position='absolute left-0 top-[25px]' bg={`${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-white`} required />

                                </div>





                                <div className='flex justify-between'>
                                    <label htmlFor="" className={`mr-5 text-[10px] ${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-white`}>
                                        Numero de páginas:
                                    </label>
                                    <input className={`h-[25px] max-w-[173px] w-full px-3 border border-[#cfcfcf] rounded-[5px] text-[10px]  ${theme === 'light' ? ' text-gray-950 bg-gray-200' : ' text-white bg-gray-200'} dark:text-white  dark:bg-transparent`} arr={['Opción 1', 'Opción 2']} name='Numero de páginas' onChange={onChangeHandler} defaultValue={filter['Numero de páginas']} uuid='123' label='Numero de páginas' position='absolute left-0 top-[25px]' bg={`${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-white`} required />
                                </div>

                            </div>
                            <div className='w-[300px] space-y-2'>




                                <div className='flex justify-between flex space-x-3'>
                                    <button type="button" class="w-full text-white bg-gradient-to-br from-blue-600 to-blue-400 hover:bg-gradient-to-bl foco-4 focus:outline-none foco-blue-300 dark:foco-blue-800 font-medium rounded-lg text-[10px] px-5 py-1.5 text-center me-2 mb-2">Consultar</button>
                                    <button type="button" class="w-full text-white bg-gradient-to-r from-cyan-400 via-cyan-500 to-cyan-600 hover:bg-gradient-to-br foco-4 focus:outline-none foco-cyan-300 dark:foco-cyan-800 font-medium rounded-lg text-[10px] px-5 py-2 text-center me-2 mb-2">Restablecer</button>
                                </div>
                            </div>
                        </div>

                    </div>

                </div>}

            {(user?.rol === 'Admin' || user.rol === 'Super Admin' || user?.rol === 'Recursos Humanos' || user.rol === 'Manager de Cobranza') && item === 'Reporte diario' &&
                <div>


                    <div className="w-full   relative  overflow-auto  scroll-smooth mb-2 lg:overflow-hidden">
                        <div className='grid grid-cols-3 gap-x-5 gap-y-2 w-[1050px]'>
                            <div className='w-[330px] space-y-2'>

                                <div className='flex justify-between'>
                                    <label htmlFor="" className={`mr-5 text-[10px] ${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-white`}>
                                        Buscar por Asesor:
                                    </label>
                                    <input className={`h-[25px] max-w-[173px] w-full px-3 border border-[#cfcfcf] rounded-[5px] text-[10px]  ${theme === 'light' ? ' text-gray-950 bg-gray-200' : ' text-white bg-gray-200'} dark:text-white  dark:bg-transparent`} arr={['Opción 1', 'Opción 2']} name='Número de teléfono' onChange={onChangeHandler} defaultValue={filter['Número de teléfono']} uuid='123' label='Filtro 1' position='absolute left-0 top-[25px]' bg={`${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-white`} required />
                                </div>





                                <div className='flex justify-between'>
                                    <label htmlFor="" className={`mr-5 text-[10px] ${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-white`}>
                                        Buscar por nombre:
                                    </label>
                                    <input className={`h-[25px] max-w-[173px] w-full px-3 border border-[#cfcfcf] rounded-[5px] text-[10px]  ${theme === 'light' ? ' text-gray-950 bg-gray-200' : ' text-white bg-gray-200'} dark:text-white  dark:bg-transparent`} arr={['Opción 1', 'Opción 2']} name='Numero de páginas' onChange={onChangeHandler} defaultValue={filter['Numero de páginas']} uuid='123' label='Numero de páginas' position='absolute left-0 top-[25px]' bg={`${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-white`} required />
                                </div>

                            </div>
                            <div className='w-[330px] space-y-2'>

                                <div className='flex justify-between'>
                                    <label htmlFor="" className={`mr-5 text-[10px] ${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-white`}>
                                        buscar por Fecha :
                                    </label>
                                    <input type='date' className="h-[25px] max-w-[173px] w-full px-2 border border-[#cfcfcf] rounded-[5px] text-[10px]  " arr={['Opción 1', 'Opción 2']} name='Nombre del cliente' click={handlerSelectClick} defaultValue={filter['Nombre del cliente']} uuid='123' label='Filtro 1' position='absolute left-0 top-[25px]' bg={`${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-white`} required />

                                </div>





                                <div className='flex justify-between'>
                                    <label htmlFor="" className={`mr-5 text-[10px] ${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-white`}>
                                        Numero de páginas:
                                    </label>
                                    <input className={`h-[25px] max-w-[173px] w-full px-3 border border-[#cfcfcf] rounded-[5px] text-[10px]  ${theme === 'light' ? ' text-gray-950 bg-gray-200' : ' text-white bg-gray-200'} dark:text-white  dark:bg-transparent`} arr={['Opción 1', 'Opción 2']} name='Numero de páginas' onChange={onChangeHandler} defaultValue={filter['Numero de páginas']} uuid='123' label='Numero de páginas' position='absolute left-0 top-[25px]' bg={`${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-white`} required />
                                </div>

                            </div>
                            <div className='w-[300px] space-y-2'>




                                <div className='flex justify-between flex space-x-3'>
                                    <button type="button" class="w-full text-white bg-gradient-to-br from-blue-600 to-blue-400 hover:bg-gradient-to-bl foco-4 focus:outline-none foco-blue-300 dark:foco-blue-800 font-medium rounded-lg text-[10px] px-5 py-1.5 text-center me-2 mb-2">Consultar</button>
                                    <button type="button" class="w-full text-white bg-gradient-to-r from-cyan-400 via-cyan-500 to-cyan-600 hover:bg-gradient-to-br foco-4 focus:outline-none foco-cyan-300 dark:foco-cyan-800 font-medium rounded-lg text-[10px] px-5 py-2 text-center me-2 mb-2">Restablecer</button>
                                </div>
                            </div>
                        </div>

                    </div>

                </div>}

            {/* -----------------------  Tablas  ---------------------------*/}


            {item === 'Flujo de Clientes' &&
                <table className="w-full min-w-[1000px] border-[1px] bg-white text-[14px] text-left text-gray-500 border-t-4 border-t-gray-400 shadow">
                    <thead className="text-[10px] text-white uppercase bg-gray-900  sticky top-[0px] z-20">
                        <tr className=''>
                            <th scope="col" className="w-[50px] px-3 py-1 text-white">
                                Solicitud
                            </th>
                            <th scope="col" className=" px-3 py-1 text-white text-center">
                                {getDay((-6)).val}
                            </th>
                            <th scope="col" className=" px-3 py-1 text-white text-center">
                                {getDay((-5)).val}
                            </th>
                            <th scope="col" className=" px-3 py-1 text-white text-center">
                                {getDay((-4)).val}
                            </th>
                            <th scope="col" className=" px-3 py-1 text-white text-center">
                                {getDay((-3)).val}
                            </th>
                            <th scope="col" className=" px-3 py-1 text-white text-center">
                                {getDay((-2)).val}
                            </th>
                            <th scope="col" className=" px-3 py-1 text-white text-center">
                                {getDay((-1)).val}
                            </th >
                        </tr>
                        <tr className=''>
                            <th scope="col" className="w-[50px] px-3 py-1 text-white">
                                Desembolso
                            </th>
                            <th scope="col" className=" px-3 py-1 text-white text-center text-blue-500">
                                {getDay((0)).val}
                            </th>
                            <th scope="col" className=" px-3 py-1 text-white text-center">
                                {getDay((1)).val}
                            </th>
                            <th scope="col" className=" px-3 py-1 text-white text-center">
                                {getDay((2)).val}
                            </th>
                            <th scope="col" className=" px-3 py-1 text-white text-center">
                                {getDay((3)).val}
                            </th>
                            <th scope="col" className=" px-3 py-1 text-white text-center">
                                {getDay((4)).val}
                            </th>
                            <th scope="col" className=" px-3 py-1 text-white text-center">
                                {getDay((5)).val}
                            </th >
                        </tr>
                        <tr className=''>
                            <th scope="col" className="w-[50px] px-3 py-1 text-white">
                                Dia
                            </th>
                            <th scope="col" className=" px-3 py-1 text-white text-center text-blue-500">
                                {getDay((0)).day}
                            </th>
                            <th scope="col" className=" px-3 py-1 text-white text-center">
                                {getDay((1)).day}
                            </th>
                            <th scope="col" className=" px-3 py-1 text-white text-center">
                                {getDay((2)).day}
                            </th>
                            <th scope="col" className=" px-3 py-1 text-white text-center">
                                {getDay((3)).day}
                            </th>
                            <th scope="col" className=" px-3 py-1 text-white text-center">
                                {getDay((4)).day}
                            </th>
                            <th scope="col" className=" px-3 py-1 text-white text-center">
                                {getDay((5)).day}
                            </th >
                        </tr>
                    </thead>
                    <tbody>
                        {filtro_1.map((item, index) => (
                            item !== 'Todo' && <tr key={index} className={`text-[12px] border-b ${index % 2 === 0 ? 'bg-gray-300' : 'bg-gray-200'}`}>
                                <td className="px-3 py-2">{item}</td>
                                <td className="px-3 py-2 text-center">/</td>
                                <td className="px-3 py-2 text-center">/</td>
                                <td className="px-3 py-2 text-center">/</td>
                                <td className="px-3 py-2 text-center">/</td>
                                <td className="px-3 py-2 text-center">/</td>
                                <td className="px-3 py-2 text-center">/</td>
                            </tr>
                        ))}

                    </tbody>
                </table>
            }



            {user?.rol === 'Cuenta personal' && item === 'Comision' && <table className="w-full min-w-[1000px] border-[1px] bg-white text-[14px] text-left text-gray-500 border-t-4 border-t-gray-400 shadow">
                <thead className="text-[10px] text-white uppercase bg-gray-900 z-20">
                    <tr>

                        <th colSpan="1" className="px-4 py-2 text-white text-center">01/12 - 07/12</th>
                        <th colSpan="1" className="px-4 py-2 text-white text-center">LUNES</th>
                        <th colSpan="1" className="px-4 py-2 text-white text-center">MARTES</th>
                        <th colSpan="1" className="px-4 py-2 text-white text-center">MIÉRCOLES</th>
                        <th colSpan="1" className="px-4 py-2 text-white text-center">JUEVES</th>
                        <th colSpan="1" className="px-4 py-2 text-white text-center">VIERNES</th>
                        <th colSpan="1" className="px-4 py-2 text-white text-center">SÁBADO</th>
                        <th colSpan="1" className="px-4 py-2 text-white text-center">DOMINGO</th>

                        <th></th>
                        <th></th>
                    </tr>
                    <tr>

                        <th colSpan="1" className="px-4 py-2 text-white text-center">DETALLE</th>
                        <th scope="col" className=" px-3 py-1 text-white text-center text-blue-500">
                            {getDay((-2)).val}
                        </th>
                        <th scope="col" className=" px-3 py-1 text-white text-center">
                            {getDay((11)).val}
                        </th>
                        <th scope="col" className=" px-3 py-1 text-white text-center text-blue-500">
                            {getDay((0)).val}
                        </th>
                        <th scope="col" className=" px-3 py-1 text-white text-center">
                            {getDay((1)).val}
                        </th>
                        <th scope="col" className=" px-3 py-1 text-white text-center">
                            {getDay((2)).val}
                        </th>
                        <th scope="col" className=" px-3 py-1 text-white text-center">
                            {getDay((3)).val}
                        </th>
                        <th scope="col" className=" px-3 py-1 text-white text-center">
                            {getDay((4)).val}
                        </th>
                        <th colSpan="1" className="px-4 py-2 text-white text-center">Porcentaje <br /> semanal alcanzado</th>
                        <th colSpan="1" className="px-4 py-2 text-white text-center">VALOR SEMANAL  <br />  ENTREGADO</th>

                    </tr>
                </thead>
                <tbody>

                    <tr className='text-[12px]'>

                        <td className="px-4 py-2 border border-gray-200 bg-gray-300">Recoleccion final</td>
                        <td className={`px-4 py-2 border border-gray-20`}>25/50</td>
                        <td className={`px-4 py-2 border border-gray-200`}>25/50</td>
                        <td className={`px-4 py-2 border border-gray-200 `}>25/50</td>
                        <td className={`px-4 py-2 border border-gray-200`}>25/50</td>
                        <td className={`px-4 py-2 border border-gray-200 `}>25/50</td>
                        <td className={`px-4 py-2 border border-gray-200`}>25/50</td>
                        <td className={`px-4 py-2 border border-gray-200 `}>25/50</td>
                    </tr>
                    <tr className='text-[12px]'>

                        <td className="px-4 py-2 border border-gray-200 bg-gray-300">Porcentaje alcanzado</td>
                        <td className={`px-4 py-2 border border-gray-20`}>25/50</td>
                        <td className={`px-4 py-2 border border-gray-200`}>25/50</td>
                        <td className={`px-4 py-2 border border-gray-200 `}>25/50</td>
                        <td className={`px-4 py-2 border border-gray-200`}>25/50</td>
                        <td className={`px-4 py-2 border border-gray-200 `}>25/50</td>
                        <td className={`px-4 py-2 border border-gray-200`}>25/50</td>
                        <td className={`px-4 py-2 border border-gray-200 `}>25/50</td>
                    </tr>
                    <tr className='text-[12px]'>

                        <td className="px-4 py-2 border border-gray-200 bg-gray-300">Valor entregado</td>
                        <td className={`px-4 py-2 border border-gray-20`}>5.00 $</td>
                        <td className={`px-4 py-2 border border-gray-200`}>5.00 $</td>
                        <td className={`px-4 py-2 border border-gray-200 `}>5.00 $</td>
                        <td className={`px-4 py-2 border border-gray-200`}>5.00 $</td>
                        <td className={`px-4 py-2 border border-gray-200 `}>5.00 $</td>
                        <td className={`px-4 py-2 border border-gray-200`}>5.00 $</td>
                        <td className={`px-4 py-2 border border-gray-200 `}>5.00 $</td>
                    </tr>

                </tbody>
            </table>}
            <br />
            {user?.rol === 'Cuenta personal' && item === 'Comision' && <table className="w-full min-w-[1000px] border-[1px] bg-white text-[14px] text-left text-gray-500 border-t-4 border-t-gray-400 shadow">
                <thead className="text-[10px] text-white uppercase bg-gray-900 z-20">
                    <tr>

                        <th colSpan="1" className="px-4 py-2 text-white text-center">01/12 - 07/12</th>
                        <th colSpan="1" className="px-4 py-2 text-white text-center">LUNES</th>
                        <th colSpan="1" className="px-4 py-2 text-white text-center">MARTES</th>
                        <th colSpan="1" className="px-4 py-2 text-white text-center">MIÉRCOLES</th>
                        <th colSpan="1" className="px-4 py-2 text-white text-center">JUEVES</th>
                        <th colSpan="1" className="px-4 py-2 text-white text-center">VIERNES</th>
                        <th colSpan="1" className="px-4 py-2 text-white text-center">SÁBADO</th>
                        <th colSpan="1" className="px-4 py-2 text-white text-center">DOMINGO</th>

                        <th></th>
                        <th></th>
                    </tr>
                    <tr>

                        <th colSpan="1" className="px-4 py-2 text-white text-center">DETALLE</th>
                        <th scope="col" className=" px-3 py-1 text-white text-center text-blue-500">
                            {getDay((-2)).val}
                        </th>
                        <th scope="col" className=" px-3 py-1 text-white text-center">
                            {getDay((11)).val}
                        </th>
                        <th scope="col" className=" px-3 py-1 text-white text-center text-blue-500">
                            {getDay((0)).val}
                        </th>
                        <th scope="col" className=" px-3 py-1 text-white text-center">
                            {getDay((1)).val}
                        </th>
                        <th scope="col" className=" px-3 py-1 text-white text-center">
                            {getDay((2)).val}
                        </th>
                        <th scope="col" className=" px-3 py-1 text-white text-center">
                            {getDay((3)).val}
                        </th>
                        <th scope="col" className=" px-3 py-1 text-white text-center">
                            {getDay((4)).val}
                        </th>
                        <th colSpan="1" className="px-4 py-2 text-white text-center">Porcentaje <br /> semanal alcanzado</th>
                        <th colSpan="1" className="px-4 py-2 text-white text-center">VALOR SEMANAL  <br />  ENTREGADO</th>

                    </tr>
                </thead>
                <tbody>

                    <tr className='text-[12px]'>

                        <td className="px-4 py-2 border border-gray-200 bg-gray-300">Recoleccion final</td>
                        <td className={`px-4 py-2 border border-gray-20`}>25/50</td>
                        <td className={`px-4 py-2 border border-gray-200`}>25/50</td>
                        <td className={`px-4 py-2 border border-gray-200 `}>25/50</td>
                        <td className={`px-4 py-2 border border-gray-200`}>25/50</td>
                        <td className={`px-4 py-2 border border-gray-200 `}>25/50</td>
                        <td className={`px-4 py-2 border border-gray-200`}>25/50</td>
                        <td className={`px-4 py-2 border border-gray-200 `}>25/50</td>
                    </tr>
                    <tr className='text-[12px]'>

                        <td className="px-4 py-2 border border-gray-200 bg-gray-300">Porcentaje alcanzado</td>
                        <td className={`px-4 py-2 border border-gray-20`}>25/50</td>
                        <td className={`px-4 py-2 border border-gray-200`}>25/50</td>
                        <td className={`px-4 py-2 border border-gray-200 `}>25/50</td>
                        <td className={`px-4 py-2 border border-gray-200`}>25/50</td>
                        <td className={`px-4 py-2 border border-gray-200 `}>25/50</td>
                        <td className={`px-4 py-2 border border-gray-200`}>25/50</td>
                        <td className={`px-4 py-2 border border-gray-200 `}>25/50</td>
                    </tr>
                    <tr className='text-[12px]'>

                        <td className="px-4 py-2 border border-gray-200 bg-gray-300">Valor entregado</td>
                        <td className={`px-4 py-2 border border-gray-20`}>5.00 $</td>
                        <td className={`px-4 py-2 border border-gray-200`}>5.00 $</td>
                        <td className={`px-4 py-2 border border-gray-200 `}>5.00 $</td>
                        <td className={`px-4 py-2 border border-gray-200`}>5.00 $</td>
                        <td className={`px-4 py-2 border border-gray-200 `}>5.00 $</td>
                        <td className={`px-4 py-2 border border-gray-200`}>5.00 $</td>
                        <td className={`px-4 py-2 border border-gray-200 `}>5.00 $</td>
                    </tr>

                </tbody>
            </table>}
            <br />
            {user?.rol === 'Cuenta personal' && item === 'Comision' && <table className="w-full min-w-[1000px] border-[1px] bg-white text-[14px] text-left text-gray-500 border-t-4 border-t-gray-400 shadow">
                <thead className="text-[10px] text-white uppercase bg-gray-900  z-20">
                    <tr>

                        <th colSpan="1" className="px-4 py-2 text-white text-center">01/12 - 07/12</th>
                        <th colSpan="1" className="px-4 py-2 text-white text-center">LUNES</th>
                        <th colSpan="1" className="px-4 py-2 text-white text-center">MARTES</th>
                        <th colSpan="1" className="px-4 py-2 text-white text-center">MIÉRCOLES</th>
                        <th colSpan="1" className="px-4 py-2 text-white text-center">JUEVES</th>
                        <th colSpan="1" className="px-4 py-2 text-white text-center">VIERNES</th>
                        <th colSpan="1" className="px-4 py-2 text-white text-center">SÁBADO</th>
                        <th colSpan="1" className="px-4 py-2 text-white text-center">DOMINGO</th>

                        <th></th>
                        <th></th>
                    </tr>
                    <tr>

                        <th colSpan="1" className="px-4 py-2 text-white text-center">DETALLE</th>
                        <th scope="col" className=" px-3 py-1 text-white text-center text-blue-500">
                            {getDay((-2)).val}
                        </th>
                        <th scope="col" className=" px-3 py-1 text-white text-center">
                            {getDay((11)).val}
                        </th>
                        <th scope="col" className=" px-3 py-1 text-white text-center text-blue-500">
                            {getDay((0)).val}
                        </th>
                        <th scope="col" className=" px-3 py-1 text-white text-center">
                            {getDay((1)).val}
                        </th>
                        <th scope="col" className=" px-3 py-1 text-white text-center">
                            {getDay((2)).val}
                        </th>
                        <th scope="col" className=" px-3 py-1 text-white text-center">
                            {getDay((3)).val}
                        </th>
                        <th scope="col" className=" px-3 py-1 text-white text-center">
                            {getDay((4)).val}
                        </th>
                        <th colSpan="1" className="px-4 py-2 text-white text-center">Porcentaje <br /> semanal alcanzado</th>
                        <th colSpan="1" className="px-4 py-2 text-white text-center">VALOR SEMANAL  <br />  ENTREGADO</th>

                    </tr>
                </thead>
                <tbody>

                    <tr className='text-[12px]'>

                        <td className="px-4 py-2 border border-gray-200 bg-gray-300">Recoleccion final</td>
                        <td className={`px-4 py-2 border border-gray-20`}>25/50</td>
                        <td className={`px-4 py-2 border border-gray-200`}>25/50</td>
                        <td className={`px-4 py-2 border border-gray-200 `}>25/50</td>
                        <td className={`px-4 py-2 border border-gray-200`}>25/50</td>
                        <td className={`px-4 py-2 border border-gray-200 `}>25/50</td>
                        <td className={`px-4 py-2 border border-gray-200`}>25/50</td>
                        <td className={`px-4 py-2 border border-gray-200 `}>25/50</td>
                    </tr>
                    <tr className='text-[12px]'>

                        <td className="px-4 py-2 border border-gray-200 bg-gray-300">Porcentaje alcanzado</td>
                        <td className={`px-4 py-2 border border-gray-20`}>25/50</td>
                        <td className={`px-4 py-2 border border-gray-200`}>25/50</td>
                        <td className={`px-4 py-2 border border-gray-200 `}>25/50</td>
                        <td className={`px-4 py-2 border border-gray-200`}>25/50</td>
                        <td className={`px-4 py-2 border border-gray-200 `}>25/50</td>
                        <td className={`px-4 py-2 border border-gray-200`}>25/50</td>
                        <td className={`px-4 py-2 border border-gray-200 `}>25/50</td>
                    </tr>
                    <tr className='text-[12px]'>

                        <td className="px-4 py-2 border border-gray-200 bg-gray-300">Valor entregado</td>
                        <td className={`px-4 py-2 border border-gray-20`}>5.00 $</td>
                        <td className={`px-4 py-2 border border-gray-200`}>5.00 $</td>
                        <td className={`px-4 py-2 border border-gray-200 `}>5.00 $</td>
                        <td className={`px-4 py-2 border border-gray-200`}>5.00 $</td>
                        <td className={`px-4 py-2 border border-gray-200 `}>5.00 $</td>
                        <td className={`px-4 py-2 border border-gray-200`}>5.00 $</td>
                        <td className={`px-4 py-2 border border-gray-200 `}>5.00 $</td>
                    </tr>

                </tbody>
            </table>}



            <div className="overflow-x-auto">
                <div className="max-h-[calc(100vh-90px)] pb-[70px] overflow-y-auto relative scroll-smooth" ref={refFirst}>






                    {/* Rol  Super Admin */}


                    {/* ---------------------------------COLECCION DE CASOS--------------------------------- */}



                    {
                        item === 'Casos de Cobranza' && <Table
                            access={true}
                            headArray={encabezadoCasosDeCobranza}
                            dataArray={['']}
                            dataFilter={(i) => i?.estadoDeCredito === 'pendiente'}
                            local={'http://localhost:3000/api/verification'}
                            server={'http://18.220.249.246/api/data'}
                        />
                    }


                    {
                        item === 'Incurrir en una estación de trabajo' && <Table
                            access={true}
                            headArray={encabezadoIncurrirEnUnaEstaciónDeTrabajo}
                            dataArray={['']}
                            dataFilter={(i) => i?.estadoDeCredito === 'pendiente'}
                            local={'http://localhost:3000/api/verification'}
                            server={'http://18.220.249.246/api/data'}
                        />
                    }


                    {
                        item === 'Gestión de cuentas de Colección' && <Table
                            access={true}
                            headArray={encabezadoGestionDeCuentasDeColección}
                            dataArray={['']}
                            dataFilter={(i) => i?.estadoDeCredito === 'pendiente'}
                            local={'http://localhost:3000/api/verification'}
                            server={'http://18.220.249.246/api/data'}
                        />
                    }


                    {
                        item === 'Registro de SMS' && <Table
                            access={true}
                            headArray={encabezadoRegistroDeSMS}
                            dataArray={['']}
                            dataFilter={(i) => i?.estadoDeCredito === 'pendiente'}
                            local={'http://localhost:3000/api/verification'}
                            server={'http://18.220.249.246/api/data'}
                        />
                    }

                    {
                        item === 'Casos de Cobranza' && <Table
                            access={true}
                            headArray={encabezadoCasosDeCobranza}
                            dataArray={['']}
                            dataFilter={(i) => i?.estadoDeCredito === 'pendiente'}
                            local={'http://localhost:3000/api/verification'}
                            server={'http://18.220.249.246/api/data'}
                        />
                    }










                    {/* 
                    <Table
                        access={true}
                        headArray={encabezadoCasosDeCobranza}
                        dataArray={refunds}
                        dataFilter={true}
                    /> */}
                    {/* ----------------------------------------CASOS DE COBRANZA  */}
                    {/* {(user?.rol === 'Admin' || user.rol === 'Super Admin') && item === 'Casos de Cobranza' && 
                    <table className="min-w-full  shadow" >
                        <thead className="bg-gray-900 text-[10px]  uppercase sticky top-[0px] z-20">

                            <tr className='text-[white] min-w-[2500px]'>

                                {encabezadoCasosDeCobranza.map((encabezado, index) => (
                                    <th scope="col" key={index}
                                        className={`w-[50px] px-3 py-3 text-white 
                                            ${index < 10 ? (selectedLeft === index ? 'sticky left-0 z-20 bg-gray-800' : 'bg-gray-900') : (selectedRight === index ? 'sticky right-0 z-20 bg-gray-800' : 'bg-gray-900')}`}
                                        onClick={() => handlerSelected(index < 10 ? 'LEFT' : 'RIGHT', index)}>
                                        {encabezado === "Seleccionar" ? <input type="checkbox" /> : encabezado}
                                    </th>
                                ))}

                            </tr>

                        </thead>
                        <tbody>
                            {refunds.map((item, index) => (
                                item?.nombreCliente?.toLowerCase().includes(filter['Nombre del cliente'].toLowerCase()) &&
                                item.numeroMovil.includes(filter['Número de teléfono']) && item.nombreProducto.includes(filter.nombreProducto === 'Todo' ? '' : filter.nombreProducto) && item.estado.includes(filter['Estado de reembolso'] === 'Por favor elige' ? '' : filter['Estado de reembolso'].toLowerCase()) && item.diasAtraso * 1 <= filter['Maximo dias vencido'] && item.diasAtraso * 1 >= filter['Minimo dias vencido'] &&
                                <tr key={index} className={`text-[12px] border-b`}>
                                    <td className={`px-3 py-2 text-[12px] border-b ${index % 2 === 0 ? 'bg-gray-300' : 'bg-gray-200'} ${selectedLeft === 0 ? 'sticky left-0 z-10' : ''}`} >
                                        <div className="flex justify-around items-center">
                                            <a
                                                href={`https://wa.me/${item.whatsapp}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center text-green-500 hover:text-green-600"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="25" height="25" viewBox="0 0 48 48">
                                                    <path fill="#fff" d="M4.868,43.303l2.694-9.835C5.9,30.59,5.026,27.324,5.027,23.979C5.032,13.514,13.548,5,24.014,5c5.079,0.002,9.845,1.979,13.43,5.566c3.584,3.588,5.558,8.356,5.556,13.428c-0.004,10.465-8.522,18.98-18.986,18.98c-0.001,0,0,0,0,0h-0.008c-3.177-0.001-6.3-0.798-9.073-2.311L4.868,43.303z"></path><path fill="#fff" d="M4.868,43.803c-0.132,0-0.26-0.052-0.355-0.148c-0.125-0.127-0.174-0.312-0.127-0.483l2.639-9.636c-1.636-2.906-2.499-6.206-2.497-9.556C4.532,13.238,13.273,4.5,24.014,4.5c5.21,0.002,10.105,2.031,13.784,5.713c3.679,3.683,5.704,8.577,5.702,13.781c-0.004,10.741-8.746,19.48-19.486,19.48c-3.189-0.001-6.344-0.788-9.144-2.277l-9.875,2.589C4.953,43.798,4.911,43.803,4.868,43.803z"></path><path fill="#cfd8dc" d="M24.014,5c5.079,0.002,9.845,1.979,13.43,5.566c3.584,3.588,5.558,8.356,5.556,13.428c-0.004,10.465-8.522,18.98-18.986,18.98h-0.008c-3.177-0.001-6.3-0.798-9.073-2.311L4.868,43.303l2.694-9.835C5.9,30.59,5.026,27.324,5.027,23.979C5.032,13.514,13.548,5,24.014,5 M24.014,42.974C24.014,42.974,24.014,42.974,24.014,42.974C24.014,42.974,24.014,42.974,24.014,42.974 M24.014,42.974C24.014,42.974,24.014,42.974,24.014,42.974C24.014,42.974,24.014,42.974,24.014,42.974 M24.014,4C24.014,4,24.014,4,24.014,4C12.998,4,4.032,12.962,4.027,23.979c-0.001,3.367,0.849,6.685,2.461,9.622l-2.585,9.439c-0.094,0.345,0.002,0.713,0.254,0.967c0.19,0.192,0.447,0.297,0.711,0.297c0.085,0,0.17-0.011,0.254-0.033l9.687-2.54c2.828,1.468,5.998,2.243,9.197,2.244c11.024,0,19.99-8.963,19.995-19.98c0.002-5.339-2.075-10.359-5.848-14.135C34.378,6.083,29.357,4.002,24.014,4L24.014,4z"></path><path fill="#40c351" d="M35.176,12.832c-2.98-2.982-6.941-4.625-11.157-4.626c-8.704,0-15.783,7.076-15.787,15.774c-0.001,2.981,0.833,5.883,2.413,8.396l0.376,0.597l-1.595,5.821l5.973-1.566l0.577,0.342c2.422,1.438,5.2,2.198,8.032,2.199h0.006c8.698,0,15.777-7.077,15.78-15.776C39.795,19.778,38.156,15.814,35.176,12.832z"></path><path fill="#fff" fill-rule="evenodd" d="M19.268,16.045c-0.355-0.79-0.729-0.806-1.068-0.82c-0.277-0.012-0.593-0.011-0.909-0.011c-0.316,0-0.83,0.119-1.265,0.594c-0.435,0.475-1.661,1.622-1.661,3.956c0,2.334,1.7,4.59,1.937,4.906c0.237,0.316,3.282,5.259,8.104,7.161c4.007,1.58,4.823,1.266,5.693,1.187c0.87-0.079,2.807-1.147,3.202-2.255c0.395-1.108,0.395-2.057,0.277-2.255c-0.119-0.198-0.435-0.316-0.909-0.554s-2.807-1.385-3.242-1.543c-0.435-0.158-0.751-0.237-1.068,0.238c-0.316,0.474-1.225,1.543-1.502,1.859c-0.277,0.317-0.554,0.357-1.028,0.119c-0.474-0.238-2.002-0.738-3.815-2.354c-1.41-1.257-2.362-2.81-2.639-3.285c-0.277-0.474-0.03-0.731,0.208-0.968c0.213-0.213,0.474-0.554,0.712-0.831c0.237-0.277,0.316-0.475,0.474-0.791c0.158-0.317,0.079-0.594-0.04-0.831C20.612,19.329,19.69,16.983,19.268,16.045z" clip-rule="evenodd"></path>
                                                </svg>
                                            </a>
                                            <a
                                                href={`https://https://t.me/${item.whatsapp}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center text-green-500 hover:text-green-600"
                                            >
                                                <svg width="19" height="19" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <circle cx="16" cy="16" r="14" fill="url(#paint0_linear_87_7225)" />
                                                    <path d="M22.9866 10.2088C23.1112 9.40332 22.3454 8.76755 21.6292 9.082L7.36482 15.3448C6.85123 15.5703 6.8888 16.3483 7.42147 16.5179L10.3631 17.4547C10.9246 17.6335 11.5325 17.541 12.0228 17.2023L18.655 12.6203C18.855 12.4821 19.073 12.7665 18.9021 12.9426L14.1281 17.8646C13.665 18.3421 13.7569 19.1512 14.314 19.5005L19.659 22.8523C20.2585 23.2282 21.0297 22.8506 21.1418 22.1261L22.9866 10.2088Z" fill="white" />
                                                    <defs>
                                                        <linearGradient id="paint0_linear_87_7225" x1="16" y1="2" x2="16" y2="30" gradientUnits="userSpaceOnUse">
                                                            <stop stop-color="#37BBFE" />
                                                            <stop offset="1" stop-color="#007DBB" />
                                                        </linearGradient>
                                                    </defs>
                                                </svg>
                                            </a>
                                        </div>
                                    </td>
                                    <td className={`px-3 py-2 text-[12px] border-b ${index % 2 === 0 ? 'bg-gray-300' : 'bg-gray-200'} ${selectedLeft === 1 ? 'sticky left-0 z-10' : ''}`} >
                                        <input type="checkbox" />
                                    </td>
                                    <td className={`px-3 py-2 text-[12px] border-b ${index % 2 === 0 ? 'bg-gray-300' : 'bg-gray-200'} ${selectedLeft === 2 ? 'sticky left-0 z-10' : ''}`} ><Link href={`/Home/Datos?seccion=info`} className='text-blue-500 underline'>{item.numeroPrestamo}</Link></td>
                                    <td className={`px-3 py-2 text-[12px] border-b ${index % 2 === 0 ? 'bg-gray-300' : 'bg-gray-200'} ${selectedLeft === 3 ? 'sticky left-0 z-10' : ''}`} >{item.idSubFactura}</td>
                                    <td className={`px-3 py-2 ${item.estado === 'pagado' ? 'text-green-500' : 'text-orange-600'} ${index % 2 === 0 ? 'bg-gray-300' : 'bg-gray-200'} ${selectedLeft === 4 ? 'sticky left-0 z-10' : ''}`}>{item.estado}</td>
                                    <td className={`px-3 py-2 text-[12px] border-b ${index % 2 === 0 ? 'bg-gray-300' : 'bg-gray-200'} ${selectedLeft === 5 ? 'sticky left-0 z-10' : ''}`} >{item.nombreCliente}</td>
                                    <td className={`px-3 py-2 text-[12px] border-b ${index % 2 === 0 ? 'bg-gray-300' : 'bg-gray-200'} ${selectedLeft === 6 ? 'sticky left-0 z-10' : ''}`} >
                                        <span className='cursor-pointer text-blue-500 underline' onClick={() => copyToClipboard(item.numeroMovil)}>{item.numeroMovil}</span>
                                        {copied === item.numeroMovil &&
                                            <p className=" absolute t-2 text-green-500 flex bg-white shadow-sm rounded-[5px] py-1 px-2 shadow-[#979797]"> <ClipboardDocumentCheckIcon className='h-4 w-4 fill-green-400' />Texto copiado al portapapeles!</p>}
                                    </td>
                                    <td className={`px-3 py-2 text-[12px] border-b ${item.nuevoCliente ? 'text-green-500' : 'text-orange-600'} ${index % 2 === 0 ? 'bg-gray-300' : 'bg-gray-200'} ${selectedLeft === 7 ? 'sticky left-0 z-10' : ''}`}>{item.nuevoCliente ? 'Sí' : 'No'}</td>
                                    <td className={`px-3 py-2 text-[12px] border-b ${index % 2 === 0 ? 'bg-gray-300' : 'bg-gray-200'} ${selectedLeft === 8 ? 'sticky left-0 z-10' : ''}`} >{item.montoReembolsable}</td>
                                    <td className={`px-3 py-2 text-[12px] border-b ${index % 2 === 0 ? 'bg-gray-300' : 'bg-gray-200'} ${selectedLeft === 9 ? 'sticky left-0 z-10' : ''}`} >{item.montoPagado}</td>
                                    <td className={`px-3 py-2 text-[12px] border-b ${index % 2 === 0 ? 'bg-gray-300' : 'bg-gray-200'} ${selectedRight === 10 ? 'sticky right-0 z-10' : ''}`} >{item.notaRegistro}</td>
                                    <td className={`px-3 py-2 text-[12px] border-b ${index % 2 === 0 ? 'bg-gray-300' : 'bg-gray-200'} ${selectedRight === 11 ? 'sticky right-0 z-10' : ''}`} >{item.nombreProducto}</td>
                                    <td className={`px-3 py-2 text-[12px] border-b ${index % 2 === 0 ? 'bg-gray-300' : 'bg-gray-200'} ${selectedRight === 12 ? 'sticky right-0 z-10' : ''}`} >{item.fechaReembolso}</td>
                                    <td className={`px-3 py-2 text-[12px] border-b ${index % 2 === 0 ? 'bg-gray-300' : 'bg-gray-200'} ${selectedRight === 13 ? 'sticky right-0 z-10' : ''}`} >{item.diasAtraso}</td>
                                    <td className={`px-3 py-2 text-[12px] border-b ${index % 2 === 0 ? 'bg-gray-300' : 'bg-gray-200'} ${selectedRight === 14 ? 'sticky right-0 z-10' : ''}`} >{item.fechaCancelacion}</td>
                                    <td className={`px-3 py-2 text-[12px] border-b ${index % 2 === 0 ? 'bg-gray-300' : 'bg-gray-200'} ${selectedRight === 15 ? 'sticky right-0 z-10' : ''}`} >{item.fechaCreacionTarea}</td>
                                    <td className={`px-3 py-2 text-[12px] border-b ${index % 2 === 0 ? 'bg-gray-300' : 'bg-gray-200'} ${selectedRight === 16 ? 'sticky right-0 z-10' : ''}`} >{item.fechaProcesoCaso}</td>
                                    <td className={`px-3 py-2 text-[12px] border-b ${index % 2 === 0 ? 'bg-gray-300' : 'bg-gray-200'} ${selectedRight === 17 ? 'sticky right-0 z-10' : ''}`} >{item.nombreEmpresa}</td>
                                    {<td className={`px-3 py-2 text-[12px] border-b ${index % 2 === 0 ? 'bg-gray-300' : 'bg-gray-200'} ${selectedRight === 18 ? 'sticky right-0 z-10' : ''}`} >{item.nombreUsuarioCobranza}</td>
                                    }                                    <td className={`px-3 py-2 text-[12px] border-b ${index % 2 === 0 ? 'bg-gray-300' : 'bg-gray-200'} ${selectedRight === 19 ? 'sticky right-0 z-10' : ''}`}>
                                        <div className='flex justify-between flex space-x-3'>
                                            <Link href={`/Home/Datos?seccion=info`} className=''>
                                                <button type="button" class="w-full text-white bg-gradient-to-br from-blue-600 to-blue-400 hover:bg-gradient-to-bl foco-4 focus:outline-none foco-blue-300 dark:foco-blue-800 font-medium rounded-lg text-[10px] px-5 py-1.5 text-center me-2 mb-2">Visitar</button>

                                            </Link>
                                            <button type="button" class="w-full text-white bg-gradient-to-r from-cyan-400 via-cyan-500 to-cyan-600 hover:bg-gradient-to-br foco-4 focus:outline-none foco-cyan-300 dark:foco-cyan-800 font-medium rounded-lg text-[10px] px-5 py-1.5 text-center me-2 mb-2" onClick={() => setModal('Registrar')}>Registrar</button>

                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    } */}

                    {(user?.rol === 'Admin' || user.rol === 'Super Admin') && item === 'Incurrir en una estación de trabajo' &&
                        <table className="w-full min-w-[2500px] border-[1px] bg-white text-[14px] text-left text-gray-500 border-t-4 border-t-gray-400">
                            <thead className="bg-gray-900 text-[10px]  uppercase sticky top-[0px] z-20">
                                <tr className=''>

                                    {encabezadoIncurrirEnUnaEstaciónDeTrabajo.map((encabezado, index) => (
                                        <th scope="col" key={index}
                                            className={`w-[50px] px-3 py-3 text-white 
                                        ${index < 10 ? (selectedLeft === index ? 'sticky left-0 z-20 bg-gray-800' : 'bg-gray-900') : (selectedRight === index ? 'sticky right-0 z-20 bg-gray-800' : 'bg-gray-900')}`}
                                            onClick={() => handlerSelected(index < 10 ? 'LEFT' : 'RIGHT', index)}>
                                            {encabezado === "Seleccionar" ? <input type="checkbox" /> : encabezado}
                                        </th>
                                    ))}

                                </tr>
                            </thead>
                            <tbody>

                                {refunds.map((item, index) => (
                                    item.nombreCliente.toLowerCase().includes(filter['Nombre del cliente'].toLowerCase()) &&
                                    item.numeroMovil.includes(filter['Número de teléfono']) &&
                                    item.nombreProducto.includes(filter.nombreProducto === 'Todo' ? '' : filter.nombreProducto) &&
                                    item.estado.includes(filter['Estado de reembolso'] === 'Por favor elige' ? '' : filter['Estado de reembolso'].toLowerCase()) &&
                                    item.diasAtraso <= filter['Maximo dias vencido'] &&
                                    item.diasAtraso >= filter['Minimo dias vencido'] && (
                                        <tr key={index} className='text-[12px] border-b'>
                                            <td className={`px-3 py-2 text-[12px] border-b 
                                                ${index % 2 === 0 ? 'bg-gray-300' : 'bg-gray-200'} ${selectedLeft === 0 ? 'sticky left-0 z-10' : ''}`}>
                                                <div className="flex justify-around items-center">
                                                    <a
                                                        href={`https://wa.me/${item.whatsapp}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="flex items-center text-green-500 hover:text-green-600"
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="25" height="25" viewBox="0 0 48 48">
                                                            <path fill="#fff" d="M4.868,43.303l2.694-9.835C5.9,30.59,5.026,27.324,5.027,23.979C5.032,13.514,13.548,5,24.014,5c5.079,0.002,9.845,1.979,13.43,5.566c3.584,3.588,5.558,8.356,5.556,13.428c-0.004,10.465-8.522,18.98-18.986,18.98c-0.001,0,0,0,0,0h-0.008c-3.177-0.001-6.3-0.798-9.073-2.311L4.868,43.303z"></path><path fill="#fff" d="M4.868,43.803c-0.132,0-0.26-0.052-0.355-0.148c-0.125-0.127-0.174-0.312-0.127-0.483l2.639-9.636c-1.636-2.906-2.499-6.206-2.497-9.556C4.532,13.238,13.273,4.5,24.014,4.5c5.21,0.002,10.105,2.031,13.784,5.713c3.679,3.683,5.704,8.577,5.702,13.781c-0.004,10.741-8.746,19.48-19.486,19.48c-3.189-0.001-6.344-0.788-9.144-2.277l-9.875,2.589C4.953,43.798,4.911,43.803,4.868,43.803z"></path><path fill="#cfd8dc" d="M24.014,5c5.079,0.002,9.845,1.979,13.43,5.566c3.584,3.588,5.558,8.356,5.556,13.428c-0.004,10.465-8.522,18.98-18.986,18.98h-0.008c-3.177-0.001-6.3-0.798-9.073-2.311L4.868,43.303l2.694-9.835C5.9,30.59,5.026,27.324,5.027,23.979C5.032,13.514,13.548,5,24.014,5 M24.014,42.974C24.014,42.974,24.014,42.974,24.014,42.974C24.014,42.974,24.014,42.974,24.014,42.974 M24.014,42.974C24.014,42.974,24.014,42.974,24.014,42.974C24.014,42.974,24.014,42.974,24.014,42.974 M24.014,4C24.014,4,24.014,4,24.014,4C12.998,4,4.032,12.962,4.027,23.979c-0.001,3.367,0.849,6.685,2.461,9.622l-2.585,9.439c-0.094,0.345,0.002,0.713,0.254,0.967c0.19,0.192,0.447,0.297,0.711,0.297c0.085,0,0.17-0.011,0.254-0.033l9.687-2.54c2.828,1.468,5.998,2.243,9.197,2.244c11.024,0,19.99-8.963,19.995-19.98c0.002-5.339-2.075-10.359-5.848-14.135C34.378,6.083,29.357,4.002,24.014,4L24.014,4z"></path><path fill="#40c351" d="M35.176,12.832c-2.98-2.982-6.941-4.625-11.157-4.626c-8.704,0-15.783,7.076-15.787,15.774c-0.001,2.981,0.833,5.883,2.413,8.396l0.376,0.597l-1.595,5.821l5.973-1.566l0.577,0.342c2.422,1.438,5.2,2.198,8.032,2.199h0.006c8.698,0,15.777-7.077,15.78-15.776C39.795,19.778,38.156,15.814,35.176,12.832z"></path><path fill="#fff" fill-rule="evenodd" d="M19.268,16.045c-0.355-0.79-0.729-0.806-1.068-0.82c-0.277-0.012-0.593-0.011-0.909-0.011c-0.316,0-0.83,0.119-1.265,0.594c-0.435,0.475-1.661,1.622-1.661,3.956c0,2.334,1.7,4.59,1.937,4.906c0.237,0.316,3.282,5.259,8.104,7.161c4.007,1.58,4.823,1.266,5.693,1.187c0.87-0.079,2.807-1.147,3.202-2.255c0.395-1.108,0.395-2.057,0.277-2.255c-0.119-0.198-0.435-0.316-0.909-0.554s-2.807-1.385-3.242-1.543c-0.435-0.158-0.751-0.237-1.068,0.238c-0.316,0.474-1.225,1.543-1.502,1.859c-0.277,0.317-0.554,0.357-1.028,0.119c-0.474-0.238-2.002-0.738-3.815-2.354c-1.41-1.257-2.362-2.81-2.639-3.285c-0.277-0.474-0.03-0.731,0.208-0.968c0.213-0.213,0.474-0.554,0.712-0.831c0.237-0.277,0.316-0.475,0.474-0.791c0.158-0.317,0.079-0.594-0.04-0.831C20.612,19.329,19.69,16.983,19.268,16.045z" clip-rule="evenodd"></path>
                                                        </svg>
                                                    </a>
                                                    <a
                                                        href={`https://https://t.me/${item.whatsapp}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="flex items-center text-green-500 hover:text-green-600"
                                                    >
                                                        <svg width="19" height="19" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                            <circle cx="16" cy="16" r="14" fill="url(#paint0_linear_87_7225)" />
                                                            <path d="M22.9866 10.2088C23.1112 9.40332 22.3454 8.76755 21.6292 9.082L7.36482 15.3448C6.85123 15.5703 6.8888 16.3483 7.42147 16.5179L10.3631 17.4547C10.9246 17.6335 11.5325 17.541 12.0228 17.2023L18.655 12.6203C18.855 12.4821 19.073 12.7665 18.9021 12.9426L14.1281 17.8646C13.665 18.3421 13.7569 19.1512 14.314 19.5005L19.659 22.8523C20.2585 23.2282 21.0297 22.8506 21.1418 22.1261L22.9866 10.2088Z" fill="white" />
                                                            <defs>
                                                                <linearGradient id="paint0_linear_87_7225" x1="16" y1="2" x2="16" y2="30" gradientUnits="userSpaceOnUse">
                                                                    <stop stop-color="#37BBFE" />
                                                                    <stop offset="1" stop-color="#007DBB" />
                                                                </linearGradient>
                                                            </defs>
                                                        </svg>
                                                    </a>
                                                </div>
                                            </td>
                                            <td className={`px-3 py-2 text-[12px] border-b ${index % 2 === 0 ? 'bg-gray-300' : 'bg-gray-200'} ${selectedLeft === 1 ? 'sticky left-0 z-10' : ''}`}>
                                                <input type="checkbox" />
                                            </td>
                                            <td className={`px-3 py-2 text-[12px] border-b ${index % 2 === 0 ? 'bg-gray-300' : 'bg-gray-200'} ${selectedLeft === 2 ? 'sticky left-0 z-10' : ''}`}>
                                                <Link href={`/Home/Datos?seccion=info`} className='text-blue-500 underline'>{item.numeroPrestamo}</Link>
                                            </td>
                                            <td className={`px-3 py-2 text-[12px] border-b ${index % 2 === 0 ? 'bg-gray-300' : 'bg-gray-200'} ${selectedLeft === 3 ? 'sticky left-0 z-10' : ''}`}>{item.idSubFactura}</td>
                                            <td className={`px-3 py-2 text-[12px] border-b ${index % 2 === 0 ? 'bg-gray-300' : 'bg-gray-200'} ${selectedLeft === 4 ? 'sticky left-0 z-10' : ''} ${item.estado === 'pagado' ? 'text-green-500' : 'text-orange-600'} ${index % 2 === 0 ? 'bg-gray-300' : 'bg-gray-200'}`}>{item.estado}</td>
                                            <td className={`px-3 py-2 text-[12px] border-b ${index % 2 === 0 ? 'bg-gray-300' : 'bg-gray-200'} ${selectedLeft === 5 ? 'sticky left-0 z-10' : ''}`}>{item.nombreCliente}</td>
                                            <td className={`px-3 py-2 text-[12px] border-b ${index % 2 === 0 ? 'bg-gray-300' : 'bg-gray-200'} ${selectedLeft === 6 ? 'sticky left-0 z-10' : ''}`}>
                                                <span className='cursor-pointer text-blue-500 underline' onClick={() => copyToClipboard(item.numeroMovil)}>
                                                    {item.numeroMovil}
                                                </span>
                                                {copied === item.numeroMovil && (
                                                    <p className="absolute t-2 text-green-500 flex bg-white shadow-sm rounded-[5px] py-1 px-2 shadow-[#979797]">
                                                        Texto copiado al portapapeles!
                                                    </p>
                                                )}
                                            </td>
                                            <td className={`px-3 py-2 text-[12px] border-b ${index % 2 === 0 ? 'bg-gray-300' : 'bg-gray-200'} ${selectedLeft === 7 ? 'sticky left-0 z-10' : ''} ${item.nuevoCliente ? 'text-green-500' : 'text-orange-600'} ${index % 2 === 0 ? 'bg-gray-300' : 'bg-gray-200'}`}>{item.nuevoCliente ? 'Sí' : 'No'}</td>
                                            <td className={`px-3 py-2 text-[12px] border-b ${index % 2 === 0 ? 'bg-gray-300' : 'bg-gray-200'} ${selectedLeft === 8 ? 'sticky left-0 z-10' : ''}`}>{item.montoReembolsable}</td>
                                            <td className={`px-3 py-2 text-[12px] border-b ${index % 2 === 0 ? 'bg-gray-300' : 'bg-gray-200'} ${selectedLeft === 9 ? 'sticky right-0 z-10' : ''}`}>{item.montoPagado}</td>
                                            <td className={`px-3 py-2 text-[12px] border-b ${index % 2 === 0 ? 'bg-gray-300' : 'bg-gray-200'} ${selectedRight === 10 ? 'sticky right-0 z-10' : ''}`}>{item.notaRegistro}</td>
                                            <td className={`px-3 py-2 text-[12px] border-b ${index % 2 === 0 ? 'bg-gray-300' : 'bg-gray-200'} ${selectedRight === 11 ? 'sticky right-0 z-10' : ''}`}>{item.nombreProducto}</td>
                                            <td className={`px-3 py-2 text-[12px] border-b ${index % 2 === 0 ? 'bg-gray-300' : 'bg-gray-200'} ${selectedRight === 12 ? 'sticky right-0 z-10' : ''}`}>{item.fechaReembolso}</td>
                                            <td className={`px-3 py-2 text-[12px] border-b ${index % 2 === 0 ? 'bg-gray-300' : 'bg-gray-200'} ${selectedRight === 13 ? 'sticky right-0 z-10' : ''}`}>{item.diasAtraso}</td>
                                            <td className={`px-3 py-2 text-[12px] border-b ${index % 2 === 0 ? 'bg-gray-300' : 'bg-gray-200'} ${selectedRight === 14 ? 'sticky right-0 z-10' : ''}`}>{item.fechaCancelacion}</td>
                                            <td className={`px-3 py-2 text-[12px] border-b ${index % 2 === 0 ? 'bg-gray-300' : 'bg-gray-200'} ${selectedRight === 15 ? 'sticky right-0 z-10' : ''}`}>{item.fechaCreacionTarea}</td>
                                            <td className={`px-3 py-2 text-[12px] border-b ${index % 2 === 0 ? 'bg-gray-300' : 'bg-gray-200'} ${selectedRight === 16 ? 'sticky right-0 z-10' : ''}`}>{item.fechaProcesoCaso}</td>
                                            <td className={`px-3 py-2 text-[12px] border-b ${index % 2 === 0 ? 'bg-gray-300' : 'bg-gray-200'} ${selectedRight === 17 ? 'sticky right-0 z-10' : ''}`}>{item.nombreEmpresa}</td>
                                            <td className={`px-3 py-2 text-[12px] border-b ${index % 2 === 0 ? 'bg-gray-300' : 'bg-gray-200'} ${selectedRight === 18 ? 'sticky right-0 z-10' : ''}`}>{item.nombreUsuarioCobranza}</td>
                                            <td className={`px-3 py-2 text-[12px] border-b ${index % 2 === 0 ? 'bg-gray-300' : 'bg-gray-200'} ${selectedRight === 19 ? 'sticky right-0 z-10' : ''}`}>
                                                <div className='flex space-x-2'>
                                                    <Link href={`/Home/Datos?seccion=info`} className=''>
                                                        <UserCircleIcon className='h-6 w-6 fill-[#ebbb40]' />
                                                    </Link>
                                                    <DocumentTextIcon className='h-6 w-6 fill-[#5c78d3] cursor-pointer' onClick={() => setModal('Registrar')} />
                                                    <ChatBubbleLeftEllipsisIcon className='h-6 w-6 fill-[#5bc0cf] cursor-pointer' onClick={() => setModal('SMS')} />
                                                    <CurrencyDollarIcon className='h-6 w-6 fill-[#1ab418] cursor-pointer' />
                                                    <FolderPlusIcon className='h-6 w-6 fill-[#eba140]' />


                                                </div>
                                            </td>
                                        </tr>
                                    )
                                ))}

                            </tbody>
                        </table>
                    }

                    {(user?.rol === 'Admin' || user.rol === 'Super Admin') && item === 'Gestión de cuentas de Colección' &&


                        <table className="w-full min-w-[1100px] border-[1px] bg-white text-[14px] text-left text-gray-500 border-t-4 border-t-gray-400">
                            <thead className="bg-gray-900 text-[10px]  uppercase sticky top-[0px] z-20">
                                <tr className=''>



                                    {encabezadoGestionDeCuentasDeColección.map((encabezado, index) => (
                                        <th scope="col" key={index}
                                            className={`w-[50px] px-3 py-3 text-white 
                                                ${index === 10 && 'text-center'}
                                        ${index < 6 ? (selectedLeft === index ? 'sticky left-0 z-20 bg-gray-800' : 'bg-gray-900') : (selectedRight === index ? 'sticky right-0 z-20 bg-gray-800' : 'bg-gray-900')}`}
                                            onClick={() => handlerSelected(index < 6 ? 'LEFT' : 'RIGHT', index)}>
                                            {encabezado === "Seleccionar" ? <input type="checkbox" /> : encabezado}
                                        </th>
                                    ))}


                                </tr>
                            </thead>
                            <tbody>


                                {refunds.map((item, index) => (

                                    item.nombreCliente.toLowerCase().includes(filter['Nombre del cliente'].toLowerCase()) &&
                                    item.numeroMovil.includes(filter['Número de teléfono']) && item.nombreProducto.includes(filter.nombreProducto === 'Todo' ? '' : filter.nombreProducto) && item.estado.includes(filter['Estado de reembolso'] === 'Por favor elige' ? '' : filter['Estado de reembolso'].toLowerCase()) && item.diasAtraso * 1 <= filter['Maximo dias vencido'] && item.diasAtraso * 1 >= filter['Minimo dias vencido'] && <tr key={index} className='text-[12px] border-b'>
                                        <td className={`px-3 py-2 text-[12px] border-b ${index % 2 === 0 ? 'bg-gray-300' : 'bg-gray-200'} ${selectedLeft === 0 ? 'sticky left-0 z-10' : ''}`}>{item.idSubFactura}</td>



                                        <td className={`px-3 py-2 text-[12px] border-b ${index % 2 === 0 ? 'bg-gray-300' : 'bg-gray-200'} ${selectedLeft === 1 ? 'sticky left-0 z-10' : ''}`}>{item.nombreUsuarioCobranza}</td>
                                        <td className={`px-3 py-2 text-[12px] border-b ${index % 2 === 0 ? 'bg-gray-300' : 'bg-gray-200'} ${selectedLeft === 2 ? 'sticky left-0 z-10' : ''}`}>{item.nombreProducto}</td>
                                        <td className={`px-3 py-2 text-[12px] border-b ${index % 2 === 0 ? 'bg-gray-300' : 'bg-gray-200'} ${selectedLeft === 3 ? 'sticky left-0 z-10' : ''}`}>Recopilación</td>
                                        <td className={`px-3 py-2 text-[12px] border-b ${index % 2 === 0 ? 'bg-gray-300' : 'bg-gray-200'} ${selectedLeft === 4 ? 'sticky left-0 z-10' : ''}`}>Número 1                                    </td>
                                        <td className={`px-3 py-2 text-[12px] border-b ${index % 2 === 0 ? 'bg-gray-300' : 'bg-gray-200'} ${selectedLeft === 5 ? 'sticky left-0 z-10' : ''}`}>Manager</td>
                                        <td className={`px-3 py-2 text-[12px] border-b ${index % 2 === 0 ? 'bg-gray-300' : 'bg-gray-200'} ${selectedRight === 6 ? 'sticky right-0 z-10' : ''}`}>Reposo</td>
                                        <td className={`px-3 py-2 text-[12px] border-b ${index % 2 === 0 ? 'bg-gray-300' : 'bg-gray-200'} ${selectedRight === 7 ? 'sticky right-0 z-10' : ''}`}>D0(0,0)</td>
                                        <td className={`px-3 py-2 text-[12px] border-b ${index % 2 === 0 ? 'bg-gray-300' : 'bg-gray-200'} ${selectedRight === 8 ? 'sticky right-0 z-10' : ''}`}>Socio 1</td>
                                        <td className={`px-3 py-2 text-[12px] border-b ${index % 2 === 0 ? 'bg-gray-300' : 'bg-gray-200'} ${selectedRight === 9 ? 'sticky right-0 z-10' : ''}`}>{item.fechaCreacionTarea}</td>


                                        <td className={`px-3 py-2 text-[12px] border-b ${index % 2 === 0 ? 'bg-gray-300' : 'bg-gray-200'} ${selectedRight === 10 ? 'sticky right-0 z-10' : ''}`}>
                                            <div className='flex justify-around'>
                                                <Link href={`/Home/Datos?seccion=info`} className=''>
                                                    <button type="button" class="w-full text-white bg-gradient-to-br from-blue-600 to-blue-400 hover:bg-gradient-to-bl foco-4 focus:outline-none foco-blue-300 dark:foco-blue-800 font-medium rounded-lg text-[10px] px-5 py-1.5 text-center me-2 mb-2">Visitar</button>

                                                </Link>
                                                <Link href='#'>

                                                    <button type="button" class="w-full text-white bg-gradient-to-r from-cyan-400 via-cyan-500 to-cyan-600 hover:bg-gradient-to-br foco-4 focus:outline-none foco-cyan-300 dark:foco-cyan-800 font-medium rounded-lg text-[10px] px-5 py-1.5 text-center me-2 mb-2" onClick={() => setModal('Registrar')}>Registrar</button>

                                                </Link>

                                            </div>
                                        </td>
                                    </tr>
                                ))}

                            </tbody>
                        </table>
                    }

                    {(user?.rol === 'Admin' || user.rol === 'Super Admin') && item === 'Registro Histórico' && (
                        <table className="w-full min-w-[1100px] border-[1px] bg-white text-[14px] text-left text-gray-500 border-t-4 border-t-gray-400">
                            <thead className="text-[10px] text-gray-700 uppercase bg-gray-900">
                                <tr>
                                    <th scope="col" className="px-3 py-3  text-white">Descripción de la excepción</th>
                                    <th scope="col" className="px-3 py-3  text-white">Apodo del usuario</th>
                                    <th scope="col" className="px-3 py-3  text-white">Código del producto</th>
                                    <th scope="col" className="px-3 py-3  text-white">Código de operación</th>
                                    <th scope="col" className="px-3 py-3  text-white">Contenido de la operación</th>
                                    <th scope="col" className="px-3 py-3  text-white">Resultados de la operación</th>
                                    <th scope="col" className="px-3 py-3  text-white">Tiempo de operación</th>
                                </tr>
                            </thead>
                            <tbody>
                                {historial.map((item, index) => (
                                    <tr key={index} className={`text-[12px] border-b  ${index % 2 === 0 ? 'bg-gray-300' : 'bg-gray-200'}`}>
                                        <td className="px-3 py-2">{item.descripcionExcepcion}</td>
                                        <td className="px-3 py-2">{item.apodoUsuario}</td>
                                        <td className="px-3 py-2">{item.codigoProducto}</td>
                                        <td className="px-3 py-2">{item.codigoOperacion}</td>
                                        <td className="px-3 py-2">{item.contenidoOperacion}</td>
                                        <td className="px-3 py-2">{item.resultadosOperacion}</td>
                                        <td className="px-3 py-2">{item.tiempoOperacion}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}

                    {(user?.rol === 'Admin' || user.rol === 'Super Admin' || user?.rol === 'Recursos Humanos' || user.rol === 'Manager de Cobranza' || user.rol === 'Manager de Cobranza' || user.rol === 'Manager de Auditoria' || user.rol === 'Manager de Verificación') && item === 'Asistencia' && <table className="w-full min-w-[1000px] bg-white text-[14px] text-left text-gray-500 border-t-4  shadow">


                        <thead className="text-[10px] text-white uppercase bg-gray-900 sticky top-[0px] z-20">
                            <tr>
                                <th className='px-3 py-2'>
                                </th>
                                <th colSpan="1" className="px-4 py-2 text-white text-center"></th>
                                <th colSpan="1" className="px-4 py-2 text-white text-center">LUNES</th>
                                <th colSpan="1" className="px-4 py-2 text-white text-center">MARTES</th>
                                <th colSpan="1" className="px-4 py-2 text-white text-center">MIÉRCOLES</th>
                                <th colSpan="1" className="px-4 py-2 text-white text-center">JUEVES</th>
                                <th colSpan="1" className="px-4 py-2 text-white text-center">VIERNES</th>
                                <th colSpan="1" className="px-4 py-2 text-white text-center">SÁBADO</th>
                                <th colSpan="1" className="px-4 py-2 text-white text-center">DOMINGO</th>
                            </tr>
                            <tr>
                                <th className='px-3 py-2'>
                                    <input type="checkbox" />
                                </th>
                                <th colSpan="1" className="px-4 py-2 text-white text-center">USUARIOS</th>
                                <th scope="col" className=" px-3 py-1 text-white text-center text-blue-500">
                                    {getDay((-2)).val}
                                </th>
                                <th scope="col" className=" px-3 py-1 text-white text-center">
                                    {getDay((11)).val}
                                </th>
                                <th scope="col" className=" px-3 py-1 text-white text-center text-blue-500">
                                    {getDay((0)).val}
                                </th>
                                <th scope="col" className=" px-3 py-1 text-white text-center">
                                    {getDay((1)).val}
                                </th>
                                <th scope="col" className=" px-3 py-1 text-white text-center">
                                    {getDay((2)).val}
                                </th>
                                <th scope="col" className=" px-3 py-1 text-white text-center">
                                    {getDay((3)).val}
                                </th>
                                <th scope="col" className=" px-3 py-1 text-white text-center">
                                    {getDay((4)).val}
                                </th>

                            </tr>
                        </thead>
                        <tbody>
                            {trabajo.map((cobrador, index) => (
                                <tr key={index} className='text-[12px]'>
                                    <td className={`px-3 py-2 text-[12px] border-b bg-gray-300 ${selectedLeft === 1 ? 'sticky left-0 z-10' : ''}`} >
                                        <input type="checkbox" />
                                    </td>
                                    <td className="px-4 py-2 border border-gray-200 bg-gray-300">{cobrador.nombre}</td>
                                    <td className={`px-4 py-2 border border-gray-200 ${getBackgroundClass(cobrador.lunes)}`}>{cobrador.lunes}</td>
                                    <td className={`px-4 py-2 border border-gray-200 ${getBackgroundClass(cobrador.martes)}`}>{cobrador.martes}</td>
                                    <td className={`px-4 py-2 border border-gray-200 ${getBackgroundClass(cobrador.miercoles)}`}>{cobrador.miercoles}</td>
                                    <td className={`px-4 py-2 border border-gray-200 ${getBackgroundClass(cobrador.jueves)}`}>{cobrador.jueves}</td>
                                    <td className={`px-4 py-2 border border-gray-200 ${getBackgroundClass(cobrador.viernes)}`}>{cobrador.viernes}</td>
                                    <td className={`px-4 py-2 border border-gray-200 ${getBackgroundClass(cobrador.sabado)}`}>{cobrador.sabado}</td>
                                    <td className={`px-4 py-2 border border-gray-200 ${getBackgroundClass(cobrador.domingo)}`}>{cobrador.domingo}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>}

                    {(user?.rol === 'Admin' || user.rol === 'Super Admin' || user?.rol === 'Recursos Humanos' || user.rol === 'Manager de Cobranza' || user.rol === 'Manager de Cobranza' || user.rol === 'Manager de Auditoria' || user.rol === 'Manager de Verificación') && item === 'Reporte diario' && <table className="w-full min-w-[2000px] border-[1px] bg-white text-[14px] text-left text-gray-500 border-t-4 border-t-gray-400">
                        <thead className="text-[10px] text-white uppercase bg-gray-900 sticky top-[0px] z-20">


                            <tr className=' bg-gray-800'>
                                <th></th>
                                <th className="px-4 py-2 text-white">SEGMENTO</th>
                                <th className="px-4 py-2 text-white">Nombres</th>

                                <th className="px-4 py-2 text-white">Usuario</th>




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
                            {cobradores.map((cobrador, index) => (
                                <tr key={index} className={`bg-gray-200 border-b text-[12px] ${index % 2 === 0 ? 'bg-gray-300' : 'bg-gray-200'}`}>

                                    <td className={`px-3 py-2 text-[12px] border-b ${index % 2 === 0 ? 'bg-gray-300' : 'bg-gray-200'} ${selectedLeft === 1 ? 'sticky left-0 z-10' : ''}`} >
                                        <input type="checkbox" />
                                    </td>
                                    <td className="px-4 py-2">{cobrador.id}</td>
                                    <td className="px-4 py-2">{cobrador.nombre}</td>
                                    <td className="px-4 py-2">{cobrador.usuario}</td>

                                    <td className="px-4 py-2">{cobrador.casos}</td>
                                    <td className="px-4 py-2">{cobrador.llamadasRealizadas}</td>
                                    <td className="px-4 py-2  bg-yellow-400">{cobrador.clientesSinResponder}</td>
                                    <td className="px-4 py-2">{cobrador.pagosHoy}</td>
                                    <td className="px-4 py-2">{cobrador.porcentajeHoy}</td>
                                    <td className="px-4 py-2 bg-yellow-400">{cobrador.ptp2pm}</td>
                                    <td className="px-4 py-2">{cobrador.ptp6pm}</td>
                                    <td className="px-4 py-2">{cobrador.porcentajePTP}</td>
                                    <td className="px-4 py-2 bg-yellow-400">{cobrador.llamadas3pm}</td>
                                    <td className="px-4 py-2">{cobrador.ptp10am}</td>
                                    <td className="px-4 py-2">{cobrador.porcentajeLlamadas}</td>
                                    <td className="px-4 py-2 bg-yellow-400">{cobrador.llamadasFinales}</td>
                                    <td className="px-4 py-2">{cobrador.tasaFinal}</td>
                                    <td className="px-4 py-2">{cobrador.porcentajeFinal}</td>

                                    <td className="px-4 py-2 bg-yellow-400">{cobrador.porcentajeTasaFinal}</td>
                                    <td className="px-4 py-2">{cobrador.tasaFinal}</td>
                                    <td className="px-4 py-2">{cobrador.porcentajeFinal}</td>
                                    <td className="px-4 py-2 bg-yellow-400">{cobrador.tasaFinal}</td>

                                    <td className="px-4 py-2">{cobrador.porcentajeTasaFinal}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>}

                    {user?.rol === 'Cuenta personal' && item === 'Control de casos' && <table className="w-full min-w-[1500px] border-[1px] bg-white text-[14px] text-left text-gray-500 border-t-4 border-t-gray-400">
                        <thead className="text-[10px] text-white uppercase bg-gray-900 sticky top-[0px] z-20">
                            {/* <tr>
        <th className="px-4 py-2 text-white" colSpan="3">Columna 1</th>
        <th className="px-4 py-2 text-white" colSpan="3">Columna 2</th>
        <th className="px-4 py-2 text-white" colSpan="3">Columna 3</th>
    </tr> */}

                            <tr className=' bg-gray-800'>
                                <th className='px-3 py-2'> <input type="checkbox" /></th>
                                <th className="px-4 py-2 text-white">Segmento</th>
                                <th className="px-4 py-2 text-white">Nombre</th>

                                <th className="px-4 py-2 text-white">Usuario asignado</th>


                                <th className="px-4 py-2 text-white">Cantidad de casos</th>
                                <th className="px-4 py-2 text-white">Porcentaje a alcanzar</th>
                                <th className="px-4 py-2  text-yellow-400">Pagos 10:00 aM</th>
                                <th className="px-4 py-2 text-white">PTP</th>
                                <th className="px-4 py-2  text-yellow-400">Pagos 2:00 PM</th>
                                <th className="px-4 py-2 text-white">PTP</th>
                                <th className="px-4 py-2  text-yellow-400">Pagos 4:00 PM</th>
                                <th className="px-4 py-2 text-white">PTP</th>
                                <th className="px-4 py-2 text-white">Pagos alcanzados</th>
                                <th className="px-4 py-2 text-white">Taza de recuperacion</th>



                            </tr>

                        </thead>
                        <tbody>
                            {cobradores.map((cobrador, index) => (
                                <tr key={index} className={`bg-gray-200 border-b text-[12px] ${index % 2 === 0 ? 'bg-gray-300' : 'bg-gray-200'}`}>
                                    <td className={`px-3 py-2 text-[12px] border-b ${index % 2 === 0 ? 'bg-gray-300' : 'bg-gray-200'} ${selectedLeft === 1 ? 'sticky left-0 z-10' : ''}`} >
                                        <input type="checkbox" />
                                    </td>
                                    <td className="px-4 py-2">{cobrador.id}</td>
                                    <td className="px-4 py-2">{cobrador.nombre}</td>
                                    <td className="px-4 py-2">{cobrador.usuario}</td>
                                    <td className="px-4 py-2">{cobrador.casos}</td>

                                    <td className="px-4 py-2">{cobrador.pagosHoy}</td>
                                    <td className="px-4 py-2 bg-yellow-400">{cobrador.ptp2pm}</td>
                                    <td className="px-4 py-2">{cobrador.ptp6pm}</td>
                                    <td className="px-4 py-2 bg-yellow-400">{cobrador.llamadas3pm}</td>
                                    <td className="px-4 py-2">{cobrador.ptp10am}</td>
                                    <td className="px-4 py-2">{cobrador.llamadasElDiaSiguiente}</td>
                                    <td className="px-4 py-2 bg-yellow-400">{cobrador.llamadasFinales}</td>
                                    <td className="px-4 py-2">{cobrador.tasaFinal}</td>
                                    <td className="px-4 py-2 bg-yellow-400">{cobrador.porcentajeTasaFinal}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>}


                    {user?.rol === 'Cuenta personal' && item === 'Asistencia' && <table className="w-full min-w-[1000px] border-[1px] bg-white text-[14px] text-left text-gray-500 border-t-4 border-t-gray-400 shadow">


                        <thead className="text-[10px] text-white uppercase bg-gray-900 sticky top-[0px] z-20">
                            <tr>

                                <th colSpan="1" className="px-4 py-2 text-white text-center"></th>
                                <th colSpan="1" className="px-4 py-2 text-white text-center">LUNES</th>
                                <th colSpan="1" className="px-4 py-2 text-white text-center">MARTES</th>
                                <th colSpan="1" className="px-4 py-2 text-white text-center">MIÉRCOLES</th>
                                <th colSpan="1" className="px-4 py-2 text-white text-center">JUEVES</th>
                                <th colSpan="1" className="px-4 py-2 text-white text-center">VIERNES</th>
                                <th colSpan="1" className="px-4 py-2 text-white text-center">SÁBADO</th>
                                <th colSpan="1" className="px-4 py-2 text-white text-center">DOMINGO</th>
                            </tr>
                            <tr>

                                <th colSpan="1" className="px-4 py-2 text-white text-center">SEMANA</th>
                                <th scope="col" className=" px-3 py-1 text-white text-center text-blue-500">
                                    {getDay((-2)).val}
                                </th>
                                <th scope="col" className=" px-3 py-1 text-white text-center">
                                    {getDay((11)).val}
                                </th>
                                <th scope="col" className=" px-3 py-1 text-white text-center text-blue-500">
                                    {getDay((0)).val}
                                </th>
                                <th scope="col" className=" px-3 py-1 text-white text-center">
                                    {getDay((1)).val}
                                </th>
                                <th scope="col" className=" px-3 py-1 text-white text-center">
                                    {getDay((2)).val}
                                </th>
                                <th scope="col" className=" px-3 py-1 text-white text-center">
                                    {getDay((3)).val}
                                </th>
                                <th scope="col" className=" px-3 py-1 text-white text-center">
                                    {getDay((4)).val}
                                </th>

                            </tr>
                        </thead>
                        <tbody>
                            {trabajo.map((cobrador, index) => (
                                <tr key={index} className='text-[12px]'>

                                    <td className="px-4 py-2 border border-gray-200 bg-gray-300">Semana {index + 1}</td>
                                    <td className={`px-4 py-2 border border-gray-200 ${getBackgroundClass(cobrador.lunes)}`}>{cobrador.lunes}</td>
                                    <td className={`px-4 py-2 border border-gray-200 ${getBackgroundClass(cobrador.martes)}`}>{cobrador.martes}</td>
                                    <td className={`px-4 py-2 border border-gray-200 ${getBackgroundClass(cobrador.miercoles)}`}>{cobrador.miercoles}</td>
                                    <td className={`px-4 py-2 border border-gray-200 ${getBackgroundClass(cobrador.jueves)}`}>{cobrador.jueves}</td>
                                    <td className={`px-4 py-2 border border-gray-200 ${getBackgroundClass(cobrador.viernes)}`}>{cobrador.viernes}</td>
                                    <td className={`px-4 py-2 border border-gray-200 ${getBackgroundClass(cobrador.sabado)}`}>{cobrador.sabado}</td>
                                    <td className={`px-4 py-2 border border-gray-200 ${getBackgroundClass(cobrador.domingo)}`}>{cobrador.domingo}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>}

                    {user?.rol === 'Cuenta personal' && item === 'Gestion de auditoria' && <table className="w-full min-w-[1500px] border-[1px] bg-white text-[14px] text-left text-gray-500 border-t-4 border-t-gray-400">
                        <thead className="text-[10px] text-white uppercase bg-gray-900 sticky top-[0px] z-20">


                            <tr className=' bg-gray-800'>
                                <th className='px-3 py-2'> <input type="checkbox" /></th>
                                <th className="px-4 py-2 text-white">Id Auditor</th>
                                <th className="px-4 py-2 text-white">Nombre del auditor</th>

                                <th className="px-4 py-2 text-white">Usuario asignado</th>


                                <th className="px-4 py-2 text-white">Nombre del operador</th>
                                <th className="px-4 py-2 text-yellow-400">Observacion</th>
                                <th className="px-4 py-2  text-white ">Amonestacion</th>
                                <th className="px-4 py-2 text-yellow-400">Valor de multa</th>
                                <th className="px-4 py-2  text-white">Estado de multa</th>
                                <th className="px-4 py-2 text-white">Fecha de creacion</th>


                            </tr>

                        </thead>
                        <tbody>
                            {cobradores.map((cobrador, index) => (
                                <tr key={index} className={`bg-gray-200 border-b text-[12px] ${index % 2 === 0 ? 'bg-gray-300' : 'bg-gray-200'}`}>
                                    <td className={`px-3 py-2 text-[12px] border-b ${index % 2 === 0 ? 'bg-gray-300' : 'bg-gray-200'} ${selectedLeft === 1 ? 'sticky left-0 z-10' : ''}`} >
                                        <input type="checkbox" />
                                    </td>
                                    <td className="px-4 py-2">{cobrador.id}</td>
                                    <td className="px-4 py-2">{cobrador.nombre}</td>
                                    <td className="px-4 py-2">{cobrador.usuario}</td>
                                    <td className="px-4 py-2">{cobrador.nombre}</td>

                                    <td className="px-4 py-2 bg-yellow-400">Con observacion</td>
                                    <td className="px-4 py-2">Operativa</td>
                                    <td className="px-4 py-2 bg-yellow-400"> $ 10</td>
                                    <td className="px-4 py-2">Aprobada</td>
                                    <td className="px-4 py-2">01/12/2024 10:00 am</td>

                                </tr>
                            ))}
                        </tbody>
                    </table>}


                    {user?.rol === 'Cuenta personal' && item === 'Informacion personal' && <div className='relative w-full h-full items-center flex flex-col justify-center'>


                        <div className={`relative w-[350px] h-auto rounded-[20px]  items-center flex flex-col justify-center space-y-3  ${theme === 'light' ? 'relative bg-white shadow-2xl shadow-gray-500' : ' relative bg-white shadow-2xl shadow-gray-500 '} p-5 dark:shadow-none dark:bg-gray-900`}>


                            <div><img src='/perfil.png' className='h-[150px] rounded-full' /></div>


                            <div className='relative w-[250px]  items-between flex   justify-between'>
                                <span className={`${theme === 'light' ? ' text-green-500' : ' text-green-500 '} dark:text-green-500`}> Nombre:</span>
                                <span className={`${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-white`} > Kiara</span>
                            </div >

                            <div className='relative w-[250px]  items-between flex   justify-between'>
                                <span className={`${theme === 'light' ? ' text-green-500' : ' text-green-500 '} dark:text-green-500`} > Apellido:</span>
                                <span className={`${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-white`} > Palacios</span>
                            </div >
                            <div className='relative w-[250px]  items-between flex   justify-between'>
                                <span className={`${theme === 'light' ? ' text-green-500' : ' text-green-500 '} dark:text-green-500`} > DNI:</span>
                                <span className={`${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-white`} > 2121323312</span>
                            </div >
                            <div className='relative w-[250px]  items-between flex   justify-between'>
                                <span className={`${theme === 'light' ? ' text-green-500' : ' text-green-500 '} dark:text-green-500`} > Correo:</span>
                                <span className={`${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-white`} > alquien@gmail.com</span>
                            </div >
                            <div className='relative w-[250px]  items-between flex   justify-between'>
                                <span className={`${theme === 'light' ? ' text-green-500' : ' text-green-500 '} dark:text-green-500`} > Usuario personal:</span>
                                <span className={`${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-white`} > Personal001</span>
                            </div >
                            <div className='relative w-[250px]  items-between flex   justify-between'>
                                <span className={`${theme === 'light' ? ' text-green-500' : ' text-green-500 '} dark:text-green-500`} > Usuario asignado hoy:</span>
                                <span className={`${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-white`} > UserVe001</span>
                            </div >

                            <InputPass type="password" name="password" valu='User@#$' id="password" disabled placeholder="••••••••" className="bg-gray-50 border border-gray-300 text-gray-900 text-[14px] rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5    " />




                        </div>




                    </div>}

                    {item === 'Casos de Cobranza' && (user?.rol === 'Usuario de Cobranza' || user?.rol === 'Manager de Cobranza' || user?.rol === 'Usuario de Auditoria') && <table className="min-w-full " >
                        <thead className="bg-gray-900 text-[10px]  uppercase sticky top-[0px] z-20">

                            <tr className='text-[white] min-w-[2500px]'>

                                {encabezadoCasosDeCobranza.map((encabezado, index) => (
                                    <th scope="col" key={index}
                                        className={`w-[50px] px-3 py-3 text-white 
                                            ${index < 10 ? (selectedLeft === index ? 'sticky left-0 z-20 bg-gray-800' : 'bg-gray-900') : (selectedRight === index ? 'sticky right-0 z-20 bg-gray-800' : 'bg-gray-900')}`}
                                        onClick={() => handlerSelected(index < 10 ? 'LEFT' : 'RIGHT', index)}>
                                        {encabezado === "Seleccionar" ? <input type="checkbox" /> : encabezado}
                                    </th>
                                ))}

                            </tr>

                        </thead>
                        <tbody>
                            {refunds.map((item, index) => (
                                item.nombreCliente.toLowerCase().includes(filter['Nombre del cliente'].toLowerCase()) &&
                                item.numeroMovil.includes(filter['Número de teléfono']) && item.nombreProducto.includes(filter.nombreProducto === 'Todo' ? '' : filter.nombreProducto) && item.estado.includes(filter['Estado de reembolso'] === 'Por favor elige' ? '' : filter['Estado de reembolso'].toLowerCase()) && item.diasAtraso * 1 <= filter['Maximo dias vencido'] && item.diasAtraso * 1 >= filter['Minimo dias vencido'] &&
                                <tr key={index} className={`text-[12px] border-b`}>
                                    <td className={`px-3 py-2 text-[12px] border-b ${index % 2 === 0 ? 'bg-gray-300' : 'bg-gray-200'} ${selectedLeft === 0 ? 'sticky left-0 z-10' : ''}`} >
                                        <div className="flex justify-around items-center">
                                            <a
                                                href={`https://wa.me/${item.whatsapp}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center text-green-500 hover:text-green-600"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="25" height="25" viewBox="0 0 48 48">
                                                    <path fill="#fff" d="M4.868,43.303l2.694-9.835C5.9,30.59,5.026,27.324,5.027,23.979C5.032,13.514,13.548,5,24.014,5c5.079,0.002,9.845,1.979,13.43,5.566c3.584,3.588,5.558,8.356,5.556,13.428c-0.004,10.465-8.522,18.98-18.986,18.98c-0.001,0,0,0,0,0h-0.008c-3.177-0.001-6.3-0.798-9.073-2.311L4.868,43.303z"></path><path fill="#fff" d="M4.868,43.803c-0.132,0-0.26-0.052-0.355-0.148c-0.125-0.127-0.174-0.312-0.127-0.483l2.639-9.636c-1.636-2.906-2.499-6.206-2.497-9.556C4.532,13.238,13.273,4.5,24.014,4.5c5.21,0.002,10.105,2.031,13.784,5.713c3.679,3.683,5.704,8.577,5.702,13.781c-0.004,10.741-8.746,19.48-19.486,19.48c-3.189-0.001-6.344-0.788-9.144-2.277l-9.875,2.589C4.953,43.798,4.911,43.803,4.868,43.803z"></path><path fill="#cfd8dc" d="M24.014,5c5.079,0.002,9.845,1.979,13.43,5.566c3.584,3.588,5.558,8.356,5.556,13.428c-0.004,10.465-8.522,18.98-18.986,18.98h-0.008c-3.177-0.001-6.3-0.798-9.073-2.311L4.868,43.303l2.694-9.835C5.9,30.59,5.026,27.324,5.027,23.979C5.032,13.514,13.548,5,24.014,5 M24.014,42.974C24.014,42.974,24.014,42.974,24.014,42.974C24.014,42.974,24.014,42.974,24.014,42.974 M24.014,42.974C24.014,42.974,24.014,42.974,24.014,42.974C24.014,42.974,24.014,42.974,24.014,42.974 M24.014,4C24.014,4,24.014,4,24.014,4C12.998,4,4.032,12.962,4.027,23.979c-0.001,3.367,0.849,6.685,2.461,9.622l-2.585,9.439c-0.094,0.345,0.002,0.713,0.254,0.967c0.19,0.192,0.447,0.297,0.711,0.297c0.085,0,0.17-0.011,0.254-0.033l9.687-2.54c2.828,1.468,5.998,2.243,9.197,2.244c11.024,0,19.99-8.963,19.995-19.98c0.002-5.339-2.075-10.359-5.848-14.135C34.378,6.083,29.357,4.002,24.014,4L24.014,4z"></path><path fill="#40c351" d="M35.176,12.832c-2.98-2.982-6.941-4.625-11.157-4.626c-8.704,0-15.783,7.076-15.787,15.774c-0.001,2.981,0.833,5.883,2.413,8.396l0.376,0.597l-1.595,5.821l5.973-1.566l0.577,0.342c2.422,1.438,5.2,2.198,8.032,2.199h0.006c8.698,0,15.777-7.077,15.78-15.776C39.795,19.778,38.156,15.814,35.176,12.832z"></path><path fill="#fff" fill-rule="evenodd" d="M19.268,16.045c-0.355-0.79-0.729-0.806-1.068-0.82c-0.277-0.012-0.593-0.011-0.909-0.011c-0.316,0-0.83,0.119-1.265,0.594c-0.435,0.475-1.661,1.622-1.661,3.956c0,2.334,1.7,4.59,1.937,4.906c0.237,0.316,3.282,5.259,8.104,7.161c4.007,1.58,4.823,1.266,5.693,1.187c0.87-0.079,2.807-1.147,3.202-2.255c0.395-1.108,0.395-2.057,0.277-2.255c-0.119-0.198-0.435-0.316-0.909-0.554s-2.807-1.385-3.242-1.543c-0.435-0.158-0.751-0.237-1.068,0.238c-0.316,0.474-1.225,1.543-1.502,1.859c-0.277,0.317-0.554,0.357-1.028,0.119c-0.474-0.238-2.002-0.738-3.815-2.354c-1.41-1.257-2.362-2.81-2.639-3.285c-0.277-0.474-0.03-0.731,0.208-0.968c0.213-0.213,0.474-0.554,0.712-0.831c0.237-0.277,0.316-0.475,0.474-0.791c0.158-0.317,0.079-0.594-0.04-0.831C20.612,19.329,19.69,16.983,19.268,16.045z" clip-rule="evenodd"></path>
                                                </svg>
                                            </a>
                                            <a
                                                href={`https://https://t.me/${item.whatsapp}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center text-green-500 hover:text-green-600"
                                            >
                                                <svg width="19" height="19" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <circle cx="16" cy="16" r="14" fill="url(#paint0_linear_87_7225)" />
                                                    <path d="M22.9866 10.2088C23.1112 9.40332 22.3454 8.76755 21.6292 9.082L7.36482 15.3448C6.85123 15.5703 6.8888 16.3483 7.42147 16.5179L10.3631 17.4547C10.9246 17.6335 11.5325 17.541 12.0228 17.2023L18.655 12.6203C18.855 12.4821 19.073 12.7665 18.9021 12.9426L14.1281 17.8646C13.665 18.3421 13.7569 19.1512 14.314 19.5005L19.659 22.8523C20.2585 23.2282 21.0297 22.8506 21.1418 22.1261L22.9866 10.2088Z" fill="white" />
                                                    <defs>
                                                        <linearGradient id="paint0_linear_87_7225" x1="16" y1="2" x2="16" y2="30" gradientUnits="userSpaceOnUse">
                                                            <stop stop-color="#37BBFE" />
                                                            <stop offset="1" stop-color="#007DBB" />
                                                        </linearGradient>
                                                    </defs>
                                                </svg>
                                            </a>
                                        </div>
                                    </td>
                                    <td className={`px-3 py-2 text-[12px] border-b ${index % 2 === 0 ? 'bg-gray-300' : 'bg-gray-200'} ${selectedLeft === 1 ? 'sticky left-0 z-10' : ''}`} >
                                        <input type="checkbox" />
                                    </td>
                                    <td className={`px-3 py-2 text-[12px] border-b ${index % 2 === 0 ? 'bg-gray-300' : 'bg-gray-200'} ${selectedLeft === 2 ? 'sticky left-0 z-10' : ''}`} ><Link href={`/Home/Datos?seccion=info`} className='text-blue-500 underline'>{item.numeroPrestamo}</Link></td>
                                    <td className={`px-3 py-2 text-[12px] border-b ${index % 2 === 0 ? 'bg-gray-300' : 'bg-gray-200'} ${selectedLeft === 3 ? 'sticky left-0 z-10' : ''}`} >{item.idSubFactura}</td>
                                    <td className={`px-3 py-2 ${item.estado === 'pagado' ? 'text-green-500' : 'text-orange-600'} ${index % 2 === 0 ? 'bg-gray-300' : 'bg-gray-200'} ${selectedLeft === 4 ? 'sticky left-0 z-10' : ''}`}>{item.estado}</td>
                                    <td className={`px-3 py-2 text-[12px] border-b ${index % 2 === 0 ? 'bg-gray-300' : 'bg-gray-200'} ${selectedLeft === 5 ? 'sticky left-0 z-10' : ''}`} >{item.nombreCliente}</td>
                                    <td className={`px-3 py-2 text-[12px] border-b ${index % 2 === 0 ? 'bg-gray-300' : 'bg-gray-200'} ${selectedLeft === 6 ? 'sticky left-0 z-10' : ''}`} >
                                        <span className='cursor-pointer text-blue-500 underline' onClick={() => copyToClipboard(item.numeroMovil)}>{item.numeroMovil}</span>
                                        {copied === item.numeroMovil &&
                                            <p className=" absolute t-2 text-green-500 flex bg-white shadow-sm rounded-[5px] py-1 px-2 shadow-[#979797]"> <ClipboardDocumentCheckIcon className='h-4 w-4 fill-green-400' />Texto copiado al portapapeles!</p>}
                                    </td>
                                    <td className={`px-3 py-2 text-[12px] border-b ${item.nuevoCliente ? 'text-green-500' : 'text-orange-600'} ${index % 2 === 0 ? 'bg-gray-300' : 'bg-gray-200'} ${selectedLeft === 7 ? 'sticky left-0 z-10' : ''}`}>{item.nuevoCliente ? 'Sí' : 'No'}</td>
                                    <td className={`px-3 py-2 text-[12px] border-b ${index % 2 === 0 ? 'bg-gray-300' : 'bg-gray-200'} ${selectedLeft === 8 ? 'sticky left-0 z-10' : ''}`} >{item.montoReembolsable}</td>
                                    <td className={`px-3 py-2 text-[12px] border-b ${index % 2 === 0 ? 'bg-gray-300' : 'bg-gray-200'} ${selectedLeft === 9 ? 'sticky left-0 z-10' : ''}`} >{item.montoPagado}</td>
                                    <td className={`px-3 py-2 text-[12px] border-b ${index % 2 === 0 ? 'bg-gray-300' : 'bg-gray-200'} ${selectedRight === 10 ? 'sticky right-0 z-10' : ''}`} >{item.notaRegistro}</td>
                                    <td className={`px-3 py-2 text-[12px] border-b ${index % 2 === 0 ? 'bg-gray-300' : 'bg-gray-200'} ${selectedRight === 11 ? 'sticky right-0 z-10' : ''}`} >{item.nombreProducto}</td>
                                    <td className={`px-3 py-2 text-[12px] border-b ${index % 2 === 0 ? 'bg-gray-300' : 'bg-gray-200'} ${selectedRight === 12 ? 'sticky right-0 z-10' : ''}`} >{item.fechaReembolso}</td>
                                    <td className={`px-3 py-2 text-[12px] border-b ${index % 2 === 0 ? 'bg-gray-300' : 'bg-gray-200'} ${selectedRight === 13 ? 'sticky right-0 z-10' : ''}`} >{item.diasAtraso}</td>
                                    <td className={`px-3 py-2 text-[12px] border-b ${index % 2 === 0 ? 'bg-gray-300' : 'bg-gray-200'} ${selectedRight === 14 ? 'sticky right-0 z-10' : ''}`} >{item.fechaCancelacion}</td>
                                    <td className={`px-3 py-2 text-[12px] border-b ${index % 2 === 0 ? 'bg-gray-300' : 'bg-gray-200'} ${selectedRight === 15 ? 'sticky right-0 z-10' : ''}`} >{item.fechaCreacionTarea}</td>
                                    <td className={`px-3 py-2 text-[12px] border-b ${index % 2 === 0 ? 'bg-gray-300' : 'bg-gray-200'} ${selectedRight === 16 ? 'sticky right-0 z-10' : ''}`} >{item.fechaProcesoCaso}</td>
                                    <td className={`px-3 py-2 text-[12px] border-b ${index % 2 === 0 ? 'bg-gray-300' : 'bg-gray-200'} ${selectedRight === 17 ? 'sticky right-0 z-10' : ''}`} >{item.nombreEmpresa}</td>
                                    {!user?.rol?.includes('Usuario') && <td className={`px-3 py-2 text-[12px] border-b ${index % 2 === 0 ? 'bg-gray-300' : 'bg-gray-200'} ${selectedRight === 18 ? 'sticky right-0 z-10' : ''}`} >{item.nombreUsuarioCobranza}</td>
                                    }                                    <td className={`px-3 py-2 text-[12px] border-b ${index % 2 === 0 ? 'bg-gray-300' : 'bg-gray-200'} ${selectedRight === 19 ? 'sticky right-0 z-10' : ''}`}>
                                        <div className='flex justify-between flex space-x-3'>


                                            <Link href={`/Home/Datos?seccion=info`} className=''>
                                                <UserCircleIcon className='h-6 w-6 fill-[#ebbb40]' />
                                            </Link>
                                            <DocumentTextIcon className='h-6 w-6 fill-[#5c78d3] cursor-pointer' onClick={() => setModal('Registrar')} />
                                            <ChatBubbleLeftEllipsisIcon className='h-6 w-6 fill-[#5bc0cf] cursor-pointer' onClick={() => setModal('SMS')} />
                                            <CurrencyDollarIcon className='h-6 w-6 fill-[#1ab418] cursor-pointer' />
                                            <FolderPlusIcon className='h-6 w-6 fill-[#eba140]' onClick={() => setModal('Solicitud a Manager')} />


                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>}

                    {item === 'Monitoreo de Transacciones' && (user?.rol === 'Usuario de Auditoria' || user?.rol === 'Manager de Auditoria') && <table className="min-w-full " >
                        <thead className="bg-gray-900 text-[10px]  uppercase sticky top-[0px] z-20">

                            <tr className='text-[white] min-w-[2500px]'>

                                {encabezadoCasosDeCobranza.map((encabezado, index) => (
                                    <th scope="col" key={index}
                                        className={`w-[50px] px-3 py-3 text-white 
                                            ${index < 10 ? (selectedLeft === index ? 'sticky left-0 z-20 bg-gray-800' : 'bg-gray-900') : (selectedRight === index ? 'sticky right-0 z-20 bg-gray-800' : 'bg-gray-900')}`}
                                        onClick={() => handlerSelected(index < 10 ? 'LEFT' : 'RIGHT', index)}>
                                        {encabezado === "Seleccionar" ? <input type="checkbox" /> : encabezado}
                                    </th>
                                ))}

                            </tr>

                        </thead>
                        <tbody>
                            {refunds.map((item, index) => (
                                item.nombreCliente.toLowerCase().includes(filter['Nombre del cliente'].toLowerCase()) &&
                                item.numeroMovil.includes(filter['Número de teléfono']) && item.nombreProducto.includes(filter.nombreProducto === 'Todo' ? '' : filter.nombreProducto) && item.estado.includes(filter['Estado de reembolso'] === 'Por favor elige' ? '' : filter['Estado de reembolso'].toLowerCase()) && item.diasAtraso * 1 <= filter['Maximo dias vencido'] && item.diasAtraso * 1 >= filter['Minimo dias vencido'] &&
                                <tr key={index} className={`text-[12px] border-b`}>
                                    <td className={`px-3 py-2 text-[12px] border-b ${index % 2 === 0 ? 'bg-gray-300' : 'bg-gray-200'} ${selectedLeft === 0 ? 'sticky left-0 z-10' : ''}`} >
                                        <div className="flex justify-around items-center">
                                            <a
                                                href={`https://wa.me/${item.whatsapp}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center text-green-500 hover:text-green-600"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="25" height="25" viewBox="0 0 48 48">
                                                    <path fill="#fff" d="M4.868,43.303l2.694-9.835C5.9,30.59,5.026,27.324,5.027,23.979C5.032,13.514,13.548,5,24.014,5c5.079,0.002,9.845,1.979,13.43,5.566c3.584,3.588,5.558,8.356,5.556,13.428c-0.004,10.465-8.522,18.98-18.986,18.98c-0.001,0,0,0,0,0h-0.008c-3.177-0.001-6.3-0.798-9.073-2.311L4.868,43.303z"></path><path fill="#fff" d="M4.868,43.803c-0.132,0-0.26-0.052-0.355-0.148c-0.125-0.127-0.174-0.312-0.127-0.483l2.639-9.636c-1.636-2.906-2.499-6.206-2.497-9.556C4.532,13.238,13.273,4.5,24.014,4.5c5.21,0.002,10.105,2.031,13.784,5.713c3.679,3.683,5.704,8.577,5.702,13.781c-0.004,10.741-8.746,19.48-19.486,19.48c-3.189-0.001-6.344-0.788-9.144-2.277l-9.875,2.589C4.953,43.798,4.911,43.803,4.868,43.803z"></path><path fill="#cfd8dc" d="M24.014,5c5.079,0.002,9.845,1.979,13.43,5.566c3.584,3.588,5.558,8.356,5.556,13.428c-0.004,10.465-8.522,18.98-18.986,18.98h-0.008c-3.177-0.001-6.3-0.798-9.073-2.311L4.868,43.303l2.694-9.835C5.9,30.59,5.026,27.324,5.027,23.979C5.032,13.514,13.548,5,24.014,5 M24.014,42.974C24.014,42.974,24.014,42.974,24.014,42.974C24.014,42.974,24.014,42.974,24.014,42.974 M24.014,42.974C24.014,42.974,24.014,42.974,24.014,42.974C24.014,42.974,24.014,42.974,24.014,42.974 M24.014,4C24.014,4,24.014,4,24.014,4C12.998,4,4.032,12.962,4.027,23.979c-0.001,3.367,0.849,6.685,2.461,9.622l-2.585,9.439c-0.094,0.345,0.002,0.713,0.254,0.967c0.19,0.192,0.447,0.297,0.711,0.297c0.085,0,0.17-0.011,0.254-0.033l9.687-2.54c2.828,1.468,5.998,2.243,9.197,2.244c11.024,0,19.99-8.963,19.995-19.98c0.002-5.339-2.075-10.359-5.848-14.135C34.378,6.083,29.357,4.002,24.014,4L24.014,4z"></path><path fill="#40c351" d="M35.176,12.832c-2.98-2.982-6.941-4.625-11.157-4.626c-8.704,0-15.783,7.076-15.787,15.774c-0.001,2.981,0.833,5.883,2.413,8.396l0.376,0.597l-1.595,5.821l5.973-1.566l0.577,0.342c2.422,1.438,5.2,2.198,8.032,2.199h0.006c8.698,0,15.777-7.077,15.78-15.776C39.795,19.778,38.156,15.814,35.176,12.832z"></path><path fill="#fff" fill-rule="evenodd" d="M19.268,16.045c-0.355-0.79-0.729-0.806-1.068-0.82c-0.277-0.012-0.593-0.011-0.909-0.011c-0.316,0-0.83,0.119-1.265,0.594c-0.435,0.475-1.661,1.622-1.661,3.956c0,2.334,1.7,4.59,1.937,4.906c0.237,0.316,3.282,5.259,8.104,7.161c4.007,1.58,4.823,1.266,5.693,1.187c0.87-0.079,2.807-1.147,3.202-2.255c0.395-1.108,0.395-2.057,0.277-2.255c-0.119-0.198-0.435-0.316-0.909-0.554s-2.807-1.385-3.242-1.543c-0.435-0.158-0.751-0.237-1.068,0.238c-0.316,0.474-1.225,1.543-1.502,1.859c-0.277,0.317-0.554,0.357-1.028,0.119c-0.474-0.238-2.002-0.738-3.815-2.354c-1.41-1.257-2.362-2.81-2.639-3.285c-0.277-0.474-0.03-0.731,0.208-0.968c0.213-0.213,0.474-0.554,0.712-0.831c0.237-0.277,0.316-0.475,0.474-0.791c0.158-0.317,0.079-0.594-0.04-0.831C20.612,19.329,19.69,16.983,19.268,16.045z" clip-rule="evenodd"></path>
                                                </svg>
                                            </a>
                                            <a
                                                href={`https://https://t.me/${item.whatsapp}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center text-green-500 hover:text-green-600"
                                            >
                                                <svg width="19" height="19" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <circle cx="16" cy="16" r="14" fill="url(#paint0_linear_87_7225)" />
                                                    <path d="M22.9866 10.2088C23.1112 9.40332 22.3454 8.76755 21.6292 9.082L7.36482 15.3448C6.85123 15.5703 6.8888 16.3483 7.42147 16.5179L10.3631 17.4547C10.9246 17.6335 11.5325 17.541 12.0228 17.2023L18.655 12.6203C18.855 12.4821 19.073 12.7665 18.9021 12.9426L14.1281 17.8646C13.665 18.3421 13.7569 19.1512 14.314 19.5005L19.659 22.8523C20.2585 23.2282 21.0297 22.8506 21.1418 22.1261L22.9866 10.2088Z" fill="white" />
                                                    <defs>
                                                        <linearGradient id="paint0_linear_87_7225" x1="16" y1="2" x2="16" y2="30" gradientUnits="userSpaceOnUse">
                                                            <stop stop-color="#37BBFE" />
                                                            <stop offset="1" stop-color="#007DBB" />
                                                        </linearGradient>
                                                    </defs>
                                                </svg>
                                            </a>
                                        </div>
                                    </td>
                                    <td className={`px-3 py-2 text-[12px] border-b ${index % 2 === 0 ? 'bg-gray-300' : 'bg-gray-200'} ${selectedLeft === 1 ? 'sticky left-0 z-10' : ''}`} >
                                        <input type="checkbox" />
                                    </td>
                                    <td className={`px-3 py-2 text-[12px] border-b ${index % 2 === 0 ? 'bg-gray-300' : 'bg-gray-200'} ${selectedLeft === 2 ? 'sticky left-0 z-10' : ''}`} ><Link href={`/Home/Datos?seccion=info`} className='text-blue-500 underline'>{item.numeroPrestamo}</Link></td>
                                    <td className={`px-3 py-2 text-[12px] border-b ${index % 2 === 0 ? 'bg-gray-300' : 'bg-gray-200'} ${selectedLeft === 3 ? 'sticky left-0 z-10' : ''}`} >{item.idSubFactura}</td>
                                    <td className={`px-3 py-2 ${item.estado === 'pagado' ? 'text-green-500' : 'text-orange-600'} ${index % 2 === 0 ? 'bg-gray-300' : 'bg-gray-200'} ${selectedLeft === 4 ? 'sticky left-0 z-10' : ''}`}>{item.estado}</td>
                                    <td className={`px-3 py-2 text-[12px] border-b ${index % 2 === 0 ? 'bg-gray-300' : 'bg-gray-200'} ${selectedLeft === 5 ? 'sticky left-0 z-10' : ''}`} >{item.nombreCliente}</td>
                                    <td className={`px-3 py-2 text-[12px] border-b ${index % 2 === 0 ? 'bg-gray-300' : 'bg-gray-200'} ${selectedLeft === 6 ? 'sticky left-0 z-10' : ''}`} >
                                        <span className='cursor-pointer text-blue-500 underline' onClick={() => copyToClipboard(item.numeroMovil)}>{item.numeroMovil}</span>
                                        {copied === item.numeroMovil &&
                                            <p className=" absolute t-2 text-green-500 flex bg-white shadow-sm rounded-[5px] py-1 px-2 shadow-[#979797]"> <ClipboardDocumentCheckIcon className='h-4 w-4 fill-green-400' />Texto copiado al portapapeles!</p>}
                                    </td>
                                    <td className={`px-3 py-2 text-[12px] border-b ${item.nuevoCliente ? 'text-green-500' : 'text-orange-600'} ${index % 2 === 0 ? 'bg-gray-300' : 'bg-gray-200'} ${selectedLeft === 7 ? 'sticky left-0 z-10' : ''}`}>{item.nuevoCliente ? 'Sí' : 'No'}</td>
                                    <td className={`px-3 py-2 text-[12px] border-b ${index % 2 === 0 ? 'bg-gray-300' : 'bg-gray-200'} ${selectedLeft === 8 ? 'sticky left-0 z-10' : ''}`} >{item.montoReembolsable}</td>
                                    <td className={`px-3 py-2 text-[12px] border-b ${index % 2 === 0 ? 'bg-gray-300' : 'bg-gray-200'} ${selectedLeft === 9 ? 'sticky left-0 z-10' : ''}`} >{item.montoPagado}</td>
                                    <td className={`px-3 py-2 text-[12px] border-b ${index % 2 === 0 ? 'bg-gray-300' : 'bg-gray-200'} ${selectedRight === 10 ? 'sticky right-0 z-10' : ''}`} >{item.notaRegistro}</td>
                                    <td className={`px-3 py-2 text-[12px] border-b ${index % 2 === 0 ? 'bg-gray-300' : 'bg-gray-200'} ${selectedRight === 11 ? 'sticky right-0 z-10' : ''}`} >{item.nombreProducto}</td>
                                    <td className={`px-3 py-2 text-[12px] border-b ${index % 2 === 0 ? 'bg-gray-300' : 'bg-gray-200'} ${selectedRight === 12 ? 'sticky right-0 z-10' : ''}`} >{item.fechaReembolso}</td>
                                    <td className={`px-3 py-2 text-[12px] border-b ${index % 2 === 0 ? 'bg-gray-300' : 'bg-gray-200'} ${selectedRight === 13 ? 'sticky right-0 z-10' : ''}`} >{item.diasAtraso}</td>
                                    <td className={`px-3 py-2 text-[12px] border-b ${index % 2 === 0 ? 'bg-gray-300' : 'bg-gray-200'} ${selectedRight === 14 ? 'sticky right-0 z-10' : ''}`} >{item.fechaCancelacion}</td>
                                    <td className={`px-3 py-2 text-[12px] border-b ${index % 2 === 0 ? 'bg-gray-300' : 'bg-gray-200'} ${selectedRight === 15 ? 'sticky right-0 z-10' : ''}`} >{item.fechaCreacionTarea}</td>
                                    <td className={`px-3 py-2 text-[12px] border-b ${index % 2 === 0 ? 'bg-gray-300' : 'bg-gray-200'} ${selectedRight === 16 ? 'sticky right-0 z-10' : ''}`} >{item.fechaProcesoCaso}</td>
                                    <td className={`px-3 py-2 text-[12px] border-b ${index % 2 === 0 ? 'bg-gray-300' : 'bg-gray-200'} ${selectedRight === 17 ? 'sticky right-0 z-10' : ''}`} >{item.nombreEmpresa}</td>
                                    {!user?.rol?.includes('Usuario') && <td className={`px-3 py-2 text-[12px] border-b ${index % 2 === 0 ? 'bg-gray-300' : 'bg-gray-200'} ${selectedRight === 18 ? 'sticky right-0 z-10' : ''}`} >{item.nombreUsuarioCobranza}</td>
                                    }                                    <td className={`px-3 py-2 text-[12px] border-b ${index % 2 === 0 ? 'bg-gray-300' : 'bg-gray-200'} ${selectedRight === 19 ? 'sticky right-0 z-10' : ''}`}>
                                        <div className='flex justify-between flex space-x-3'>
                                            <Link href={`/Home/Datos?seccion=info`} className=''>
                                                <button type="button" class="w-full text-white bg-gradient-to-br from-blue-600 to-blue-400 hover:bg-gradient-to-bl foco-4 focus:outline-none foco-blue-300 dark:foco-blue-800 font-medium rounded-lg text-[10px] px-5 py-1.5 text-center me-2 mb-2">Visitar</button>

                                            </Link>
                                            <button type="button" class="w-full text-white bg-gradient-to-r from-cyan-400 via-cyan-500 to-cyan-600 hover:bg-gradient-to-br foco-4 focus:outline-none foco-cyan-300 dark:foco-cyan-800 font-medium rounded-lg text-[10px] px-5 py-1.5 text-center me-2 mb-2" onClick={() => setModal('Registrar Auditor')}>Registrar</button>

                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>}

                    {
                        item === 'Recolección y Validación de Datos' && <Table
                            access={true}
                            headArray={encabezadoCasosDeVerificacion}
                            dataArray={['']}
                            dataFilter={(i) => i.estadoDeCredito === 'pendiente'}
                            local={'http://localhost:3000/api/verification'}
                            server={'http://18.220.249.246/api/data'}
                        />
                    }

                    {
                        item === 'Lista final' && <Table
                            access={true}
                            headArray={encabezadoCasosDeVerificacion}
                            dataFilter={(i) => i.estadoDeCredito.toLowerCase() === 'aprobado' || i.estadoDeCredito.toLowerCase() === 'reprobado'}
                            local={'http://localhost:3000/api/verification'}
                            server={'http://18.220.249.246/api/data'}

                        />
                    }

                    {item === 'Recolección y Validación de Datos 000' && <table className="min-w-full " >
                        <thead className="bg-gray-900 text-[10px]  uppercase sticky top-[0px] z-20">

                            <tr className='text-[white] min-w-[2500px]'>

                                {encabezadoCasosDeVerificacion.map((encabezado, index) => (
                                    <th scope="col" key={index}
                                        className={`w-[50px] px-3 py-3 text-white 
                                            ${index < 10 ? (selectedLeft === index ? 'sticky left-0 z-20 bg-gray-800' : 'bg-gray-900') : (selectedRight === index ? 'sticky right-0 z-20 bg-gray-800' : 'bg-gray-900')}`}
                                        onClick={() => handlerSelected(index < 10 ? 'LEFT' : 'RIGHT', index)}>
                                        {encabezado === "Seleccionar" ? <input type="checkbox" /> : encabezado}
                                    </th>
                                ))}

                            </tr>

                        </thead>
                        <tbody>
                            {refunds.map((item, index) => (
                                item.nombreCliente.toLowerCase().includes(filter['Nombre del cliente'].toLowerCase()) &&
                                item.numeroMovil.includes(filter['Número de teléfono']) && item.nombreProducto.includes(filter.nombreProducto === 'Todo' ? '' : filter.nombreProducto) && item.estado.includes(filter['Estado de reembolso'] === 'Por favor elige' ? '' : filter['Estado de reembolso'].toLowerCase()) && item.diasAtraso * 1 <= filter['Maximo dias vencido'] && item.diasAtraso * 1 >= filter['Minimo dias vencido'] &&
                                <tr key={index} className={`text-[12px] border-b`}>
                                    <td className={`px-3 py-2 text-[12px] border-b ${index % 2 === 0 ? 'bg-gray-300' : 'bg-gray-200'} ${selectedLeft === 0 ? 'sticky left-0 z-10' : ''}`} >
                                        <div className="flex justify-around items-center">
                                            <a
                                                href={`https://wa.me/${item.whatsapp}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center text-green-500 hover:text-green-600"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="25" height="25" viewBox="0 0 48 48">
                                                    <path fill="#fff" d="M4.868,43.303l2.694-9.835C5.9,30.59,5.026,27.324,5.027,23.979C5.032,13.514,13.548,5,24.014,5c5.079,0.002,9.845,1.979,13.43,5.566c3.584,3.588,5.558,8.356,5.556,13.428c-0.004,10.465-8.522,18.98-18.986,18.98c-0.001,0,0,0,0,0h-0.008c-3.177-0.001-6.3-0.798-9.073-2.311L4.868,43.303z"></path><path fill="#fff" d="M4.868,43.803c-0.132,0-0.26-0.052-0.355-0.148c-0.125-0.127-0.174-0.312-0.127-0.483l2.639-9.636c-1.636-2.906-2.499-6.206-2.497-9.556C4.532,13.238,13.273,4.5,24.014,4.5c5.21,0.002,10.105,2.031,13.784,5.713c3.679,3.683,5.704,8.577,5.702,13.781c-0.004,10.741-8.746,19.48-19.486,19.48c-3.189-0.001-6.344-0.788-9.144-2.277l-9.875,2.589C4.953,43.798,4.911,43.803,4.868,43.803z"></path><path fill="#cfd8dc" d="M24.014,5c5.079,0.002,9.845,1.979,13.43,5.566c3.584,3.588,5.558,8.356,5.556,13.428c-0.004,10.465-8.522,18.98-18.986,18.98h-0.008c-3.177-0.001-6.3-0.798-9.073-2.311L4.868,43.303l2.694-9.835C5.9,30.59,5.026,27.324,5.027,23.979C5.032,13.514,13.548,5,24.014,5 M24.014,42.974C24.014,42.974,24.014,42.974,24.014,42.974C24.014,42.974,24.014,42.974,24.014,42.974 M24.014,42.974C24.014,42.974,24.014,42.974,24.014,42.974C24.014,42.974,24.014,42.974,24.014,42.974 M24.014,4C24.014,4,24.014,4,24.014,4C12.998,4,4.032,12.962,4.027,23.979c-0.001,3.367,0.849,6.685,2.461,9.622l-2.585,9.439c-0.094,0.345,0.002,0.713,0.254,0.967c0.19,0.192,0.447,0.297,0.711,0.297c0.085,0,0.17-0.011,0.254-0.033l9.687-2.54c2.828,1.468,5.998,2.243,9.197,2.244c11.024,0,19.99-8.963,19.995-19.98c0.002-5.339-2.075-10.359-5.848-14.135C34.378,6.083,29.357,4.002,24.014,4L24.014,4z"></path><path fill="#40c351" d="M35.176,12.832c-2.98-2.982-6.941-4.625-11.157-4.626c-8.704,0-15.783,7.076-15.787,15.774c-0.001,2.981,0.833,5.883,2.413,8.396l0.376,0.597l-1.595,5.821l5.973-1.566l0.577,0.342c2.422,1.438,5.2,2.198,8.032,2.199h0.006c8.698,0,15.777-7.077,15.78-15.776C39.795,19.778,38.156,15.814,35.176,12.832z"></path><path fill="#fff" fill-rule="evenodd" d="M19.268,16.045c-0.355-0.79-0.729-0.806-1.068-0.82c-0.277-0.012-0.593-0.011-0.909-0.011c-0.316,0-0.83,0.119-1.265,0.594c-0.435,0.475-1.661,1.622-1.661,3.956c0,2.334,1.7,4.59,1.937,4.906c0.237,0.316,3.282,5.259,8.104,7.161c4.007,1.58,4.823,1.266,5.693,1.187c0.87-0.079,2.807-1.147,3.202-2.255c0.395-1.108,0.395-2.057,0.277-2.255c-0.119-0.198-0.435-0.316-0.909-0.554s-2.807-1.385-3.242-1.543c-0.435-0.158-0.751-0.237-1.068,0.238c-0.316,0.474-1.225,1.543-1.502,1.859c-0.277,0.317-0.554,0.357-1.028,0.119c-0.474-0.238-2.002-0.738-3.815-2.354c-1.41-1.257-2.362-2.81-2.639-3.285c-0.277-0.474-0.03-0.731,0.208-0.968c0.213-0.213,0.474-0.554,0.712-0.831c0.237-0.277,0.316-0.475,0.474-0.791c0.158-0.317,0.079-0.594-0.04-0.831C20.612,19.329,19.69,16.983,19.268,16.045z" clip-rule="evenodd"></path>
                                                </svg>
                                            </a>
                                            <a
                                                href={`https://https://t.me/${item.whatsapp}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center text-green-500 hover:text-green-600"
                                            >
                                                <svg width="19" height="19" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <circle cx="16" cy="16" r="14" fill="url(#paint0_linear_87_7225)" />
                                                    <path d="M22.9866 10.2088C23.1112 9.40332 22.3454 8.76755 21.6292 9.082L7.36482 15.3448C6.85123 15.5703 6.8888 16.3483 7.42147 16.5179L10.3631 17.4547C10.9246 17.6335 11.5325 17.541 12.0228 17.2023L18.655 12.6203C18.855 12.4821 19.073 12.7665 18.9021 12.9426L14.1281 17.8646C13.665 18.3421 13.7569 19.1512 14.314 19.5005L19.659 22.8523C20.2585 23.2282 21.0297 22.8506 21.1418 22.1261L22.9866 10.2088Z" fill="white" />
                                                    <defs>
                                                        <linearGradient id="paint0_linear_87_7225" x1="16" y1="2" x2="16" y2="30" gradientUnits="userSpaceOnUse">
                                                            <stop stop-color="#37BBFE" />
                                                            <stop offset="1" stop-color="#007DBB" />
                                                        </linearGradient>
                                                    </defs>
                                                </svg>
                                            </a>
                                        </div>

                                    </td>
                                    <td className={`px-3 py-2 text-[12px] border-b ${index % 2 === 0 ? 'bg-gray-300' : 'bg-gray-200'} ${selectedLeft === 1 ? 'sticky left-0 z-10' : ''}`} >
                                        <input type="checkbox" />
                                    </td>
                                    <td className={`px-3 py-2 text-[12px] border-b ${index % 2 === 0 ? 'bg-gray-300' : 'bg-gray-200'} ${selectedLeft === 2 ? 'sticky left-0 z-10' : ''}`} ><Link href={`/Home/Datos?seccion=info`} className='text-blue-500 underline'>{item.numeroPrestamo}</Link></td>
                                    <td className={`px-3 py-2 text-[12px] border-b ${index % 2 === 0 ? 'bg-gray-300' : 'bg-gray-200'} ${selectedLeft === 3 ? 'sticky left-0 z-10' : ''}`} >{item.idSubFactura}</td>
                                    <td className={`px-3 py-2 ${item.estado === 'pagado' ? 'text-green-500' : 'text-orange-600'} ${index % 2 === 0 ? 'bg-gray-300' : 'bg-gray-200'} ${selectedLeft === 4 ? 'sticky left-0 z-10' : ''}`}>{item.estado === 'pagado' ? 'Aprobado' : 'Reprobado'}</td>
                                    <td className={`px-3 py-2 text-[12px] border-b ${index % 2 === 0 ? 'bg-gray-300' : 'bg-gray-200'} ${selectedLeft === 5 ? 'sticky left-0 z-10' : ''}`} >{item.nombreCliente}</td>
                                    <td className={`px-3 py-2 text-[12px] border-b ${index % 2 === 0 ? 'bg-gray-300' : 'bg-gray-200'} ${selectedLeft === 6 ? 'sticky left-0 z-10' : ''}`} >
                                        <span className='cursor-pointer text-blue-500 underline' onClick={() => copyToClipboard(item.numeroMovil)}>{item.numeroMovil}</span>
                                        {copied === item.numeroMovil &&
                                            <p className=" absolute t-2 text-green-500 flex bg-white shadow-sm rounded-[5px] py-1 px-2 shadow-[#979797]"> <ClipboardDocumentCheckIcon className='h-4 w-4 fill-green-400' />Texto copiado al portapapeles!</p>}
                                    </td>
                                    <td className={`px-3 py-2 text-[12px] border-b ${item.nuevoCliente ? 'text-green-500' : 'text-orange-600'} ${index % 2 === 0 ? 'bg-gray-300' : 'bg-gray-200'} ${selectedLeft === 7 ? 'sticky left-0 z-10' : ''}`}>{item.nuevoCliente ? 'Sí' : 'No'}</td>
                                    <td className={`px-3 py-2 text-[12px] border-b ${index % 2 === 0 ? 'bg-gray-300' : 'bg-gray-200'} ${selectedLeft === 8 ? 'sticky left-0 z-10' : ''}`} >{item.montoReembolsable}</td>
                                    <td className={`px-3 py-2 text-[12px] border-b ${index % 2 === 0 ? 'bg-gray-300' : 'bg-gray-200'} ${selectedLeft === 9 ? 'sticky left-0 z-10' : ''}`} >{item.montoPagado}</td>
                                    <td className={`px-3 py-2 text-[12px] border-b ${index % 2 === 0 ? 'bg-gray-300' : 'bg-gray-200'} ${selectedRight === 10 ? 'sticky right-0 z-10' : ''}`} >{item.notaRegistro}</td>
                                    <td className={`px-3 py-2 text-[12px] border-b ${index % 2 === 0 ? 'bg-gray-300' : 'bg-gray-200'} ${selectedRight === 11 ? 'sticky right-0 z-10' : ''}`} >{item.nombreProducto}</td>
                                    <td className={`px-3 py-2 text-[12px] border-b ${index % 2 === 0 ? 'bg-gray-300' : 'bg-gray-200'} ${selectedRight === 12 ? 'sticky right-0 z-10' : ''}`} >{item.fechaReembolso}</td>
                                    <td className={`px-3 py-2 text-[12px] border-b ${index % 2 === 0 ? 'bg-gray-300' : 'bg-gray-200'} ${selectedRight === 15 ? 'sticky right-0 z-10' : ''}`} >{item.fechaCreacionTarea}</td>
                                    <td className={`px-3 py-2 text-[12px] border-b ${index % 2 === 0 ? 'bg-gray-300' : 'bg-gray-200'} ${selectedRight === 16 ? 'sticky right-0 z-10' : ''}`} >{item.fechaProcesoCaso}</td>
                                    <td className={`px-3 py-2 text-[12px] border-b ${index % 2 === 0 ? 'bg-gray-300' : 'bg-gray-200'} ${selectedRight === 17 ? 'sticky right-0 z-10' : ''}`} >{item.nombreEmpresa}</td>
                                    {!user?.rol?.includes('Usuario') && <td className={`px-3 py-2 text-[12px] border-b ${index % 2 === 0 ? 'bg-gray-300' : 'bg-gray-200'} ${selectedRight === 18 ? 'sticky right-0 z-10' : ''}`} >{item.nombreUsuarioCobranza}</td>}



                                    <td className={`px-3 py-2 text-[12px] border-b ${index % 2 === 0 ? 'bg-gray-300' : 'bg-gray-200'} ${selectedRight === 19 ? 'sticky right-0 z-10' : ''}`}>
                                        <div className='flex justify-between flex space-x-3'>
                                            <Link href={`/Home/Datos?seccion=info`} className=''>
                                                <button type="button" class="w-full text-white bg-gradient-to-br from-blue-600 to-blue-400 hover:bg-gradient-to-bl foco-4 focus:outline-none foco-blue-300 dark:foco-blue-800 font-medium rounded-lg text-[10px] px-5 py-1.5 text-center me-2 mb-2">Visitar</button>

                                            </Link>
                                            <button type="button" class="w-full text-white bg-gradient-to-r from-cyan-400 via-cyan-500 to-cyan-600 hover:bg-gradient-to-br foco-4 focus:outline-none foco-cyan-300 dark:foco-cyan-800 font-medium rounded-lg text-[10px] px-5 py-1.5 text-center me-2 mb-2" onClick={() => setModal('Registrar Verificacion')}>Registrar</button>

                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>}























                    {item === 'Lista final 000' && <table className="min-w-full " >
                        <thead className="bg-gray-900 text-[10px]  uppercase sticky top-[0px] z-20">

                            <tr className='text-[white] min-w-[2500px]'>

                                {encabezadoListaFinal.map((encabezado, index) => (
                                    <th scope="col" key={index}
                                        className={`w-[50px] px-3 py-3 text-white 
                                            ${index < 10 ? (selectedLeft === index ? 'sticky left-0 z-20 bg-gray-800' : 'bg-gray-900') : (selectedRight === index ? 'sticky right-0 z-20 bg-gray-800' : 'bg-gray-900')}`}
                                        onClick={() => handlerSelected(index < 10 ? 'LEFT' : 'RIGHT', index)}>
                                        {encabezado === "Seleccionar" ? <input type="checkbox" /> : encabezado}
                                    </th>
                                ))}

                            </tr>

                        </thead>
                        <tbody>
                            {refunds.map((item, index) => (
                                item.nombreCliente.toLowerCase().includes(filter['Nombre del cliente'].toLowerCase()) &&
                                item.numeroMovil.includes(filter['Número de teléfono']) && item.nombreProducto.includes(filter.nombreProducto === 'Todo' ? '' : filter.nombreProducto) && item.estado.includes(filter['Estado de reembolso'] === 'Por favor elige' ? '' : filter['Estado de reembolso'].toLowerCase()) && item.diasAtraso * 1 <= filter['Maximo dias vencido'] && item.diasAtraso * 1 >= filter['Minimo dias vencido'] &&
                                <tr key={index} className={`text-[12px] border-b`}>
                                    <td className={`px-3 py-2 text-[12px] border-b ${index % 2 === 0 ? 'bg-gray-300' : 'bg-gray-200'} ${selectedLeft === 0 ? 'sticky left-0 z-10' : ''}`} >
                                        <div className="flex justify-around items-center">
                                            <a
                                                href={`https://wa.me/${item.whatsapp}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center text-green-500 hover:text-green-600"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="25" height="25" viewBox="0 0 48 48">
                                                    <path fill="#fff" d="M4.868,43.303l2.694-9.835C5.9,30.59,5.026,27.324,5.027,23.979C5.032,13.514,13.548,5,24.014,5c5.079,0.002,9.845,1.979,13.43,5.566c3.584,3.588,5.558,8.356,5.556,13.428c-0.004,10.465-8.522,18.98-18.986,18.98c-0.001,0,0,0,0,0h-0.008c-3.177-0.001-6.3-0.798-9.073-2.311L4.868,43.303z"></path><path fill="#fff" d="M4.868,43.803c-0.132,0-0.26-0.052-0.355-0.148c-0.125-0.127-0.174-0.312-0.127-0.483l2.639-9.636c-1.636-2.906-2.499-6.206-2.497-9.556C4.532,13.238,13.273,4.5,24.014,4.5c5.21,0.002,10.105,2.031,13.784,5.713c3.679,3.683,5.704,8.577,5.702,13.781c-0.004,10.741-8.746,19.48-19.486,19.48c-3.189-0.001-6.344-0.788-9.144-2.277l-9.875,2.589C4.953,43.798,4.911,43.803,4.868,43.803z"></path><path fill="#cfd8dc" d="M24.014,5c5.079,0.002,9.845,1.979,13.43,5.566c3.584,3.588,5.558,8.356,5.556,13.428c-0.004,10.465-8.522,18.98-18.986,18.98h-0.008c-3.177-0.001-6.3-0.798-9.073-2.311L4.868,43.303l2.694-9.835C5.9,30.59,5.026,27.324,5.027,23.979C5.032,13.514,13.548,5,24.014,5 M24.014,42.974C24.014,42.974,24.014,42.974,24.014,42.974C24.014,42.974,24.014,42.974,24.014,42.974 M24.014,42.974C24.014,42.974,24.014,42.974,24.014,42.974C24.014,42.974,24.014,42.974,24.014,42.974 M24.014,4C24.014,4,24.014,4,24.014,4C12.998,4,4.032,12.962,4.027,23.979c-0.001,3.367,0.849,6.685,2.461,9.622l-2.585,9.439c-0.094,0.345,0.002,0.713,0.254,0.967c0.19,0.192,0.447,0.297,0.711,0.297c0.085,0,0.17-0.011,0.254-0.033l9.687-2.54c2.828,1.468,5.998,2.243,9.197,2.244c11.024,0,19.99-8.963,19.995-19.98c0.002-5.339-2.075-10.359-5.848-14.135C34.378,6.083,29.357,4.002,24.014,4L24.014,4z"></path><path fill="#40c351" d="M35.176,12.832c-2.98-2.982-6.941-4.625-11.157-4.626c-8.704,0-15.783,7.076-15.787,15.774c-0.001,2.981,0.833,5.883,2.413,8.396l0.376,0.597l-1.595,5.821l5.973-1.566l0.577,0.342c2.422,1.438,5.2,2.198,8.032,2.199h0.006c8.698,0,15.777-7.077,15.78-15.776C39.795,19.778,38.156,15.814,35.176,12.832z"></path><path fill="#fff" fill-rule="evenodd" d="M19.268,16.045c-0.355-0.79-0.729-0.806-1.068-0.82c-0.277-0.012-0.593-0.011-0.909-0.011c-0.316,0-0.83,0.119-1.265,0.594c-0.435,0.475-1.661,1.622-1.661,3.956c0,2.334,1.7,4.59,1.937,4.906c0.237,0.316,3.282,5.259,8.104,7.161c4.007,1.58,4.823,1.266,5.693,1.187c0.87-0.079,2.807-1.147,3.202-2.255c0.395-1.108,0.395-2.057,0.277-2.255c-0.119-0.198-0.435-0.316-0.909-0.554s-2.807-1.385-3.242-1.543c-0.435-0.158-0.751-0.237-1.068,0.238c-0.316,0.474-1.225,1.543-1.502,1.859c-0.277,0.317-0.554,0.357-1.028,0.119c-0.474-0.238-2.002-0.738-3.815-2.354c-1.41-1.257-2.362-2.81-2.639-3.285c-0.277-0.474-0.03-0.731,0.208-0.968c0.213-0.213,0.474-0.554,0.712-0.831c0.237-0.277,0.316-0.475,0.474-0.791c0.158-0.317,0.079-0.594-0.04-0.831C20.612,19.329,19.69,16.983,19.268,16.045z" clip-rule="evenodd"></path>
                                                </svg>
                                            </a>
                                            <a
                                                href={`https://https://t.me/${item.whatsapp}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center text-green-500 hover:text-green-600"
                                            >
                                                <svg width="19" height="19" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <circle cx="16" cy="16" r="14" fill="url(#paint0_linear_87_7225)" />
                                                    <path d="M22.9866 10.2088C23.1112 9.40332 22.3454 8.76755 21.6292 9.082L7.36482 15.3448C6.85123 15.5703 6.8888 16.3483 7.42147 16.5179L10.3631 17.4547C10.9246 17.6335 11.5325 17.541 12.0228 17.2023L18.655 12.6203C18.855 12.4821 19.073 12.7665 18.9021 12.9426L14.1281 17.8646C13.665 18.3421 13.7569 19.1512 14.314 19.5005L19.659 22.8523C20.2585 23.2282 21.0297 22.8506 21.1418 22.1261L22.9866 10.2088Z" fill="white" />
                                                    <defs>
                                                        <linearGradient id="paint0_linear_87_7225" x1="16" y1="2" x2="16" y2="30" gradientUnits="userSpaceOnUse">
                                                            <stop stop-color="#37BBFE" />
                                                            <stop offset="1" stop-color="#007DBB" />
                                                        </linearGradient>
                                                    </defs>
                                                </svg>
                                            </a>
                                        </div>
                                    </td>
                                    <td className={`px-3 py-2 text-[12px] border-b ${index % 2 === 0 ? 'bg-gray-300' : 'bg-gray-200'} ${selectedLeft === 1 ? 'sticky left-0 z-10' : ''}`} >
                                        <input type="checkbox" />
                                    </td>
                                    <td className={`px-3 py-2 text-[12px] border-b ${index % 2 === 0 ? 'bg-gray-300' : 'bg-gray-200'} ${selectedLeft === 2 ? 'sticky left-0 z-10' : ''}`} ><Link href={`/Home/Datos?seccion=info`} className='text-blue-500 underline'>{item.numeroPrestamo}</Link></td>
                                    {/* <td className={`px-3 py-2 text-[12px] border-b ${index % 2 === 0 ? 'bg-gray-300' : 'bg-gray-200'} ${selectedLeft === 3 ? 'sticky left-0 z-10' : ''}`} >{item.idSubFactura}</td> */}
                                    <td className={`px-3 py-2 ${item.estado === 'pagado' ? 'text-green-500' : 'text-orange-600'} ${index % 2 === 0 ? 'bg-gray-300' : 'bg-gray-200'} ${selectedLeft === 4 ? 'sticky left-0 z-10' : ''}`}>{item.estado === 'pagado' ? 'Aprobado' : 'Reprobado'}</td>
                                    <td className={`px-3 py-2 text-[12px] border-b ${index % 2 === 0 ? 'bg-gray-300' : 'bg-gray-200'} ${selectedLeft === 5 ? 'sticky left-0 z-10' : ''}`} >{item.nombreCliente}</td>
                                    <td className={`px-3 py-2 text-[12px] border-b ${index % 2 === 0 ? 'bg-gray-300' : 'bg-gray-200'} ${selectedLeft === 6 ? 'sticky left-0 z-10' : ''}`} >
                                        <span className='cursor-pointer text-blue-500 underline' onClick={() => copyToClipboard(item.numeroMovil)}>{item.numeroMovil}</span>
                                        {copied === item.numeroMovil &&
                                            <p className=" absolute t-2 text-green-500 flex bg-white shadow-sm rounded-[5px] py-1 px-2 shadow-[#979797]"> <ClipboardDocumentCheckIcon className='h-4 w-4 fill-green-400' />Texto copiado al portapapeles!</p>}
                                    </td>

                                    <td className={`px-3 py-2 text-[12px] border-b ${index % 2 === 0 ? 'bg-gray-300' : 'bg-gray-200'} ${selectedRight === 11 ? 'sticky right-0 z-10' : ''}`} >{item.nombreProducto}</td>

                                    <td className={`px-3 py-2 text-[12px] border-b ${index % 2 === 0 ? 'bg-gray-300' : 'bg-gray-200'} ${selectedRight === 18 ? 'sticky right-0 z-10' : ''}`} >{item.nombreUsuarioCobranza}</td>
                                    <td className={`px-3 py-2 text-[12px] border-b ${index % 2 === 0 ? 'bg-gray-300' : 'bg-gray-200'} ${selectedRight === 10 ? 'sticky right-0 z-10' : ''}`} >{item.notaRegistro}</td>
                                    <td className={`px-3 py-2 text-[12px] border-b ${index % 2 === 0 ? 'bg-gray-300' : 'bg-gray-200'} ${selectedRight === 12 ? 'sticky right-0 z-10' : ''}`} >{item.fechaReembolso}</td>

                                </tr>
                            ))}
                        </tbody>
                    </table>}

                    {(item === 'Control de Cumplimiento') &&
                        <table className="min-w-full " >
                            <thead className="bg-gray-900 text-[10px]  uppercase sticky top-[0px] z-20">

                                <tr className='text-[white] min-w-[2500px]'>

                                    {encabezadoResgistroDeUsuarios.map((encabezado, index) => (
                                        <th scope="col" key={index}
                                            className={`  ${(encabezado === 'Operaciones' || encabezado === "Seleccionar") ? 'text-center' : 'text-left'} w-[50px] px-3 py-3 text-white
                                            ${index < 10 ? (selectedLeft === index ? 'sticky left-0 z-20 bg-gray-800' : 'bg-gray-900') : (selectedRight === index ? 'sticky right-0 z-20 bg-gray-800' : 'bg-gray-900')}`}
                                            onClick={() => handlerSelected(index < 10 ? 'LEFT' : 'RIGHT', index)}>
                                            {encabezado === "Seleccionar" ? <input type="checkbox" /> : encabezado}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {refunds.map((item, index) => (
                                    item.nombreCliente.toLowerCase().includes(filter['Nombre del cliente'].toLowerCase()) &&
                                    item.numeroMovil.includes(filter['Número de teléfono']) && item.nombreProducto.includes(filter.nombreProducto === 'Todo' ? '' : filter.nombreProducto) && item.estado.includes(filter['Estado de reembolso'] === 'Por favor elige' ? '' : filter['Estado de reembolso'].toLowerCase()) && item.diasAtraso * 1 <= filter['Maximo dias vencido'] && item.diasAtraso * 1 >= filter['Minimo dias vencido'] &&
                                    <tr key={index} className={`text-[12px] border-b`}>
                                        <td className={`px-3 py-2 text-[12px] border-b  ${item.estado === 'pagado' ? 'text-green-500' : 'text-orange-600'} ${index % 2 === 0 ? 'bg-gray-300' : 'bg-gray-200'} ${index % 2 === 0 ? 'bg-gray-300' : 'bg-gray-200'} ${selectedRight === 18 ? 'sticky right-0 z-10' : ''}`} >Maximiliano del Palacios</td>

                                        <td className={`px-3 py-2 text-[12px] border-b  ${item.estado === 'pagado' ? 'text-green-500' : 'text-orange-600'} ${index % 2 === 0 ? 'bg-gray-300' : 'bg-gray-200'} ${index % 2 === 0 ? 'bg-gray-300' : 'bg-gray-200'} ${selectedRight === 18 ? 'sticky right-0 z-10' : ''}`} >{item.nombreUsuarioCobranza}</td>
                                        <td className={`px-3 py-2 text-[12px] border-b text-center ${index % 2 === 0 ? 'bg-gray-300' : 'bg-gray-200'} ${selectedLeft === 1 ? 'sticky left-0 z-10' : ''}`} >
                                            <input type="checkbox" />
                                        </td>
                                        <td className={`px-3 py-2 text-[12px] border-b text-center ${index % 2 === 0 ? 'bg-gray-300' : 'bg-gray-200'} ${selectedLeft === 2 ? 'sticky left-0 z-10' : ''}`} ><Link href={`/Home/Datos?seccion=info`} className='text-blue-500 underline'>{item.numeroPrestamo}</Link></td>
                                        {/* <td className={`px-3 py-2 text-[12px] border-b ${index % 2 === 0 ? 'bg-gray-300' : 'bg-gray-200'} ${selectedLeft === 3 ? 'sticky left-0 z-10' : ''}`} >{item.idSubFactura}</td> */}
                                        <td className={`px-3 py-2 ${item.estado === 'pagado' ? 'text-green-500' : 'text-orange-600'} ${index % 2 === 0 ? 'bg-gray-300' : 'bg-gray-200'} ${selectedLeft === 4 ? 'sticky left-0 z-10' : ''}`}>{item.estado === 'pagado' ? '200 casos' : '200 casos'}</td>
                                        <td className={`px-3 py-2 ${item.estado === 'pagado' ? 'text-green-500' : 'text-orange-600'} ${index % 2 === 0 ? 'bg-gray-300' : 'bg-gray-200'} ${selectedLeft === 4 ? 'sticky left-0 z-10' : ''}`}>{item.estado === 'pagado' ? 'Completado' : '170/200'}</td>
                                        <td className={`px-3 py-2 text-[12px] border-b ${index % 2 === 0 ? 'bg-gray-300' : 'bg-gray-200'} ${selectedLeft === 6 ? 'sticky left-0 z-10' : ''}`} >
                                            <span className='cursor-pointer text-blue-500 underline' onClick={() => copyToClipboard(item.numeroMovil)}>{item.numeroMovil}</span>
                                            {copied === item.numeroMovil &&
                                                <p className=" absolute t-2 text-green-500 flex bg-white shadow-sm rounded-[5px] py-1 px-2 shadow-[#979797]"> <ClipboardDocumentCheckIcon className='h-4 w-4 fill-green-400' />Texto copiado al portapapeles!</p>}
                                        </td>
                                        <td className={`px-3 py-2 text-[12px] border-b ${index % 2 === 0 ? 'bg-gray-300' : 'bg-gray-200'} ${selectedRight === 19 ? 'sticky right-0 z-10' : ''}`}>
                                            <div className='flex justify-between flex space-x-3'>
                                                <Link href={`/Home?seccion=auditoria&item=Casos%20de%20Cobranza`} className=''>
                                                    <button type="button" class="w-full text-white bg-gradient-to-br from-blue-600 to-blue-400 hover:bg-gradient-to-bl foco-4 focus:outline-none foco-blue-300 dark:foco-blue-800 font-medium rounded-lg text-[10px] px-5 py-1.5 text-center me-2 mb-2">Visitar</button>

                                                </Link>

                                                <button type="button" class="w-full text-white bg-gradient-to-r from-cyan-400 via-cyan-500 to-cyan-600 hover:bg-gradient-to-br foco-4 focus:outline-none foco-cyan-300 dark:foco-cyan-800 font-medium rounded-lg text-[10px] px-5 py-1.5 text-center me-2 mb-2" onClick={() => setModal('Registrar Auditor')}>Registrar</button>

                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    }
                    {/* {(item === 'Registro de SMS' || item === 'Atención al Cliente') &&
                        <table className="min-w-full " >
                            <thead className="bg-gray-900 text-[10px]  uppercase sticky top-[0px] z-20">

                                <tr className='text-[white] min-w-[2500px]'>

                                    {mensajes.map((encabezado, index) => (
                                        <th scope="col" key={index}
                                            className={`  ${(encabezado === 'Operaciones' || encabezado === "Seleccionar") ? 'text-center' : 'text-left'} w-[50px] px-3 py-3 text-white
                                            ${index < 10 ? (selectedLeft === index ? 'sticky left-0 z-20 bg-gray-800' : 'bg-gray-900') : (selectedRight === index ? 'sticky right-0 z-20 bg-gray-800' : 'bg-gray-900')}`}
                                            onClick={() => handlerSelected(index < 10 ? 'LEFT' : 'RIGHT', index)}>
                                            {encabezado === "Seleccionar" ? <input type="checkbox" /> : encabezado}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {refunds.map((item, index) => (
                                    item.nombreCliente.toLowerCase().includes(filter['Nombre del cliente'].toLowerCase()) &&
                                    item.numeroMovil.includes(filter['Número de teléfono']) && item.nombreProducto.includes(filter.nombreProducto === 'Todo' ? '' : filter.nombreProducto) && item.estado.includes(filter['Estado de reembolso'] === 'Por favor elige' ? '' : filter['Estado de reembolso'].toLowerCase()) && item.diasAtraso * 1 <= filter['Maximo dias vencido'] && item.diasAtraso * 1 >= filter['Minimo dias vencido'] &&
                                    <tr key={index} className={`text-[12px] border-b`}>
                                        <th className={`px-3 py-2  ${index % 2 === 0 ? 'bg-gray-300' : 'bg-gray-200'} `}> <input type="checkbox" /></th>

                                        <td className={`px-3 py-2 text-[12px] border-b  ${item.estado === 'pagado' ? 'text-green-500' : 'text-orange-600'} ${index % 2 === 0 ? 'bg-gray-300' : 'bg-gray-200'} ${index % 2 === 0 ? 'bg-gray-300' : 'bg-gray-200'} ${selectedRight === 18 ? 'sticky right-0 z-10' : ''}`} >Maximiliano del Palacios</td>

                                        <td className={`px-3 py-2 text-[12px] border-b  ${item.estado === 'pagado' ? 'text-green-500' : 'text-orange-600'} ${index % 2 === 0 ? 'bg-gray-300' : 'bg-gray-200'} ${index % 2 === 0 ? 'bg-gray-300' : 'bg-gray-200'} ${selectedRight === 18 ? 'sticky right-0 z-10' : ''}`} >+564 456465</td>
                                        <td className={`px-3 py-2 text-[12px] border-b text-center ${index % 2 === 0 ? 'bg-gray-300' : 'bg-gray-200'} ${selectedLeft === 1 ? 'sticky left-0 z-10' : ''}`} >
                                            FastCash
                                        </td>
                                        <td className={`px-3 py-2 text-[12px] border-b text-center ${index % 2 === 0 ? 'bg-gray-300' : 'bg-gray-200'} ${selectedLeft === 2 ? 'sticky left-0 z-10' : ''}`} ><Link href={`/Home/Datos?seccion=info`} className='text-blue-500 underline'>Fast Cash</Link></td>
                                        <td className={`px-3 py-2 ${item.estado === 'pagado' ? 'text-gray-900' : 'text-gray-900'} w-[400px] ${index % 2 === 0 ? 'bg-gray-300' : 'bg-gray-200'} ${selectedLeft === 4 ? 'sticky left-0 z-10' : ''}`}>RICO PAGO. Usted tiene un prestamo y debe pagar. SOLICITAMOS EL PAGO DEL DINERO prestado de inmediato! SU PAGO EN LA FINANCIERA MAXIMO 08:30 AM HORA CENTRO MEXICO Y RECIBE RENOVACION RAPIDA CON UN 10% DE DESCUENTO.
                                            debe pagar $1700. iSi paga ahora, podr obtener ms dinero prestado de inmediato! Por favor verifique am.pagoc.cc/Xx42AJzKr.
                                        </td>
                                        <td className={`px-3 py-2 ${item.estado === 'pagado' ? 'text-green-500' : 'text-orange-600'} ${index % 2 === 0 ? 'bg-gray-300' : 'bg-gray-200'} ${selectedLeft === 4 ? 'sticky left-0 z-10' : ''}`}>2024-10-27 07:47</td>
                                        <td className={`px-3 py-2 text-[12px] border-b ${index % 2 === 0 ? 'bg-gray-300' : 'bg-gray-200'} ${selectedLeft === 6 ? 'sticky left-0 z-10' : ''}`} >
                                            <span className='cursor-pointer text-gray-900' onClick={() => copyToClipboard(item.numeroMovil)}>Exitoso</span>
                                            {copied === item.numeroMovil &&
                                                <p className=" absolute t-2 text-green-500 flex bg-white shadow-sm rounded-[5px] py-1 px-2 shadow-[#979797]"> <ClipboardDocumentCheckIcon className='h-4 w-4 fill-green-400' />Texto copiado al portapapeles!</p>}
                                        </td>
                                        <td className={`px-3 py-2 text-[12px] border-b ${index % 2 === 0 ? 'bg-gray-300' : 'bg-gray-200'} ${selectedRight === 19 ? 'sticky right-0 z-10' : ''}`}>
                                            null
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    } */}

                    {(item === 'Usuarios de verificación' || item === 'Usuarios de Cobranza' || item === 'Usuarios de Auditoria') &&


                        <table className="min-w-full " >
                            <thead className="bg-gray-900 text-[10px]  uppercase sticky top-[0px] z-20">

                                <tr className='text-[white] min-w-[2500px]'>

                                    {encabezadoResgistroDeUsuarios.map((encabezado, index) => (
                                        <th scope="col" key={index}
                                            className={`  ${(encabezado === 'Operaciones' || encabezado === "Seleccionar") ? 'text-center' : 'text-left'} w-[50px] px-3 py-3 text-white
                                           ${index < 10 ? (selectedLeft === index ? 'sticky left-0 z-20 bg-gray-800' : 'bg-gray-900') : (selectedRight === index ? 'sticky right-0 z-20 bg-gray-800' : 'bg-gray-900')}`}
                                            onClick={() => handlerSelected(index < 10 ? 'LEFT' : 'RIGHT', index)}>
                                            {encabezado === "Seleccionar" ? <input type="checkbox" /> : encabezado}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {refunds.map((item, index) => (
                                    item.nombreCliente.toLowerCase().includes(filter['Nombre del cliente'].toLowerCase()) &&
                                    item.numeroMovil.includes(filter['Número de teléfono']) && item.nombreProducto.includes(filter.nombreProducto === 'Todo' ? '' : filter.nombreProducto) && item.estado.includes(filter['Estado de reembolso'] === 'Por favor elige' ? '' : filter['Estado de reembolso'].toLowerCase()) && item.diasAtraso * 1 <= filter['Maximo dias vencido'] && item.diasAtraso * 1 >= filter['Minimo dias vencido'] &&
                                    <tr key={index} className={`text-[12px] border-b`}>
                                        <td className={`px-3 py-2 text-[12px] border-b  ${item.estado === 'pagado' ? 'text-green-500' : 'text-orange-600'} ${index % 2 === 0 ? 'bg-gray-300' : 'bg-gray-200'} ${index % 2 === 0 ? 'bg-gray-300' : 'bg-gray-200'} ${selectedRight === 18 ? 'sticky right-0 z-10' : ''}`} >{item.nombreUsuarioCobranza}</td>
                                        <td className={`px-3 py-2 text-[12px] border-b text-center ${index % 2 === 0 ? 'bg-gray-300' : 'bg-gray-200'} ${selectedLeft === 1 ? 'sticky left-0 z-10' : ''}`} >
                                            <input type="checkbox" />
                                        </td>
                                        <td className={`px-3 py-2 text-[12px] border-b text-center ${index % 2 === 0 ? 'bg-gray-300' : 'bg-gray-200'} ${selectedLeft === 2 ? 'sticky left-0 z-10' : ''}`} ><Link href={`/Home/Datos?seccion=info`} className='text-blue-500 underline'>{item.numeroPrestamo}</Link></td>
                                        {/* <td className={`px-3 py-2 text-[12px] border-b ${index % 2 === 0 ? 'bg-gray-300' : 'bg-gray-200'} ${selectedLeft === 3 ? 'sticky left-0 z-10' : ''}`} >{item.idSubFactura}</td> */}
                                        <td className={`px-3 py-2 ${item.estado === 'pagado' ? 'text-green-500' : 'text-orange-600'} ${index % 2 === 0 ? 'bg-gray-300' : 'bg-gray-200'} ${selectedLeft === 4 ? 'sticky left-0 z-10' : ''}`}>{item.estado === 'pagado' ? '200 casos' : '200 casos'}</td>
                                        <td className={`px-3 py-2 ${item.estado === 'pagado' ? 'text-green-500' : 'text-orange-600'} ${index % 2 === 0 ? 'bg-gray-300' : 'bg-gray-200'} ${selectedLeft === 4 ? 'sticky left-0 z-10' : ''}`}>{item.estado === 'pagado' ? 'Completado' : '170/200'}</td>
                                        <td className={`px-3 py-2 text-[12px] border-b ${index % 2 === 0 ? 'bg-gray-300' : 'bg-gray-200'} ${selectedLeft === 6 ? 'sticky left-0 z-10' : ''}`} >
                                            <span className='cursor-pointer text-blue-500 underline' onClick={() => copyToClipboard(item.numeroMovil)}>{item.numeroMovil}</span>
                                            {copied === item.numeroMovil &&
                                                <p className=" absolute t-2 text-green-500 flex bg-white shadow-sm rounded-[5px] py-1 px-2 shadow-[#979797]"> <ClipboardDocumentCheckIcon className='h-4 w-4 fill-green-400' />Texto copiado al portapapeles!</p>}
                                        </td>
                                        <td className={`px-3 py-2 text-[12px] border-b ${index % 2 === 0 ? 'bg-gray-300' : 'bg-gray-200'} ${selectedRight === 19 ? 'sticky right-0 z-10' : ''}`}>
                                            <div className='flex justify-between flex space-x-3'>
                                                <Link href={`/Home?seccion=auditoria&item=Casos%20de%20Cobranza`} className=''>
                                                    <button type="button" class="w-full text-white bg-gradient-to-br from-blue-600 to-blue-400 hover:bg-gradient-to-bl foco-4 focus:outline-none foco-blue-300 dark:foco-blue-800 font-medium rounded-lg text-[10px] px-5 py-1.5 text-center me-2 mb-2">Visitar</button>

                                                </Link>

                                                <button type="button" class="w-full text-white bg-gradient-to-r from-cyan-400 via-cyan-500 to-cyan-600 hover:bg-gradient-to-br foco-4 focus:outline-none foco-cyan-300 dark:foco-cyan-800 font-medium rounded-lg text-[10px] px-5 py-1.5 text-center me-2 mb-2" onClick={() => setModal('Registrar Auditor')}>Registrar</button>
                                                <button type="button" class="w-full text-white bg-gradient-to-r from-cyan-400 via-cyan-500 to-cyan-600 hover:bg-gradient-to-br foco-4 focus:outline-none foco-cyan-300 dark:foco-cyan-800 font-medium rounded-lg text-[10px] px-5 py-1.5 text-center me-2 mb-2" onClick={() => { setModal('Editar Usuario'); setEditItem(item) }}>Editar</button>

                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        // <table className="min-w-full " >
                        //     <thead className="bg-gray-900 text-[10px]  uppercase sticky top-[0px] z-20">

                        //         <tr className='text-[white] min-w-[2500px]'>

                        //             {encabezadoAccesos.map((encabezado, index) => (
                        //                 <th scope="col" key={index}
                        //                     className={`  ${(encabezado === 'Operaciones' || encabezado === "Seleccionar") ? 'text-center' : 'text-left'} w-[50px] px-3 py-3 text-white
                        //              ${index < 10 ? (selectedLeft === index ? 'sticky left-0 z-20 bg-gray-800' : 'bg-gray-900') : (selectedRight === index ? 'sticky right-0 z-20 bg-gray-800' : 'bg-gray-900')}`}
                        //                     onClick={() => handlerSelected(index < 10 ? 'LEFT' : 'RIGHT', index)}>
                        //                     {encabezado === "Seleccionar" ? <input type="checkbox" /> : encabezado}
                        //                 </th>
                        //             ))}
                        //         </tr>
                        //     </thead>
                        //     <tbody>
                        //         {refunds.map((item, index) => (
                        //             item.nombreCliente.toLowerCase().includes(filter['Nombre del cliente'].toLowerCase()) &&
                        //             item.numeroMovil.includes(filter['Número de teléfono']) && item.nombreProducto.includes(filter.nombreProducto === 'Todo' ? '' : filter.nombreProducto) && item.estado.includes(filter['Estado de reembolso'] === 'Por favor elige' ? '' : filter['Estado de reembolso'].toLowerCase()) && item.diasAtraso * 1 <= filter['Maximo dias vencido'] && item.diasAtraso * 1 >= filter['Minimo dias vencido'] &&
                        //             <tr key={index} className={`text-[12px] border-b`}>
                        //                 <td className={`px-3 py-2 text-[12px] border-b text-center ${index % 2 === 0 ? 'bg-gray-300' : 'bg-gray-200'} ${selectedLeft === 1 ? 'sticky left-0 z-10' : ''}`} >
                        //                     <input type="checkbox" />
                        //                 </td>
                        //                 <td className={`px-3 py-2 text-[12px] border-b text-left ${index % 2 === 0 ? 'bg-gray-300' : 'bg-gray-200'} ${selectedLeft === 2 ? 'sticky left-0 z-10' : ''}`} ><Link href={`/Home/Datos?seccion=info`} className='text-blue-500 underline'>{item.nombreCliente}</Link></td>

                        //                 <td className={`px-3 py-2 ${selectedLeft === 4 ? 'sticky left-0 z-10' : ''}`}>{item.estado === 'pagado' ? 'XXX-XXXX-XX' : 'XXX-XXXX-XX'}</td>
                        //                 <td className={`px-3 py-2 text-[12px] border-b ${index % 2 === 0 ? 'bg-gray-300' : 'bg-gray-200'} ${selectedLeft === 6 ? 'sticky left-0 z-10' : ''}`} >
                        //                     <span className='cursor-pointer text-blue-500 underline' onClick={() => copyToClipboard(item.numeroMovil)}>{item.numeroMovil}</span>
                        //                     {copied === item.numeroMovil &&
                        //                         <p className=" absolute t-2 text-green-500 flex bg-white shadow-sm rounded-[5px] py-1 px-2 shadow-[#979797]"> <ClipboardDocumentCheckIcon className='h-4 w-4 fill-green-400' />Texto copiado al portapapeles!</p>}
                        //                 </td>
                        //                 <td className={`px-3 py-2 text-[12px] border-b text-left ${index % 2 === 0 ? 'bg-gray-300' : 'bg-gray-200'} ${selectedLeft === 2 ? 'sticky left-0 z-10' : ''}`} ><Link href={`/Home/Datos?seccion=info`} className='text-blue-500 underline'>example@gmail.com</Link></td>

                        //                 <td className={`px-3 py-2 ${item.estado === 'pagado' ? 'text-green-500' : 'text-orange-600'} ${index % 2 === 0 ? 'bg-gray-300' : 'bg-gray-200'} ${selectedLeft === 4 ? 'sticky left-0 z-10' : ''}`}>{item.estado === 'pagado' ? item.nombreUsuarioCobranza : item.nombreUsuarioCobranza}</td>
                        //                 <td className={`px-3 py-2 ${item.estado === 'pagado' ? 'text-green-500' : 'text-orange-600'} ${index % 2 === 0 ? 'bg-gray-300' : 'bg-gray-200'} ${selectedLeft === 4 ? 'sticky left-0 z-10' : ''}`}>{item.estado === 'pagado' ? 'Manager' : 'Manager'}</td>

                        //                 <td className={`px-3 py-2 text-[12px] border-b ${index % 2 === 0 ? 'bg-gray-300' : 'bg-gray-200'} ${selectedRight === 19 ? 'sticky right-0 z-10' : ''}`}>
                        //                     <div className='flex justify-between flex space-x-3'>
                        //                         <button type="button" class="w-full text-white bg-gradient-to-r from-cyan-400 via-cyan-500 to-cyan-600 hover:bg-gradient-to-br foco-4 focus:outline-none foco-cyan-300 dark:foco-cyan-800 font-medium rounded-lg text-[10px] px-5 py-1.5 text-center me-2 mb-2" onClick={() => { setModal('Editar Usuario'); setEditItem(item) }}>Editar</button>
                        //                     </div>
                        //                 </td>
                        //             </tr>
                        //         ))}
                        //     </tbody>
                        // </table>
                    }

                    {(item === 'Gestión de RH' || item === 'Gestión de administradores' || item === 'Gestión de managers' || item === 'Gestión de asesores') &&
                        <table className="min-w-full " >
                            <thead className="bg-gray-900 text-[10px]  uppercase sticky top-[0px] z-20">

                                <tr className='text-[white] min-w-[2500px]'>

                                    {encabezadoAccesos.map((encabezado, index) => (
                                        <th scope="col" key={index}
                                            className={`  ${(encabezado === 'Operaciones' || encabezado === "Seleccionar") ? 'text-center' : 'text-left'} w-[50px] px-3 py-3 text-white
                                            ${index < 10 ? (selectedLeft === index ? 'sticky left-0 z-20 bg-gray-800' : 'bg-gray-900') : (selectedRight === index ? 'sticky right-0 z-20 bg-gray-800' : 'bg-gray-900')}`}
                                            onClick={() => handlerSelected(index < 10 ? 'LEFT' : 'RIGHT', index)}>
                                            {encabezado === "Seleccionar" ? <input type="checkbox" /> : encabezado}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {refunds.map((item, index) => (
                                    item.nombreCliente.toLowerCase().includes(filter['Nombre del cliente'].toLowerCase()) &&
                                    item.numeroMovil.includes(filter['Número de teléfono']) && item.nombreProducto.includes(filter.nombreProducto === 'Todo' ? '' : filter.nombreProducto) && item.estado.includes(filter['Estado de reembolso'] === 'Por favor elige' ? '' : filter['Estado de reembolso'].toLowerCase()) && item.diasAtraso * 1 <= filter['Maximo dias vencido'] && item.diasAtraso * 1 >= filter['Minimo dias vencido'] &&
                                    <tr key={index} className={`text-[12px] border-b`}>
                                        <td className={`px-3 py-2 text-[12px] border-b text-center ${index % 2 === 0 ? 'bg-gray-300' : 'bg-gray-200'} ${selectedLeft === 1 ? 'sticky left-0 z-10' : ''}`} >
                                            <input type="checkbox" />
                                        </td>
                                        <td className={`px-3 py-2 text-[12px] border-b text-left ${index % 2 === 0 ? 'bg-gray-300' : 'bg-gray-200'} ${selectedLeft === 2 ? 'sticky left-0 z-10' : ''}`} ><Link href={`/Home/Datos?seccion=info`} className='text-blue-500 underline'>{item.nombreCliente}</Link></td>

                                        <td className={`px-3 py-2  ${index % 2 === 0 ? 'bg-gray-300' : 'bg-gray-200'}  ${selectedLeft === 4 ? 'sticky left-0 z-10' : ''}`}>{item.estado === 'pagado' ? 'XXX-XXXX-XX' : 'XXX-XXXX-XX'}</td>
                                        <td className={`px-3 py-2 text-[12px] border-b ${index % 2 === 0 ? 'bg-gray-300' : 'bg-gray-200'} ${selectedLeft === 6 ? 'sticky left-0 z-10' : ''}`} >
                                            <span className='cursor-pointer text-blue-500 underline' onClick={() => copyToClipboard(item.numeroMovil)}>{item.numeroMovil}</span>
                                            {copied === item.numeroMovil &&
                                                <p className=" absolute t-2 text-green-500 flex bg-white shadow-sm rounded-[5px] py-1 px-2 shadow-[#979797]"> <ClipboardDocumentCheckIcon className='h-4 w-4 fill-green-400' />Texto copiado al portapapeles!</p>}
                                        </td>
                                        <td className={`px-3 py-2 text-[12px] border-b text-left ${index % 2 === 0 ? 'bg-gray-300' : 'bg-gray-200'} ${selectedLeft === 2 ? 'sticky left-0 z-10' : ''}`} ><Link href={`/Home/Datos?seccion=info`} className='text-blue-500 underline'>example@gmail.com</Link></td>

                                        <td className={`px-3 py-2 ${item.estado === 'pagado' ? 'text-green-500' : 'text-orange-600'} ${index % 2 === 0 ? 'bg-gray-300' : 'bg-gray-200'} ${selectedLeft === 4 ? 'sticky left-0 z-10' : ''}`}>{item.estado === 'pagado' ? item.nombreUsuarioCobranza : item.nombreUsuarioCobranza}</td>
                                        <td className={`px-3 py-2 ${item.estado === 'pagado' ? 'text-green-500' : 'text-orange-600'} ${index % 2 === 0 ? 'bg-gray-300' : 'bg-gray-200'} ${selectedLeft === 4 ? 'sticky left-0 z-10' : ''}`}>{item.estado === 'pagado' ? 'Manager' : 'Manager'}</td>

                                        <td className={`px-3 py-2 text-[12px] border-b ${index % 2 === 0 ? 'bg-gray-300' : 'bg-gray-200'} ${selectedRight === 19 ? 'sticky right-0 z-10' : ''}`}>
                                            <div className='flex justify-between flex space-x-3'>
                                                <button type="button" class="w-full text-white bg-gradient-to-r from-cyan-400 via-cyan-500 to-cyan-600 hover:bg-gradient-to-br foco-4 focus:outline-none foco-cyan-300 dark:foco-cyan-800 font-medium rounded-lg text-[10px] px-5 py-1.5 text-center me-2 mb-2" onClick={() => { setModal('Editar Usuario'); setEditItem(item) }}>Editar</button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    }



                    {(item === 'Cobro y valance') &&
                        <table className="min-w-full " >
                            <thead className="bg-gray-900 text-[10px]  uppercase sticky top-[0px] z-20">

                                <tr className='text-[white] min-w-[2500px]'>

                                    {liquidacion.map((encabezado, index) => (
                                        <th scope="col" key={index}
                                            className={`  ${(encabezado === 'Operaciones' || encabezado === "Seleccionar") ? 'text-center' : 'text-left'} w-[50px] px-3 py-3 text-white
                                            ${index < 10 ? (selectedLeft === index ? 'sticky left-0 z-20 bg-gray-800' : 'bg-gray-900') : (selectedRight === index ? 'sticky right-0 z-20 bg-gray-800' : 'bg-gray-900')}`}
                                            onClick={() => handlerSelected(index < 10 ? 'LEFT' : 'RIGHT', index)}>
                                            {encabezado === "Seleccionar" ? <input type="checkbox" /> : encabezado}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>

                                <tr className={`text-[12px] border-b`}>
                                    <td className={`px-3 py-2 text-[12px] border-b text-center bg-gray-200 bg-gray-200 ${selectedLeft === 1 ? 'sticky left-0 z-10' : ''}`} >
                                        <input type="checkbox" />
                                    </td>


                                    {liquidacion2.map((item, index) => (


                                        <td className={`px-3 py-2  bg-gray-200  ${selectedLeft === 4 ? 'sticky left-0 z-10' : ''}`}>{item}</td>


                                    ))}

                                </tr>

                                <tr className={`text-[12px] border-b`}>
                                    <td className={`px-3 py-2 text-[12px] border-b text-center bg-gray-300 ${selectedLeft === 1 ? 'sticky left-0 z-10' : ''}`} >
                                        <input type="checkbox" />
                                    </td>


                                    {liquidacion2.map((item, index) => (


                                        <td className={`px-3 py-2  bg-gray-300  ${selectedLeft === 4 ? 'sticky left-0 z-10' : ''}`}>{item}</td>


                                    ))}

                                </tr>

                                <tr className={`text-[12px] border-b`}>
                                    <td className={`px-3 py-2 text-[12px] border-b text-center bg-gray-200 bg-gray-200 ${selectedLeft === 1 ? 'sticky left-0 z-10' : ''}`} >
                                        <input type="checkbox" />
                                    </td>


                                    {liquidacion2.map((item, index) => (


                                        <td className={`px-3 py-2  bg-gray-200  ${selectedLeft === 4 ? 'sticky left-0 z-10' : ''}`}>{item}</td>


                                    ))}

                                </tr>

                                <tr className={`text-[12px] border-b`}>
                                    <td className={`px-3 py-2 text-[12px] border-b text-center bg-gray-300 ${selectedLeft === 1 ? 'sticky left-0 z-10' : ''}`} >
                                        <input type="checkbox" />
                                    </td>


                                    {liquidacion2.map((item, index) => (


                                        <td className={`px-3 py-2  bg-gray-300  ${selectedLeft === 4 ? 'sticky left-0 z-10' : ''}`}>{item}</td>


                                    ))}

                                </tr>
                                <tr className={`text-[12px] border-b`}>
                                    <td className={`px-3 py-2 text-[12px] border-b text-center bg-gray-200 bg-gray-200 ${selectedLeft === 1 ? 'sticky left-0 z-10' : ''}`} >
                                        <input type="checkbox" />
                                    </td>


                                    {liquidacion2.map((item, index) => (


                                        <td className={`px-3 py-2  bg-gray-200  ${selectedLeft === 4 ? 'sticky left-0 z-10' : ''}`}>{item}</td>


                                    ))}

                                </tr>

                                <tr className={`text-[12px] border-b`}>
                                    <td className={`px-3 py-2 text-[12px] border-b text-center bg-gray-300 ${selectedLeft === 1 ? 'sticky left-0 z-10' : ''}`} >
                                        <input type="checkbox" />
                                    </td>


                                    {liquidacion2.map((item, index) => (


                                        <td className={`px-3 py-2  bg-gray-300  ${selectedLeft === 4 ? 'sticky left-0 z-10' : ''}`}>{item}</td>


                                    ))}

                                </tr>
                            </tbody>
                        </table>
                    }

                    {(item === 'Monitoreo de Transacciones') &&
                        <table className="min-w-full " >
                            <thead className="bg-gray-900 text-[10px]  uppercase sticky top-[0px] z-20">

                                <tr className='text-[white] min-w-[2500px]'>

                                    {liquidacion.map((encabezado, index) => (
                                        <th scope="col" key={index}
                                            className={`  ${(encabezado === 'Operaciones' || encabezado === "Seleccionar") ? 'text-center' : 'text-left'} w-[50px] px-3 py-3 text-white
                                            ${index < 10 ? (selectedLeft === index ? 'sticky left-0 z-20 bg-gray-800' : 'bg-gray-900') : (selectedRight === index ? 'sticky right-0 z-20 bg-gray-800' : 'bg-gray-900')}`}
                                            onClick={() => handlerSelected(index < 10 ? 'LEFT' : 'RIGHT', index)}>
                                            {encabezado === "Seleccionar" ? <input type="checkbox" /> : encabezado}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>

                                <tr className={`text-[12px] border-b`}>
                                    <td className={`px-3 py-2 text-[12px] border-b text-center bg-gray-200 bg-gray-200 ${selectedLeft === 1 ? 'sticky left-0 z-10' : ''}`} >
                                        <input type="checkbox" />
                                    </td>


                                    {liquidacion2.map((item, index) => (


                                        <td className={`px-3 py-2  bg-gray-200  ${selectedLeft === 4 ? 'sticky left-0 z-10' : ''}`}>{item}</td>


                                    ))}

                                </tr>

                                <tr className={`text-[12px] border-b`}>
                                    <td className={`px-3 py-2 text-[12px] border-b text-center bg-gray-300 ${selectedLeft === 1 ? 'sticky left-0 z-10' : ''}`} >
                                        <input type="checkbox" />
                                    </td>


                                    {liquidacion2.map((item, index) => (


                                        <td className={`px-3 py-2  bg-gray-300  ${selectedLeft === 4 ? 'sticky left-0 z-10' : ''}`}>{item}</td>


                                    ))}

                                </tr>

                                <tr className={`text-[12px] border-b`}>
                                    <td className={`px-3 py-2 text-[12px] border-b text-center bg-gray-200 bg-gray-200 ${selectedLeft === 1 ? 'sticky left-0 z-10' : ''}`} >
                                        <input type="checkbox" />
                                    </td>


                                    {liquidacion2.map((item, index) => (


                                        <td className={`px-3 py-2  bg-gray-200  ${selectedLeft === 4 ? 'sticky left-0 z-10' : ''}`}>{item}</td>


                                    ))}

                                </tr>

                                <tr className={`text-[12px] border-b`}>
                                    <td className={`px-3 py-2 text-[12px] border-b text-center bg-gray-300 ${selectedLeft === 1 ? 'sticky left-0 z-10' : ''}`} >
                                        <input type="checkbox" />
                                    </td>


                                    {liquidacion2.map((item, index) => (


                                        <td className={`px-3 py-2  bg-gray-300  ${selectedLeft === 4 ? 'sticky left-0 z-10' : ''}`}>{item}</td>


                                    ))}

                                </tr>
                                <tr className={`text-[12px] border-b`}>
                                    <td className={`px-3 py-2 text-[12px] border-b text-center bg-gray-200 bg-gray-200 ${selectedLeft === 1 ? 'sticky left-0 z-10' : ''}`} >
                                        <input type="checkbox" />
                                    </td>


                                    {liquidacion2.map((item, index) => (


                                        <td className={`px-3 py-2  bg-gray-200  ${selectedLeft === 4 ? 'sticky left-0 z-10' : ''}`}>{item}</td>


                                    ))}

                                </tr>

                                <tr className={`text-[12px] border-b`}>
                                    <td className={`px-3 py-2 text-[12px] border-b text-center bg-gray-300 ${selectedLeft === 1 ? 'sticky left-0 z-10' : ''}`} >
                                        <input type="checkbox" />
                                    </td>


                                    {liquidacion2.map((item, index) => (


                                        <td className={`px-3 py-2  bg-gray-300  ${selectedLeft === 4 ? 'sticky left-0 z-10' : ''}`}>{item}</td>


                                    ))}

                                </tr>
                            </tbody>
                        </table>
                    }





                    {item === 'Auditoria Periodica' && <table className="min-w-full " >
                        <thead className="bg-gray-900 text-[10px]  uppercase sticky top-[0px] z-20">

                            <tr className='text-[white] min-w-[2500px]'>

                                {auditoriaPeriodica.map((encabezado, index) => (
                                    <th scope="col" key={index}
                                        className={`  ${(encabezado === 'Operaciones' || encabezado === "Seleccionar") ? 'text-center' : 'text-left'} w-[50px] px-3 py-3 text-white
                                            ${index < 10 ? (selectedLeft === index ? 'sticky left-0 z-20 bg-gray-800' : 'bg-gray-900') : (selectedRight === index ? 'sticky right-0 z-20 bg-gray-800' : 'bg-gray-900')}`}
                                        onClick={() => handlerSelected(index < 10 ? 'LEFT' : 'RIGHT', index)}>
                                        {encabezado === "Seleccionar" ? <input type="checkbox" /> : encabezado}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>







                            <tr className={`text-[12px] border-b`}>
                                <td className={`px-3 py-2 text-[12px] border-b text-center bg-gray-300 ${selectedLeft === 1 ? 'sticky left-0 z-10' : ''}`} >
                                    <input type="checkbox" />
                                </td>


                                {auditoriaPeriodica2.map((item, index) => (


                                    <td className={`px-3 py-2  bg-gray-300  ${selectedLeft === 4 ? 'sticky left-0 z-10' : ''}`}>{item}</td>


                                ))}


                                <td className={`px-3 py-2 text-[12px] border-b bg-gray-30 bg-gray-300`}>
                                    <div className='flex justify-between flex space-x-3'>
                                        <Link href={`/Home?seccion=auditoria&item=Casos%20de%20Cobranza`} className=''>
                                            <button type="button" class="w-full text-white bg-gradient-to-br from-blue-600 to-blue-400 hover:bg-gradient-to-bl foco-4 focus:outline-none foco-blue-300 dark:foco-blue-800 font-medium rounded-lg text-[10px] px-5 py-1.5 text-center me-2 mb-2">Observacion</button>

                                        </Link>

                                        <button type="button" class="w-full text-white bg-gradient-to-r from-cyan-400 via-cyan-500 to-cyan-600 hover:bg-gradient-to-br foco-4 focus:outline-none foco-cyan-300 dark:foco-cyan-800 font-medium rounded-lg text-[10px] px-5 py-1.5 text-center me-2 mb-2" onClick={() => setModal('Registrar Multa')}>Multa</button>

                                    </div>
                                </td>

                            </tr>


                            <tr className={`text-[12px] border-b`}>
                                <td className={`px-3 py-2 text-[12px] border-b text-center bg-gray-300 ${selectedLeft === 1 ? 'sticky left-0 z-10' : ''}`} >
                                    <input type="checkbox" />
                                </td>


                                {auditoriaPeriodica2.map((item, index) => (


                                    <td className={`px-3 py-2  bg-gray-300  ${selectedLeft === 4 ? 'sticky left-0 z-10' : ''}`}>{item}</td>


                                ))}




                                <td className={`px-3 py-2 text-[12px] border-b bg-gray-30 bg-gray-300`}>
                                    <div className='flex justify-between flex space-x-3'>
                                        <Link href={`/Home?seccion=auditoria&item=Casos%20de%20Cobranza`} className=''>
                                            <button type="button" class="w-full text-white bg-gradient-to-br from-blue-600 to-blue-400 hover:bg-gradient-to-bl foco-4 focus:outline-none foco-blue-300 dark:foco-blue-800 font-medium rounded-lg text-[10px] px-5 py-1.5 text-center me-2 mb-2">Observacion</button>

                                        </Link>

                                        <button type="button" class="w-full text-white bg-gradient-to-r from-cyan-400 via-cyan-500 to-cyan-600 hover:bg-gradient-to-br foco-4 focus:outline-none foco-cyan-300 dark:foco-cyan-800 font-medium rounded-lg text-[10px] px-5 py-1.5 text-center me-2 mb-2" onClick={() => setModal('Registrar Auditor')}>Multa</button>

                                    </div>
                                </td>


                            </tr>
                        </tbody>
                    </table>
                    }





                    {/* <div className='sticky bottom-0 right-0 left-0 mx-auto bottom-[15px] flex justify-center'>

                        <nav aria-label="mr-5 ">
                            <ul class="flex items-center -space-x-px h-8 text-sm">
                                <li>
                                    <a href="#" class="flex items-center justify-center px-3 h-8 leading-tight text-gray-100 bg-white border border-gray-300 rounded-l-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-100 dark:border-gray-700 dark:text-gray-100 dark:hover:bg-gray-700 dark:hover:text-white">
                                        <span class="sr-only">Previous</span>
                                        <svg class="w-2.5 h-2.5 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 1 1 5l4 4" />
                                        </svg>
                                    </a>
                                </li>
                                <li>
                                    <a href="#" class="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-900 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">1</a>
                                </li>
                                <li>
                                    <a href="#" class="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-900 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">2</a>
                                </li>
                                <li>
                                    <a href="#" aria-current="page" class="z-10 flex items-center justify-center px-3 h-8 leading-tight text-blue-600 border border-blue-300 bg-blue-50 hover:bg-blue-100 hover:text-blue-700 dark:border-gray-700 dark:bg-gray-700 dark:text-white">3</a>
                                </li>
                                <li>
                                    <a href="#" class="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-900 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">4</a>
                                </li>
                                <li>
                                    <a href="#" class="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-900 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">5</a>
                                </li>
                                <li>
                                    <a href="#" class="flex items-center justify-center px-3 h-8 leading-tight text-gray-100 bg-white border border-gray-300 rounded-e-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-100 dark:border-gray-700 dark:text-gray-100 dark:hover:bg-gray-700 dark:hover:text-white">
                                        <span class="sr-only">Next</span>
                                        <svg class="w-2.5 h-2.5 rtl:rotate-180 dark:stroke-slate-100 dark:-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 6 10">
                                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 9 4-4-4-4" />
                                        </svg>
                                    </a>
                                </li>
                            </ul>

                        </nav>

                        <form class="ml-2">

                            <div class="relative w-full">
                                <input type="search" id="search-dropdown" class="block p-[5px] w-[80px] z-20 rounded-l-[5px] text-left text-[12px] text-gray-900 bg-gray-50 rounded-e-lg border-s-gray-50 border-s-2 border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-100 dark:border-s-gray-700  dark:border-gray-600 dark:placeholder-gray-400 dark:text-black dark:focus:border-blue-500 outline-none" placeholder="3" required />
                                <button type="submit" class="absolute top-0 end-0 p-2 text-sm font-medium h-full text-white bg-gray-900 rounded-e-lg border border-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-gray-900 dark:focus:ring-blue-800">
                                    <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                        <path stroke="white" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                                    </svg>
                                    <span class="sr-only">Search</span>
                                </button>
                            </div>

                        </form>

                    </div> */}


















                </div>
            </div>

        </main>
    )
}






















{/* 
            {modal === true && <div className="h-screen w-screen flex justify-center items-center bg-[#000000c2] fixed top-0 left-0  z-50  p-4 overflow-x-hidden overflow-y-auto md:inset-0" onClick={() => setmodal(false)}>
                <div className="relative w-full max-w-md max-h-full">
                    <div className="relative bg-white rounded-lg shadow p-5 " onClick={(e) => e.stopPropagation()}>

                        <h3 className='relative bg-[#FF9600] text-white px-5 py-3 mb-5'>Añadir cuenta</h3>

                        <div className='w-[400px] space-y-2'>
                            <div className='flex justify-between'>
                                <label htmlFor="" className={`mr-5 text-[10px] ${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-white`}>
                                    Cuenta:
                                </label>
                                <input className={`h-[25px] max-w-[173px] w-full px-3 border border-[#cfcfcf] rounded-[5px] text-[10px]  ${theme === 'light' ? ' text-gray-950 bg-gray-200' : ' text-white bg-gray-200'} dark:text-white  dark:bg-transparent`}   arr={['Opción 1', 'Opción 2']} name='filtro' click={handlerSelectClick} defaultValue={filter['filtro']} uuid='123' label='Filtro 1' position='absolute left-0 top-[25px]'  bg={`${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-white`} required />
                            </div>
                            <div className='flex justify-between'>
                                <label htmlFor="" className={`mr-5 text-[10px] ${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-white`}>
                                    Contraseña:
                                </label>
                                <input type='password' className={`h-[25px] max-w-[173px] w-full px-3 border border-[#cfcfcf] rounded-[5px] text-[10px]  ${theme === 'light' ? ' text-gray-950 bg-gray-200' : ' text-white bg-gray-200'} dark:text-white  dark:bg-transparent`}   arr={['Opción 1', 'Opción 2']} name='filtro' click={handlerSelectClick} defaultValue={filter['filtro']} uuid='123' label='Filtro 1' position='absolute left-0 top-[25px]'  bg={`${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-white`} required />
                            </div>




                            <div className='flex justify-between'>
                                <label htmlFor="" className={`mr-5 text-[10px] ${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-white`}>
                                    Apodo:
                                </label>
                                <input type='password' className={`h-[25px] max-w-[173px] w-full px-3 border border-[#cfcfcf] rounded-[5px] text-[10px]  ${theme === 'light' ? ' text-gray-950 bg-gray-200' : ' text-white bg-gray-200'} dark:text-white  dark:bg-transparent`}   arr={['Opción 1', 'Opción 2']} name='filtro' click={handlerSelectClick} defaultValue={filter['filtro']} uuid='123' label='Filtro 1' position='absolute left-0 top-[25px]'  bg={`${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-white`} required />
                            </div>
                            <div className='flex justify-between'>
                                <label htmlFor="" className={`mr-5 text-[10px] ${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-white`}>
                                    Origen de la cuenta
                                </label>
                                <SelectSimple arr={['Opción 1', 'Opción 2']} name='Fecha de cancelación a cuenta 1' click={handlerSelectClick} defaultValue={filter['Fecha de cancelación a cuenta 1']} uuid='123' label='Filtro 1' position='absolute left-0 top-[25px]'  bg={`${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-white`} required />

                            </div>



                            <div className='flex justify-between'>
                                <label htmlFor="" className={`mr-5 text-[10px] ${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-white`}>
                                    Codificación de roles:
                                </label>
                                <SelectSimple arr={['Opción 1', 'Opción 2']} name='ID de sub-factura' click={handlerSelectClick} defaultValue={filter['ID de sub-factura']} uuid='123' label='Filtro 1' position='absolute left-0 top-[25px]'  bg={`${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-white`} required />
                            </div>

                            <div className='flex justify-between'>
                                <label htmlFor="" className={`mr-5 text-[10px] ${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-white`}>
                                    situación laboral
                                </label>
                                <div className='flex space-x-3'>
                                    <label className='text-[10px]'>
                                        <input
                                            className='mr-5'

                                            type="checkbox"
                                            checked={selectedCheckbox === 1}
                                            onChange={() => handleCheckboxChange(1)}
                                        />
                                        En el trabajo
                                    </label>
                                    <br />
                                    <label className='text-[10px]'>
                                        <input
                                            className='mr-5'
                                            type="checkbox"
                                            checked={selectedCheckbox === 2}
                                            onChange={() => handleCheckboxChange(2)}
                                        />
                                        Dimitir
                                    </label>
                                    <br />
                                    <label className='text-[10px]'>
                                        <input
                                            className='mr-5'

                                            type="checkbox"
                                            checked={selectedCheckbox === 3}
                                            onChange={() => handleCheckboxChange(3)}
                                        />
                                        Reposo
                                    </label>
                                </div>
                            </div>
                        </div>


                    </div>
                </div>
            </div>} */}





{/* {
                modal === 'Registrar' && <div className='fixed flex justify-center items-center top-0 left-0 bg-[#0000007c] h-screen w-screen z-50' onClick={() => setModal('')}>
                    <div className='relative flex flex-col items-center justify-center bg-gray-200 w-[400px] h-[300px] p-5 space-y-5 rounded-[5px]' onClick={(e) => e.stopPropagation()}>
                        <button
                            className="absolute top-5 right-5 flex items-center justify-center w-12 h-6 bg-red-500 text-white rounded-[5px] hover:bg-red-600 focus:outline-none"
                            onClick={() => setModal('')}
                        >
                            X
                        </button>

                        <h4></h4>
                        <div className='relative flex justify-between w-[300px]'>

                            <label htmlFor="" className={`mr-5 text-[10px] ${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-white`}>
                                Estado de reembolso:
                            </label>
                            <SelectSimple arr={optionsArray} name='Estado de reembolso' click={handlerSelectClick2} defaultValue={value} uuid='123' label='Filtro 1' position='absolute left-0 top-[25px]'  bg={`${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-white`} required />
                        </div>
                        <div className='relative flex justify-between w-[300px]'>

                            <label htmlFor="" className={`mr-5 text-[10px] ${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-white`}>
                                Registro por:
                            </label>
                            <textarea name=""
                                value={texto}
                                onChange={manejarCambio}
                                placeholder="Escribe algo..."

                                className='text-[10px] p-2 w-[200px] focus:outline-none bg-gray-200 border-[1px] border-gray-300 rounded-[5px]' id=""></textarea>                        </div>


                        <button type="button" class="w-[300px] text-white bg-gradient-to-br from-blue-600 to-blue-400 hover:bg-gradient-to-bl foco-4 focus:outline-none foco-blue-300 dark:foco-blue-800 font-medium rounded-lg text-[10px] px-5 py-1.5 text-center me-2 mb-2" onClick={() => setModal('Registro de cobro')}>Registro de cobro</button>

                    </div>

                </div>
            } */}