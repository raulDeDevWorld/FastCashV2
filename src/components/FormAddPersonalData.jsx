'use client'

import { useState } from "react"
import { useAppContext } from '@/context/AppContext'
import { useTheme } from '@/context/ThemeContext';
import SelectSimple from '@/components/SelectSimple'
import { domainToASCII } from "url";
import { useSearchParams } from 'next/navigation'

import { toast } from 'react-hot-toast';



export default function AddAccount() {
    const { user, userDB, setUserProfile, setAlerta, users, modal, setModal, setUsers, loader, setLoader, setUserSuccess, success, setUserData, postsIMG, setUserPostsIMG, divisas, setDivisas, exchange, setExchange, destinatario, setDestinatario, itemSelected, setItemSelected } = useAppContext()
    const { theme, toggleTheme } = useTheme();
    const [data, setData] = useState({})
    const [value1, setValue1] = useState('Por favor elige')
    const [value2, setValue2] = useState('Por favor elige')
    const [value3, setValue3] = useState('Por favor elige')
    const [showPassword, setShowPassword] = useState(false)
    const [password, setPassword] = useState('');
    const [selectedCheckbox, setSelectedCheckbox] = useState(null);
    const [base64, setBase64] = useState("");


    const searchParams = useSearchParams()


    const seccion = searchParams.get('seccion')

    const item = searchParams.get('item')

    function onChangeHandler(e) {
        // console.log(e.target.value)
        setData({ ...data, [e.target.name]: e.target.value })
    }

    const saveAccount = async (e) => {
        e.preventDefault();
        try {
            setLoader('Guardando...')
            const db = {
                ...data,
            };
            const id = userDB.id
            // console.log(userDB)
            const response = await fetch(window?.location?.href?.includes('localhost') ? `http://localhost:3000/api/auth/registerPersonal/${id}` : `http://18.220.249.246/api/auth/registerPersonal/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(db),
            });

            if (!response.ok) {
                setLoader('')
                setAlerta('Error de datos!')
                throw new Error('Registration failed');
            }

            const result = await response.json();
            // console.log(result);


            setAlerta('Operación exitosa!')
            setModal('')
            setLoader('')
            // navigate('/dashboard');
        } catch (error) {
            setLoader('')
            setAlerta('Error de datos!')

        }
    };













































    // Función para manejar la subida de la imagen
    const handleImageUpload = (event) => {
        const file = event.target.files[0]; // obtiene el archivo seleccionado

        if (file) {
            const reader = new FileReader(); // crea un lector de archivos

            reader.onloadend = () => {
                setBase64(reader.result); // establece la imagen en formato base64
            };

            reader.readAsDataURL(file); // lee el archivo como una URL de datos
        }
    };

    return <div className='fixed flex justify-center items-center top-0 left-0 bg-[#0000007c] h-screen w-screen z-40' onClick={() => setModal('')}>
        <div className='relative flex flex-col items-start justify-center bg-gray-200 w-[450px] h-[450px] p-5 px-12 space-y-3 rounded-[5px]' onClick={(e) => e.stopPropagation()}>

            <h4 className='w-full text-center text-gray-950'>Completa tus datos personales</h4>

            <div className="w-full flex justify-center">
                <label htmlFor="file" className="flex justify-center items-center w-[150px] min-h-[150px] rounded-full bg-gray-200 border border-gray-400  text-center text-gray-900 text-[14px] focus:ring-blue-500 focus:border-blue-500 " >
                    {base64 !== "" ? <img className="flex justify-center items-center w-[150px] min-h-[150px] bg-gray-200 border border-gray-400 text-gray-900 text-sm focus:ring-blue-500 focus:border-blue-500 rounded-full" style={{ objectPosition: 'center' }} src={base64} alt="" />
                        : 'Subir perfil'}
                </label>
                <input className="hidden" id='file' name='name' onChange={handleImageUpload} accept=".jpg, .jpeg, .png, .mp4, webm" type="file" required />
            </div>


            <div className='flex justify-between'>
                <label htmlFor="" className={`mr-5 text-[10px] w-[200px] ${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-gray-950`}>
                    Nombre Completo:
                </label>
                <input
                    type='text'
                    className={`h-[25px] max-w-[173px] w-full px-3 border border-[#adadad] rounded-[5px] text-[10px]  ${theme === 'light' ? ' text-gray-950 bg-gray-200' : ' text-white bg-gray-200'} dark:text-gray-950  dark:bg-transparent`}
                    name='nombreCompleto' onChange={onChangeHandler} placeholder='example@gmail.com' uuid='123' label='Filtro 1' position='absolute left-0 top-[25px]' bg={`${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-gray-950`} required />
            </div>

            <div className='flex justify-between'>
                <label htmlFor="" className={`mr-5 text-[10px] w-[200px] ${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-gray-950`}>
                    DNI:
                </label>
                <input
                    type='text'
                    className={`h-[25px] max-w-[173px] w-full px-3 border border-[#adadad] rounded-[5px] text-[10px]  ${theme === 'light' ? ' text-gray-950 bg-gray-200' : ' text-white bg-gray-200'} dark:text-gray-950  dark:bg-transparent`}
                    name='dni' onChange={onChangeHandler} placeholder='example@gmail.com' uuid='123' label='Filtro 1' position='absolute left-0 top-[25px]' bg={`${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-gray-950`} required />
            </div>

            <div className='flex justify-between'>
                <label htmlFor="" className={`mr-5 text-[10px] w-[200px] ${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-gray-950`}>
                    Telefono:
                </label>
                <input
                    type='text'
                    className={`h-[25px] max-w-[173px] w-full px-3 border border-[#adadad] rounded-[5px] text-[10px]  ${theme === 'light' ? ' text-gray-950 bg-gray-200' : ' text-white bg-gray-200'} dark:text-gray-950  dark:bg-transparent`}
                    name='telefono' onChange={onChangeHandler} placeholder='example@gmail.com' uuid='123' label='Filtro 1' position='absolute left-0 top-[25px]' bg={`${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-gray-950`} required />
            </div>
            <button type="button"
                class="w-[300px] relative left-0 right-0 mx-auto text-white bg-gradient-to-br from-blue-600 to-blue-400 hover:bg-gradient-to-bl foco-4 focus:outline-none foco-blue-300 dark:foco-blue-800 font-medium rounded-lg text-[10px] px-5 py-1.5 text-center  mb-2"
                onClick={saveAccount}>Registrar cuenta</button>
        </div>

    </div>
}