'use client';

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation';
import { useAppContext } from '@/context/AppContext'


export default function Select({ arr, name, click, defaultValue, uuid, label, position, bg, required }) {

    const router = useRouter()
    const { select, setSelect, languaje, success} = useAppContext()
    const [state, setState] = useState(defaultValue ? defaultValue : arr[0])
    function handlerSelect() {
        select === name ? setSelect('') : setSelect(name)

    }
    function handlerUserState(name, i) {
        setState(i)
        click(name, i, uuid)
    }
    return (
        <div className='relative '>
                <div id={label}
                    className={`relative  border border-[#cfcfcf]  pt-.5 mb-0   w-full text-[10px]   px-5 cursor-pointer ${bg ? `${bg} pb-2` : 'bg-transparent text-gray-900 border-[#a1a1a1]'}   focus:outline-none focus:ring-0  peer rounded-[5px]`}
                    onClick={handlerSelect}>
                    {defaultValue === 'Seleccionar' && <span className='absolute top-2'>Seleccionar</span>}
                    <input type="text" readonly className='relative top-[4.5px] w-full h-full border-transparent outline-none focus:outline-none bg-transparent caret-transparent cursor-pointer' value={defaultValue !== undefined && defaultValue !== 'Seleccionar' ? defaultValue : arr[0]} minLength={2} required={required} />
                    <span className={select === name ? 'absolute top-[4px] right-[10px] rotate-[270deg]' : 'absolute top-[4.5px] right-[10px] rotate-90'}>{'>'}</span>
                    <ul
                        className={` ${position ? position : 'relative'}  ${bg ? 'bg-gray-50' : 'bg-transparent'} mt-0  transition-all rounded-[5px]  w-full  ${select === name ? ` ${arr.length > 2 && 'h-[75px] border-t z-10 border border-[#cfcfcf]   overflow-auto '} ${arr.length == 2 && 'h-[48px] border-t overflow-hidden border border-[#cfcfcf]   z-10'} ${arr.length == 1 && 'h-[25px] border-t overflow-hidden border border-[#cfcfcf]   z-10'}  ` : 'h-[0] overflow-hidden'}`}  >
                        {
                            arr.map((i, index) => <li key={index} className='flex items-center hover:bg-gray-100 text-black border-b cursor-pointer px-2 py-1' onClick={() => handlerUserState(name, i)}> {i} </li>)
                        }
                    </ul>
                </div>
                {/* {label && <label htmlFor={label} className={`z-50 peer-focus:font-medium shadow-white shadow-2xl absolute text-[10px] ${select === name ? 'text-blue-600' : 'text-[#6b7280]'} bg-white px-5 mx-2 duration-300 transform -translate-y-6 scale-75 top-3 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600  peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6`}>{label}</label>} */}
        </div>
    )
}












