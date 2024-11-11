'use client'

import { useState } from "react"
import { useAppContext } from '@/context/AppContext'
import { useTheme } from '@/context/ThemeContext';
import SelectSimple from '@/components/SelectSimple'
import { domainToASCII } from "url";
import { useSearchParams } from 'next/navigation'

import { toast } from 'react-hot-toast';



export default function AddAccount() {
    const { user, userDB, setUserProfile, setAlerta, users, modal,  setModal, setUsers, loader, setLoader, setUserSuccess, success, setUserData, postsIMG, setUserPostsIMG, divisas, setDivisas, exchange, setExchange, destinatario, setDestinatario, itemSelected, setItemSelected } = useAppContext()
    const { theme, toggleTheme } = useTheme();
    const [data, setData] = useState({})
    const [value, setValue] = useState('Por favor elige')

    const searchParams = useSearchParams()
    const seccion = searchParams.get('seccion')
    const item = searchParams.get('item')


    function onChangeHandler(e) {
        setData({ ...data, [e.target.name]: e.target.value })
    }
    function handlerSelectClick2(name, i, uuid) {
            setValue(i)
    }






    async function updateUser() {
        try {

            setLoader('Guardando...')


            const response = await fetch(window?.location?.href.includes('localhost')
            ?`http://localhost:3000/api/verification/${itemSelected._id}`
            :`https://fastcash-mx.com/api/verification/${itemSelected._id}`, {
                method: 'PUT', // El método es PUT para actualizar
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`, // Si estás usando JWT
                },
                body: JSON.stringify({...data,estadoDeCredito: value,asesorVerificador: userDB.cuenta }), // Los datos que queremos actualizar
            });
            if (!response.ok) {
                setLoader('')
                setAlerta('Error de datos!')
                throw new Error('Registration failed');
            }
    
            // Verificar si la respuesta es exitosa
            if (response.ok) {
                setAlerta('Operación exitosa!')
                setModal('')
                setLoader('')
            } else {
                setLoader('')
                setAlerta('Error de datos!')
                throw new Error('Registration failed');
            }
        } catch (error) {
            setLoader('')
            setAlerta('Error de datos!')
            throw new Error('Registration failed');
        }
    }







// console.log(userDB)





// console.log(itemSelected)
// console.log(data)
    return (
        <div className='fixed flex justify-center items-center top-0 left-0 bg-[#0000007c] h-screen w-screen z-30' onClick={() => setModal('')}>
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
                    <textarea name="acotacionVerificador" className='text-[10px] p-2 w-[200px] focus:outline-none bg-gray-200 border-[1px] border-gray-300 rounded-[5px]' id="" onChange={onChangeHandler}></textarea>                        </div>
                <button type="button" class="w-[300px] text-white bg-gradient-to-br from-blue-600 to-blue-400 hover:bg-gradient-to-bl foco-4 focus:outline-none foco-blue-300 dark:foco-blue-800 font-medium rounded-lg text-[10px] px-5 py-1.5 text-center me-2 mb-2" onClick={updateUser}>Registrar</button>
            </div>
        </div>
    )
}