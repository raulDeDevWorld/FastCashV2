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
import TableReporteDiario from '@/components/TableReporteDiario'

// import Velocimetro from '@/components/Velocimetro'
const Velocimetro = dynamic(() => import("@/components/Velocimetro"), { ssr: false, });
import FormAddAccount from '@/components/FormAddAccount'
import FormAddMasiveAccounts from '@/components/FormAddMasiveAccounts'
import FormAddPersonalAccount from '@/components/FormAddPersonalAccount'
import FormAddPersonalData from '@/components/FormAddPersonalData'
import FormAddVerification from '@/components/FormAddVerification'
import FormAdminAccount from '@/components/FormAdminAccount'
import FormAddApplication from '@/components/FormAddApplication'
import FormDistributionCases from '@/components/FormDistributionCases'
import FormAsignarAsesor from '@/components/FormAsignarAsesor'
import TableTools from '@/components/TableTools'
import TableReporteDiarioVerificacion from '@/components/TableReporteDiarioVerificacion'
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
    encabezadoDeAplicaciones
} from '@/constants/TableHeaders.jsx'



export default function Home() {
    const [selectedLeft, setSelectedLeft] = useState(-1);
    const [selectedRight, setSelectedRight] = useState(-1);

    const { user, userDB, setUserProfile, users, alerta, setAlerta, modal, setModal, loader, setLoader, setUsers, setUserSuccess, success, setUserData, postsIMG, setUserPostsIMG, divisas, setDivisas, exchange, setExchange, destinatario, setDestinatario, itemSelected, setItemSelected } = useAppContext()
    const refFirst = useRef(null);
    const searchParams = useSearchParams()
    const seccion = searchParams.get('seccion')
    const item = searchParams.get('item')
    let menu = user?.rol ? menuArray[user.rol].filter(i => i.hash === seccion) : ''


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




    return (
        <div className="overflow-x-auto">
    
        </div>

    )
}








