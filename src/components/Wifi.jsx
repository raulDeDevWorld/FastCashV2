import React, { useState, useEffect } from 'react';
import { WifiIcon } from '@heroicons/react/24/outline';


const WifiStrength = () => {
    const [wifiStrength, setWifiStrength] = useState('Calculando...');
  
    useEffect(() => {
      const updateWifiStrength = () => {
        const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
        
        if (connection && connection.downlink) {
          const mbps = connection.downlink; // La propiedad downlink ya está en Mbps
          setWifiStrength(`${mbps.toFixed(2)} Mbps (${getWifiLabel(mbps)})`);
        } else {
          setWifiStrength('API no soportada o conexión no disponible');
        }
      };
  
      // Ejecutar al montar el componente
      updateWifiStrength();
  
      // Escuchar cambios en la conexión
      const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
      if (connection) {
        connection.addEventListener('change', updateWifiStrength);
      }
  
      // Limpiar el evento al desmontar
      return () => {
        if (connection) {
          connection.removeEventListener('change', updateWifiStrength);
        }
      };
    }, []);
  
    const getWifiLabel = (mbps) => {
      if (mbps > 5) return 'Excelente';
      if (mbps > 2) return 'Buena';
      return 'Débil';
    };
  
    return (
      <div className="pr-5  rounded-lg text-white flex items-center">
        <WifiIcon className="w-6 h-6 mr-2 stroke-gray-300" />
        <div>
          <p className="text-[12px] text-white">Intensidad del WiFi:{wifiStrength}</p>
        </div>
      </div>
    );
  };
  
  export default WifiStrength;