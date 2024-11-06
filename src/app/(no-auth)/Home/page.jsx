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
import FormAddAccount from '@/components/AddAccount'


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
    const { user, userDB, setUserProfile, users, modal, setModal, setUsers, setUserSuccess, success, setUserData, postsIMG, setUserPostsIMG, divisas, setDivisas, exchange, setExchange, destinatario, setDestinatario, itemSelected, setItemSelected } = useAppContext()
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
                console.log(scrollLeft);
                const itemWidth = screen.width - 50;
                refFirst.current.scrollLeft = scrollLeft - itemWidth;
            }
        });
    };
    const next = () => {
        requestAnimationFrame(() => {
            if (refFirst.current) {
                const scrollLeft = refFirst.current.scrollLeft;
                console.log(scrollLeft);
                const itemWidth = screen.width - 50;
                console.log(itemWidth);
                refFirst.current.scrollLeft = scrollLeft + itemWidth;
            }
        });
    };
    function handlerSelectClick(name, i, uuid) {
        setFilter({ ...filter, [name]: i })
    }
    console.log(filter)
    function onChangeHandler(e) {
        console.log(e.target.value)
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

        // console.log('Fecha Actual: ' + dt);
        //restando los dias deseados
        const dat = dt.setDate(dt.getDate() + dias);
        const index = new Date(dat).getDay()
        //mostrando el resultado
        return { val: formatDate(dt), day: diasSemana[index] }
    }
    //fecha actual
    const [value, setValue] = useState({})
    const [value2, setValue2] = useState('Por favor elige')

    function handlerSelectClick2(name, i, uuid) {
        if (name === 'Tipo de grupo') {
            setValue({ ...value, [name]: i, ['Codificación de roles']: 'Por favor elige' })
        } else {
            setValue({ ...value, [name]: i })
        }

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

    console.log(filter)

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
    console.log(selectedLeft)

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
    const [isMounted, setIsMounted] = useState(false);
    console.log(item)










    function* infiniteSequence() {
        const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        let level = 1;  // Nivel de profundidad de la combinación de letras (A, AA, AAA, etc.)
        const suffix = "1";  // El sufijo constante que se añade a cada secuencia

        while (true) {
            // Bucle para generar combinaciones de un nivel determinado
            for (let i = 0; i < Math.pow(26, level); i++) {
                let seq = "";
                let n = i;
                // Genera una combinación de letras de acuerdo al nivel actual
                for (let j = 0; j < level; j++) {
                    seq = alphabet[n % 26] + seq;
                    n = Math.floor(n / 26);
                }
                yield `${seq}${suffix}`;
            }
            // Aumenta el nivel de profundidad para el siguiente conjunto de combinaciones
            level += 1;
        }
    }



    function generateCuentasMasivas() {
        // Ejemplo de uso:
        const generator = infiniteSequence();

        for (let i = 0; i < 200; i++) {  // Cambia el número para mostrar más o menos elementos
            console.log(generator.next().value);
        }
    }



    const codificacionDeRoles = {
        'Recursos Humanos': ['Recursos Humanos'],
        'Admin': ['Admin'],
        'Manager de Auditoria': ['Manager de Auditoria'],
        'Manager de Cobranza': ['Manager de Cobranza'],
        'Manager de Verificación': ['Manager de Verificación'],
        'Usuario de Auditoria': ['Usuario de Auditoria'],
        'Usuario de Cobranza': [
            'D2 = 2 DIAS ANTES DE LA FECHA DE COBRO',
            'D1 = 1 DIA ANTES DE LA FECHA DE COBRO',
            'D0 = DIA DE LA FECHA DE COBRO',
            'S1 = 1 - 7 DIAS DE MORA EN EL SISTEMA',
            'S2 = 8 - 16 DIAS DE MORA EN EL SISTEMA'
        ],
        'Usuario de Verificación': ['Usuario de Verificación'],
        'Cuenta personal': ['Cuenta personal'],
    }


    function saveAccount() {

    }
    useEffect(() => {
        setIsMounted(true);
    }, []);

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
                            <SelectSimple arr={['Activo', 'Inactivo']} name='Estado de usuario' click={handlerSelectClick2} defaultValue={value} uuid='123' label='Filtro 1' position='absolute left-0 top-[25px]' bg={`${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-white`} required />
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
                        > X </button>

                        <h4>Registro de Usuario</h4>

                        <div className='relative flex justify-between w-[300px]'>
                            <label htmlFor="" className={`mr-5 text-[10px] ${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-white`}>
                                Cuenta Auditora:
                            </label>
                            <SelectSimple arr={['Activo', 'Inactivo']} name='Cuenta Auditora' click={handlerSelectClick2} defaultValue={value} uuid='123' label='Filtro 1' position='absolute left-0 top-[25px]' bg={`${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-white`} required />
                        </div>

                        <div className='relative flex justify-between w-[300px]'>
                            <label htmlFor="" className={`mr-5 text-[10px] ${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-white`}>
                                Id Auditor:
                            </label>
                            <SelectSimple arr={['Activo', 'Inactivo']} name='Id Auditor' click={handlerSelectClick2} defaultValue={value} uuid='123' label='Filtro 1' position='absolute left-0 top-[25px]' bg={`${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-white`} required />
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























            {
                modal === 'Añadir cuenta' && <FormAddAccount />
            }




















            {modal === 'Añadir cuenta 000' && <div className='fixed flex justify-center items-center top-0 left-0 bg-[#0000007c] h-screen w-screen z-50' onClick={() => setModal('')}>
                <div className='relative flex flex-col items-start justify-center bg-gray-200 w-[450px] h-[450px] p-5 px-12 space-y-3 rounded-[5px]' onClick={(e) => e.stopPropagation()}>
                    <button
                        className="absolute top-5 right-5 flex items-center justify-center w-12 h-6 bg-red-500 text-white rounded-[5px] hover:bg-red-600 focus:outline-none"
                        onClick={() => setModal('')}
                    >
                        X
                    </button>
                    <h4 className='w-full text-center text-gray-950'>Añadir cuenta</h4>
                    <div className='relative flex justify-between w-[300px]'>
                        <label htmlFor="" className={`mr-5 text-[10px] ${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-gray-950`}>
                            Origen de la cuenta:
                        </label>
                        <SelectSimple
                            arr={['Por favor elige',
                                '通达富-UIO',
                                '通达富-CLI',
                                '通达富-EUA'
                            ]}
                            name='Origen de la cuenta'
                            click={handlerSelectClick2}
                            defaultValue={value?.['Origen de la cuenta'] ? value['Origen de la cuenta'] : 'Por favor elige'}
                            uuid='123'
                            label='Filtro 1'
                            position='absolute left-0 top-[25px]'
                            bg={`${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-gray-950`}
                            required />
                    </div>
                    <div className='relative flex justify-between w-[300px]'>
                        <label htmlFor="" className={`mr-5 text-[10px] ${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-gray-950`}>
                            Tipo de grupo:
                        </label>
                        <SelectSimple
                            arr={[
                                'Por favor elige',
                                'Recursos Humanos',
                                'Admin',
                                'Manager de Auditoria',
                                'Manager de Cobranza',
                                'Manager de Verificación',
                                'Usuario de Auditoria',
                                'Usuario de Cobranza',
                                'Usuario de Verificación',
                                'Cuenta personal'
                            ]}
                            name='Tipo de grupo'
                            click={handlerSelectClick2}
                            defaultValue={value?.['Tipo de grupo'] ? value['Tipo de grupo'] : 'Por favor elige'}
                            uuid='123'
                            label='Filtro 1'
                            position='absolute left-0 top-[25px]'
                            bg={`${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-gray-950`}
                            required />
                    </div>
                    <div className='relative flex justify-between w-[300px]'>
                        <label htmlFor="" className={`mr-5 text-[10px] ${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-gray-950`}>
                            Codificación de roles:
                        </label>
                        <SelectSimple
                            arr={codificacionDeRoles[value?.['Tipo de grupo']]
                                ? codificacionDeRoles[value?.['Tipo de grupo']]
                                : []}
                            name='Codificación de roles'
                            click={handlerSelectClick2}
                            defaultValue={value?.['Codificación de roles'] ? value['Codificación de roles'] : 'Por favor elige'}
                            uuid='123'
                            label='Filtro 1'
                            position='absolute left-0 top-[25px]'
                            bg={`${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-gray-950`}
                            required />
                    </div>
                    <div className='flex justify-between'>
                        <label htmlFor="" className={`mr-5 text-[10px] ${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-gray-950`}>
                            Cuenta:
                        </label>
                        <input className={`h-[25px] max-w-[173px] w-full px-3 border border-[#cfcfcf] rounded-[5px] text-[10px]  ${theme === 'light' ? ' text-gray-950 bg-gray-200' : ' text-white bg-gray-200'} dark:text-gray-950  dark:bg-transparent`} arr={['Opción 1', 'Opción 2']} onChange={onChangeHandler} placeholder='Mathew' uuid='123' label='Filtro 1' position='absolute left-0 top-[25px]' bg={`${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-gray-950`} required />
                    </div>

                    <div className='flex justify-between items-center space-x-2'>
                        <label htmlFor="" className={`mr-5 text-[10px] ${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-gray-950`}>
                            Contraseña:
                        </label>
                        <span className='relative inline-block '>
                            <input
                                type={showPassword ? 'text' : 'password'}
                                className={`h-[25px] max-w-[173px] w-full px-3 border border-[#cfcfcf] rounded-[5px] text-[10px]  ${theme === 'light' ? ' text-gray-950 bg-gray-200' : ' text-white bg-gray-200'} dark:text-gray-950  dark:bg-transparent`}
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
                        <label htmlFor="" className={`mr-5 text-[10px] ${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-gray-950`}>
                            Apodo:
                        </label>
                        <input
                            className={`h-[25px] max-w-[173px] w-full px-3 border border-[#cfcfcf] rounded-[5px] text-[10px]  ${theme === 'light' ? ' text-gray-950 bg-gray-200' : ' text-white bg-gray-200'} dark:text-gray-950  dark:bg-transparent`}
                            arr={['Opción 1', 'Opción 2']} onChange={onChangeHandler} placeholder='user123' uuid='123' label='Filtro 1' position='absolute left-0 top-[25px]' bg={`${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-gray-950`} required />
                    </div>
                    <div className='flex justify-between'>
                        <label htmlFor="" className={`mr-5 text-[10px] ${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-gray-950`}>
                            Email:
                        </label>
                        <input
                            type='email'
                            className={`h-[25px] max-w-[173px] w-full px-3 border border-[#cfcfcf] rounded-[5px] text-[10px]  ${theme === 'light' ? ' text-gray-950 bg-gray-200' : ' text-white bg-gray-200'} dark:text-gray-950  dark:bg-transparent`}
                            name='Email' onChange={onChangeHandler} placeholder='example@gmail.com' uuid='123' label='Filtro 1' position='absolute left-0 top-[25px]' bg={`${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-gray-950`} required />
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
                        onClick={saveAccount}>Registro de cobro</button>

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






            {(item === 'Gestión de RH' || item === 'Gestión de administradores' || item === 'Gestión de managers' || item === 'Gestión de asesores') &&
                <div>


                    <div className="w-full   relative  overflow-auto  scroll-smooth mb-2 lg:overflow-hidden">
                        <div className='grid grid-cols-3 gap-x-5 gap-y-2 w-[1050px]'>
                            <div className='w-[330px] space-y-2'>

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
                                <button type="button" onClick={() => setModal('Añadir cuenta')} class="w-full text-white bg-gradient-to-r from-cyan-400 via-cyan-500 to-cyan-600 hover:bg-gradient-to-br foco-4 focus:outline-none foco-cyan-300 dark:foco-cyan-800 font-medium rounded-lg text-[10px] px-5 py-2 text-center me-2 mb-2">Crear Usuarios</button>

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
            <div className="overflow-x-auto">
                {isMounted && user?.rol && <div className="max-h-[calc(100vh-90px)] pb-[70px] overflow-y-auto relative scroll-smooth" ref={refFirst}>

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
                        item === 'Cobro y valance' && <Table
                            access={true}
                            headArray={encabezadoCobroYValance}
                            dataArray={['']}
                            dataFilter={(i) => i?.estadoDeCredito === 'pendiente'}
                            local={'http://localhost:3000/api/verification'}
                            server={'http://18.220.249.246/api/data'}
                        />
                    }
                    {
                        item === 'Registro Histórico' && <Table
                            access={true}
                            headArray={encabezadoRegistroHistorico}
                            dataArray={['']}
                            dataFilter={(i) => i?.estadoDeCredito?.toLowerCase() === 'pendiente'}
                            local={'http://localhost:3000/api/verification'}
                            server={'http://18.220.249.246/api/data'}
                        />
                    }
                    {
                        item === 'Monitoreo de Transacciones' && <Table
                            access={true}
                            headArray={encabezadoMonitoreoDeTransacciones}
                            dataArray={['']}
                            dataFilter={(i) => i?.estadoDeCredito === 'pendiente'}
                            local={'http://localhost:3000/api/verification'}
                            server={'http://18.220.249.246/api/data'}
                        />
                    }
                    {
                        item === 'Control de Cumplimiento' && <Table
                            access={true}
                            headArray={encabezadoControlDeCumplimiento}
                            dataArray={['']}
                            dataFilter={(i) => i?.estadoDeCredito === 'pendiente'}
                            local={'http://localhost:3000/api/verification'}
                            server={'http://18.220.249.246/api/data'}
                        />
                    }
                    {
                        item === 'Auditoria Periodica' && <Table
                            access={true}
                            headArray={encabezadoAuditoriaPeriodica}
                            dataArray={['']}
                            dataFilter={(i) => i?.estadoDeCredito === 'pendiente'}
                            local={'http://localhost:3000/api/verification'}
                            server={'http://18.220.249.246/api/data'}
                        />
                    }
                    {
                        item === 'Recolección y Validación de Datos' && <Table
                            access={true}
                            headArray={encabezadoCasosDeVerificacion}
                            dataArray={['']}
                            dataFilter={(i) => i?.estadoDeCredito?.toLowerCase() === 'pendiente'}
                            local={'http://localhost:3000/api/verification'}
                            server={'http://18.220.249.246/api/data'}
                        />
                    }
                    {
                        item === 'Lista final' && <Table
                            access={true}
                            headArray={encabezadoCasosDeVerificacion}
                            dataFilter={(i) => i?.estadoDeCredito.toLowerCase() === 'aprobado' || i.estadoDeCredito.toLowerCase() === 'reprobado'}
                            local={'http://localhost:3000/api/verification'}
                            server={'http://18.220.249.246/api/data'}
                        />
                    }
                    {
                        (item === 'Gestión de administradores' || item === 'Gestión de RH' || item === 'Gestión de managers' || item === 'Gestión de asesores' || item === 'Gestión de cuentas personales') && <Table
                            access={true}
                            headArray={encabezadoGestionDeAccesos}
                            dataFilter={(i) => i?.estadoDeCredito.toLowerCase() === 'aprobado' || i.estadoDeCredito.toLowerCase() === 'reprobado'}
                            local={'http://localhost:3000/api/verification'}
                            server={'http://18.220.249.246/api/data'}
                        />
                    }

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

                </div>}
            </div>

        </main>
    )
}








