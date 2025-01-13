import React from 'react';
import {rolesMenuResult_set} from '@/constants/appleCash'

// Datos de ejemplo (esto se simula como el objeto rolesMenuResult_set)


// Componente para crear el enlace
const RolesMenu = ({ roles }) => {
  return (
    <div className='bg-white p-12'>
      {Object.entries(roles).map(([key, menuItem]) => {
        // Si el item está oculto, no lo mostramos
        if (menuItem.hide) return null;

        return (
          <div key={key} style={{ margin: '10px 0' }} className='bg-gray-300'>
            <a style={{color: 'green'}} className='relative bg-gray-300 text-green-500' href={"https://m1.prestamomaximo.mx/M1_system/view/main/index.html?time=1731468668303&auditor=M1-fydi01/?v=1731468668303#/" +menuItem.url} target={menuItem.target} >
              {/* Aquí podemos renderizar el icono */}
              <span>{key}</span>
            </a>
          </div>
        );
      })}
    </div>
  );
};
// Estilos (puedes personalizarlos según tu diseño)



const App = () => {
  return (
    <div>
      <h1>Roles Menu</h1>
      <RolesMenu roles={rolesMenuResult_set} />
    </div>
  );
};

export default App;
