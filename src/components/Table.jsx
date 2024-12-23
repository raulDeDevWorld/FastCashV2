'use client'
import React, { useEffect, useState } from 'react';
import { useAppContext } from '@/context/AppContext'
import { useSearchParams } from 'next/navigation'

import Link from 'next/link';
import { ChatIcon, PhoneIcon, ClipboardDocumentCheckIcon, FolderPlusIcon, CurrencyDollarIcon, DocumentTextIcon, UserCircleIcon, ChatBubbleLeftEllipsisIcon } from '@heroicons/react/24/solid';

const Table = ({
    headArray,
    dataArray,
    dataFilter,
    access,
    local,
    server,
    query
}) => {
    const { user, userDB, loader, setUserProfile, users, setLoader, setUsers, checkedArr, setCheckedArr, setModal, itemSelected, setItemSelected, setUserSuccess, success, setUserData, postsIMG, setUserPostsIMG, divisas, setDivisas, exchange, setExchange, destinatario, setDestinatario } = useAppContext()
    const searchParams = useSearchParams()
    const seccion = searchParams.get('seccion')
    const item = searchParams.get('item')
    const [data, setData] = useState([])


    const toCamelCase = (str) => {
        let cleanedStr = str.toLowerCase();
        cleanedStr = cleanedStr.replace(/\([^)]*\)/g, '');
        cleanedStr = cleanedStr.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        cleanedStr = cleanedStr.replace(/-/g, ' ');
        return cleanedStr
            .replace(/[_\s]+(.)?/g, (_, char) => char ? char.toUpperCase() : '')
            .replace(/^[A-Z]/, firstChar => firstChar.toLowerCase());
    };

    function handlerVerification(i) {
        setModal('Registrar Verificacion')
        setItemSelected(i)
    }
    function handlerAcount(mod, i) {
        setModal(mod)
        setCheckedArr([i])
    }
    // console.log(userDB)
    async function handlerFetch(queryURL) {

console.log(window?.location?.href?.includes('localhost') ? `${local}${queryURL}` : `${server}${queryURL}`)
        const res = await fetch(
            window?.location?.href?.includes('localhost') ? `${local}${queryURL}` : `${server}${queryURL}`
        )
        const data = await res.json()
        setData(data)
        setLoader(false)
    }


    function handlerSelectCheck(e, i) {
        if (e.target.checked) {
            // Si está marcado, agrega el índice al array
            setCheckedArr([...checkedArr, i]);
        } else {
            // Si no está marcado, quita el índice del array
            setCheckedArr(checkedArr.filter(item => item._id !== i._id));
        }
    }
    function handlerSelectAllCheck(e, i) {
        if (e.target.checked) {
            // Si está marcado, agrega el índice al array
            const db = data.filter((i, index) => dataFilter(i))
            console.log(db)
            setCheckedArr(db);
        } else {
            // Si no está marcado, quita el índice del array
            setCheckedArr([]);
        }
    }
