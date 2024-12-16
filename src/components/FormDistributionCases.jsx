'use client'

import { useState } from "react"
import { useAppContext } from '@/context/AppContext'
import { useTheme } from '@/context/ThemeContext';
import SelectSimple from '@/components/SelectSimple'
import { domainToASCII } from "url";
import { useSearchParams } from 'next/navigation'
import { toast } from 'react-hot-toast';
import FormLayout from '@/components/FormLayout'



export default function AddAccount() {
    const { user, userDB, setUserProfile, setAlerta, users, modal, setModal, checkedArr, setUsers, loader, setLoader, setUserSuccess, success, setUserData, postsIMG, setUserPostsIMG, divisas, setDivisas, exchange, setExchange, destinatario, setDestinatario, itemSelected, setItemSelected } = useAppContext()
    const { theme, toggleTheme } = useTheme();
    // const [cases, setCases] = useState(initialCases);
    // const [users, setUsers] = useState(initialUsers);
    // const [assignedCases, setAssignedCases] = useState([]);
    const [maximoAsignacion, setMaximoAsignacion] = useState(2);
    const [usuariosConAsignacion, setusuariosConAsignacion] = useState([]);
    const [casosNoAsignados, setCasosNoAsignados] = useState([]);
    const [casosAsignados, setCasosAsignados] = useState([]);
    const [calculate, setCalculate] = useState(false);
    const [type, setType] = useState('');

    const logAssignments = (updatedUsers) => {
        console.log("Assigned cases:");
        updatedUsers.forEach(user => {
            console.log({
                id: user.id,
                idCasosAsignados: user.idCasosAsignados
            });
        });
    };
    const countByItemsLength = (data) => {
        const counts = {};

        data.forEach((obj) => {
            const length = obj.idCasosAsignados.length;
            counts[length] = (counts[length] || 0) + 1;
        });

        return Object.entries(counts).map(([length, count]) => ({
            itemsCount: parseInt(length, 10),
            objectsCount: count,
        }));
    };
    const assignCasesEqually = async () => {
        setCalculate(true)
        setType('Equaly')

        const res = await fetch('https://api.fastcash-mx.com/api/auth/users')
        const data = await res.json()
        const verificadores = data.filter(i => i.tipoDeGrupo === 'Asesor de Verificación')
        const updatedUsers = verificadores.map(user => ({ ...user, idCasosAsignados: [] }));
        const resCases = await fetch('https://api.fastcash-mx.com/api/verification/')
        const dataVerification = await resCases.json()
        const casesVerification = dataVerification.filter(i => i.estadoDeCredito === 'Pendiente')

        let unassignedCases = [...casesVerification];

        updatedUsers.forEach(user => {
            if (unassignedCases.length >= maximoAsignacion) {
                user.idCasosAsignados =
                    unassignedCases
                        .slice(0, maximoAsignacion)
                        .map(caso => caso.numeroDePrestamo)
                unassignedCases = unassignedCases.slice(maximoAsignacion);
            }
        });
        const updatedCases = casesVerification.map(caso => {
            const assignedUser = updatedUsers.find(user => user.idCasosAsignados.includes(caso.numeroDePrestamo));
            return assignedUser ? { ...caso, cuenta: assignedUser.cuenta, nombreDeLaEmpresa: assignedUser.origenDeLaCuenta } : caso;
        });
        setusuariosConAsignacion(updatedUsers)
        setCasosNoAsignados(unassignedCases)
        setCasosAsignados(updatedCases)
    }

    // usuarios, asignaciones
    async function assignCasesTotally() {

        setCalculate(true)
        setType('Totaly')

        const res = await fetch('https://api.fastcash-mx.com/api/auth/users')
        const data = await res.json()
        const verificadores = data.filter(i => i.tipoDeGrupo === 'Asesor de Verificación')
        const usuarios = verificadores.map(user => ({ ...user, idCasosAsignados: [] }));
        const resCases = await fetch('https://api.fastcash-mx.com/api/verification/')
        const dataVerification = await resCases.json()
        const asignaciones = dataVerification.filter(i => i.estadoDeCredito === 'Pendiente')

        let usuarioIndex = 0; // Índice del usuario al que se asignará la siguiente tarea

        // Crear un mapa para rastrear las asignaciones por usuario
        const administracion = usuarios.map(usuario => ({ ...usuario, idCasosAsignados: [] }));

        // Actualizar las asignaciones con idUsuario y registrar en el mapa
        const asignacionesConUsuarios = asignaciones.map(asignacion => {
            const cuenta = usuarios[usuarioIndex].cuenta;
            const nombreDeLaEmpresa = usuarios[usuarioIndex].origenDeLaCuenta;

            // Agregar esta tarea al usuario correspondiente
            const usuario = administracion.find(admin => admin.cuenta === cuenta);
            usuario.idCasosAsignados.push(asignacion.numeroDePrestamo);

            // Avanzar al siguiente usuario (circular)
            usuarioIndex = (usuarioIndex + 1) % usuarios.length;

            // Retornar la asignación actualizada
            return { ...asignacion, cuenta, nombreDeLaEmpresa };
        });
        setusuariosConAsignacion(administracion)
        setCasosAsignados(asignacionesConUsuarios)
        // setCasosNoAsignados(unassignedCases)
        // console.log({ asignacionesConUsuarios, administracion })
    }

    const abortAssignment = () => {
        setMaximoAsignacion(2);
        setusuariosConAsignacion([]);
        setCasosNoAsignados([]);
        setCalculate(false);
    };

    function onChangeHandler(e) {
        // console.log(e.target.value)
        setMaximoAsignacion(e.target.value)
    }
    const saveAccount = async (imgIcon) => {
        try {
            setLoader('Guardando...')
            const response = await fetch(
                window?.location?.href?.includes('localhost')
                    ? 'http://localhost:3000/api/applications/register'
                    : 'https://api.fastcash-mx.com/api/authApk/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ ...data, icon: selectedImage }),
            });
            if (!response.ok) {
                setLoader('')
                setAlerta('Error de datos!')
                throw new Error('Registration failed');
            }
            const result = await response.json();
            setAlerta('Operación exitosa!')
            setModal('')
            setLoader('')
            // navigate('/dashboard');
        } catch (error) {
            setLoader('')
            setAlerta('Error de datos!')
        }
    };




    function saveAsignation() {
        // console.log(casosAsignados)
        console.log(usuariosConAsignacion)
        setLoader('Guardando...')

        casosAsignados.map(async (i) => {
            if (i?.cuenta !== undefined, i?.nombreDeLaEmpresa !== undefined)

                try {
                    const response = await fetch(window?.location?.href?.includes('localhost')
                        ? `http://localhost:3000/api/verification/${i._id}`
                        : `https://api.fastcash-mx.com/api/verification/${i._id}`, {
                        method: "PUT",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            cuentaVerificador: i.cuenta,
                            nombreDeLaEmpresa: i.nombreDeLaEmpresa
                        }), // Datos a enviar en el cuerpo de la petición
                    });
                    if (response.ok) {
                        checkedArr.length && setAlerta('Operación exitosa!')
                        checkedArr.length && setModal('')
                        checkedArr.length && setLoader('')
                        // navigate('/dashboard');
                    } else {
                        setLoader('')
                        setAlerta('Error de datos!')

                        throw new Error(`Error: ${response.status} - ${response.statusText}`);
                    }
                    const result = await response.json(); // Si el servidor devuelve JSON
                    console.log("Actualización exitosa:", result);
                    return result;
                } catch (error) {
                    console.error("Error al realizar la solicitud:", error);
                }


            console.log(
                {
                    cuenta: i.cuenta,
                    nombreDeLaEmpresa: i.nombreDeLaEmpresa
                }
            )
        })
    }
    console.log(checkedArr)
    return (
        <FormLayout>
            <h4>Distrinuir Casos Masivos</h4>



            {!calculate &&
                <div className='flex justify-between w-[100%]'>
                    <label htmlFor="" className={`mr-5 text-[11px] ${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-gray-950`}>
                        Asignacion Igualitaria Cantidad:
                    </label>
                    <input name='cantidadAsignacionIgualitaria' className={`h-[25px] max-w-[173px] w-full px-3 border border-gray-400 rounded-[5px] text-[10px]  ${theme === 'light' ? ' text-gray-950 bg-gray-200' : ' text-white bg-gray-200'} dark:text-gray-950  dark:bg-transparent`} arr={['Opción 1', 'Opción 2']} onChange={onChangeHandler} placeholder='2' uuid='123' label='Filtro 1' position='absolute left-0 top-[25px]' bg={`${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-gray-950`} required />
                </div>
            }
            <div className="mt-4 space-x-2">
                {!calculate && <button
                    className="bg-blue-500 text-white px-2 py-1 text-[10px] rounded hover:bg-blue-600"
                    onClick={assignCasesEqually}
                >
                    Autorizar Asignación Igualitaria
                </button>}
                {!calculate && <button
                    className="bg-green-500 text-white px-2 py-1 text-[10px] rounded hover:bg-green-600"
                    onClick={assignCasesTotally}
                >
                    Asignar Casos Totales
                </button>}
                {type !== 'Totaly'
                    ? <div className=" rounded-[10px] my-5">
                        {usuariosConAsignacion?.filter(i => i?.idCasosAsignados.length * 1 === maximoAsignacion * 1).length !== 0 && <p className="text-[10px] text-green-900 bg-green-200 p-3 mb-3 border-[1px] border-green-900 font-medium rounded-md">
                            {(usuariosConAsignacion?.filter(i => i?.idCasosAsignados.length * 1 === maximoAsignacion * 1)).length} ASESORES SE ASIGNARAN CON {maximoAsignacion} CASOS
                        </p>}
                        {(usuariosConAsignacion?.filter(i => i?.idCasosAsignados.length * 1 !== maximoAsignacion * 1)).length !== 0 && <p className="text-[10px] text-red-900 bg-red-200 p-3 mb-3 border-[1px] border-red-900 font-medium rounded-md">
                            {(usuariosConAsignacion?.filter(i => i?.idCasosAsignados.length * 1 !== maximoAsignacion * 1)).length} ASESORES NO SE ASIGNARAN CON {maximoAsignacion} CASOS
                        </p>}
                        {casosNoAsignados.length !== 0 && <p className="text-[10px] text-red-900 bg-red-200 p-3 mb-3 border-[1px] border-red-900 font-medium rounded-md">
                            {casosNoAsignados.length} CASOS NO ASIGNADOS
                        </p>}
                        {/* {countByItemsLength(usuariosConAsignacion).map((row, index) => (
                            row.itemsCount !== 0 && <p className="text-[10px] pl-5">
                                {row.objectsCount} usuarios tienen {row.itemsCount} casos asignados
                            </p>
                        ))} */}
                    </div>
                    : <div className=" rounded-[10px] my-5 ">
                        {/* {usuariosConAsignacion?.filter(i => i?.idCasosAsignados.length * 1 === maximoAsignacion * 1).length !== 0 && <p className="text-[10px] text-green-900 bg-green-200 p-3 mb-3 border-[1px] border-green-900 font-medium rounded-md">
                            {(usuariosConAsignacion?.filter(i => i?.idCasosAsignados.length * 1 === maximoAsignacion * 1)).length} ASESORES SE ASIGNARAN CON {maximoAsignacion} CASOS
                        </p>}
                        {(usuariosConAsignacion?.filter(i => i?.idCasosAsignados.length * 1 !== maximoAsignacion * 1)).length !== 0 && <p className="text-[10px] text-red-900 bg-red-200 p-3 mb-3 border-[1px] border-red-900 font-medium rounded-md">
                            {(usuariosConAsignacion?.filter(i => i?.idCasosAsignados.length * 1 !== maximoAsignacion * 1)).length} ASESORES NO SE ASIGNARAN CON {maximoAsignacion} CASOS
                        </p>} */}
                        {countByItemsLength(usuariosConAsignacion).map((row, index) => (
                            row.itemsCount === 0
                                ? <p className="text-[10px] text-red-900 bg-red-200 p-3 mb-3 border-[1px] border-red-900 font-medium rounded-md">
                                    {row.objectsCount} usuarios tienen {row.itemsCount} casos asignados
                                </p>
                                : <p className="text-[10px] text-green-900 bg-green-200 p-3 mb-3 border-[1px] border-green-900 font-medium rounded-md">
                                    {row.objectsCount} usuarios tienen {row.itemsCount} casos asignados
                                </p>
                        ))}
                    </div>
                }
                {calculate && <button
                    className="bg-green-500 text-white px-2 py-1 text-[10px] rounded hover:bg-green-600"
                    onClick={saveAsignation}
                >
                    Confirmar guaradr
                </button>}

                {calculate && <button
                    className="bg-red-500 text-white px-2 py-1 text-[10px] rounded hover:bg-red-600"
                    onClick={abortAssignment}
                >
                    Abortar
                </button>}
            </div>

        </FormLayout>)

}