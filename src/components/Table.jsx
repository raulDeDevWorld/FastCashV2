import React from 'react';

const Table = ({
    user,
    headArray,
    dataArray,
    selectedRight,
    handlerSelected,
    dataFilter,
}) => {
    if (!(user?.rol === 'Admin' || user.rol === 'Super Admin') || item !== 'Casos de Cobranza') {
        return null;
    }

    return (
        <table className="min-w-full shadow">
            <thead className="bg-gray-900 text-[10px] uppercase sticky top-[0px] z-20">
                <tr className="text-white min-w-[2500px]">
                    {headArray.map((i, index) => (
                        <th
                            scope="col"
                            key={index}
                            className={`w-[50px] px-3 py-3 text-white 
                                    ${index < 10
                                    ? (selectedLeft === index
                                        ? 'sticky left-0 z-20 bg-gray-800' : 'bg-gray-900')
                                    : (selectedRight === index ? 'sticky right-0 z-20 bg-gray-800'
                                        : 'bg-gray-900')}`}
                            onClick={() => handlerSelected(index < 10 ? 'LEFT' : 'RIGHT', index)}
                        >
                            {i === "Seleccionar" ? <input type="checkbox" /> : i}
                        </th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {dataArray.map((i, index) =>
                   dataFilter && (
                        <tr key={index} className="text-[12px] border-b">
                            <td className={`px-3 py-2 text-[12px] border-b ${index % 2 === 0 ? 'bg-gray-300' : 'bg-gray-200'} ${selectedLeft === 0 ? 'sticky left-0 z-10' : ''}`}>
                                <div className="flex justify-around items-center">
                                    <a
                                        href={`https://wa.me/${i.whatsapp}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center text-green-500 hover:text-green-600"
                                    >
                                        {/* WhatsApp Icon SVG */}
                                        <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 48 48">
                                            <path fill="#fff" d="M4.868,43.303l2.694-9.835..."></path>
                                        </svg>
                                    </a>
                                    <a
                                        href={`https://t.me/${i.whatsapp}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center text-green-500 hover:text-green-600"
                                    >
                                        {/* Telegram Icon SVG */}
                                        <svg width="19" height="19" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <circle cx="16" cy="16" r="14" fill="url(#paint0_linear_87_7225)" />
                                            <path d="M22.9866 10.2088C23.1112 9.40332 22.3454 8.76755..." fill="white" />
                                            <defs>
                                                <linearGradient id="paint0_linear_87_7225" x1="16" y1="2" x2="16" y2="30">
                                                    <stop stopColor="#37BBFE" />
                                                    <stop offset="1" stopColor="#007DBB" />
                                                </linearGradient>
                                            </defs>
                                        </svg>
                                    </a>
                                </div>
                            </td>
                        </tr>
                    )
                )}
            </tbody>
        </table>
    );
};

export default CasosDeCobranzaTable;