console.log(data)
    useEffect(() => {
        var queryURL = `${window.location.search}${query ?`&${query}`: ''}`;
        handlerFetch(queryURL)
    }, [loader])

    useEffect(() => {
        setCheckedArr([])
    }, [])
    return (
        access && <table className="min-w-full shadow">
            <thead className="bg-gray-900 text-[10px] uppercase sticky top-[0px] z-20">
                <tr className="text-white min-w-[2500px]">
                    {headArray().map((i, index) => (
                        <th
                            scope="col"
                            key={index}
                            className={`w-[50px] px-3 py-3 text-white `}
                        // className={`w-[50px] px-3 py-3 text-white 
                        //     ${index < 10
                        //     ? (selectedLeft === index
                        //         ? 'sticky left-0 z-20 bg-gray-800' : 'bg-gray-900')
                        //     : (selectedRight === index ? 'sticky right-0 z-20 bg-gray-800'
                        //         : 'bg-gray-900')}
                        //         `}
                        // onClick={() => handlerSelected(index < 10 ? 'LEFT' : 'RIGHT', index)}
                        >
                            {i === "Seleccionar" ? <input type="checkbox" onClick={(e) => handlerSelectAllCheck(e, i)} /> : i}
                        </th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {data?.map((i, index) => {

                    return dataFilter(i) && (
                        <tr key={index} className="text-[12px] border-b">
                            {headArray().map((it, index) => {
                                return (

                                    <td className={`px-3 py-2 text-[12px] border-b ${index % 2 === 0 ? 'bg-gray-300' : 'bg-gray-200'} `} >
                                        {it === "Seleccionar" &&
                                            <input type="checkbox"
                                                checked={checkedArr.some(value => value._id === i._id)}
                                                onClick={(e) => handlerSelectCheck(e, i)} />}
                                        { it.toLowerCase() === 'contactos' &&
                                            <div className="flex justify-around items-center">
                                                {/* {console.log( checkedArr.some(value => value._id === i._id))} */}
                                                <a
                                                    href={`https://wa.me/${i.numeroDeTelefonoMovil}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center text-green-500 hover:text-green-600"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="25" height="25" viewBox="0 0 48 48">
                                                        <path fill="#fff" d="M4.868,43.303l2.694-9.835C5.9,30.59,5.026,27.324,5.027,23.979C5.032,13.514,13.548,5,24.014,5c5.079,0.002,9.845,1.979,13.43,5.566c3.584,3.588,5.558,8.356,5.556,13.428c-0.004,10.465-8.522,18.98-18.986,18.98c-0.001,0,0,0,0,0h-0.008c-3.177-0.001-6.3-0.798-9.073-2.311L4.868,43.303z"></path><path fill="#fff" d="M4.868,43.803c-0.132,0-0.26-0.052-0.355-0.148c-0.125-0.127-0.174-0.312-0.127-0.483l2.639-9.636c-1.636-2.906-2.499-6.206-2.497-9.556C4.532,13.238,13.273,4.5,24.014,4.5c5.21,0.002,10.105,2.031,13.784,5.713c3.679,3.683,5.704,8.577,5.702,13.781c-0.004,10.741-8.746,19.48-19.486,19.48c-3.189-0.001-6.344-0.788-9.144-2.277l-9.875,2.589C4.953,43.798,4.911,43.803,4.868,43.803z"></path><path fill="#cfd8dc" d="M24.014,5c5.079,0.002,9.845,1.979,13.43,5.566c3.584,3.588,5.558,8.356,5.556,13.428c-0.004,10.465-8.522,18.98-18.986,18.98h-0.008c-3.177-0.001-6.3-0.798-9.073-2.311L4.868,43.303l2.694-9.835C5.9,30.59,5.026,27.324,5.027,23.979C5.032,13.514,13.548,5,24.014,5 M24.014,42.974C24.014,42.974,24.014,42.974,24.014,42.974C24.014,42.974,24.014,42.974,24.014,42.974 M24.014,42.974C24.014,42.974,24.014,42.974,24.014,42.974C24.014,42.974,24.014,42.974,24.014,42.974 M24.014,4C24.014,4,24.014,4,24.014,4C12.998,4,4.032,12.962,4.027,23.979c-0.001,3.367,0.849,6.685,2.461,9.622l-2.585,9.439c-0.094,0.345,0.002,0.713,0.254,0.967c0.19,0.192,0.447,0.297,0.711,0.297c0.085,0,0.17-0.011,0.254-0.033l9.687-2.54c2.828,1.468,5.998,2.243,9.197,2.244c11.024,0,19.99-8.963,19.995-19.98c0.002-5.339-2.075-10.359-5.848-14.135C34.378,6.083,29.357,4.002,24.014,4L24.014,4z"></path><path fill="#40c351" d="M35.176,12.832c-2.98-2.982-6.941-4.625-11.157-4.626c-8.704,0-15.783,7.076-15.787,15.774c-0.001,2.981,0.833,5.883,2.413,8.396l0.376,0.597l-1.595,5.821l5.973-1.566l0.577,0.342c2.422,1.438,5.2,2.198,8.032,2.199h0.006c8.698,0,15.777-7.077,15.78-15.776C39.795,19.778,38.156,15.814,35.176,12.832z"></path><path fill="#fff" fill-rule="evenodd" d="M19.268,16.045c-0.355-0.79-0.729-0.806-1.068-0.82c-0.277-0.012-0.593-0.011-0.909-0.011c-0.316,0-0.83,0.119-1.265,0.594c-0.435,0.475-1.661,1.622-1.661,3.956c0,2.334,1.7,4.59,1.937,4.906c0.237,0.316,3.282,5.259,8.104,7.161c4.007,1.58,4.823,1.266,5.693,1.187c0.87-0.079,2.807-1.147,3.202-2.255c0.395-1.108,0.395-2.057,0.277-2.255c-0.119-0.198-0.435-0.316-0.909-0.554s-2.807-1.385-3.242-1.543c-0.435-0.158-0.751-0.237-1.068,0.238c-0.316,0.474-1.225,1.543-1.502,1.859c-0.277,0.317-0.554,0.357-1.028,0.119c-0.474-0.238-2.002-0.738-3.815-2.354c-1.41-1.257-2.362-2.81-2.639-3.285c-0.277-0.474-0.03-0.731,0.208-0.968c0.213-0.213,0.474-0.554,0.712-0.831c0.237-0.277,0.316-0.475,0.474-0.791c0.158-0.317,0.079-0.594-0.04-0.831C20.612,19.329,19.69,16.983,19.268,16.045z" clip-rule="evenodd"></path>
                                                    </svg>
                                                </a>
                                                <a
                                                    href={`https://https://t.me/${i.numeroDeTelefonoMovil}`}
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
                                            </div>}
                                        {it.toLowerCase() === 'operar' && item?.toLowerCase().includes('colección') && <div className='flex justify-between flex space-x-3'>
                                            <Link href={`/Home/Datos?caso=${i._id}&seccion=info`} className=''>
                                                <button type="button" class="w-full text-white bg-gradient-to-br from-blue-600 to-blue-400 hover:bg-gradient-to-bl foco-4 focus:outline-none foco-blue-300 dark:foco-blue-800 font-medium rounded-lg text-[10px] px-5 py-1.5 text-center me-2 mb-2">Visitar</button>
                                            </Link>
                                            <button type="button" class="w-full text-white bg-gradient-to-r from-cyan-400 via-cyan-500 to-cyan-600 hover:bg-gradient-to-br foco-4 focus:outline-none foco-cyan-300 dark:foco-cyan-800 font-medium rounded-lg text-[10px] px-5 py-1.5 text-center me-2 mb-2" onClick={() => handlerVerification(i)}>Registrar</button>
                                        </div>}
                                        {it.toLowerCase() === 'icon' && item?.toLowerCase().includes('aplicacion') && <div className='flex justify-between flex space-x-3'>
                                            <img src={i[toCamelCase(it)]} className='w-[80px] h-[80px]' alt="" />
                                        </div>}
                                        {item?.toLowerCase().includes('gestión de') && !item?.toLowerCase().includes('colección') && it.toLowerCase() === 'operar' && <div className='flex justify-between flex space-x-3'>
                                            <UserCircleIcon
                                                className='h-6 w-6 fill-[#ebbb40]'
                                                onClick={() => handlerAcount('Asignar Asesor', i)} />

                                            {/* <DocumentTextIcon className='h-6 w-6 fill-[#5c78d3] cursor-pointer' onClick={() => setModal('Registrar')} /> */}
                                            <ChatBubbleLeftEllipsisIcon
                                                className='h-6 w-6 fill-[#5bc0cf] cursor-pointer'
                                                onClick={() => setModal('SMS')} />
                                            <CurrencyDollarIcon
                                                className='h-6 w-6 fill-[#1ab418] cursor-pointer' />
                                            {/* <FolderPlusIcon className='h-6 w-6 fill-[#eba140]' /> */}
                                        </div>}
                                        {item?.toLowerCase().includes('aplicacion') && it.toLowerCase() === 'operar' && <div className='relative flex max-w-[150px] justify-between space-x-3'>
                                            <button type="button" class="w-full max-w-[70px] text-white bg-gradient-to-br from-red-600 to-red-400 hover:bg-gradient-to-bl foco-4 focus:outline-none foco-blue-300 dark:foco-blue-800 font-medium rounded-lg text-[10px] px-5 py-1.5 text-center me-2 mb-2">Eliminar</button>
                                            <button type="button" class="w-full max-w-[70px] text-white bg-gradient-to-r from-cyan-400 via-cyan-500 to-cyan-600 hover:bg-gradient-to-br foco-4 focus:outline-none foco-cyan-300 dark:foco-cyan-800 font-medium rounded-lg text-[10px] px-5 py-2 text-center me-2 mb-2">Editar</button>
                                        </div>}
                                        {it.toLowerCase() !== 'operar' && it !==  'Contactos' && it.toLowerCase() !== 'icon' && i[toCamelCase(it)]}
                                    </td>
                                )
                            })}
                        </tr>
                    )
                })}

            </tbody>
        </table>
    );
};

export default Table;
