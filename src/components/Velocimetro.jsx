'use client'
import React, { useEffect, useRef, useState } from 'react';
import * as Highcharts from 'highcharts';
import HighchartsMore from 'highcharts/highcharts-more';
import HighchartsReact from 'highcharts-react-official';
import { useTheme } from '@/context/ThemeContext';





// // import Highcharts from 'highcharts'
// import HighchartsExporting from 'highcharts/modules/exporting'
// // import HighchartsReact from 'highcharts-react-official'

// if (typeof Highcharts === 'object') {
//     HighchartsExporting(Highcharts)
// }




// Importa el módulo de más gráficos para Highcharts
HighchartsMore(Highcharts);

// Configura Highcharts globalmente para desactivar los créditos
Highcharts.setOptions({
  credits: {
    enabled: false
  }
});

const ColoredSpeedometer = () => {
  const chartRef = useRef(null);
  const [speedValue, setSpeedValue] = useState(30);
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    if (chartRef.current) {
      const chart = chartRef.current.chart;

      // Función para ocultar los créditos
      const hideCredits = () => {
        const credits = document.querySelectorAll('.highcharts-credits');
        credits.forEach(credit => {
          credit.style.display = 'none';
        });
      };

      // Llama a hideCredits después de que el gráfico se haya renderizado
      hideCredits();

      const updateValue = () => {
        if (chart.axes) {
          const point = chart.series[0].points[0];
          const inc = Math.round((Math.random() - 0.5) * 10);
          let newVal = point.y + inc;

          if (newVal < 0 || newVal > 100) {
            newVal = point.y - inc;
          }

          point.update(newVal);
          setSpeedValue(newVal);
        }
      };

      const intervalId = setInterval(updateValue, 3000);

      return () => {
        clearInterval(intervalId);
        hideCredits(); // Asegúrate de ocultar los créditos al desmontar el componente
      };
    }
  }, [theme]);

  const options = {
    chart: {
      type: 'gauge',
      plotBackgroundColor: theme !== 'dark'? '#d1d5db': '#1f2937',
      plotBackgroundImage: null,
      plotBorderWidth: 0,
      plotShadow: false,
      height: '100%',
      spacing: [0, 0, 0, 0], // Espaciado: [top, right, bottom, left]

    },

    title: {
      text: null // Elimina el título
    },

    pane: {
      startAngle: -150,
      endAngle: 150,
      background: [
        {
          backgroundColor: Highcharts.color('#4b5563').setOpacity(0.9).get(),
          borderWidth: 0,
          outerRadius: '105%', // Reducido para acercarse al indicador
          innerRadius: '100%', // Reducido para acercarse al indicador
          shape: 'arc',
          borderColor: 'none'
        },
        {
          backgroundColor: Highcharts.color('#4b5563').setOpacity(0.8).get(),
          borderWidth: 0,
          outerRadius: '103%', // Reducido para acercarse al indicador
          innerRadius: '100%', // Reducido para acercarse al indicador
          shape: 'arc',
          borderColor: 'none'
        }
      ],

    },

    yAxis: {
      min: 0,
      max: 100,
      lineColor: theme !== 'dark' ? '#339' : '#0086c9',
      tickColor: theme !== 'dark' ? '#339' : '#0086c9',
      minorTickColor: theme !== 'dark' ? '#339' : '#0086c9',
      offset: -15, // Ajustado para reducir el espacio
      lineWidth: 1,
      tickLength: 5, // Reducido proporcionalmente
      minorTickLength: 4, // Reducido proporcionalmente
      endOnTick: true,
      tickPositions: [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100],
      labels: {
        distance: -15, // Reducido proporcionalmente
        rotation: 'auto',
        style: {
          fontSize: '10px', // Reducido proporcionalmente
          color:  theme !== 'dark' ? '#030712' : '#d1d5db' // Cambia el color a verde

        }
      },
      plotBands: [
        {
          from: 0,
          to: 20,
          color: '#90ed7d'
        },
        {
          from: 20,
          to: 80,
          color: '#0d6d0d'
        },
        {
          from: 80,
          to: 100,
          color: '#ff0000'
        }
      ]
    },

    series: [{
      name: 'Speed',
      data: [speedValue],
      dataLabels: {
        enabled: true,
        format: '<span style="color:#0086c9; border:none">{y} %</span>',
        style: {
          fontSize: '18px', // Reducido proporcionalmente
          color: theme !== 'dark' ? '#0086c9' :'#000000', // Azul para el texto
          textOutline: 'none' // Elimina el contorno del texto
        },
        borderWidth: 0, // Elimina el borde de la caja de datos
        backgroundColor: 'transparent', // Fondo transparente
        align: 'center',
        verticalAlign: 'bottom',
        y: 120 // Reducido proporcionalmente
      },
      tooltip: {
        valueSuffix: ' %'
      },
      dial: {
        backgroundColor:  theme !== 'dark' ? '#000000' :'#0086c9',   // Cambia el color del apuntador (verde)
        baseWidth: 1,                // Ancho de la base del apuntador
        topWidth: .01,                  // Ancho del extremo del apuntador
        radius: '60%',                // Longitud del apuntador
        borderColor: theme !== 'dark' ? '#000000' :'#0086c9',       // Color del borde del apuntador
        borderWidth: 2                // Ancho del borde del apuntador
      }
    }],

  };

  return (
    <div style={{ width: 210, height: 210, margin: '0 auto' }}> {/* Reducido en un 30% */}
      <HighchartsReact
        highcharts={Highcharts}
        options={options}
        ref={chartRef}
        containerProps={{
          style: {
            borderRadius: '8px', // Opcional, para bordes redondeados
            padding: '#000000',
            background:'transparent'
            
          }
        }}
      />
    </div>
  );
};

export default ColoredSpeedometer;






// import React, { useEffect, useRef, useState } from 'react';
// import Highcharts from 'highcharts';
// import HighchartsMore from 'highcharts/highcharts-more';
// import HighchartsReact from 'highcharts-react-official';

// // Importa el módulo de más gráficos para Highcharts
// HighchartsMore(Highcharts);

// // Configura Highcharts globalmente para desactivar los créditos
// Highcharts.setOptions({
//   credits: {
//     enabled: false
//   }
// });

// const ColoredSpeedometer = () => {
//   const chartRef = useRef(null);
//   const [speedValue, setSpeedValue] = useState(30);

//   useEffect(() => {
//     if (chartRef.current) {
//       const chart = chartRef.current.chart;

//       // Función para ocultar los créditos
//       const hideCredits = () => {
//         const credits = document.querySelectorAll('.highcharts-credits');
//         credits.forEach(credit => {
//           credit.style.display = 'none';
//         });
//       };

//       // Llama a hideCredits después de que el gráfico se haya renderizado
//       hideCredits();

//       const updateValue = () => {
//         if (chart.axes) {
//           const point = chart.series[0].points[0];
//           const inc = Math.round((Math.random() - 0.5) * 10);
//           let newVal = point.y + inc;

//           if (newVal < 0 || newVal > 100) {
//             newVal = point.y - inc;
//           }

//           point.update(newVal);
//           setSpeedValue(newVal);
//         }
//       };

//       const intervalId = setInterval(updateValue, 3000);

//       return () => {
//         clearInterval(intervalId);
//         hideCredits(); // Asegúrate de ocultar los créditos al desmontar el componente
//       };
//     }
//   }, []);

//   const options = {
//     chart: {
//       type: 'gauge',
//       plotBackgroundColor: null,
//       plotBackgroundImage: null,
//       plotBorderWidth: 0,
//       plotShadow: false,
//       height: '100%',
//     },

//     title: {
//       text: null // Elimina el título
//     },

//     pane: {
//       startAngle: -150,
//       endAngle: 150,
//       background: [
//         {
//           backgroundColor: Highcharts.color('#90ed7d').setOpacity(0.3).get(),
//           borderWidth: 0,
//           outerRadius: '109%', // Ajustado proporcionalmente
//           innerRadius: '100%', // Ajustado proporcionalmente
//           shape: 'arc',
//           borderColor: 'none'
//         },
//         {
//           backgroundColor: Highcharts.color('#7cb5ec').setOpacity(0.3).get(),
//           borderWidth: 0,
//           outerRadius: '107%', // Ajustado proporcionalmente
//           innerRadius: '100%', // Ajustado proporcionalmente
//           shape: 'arc',
//           borderColor: 'none'
//         }
//       ]
//     },

//     yAxis: {
//       min: 0,
//       max: 100,
//       lineColor: '#339',
//       tickColor: '#339',
//       minorTickColor: '#339',
//       offset: -25,
//       lineWidth: 2,
//       tickLength: 4, // Reducido proporcionalmente
//       minorTickLength: 4, // Reducido proporcionalmente
//       endOnTick: false,
//       tickPositions: [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100],
//       labels: {
//         distance: -15, // Reducido proporcionalmente
//         rotation: 'auto',
//         style: {
//           fontSize: '10px' // Reducido proporcionalmente
//         }
//       },
//       plotBands: [
//         {
//           from: 0,
//           to: 20,
//           color: '#90ed7d'
//         },
//         {
//           from: 20,
//           to: 80,
//           color: '#0d6d0d'
//         },
//         {
//           from: 80,
//           to: 100,
//           color: '#ff0000'
//         }
//       ]
//     },

//     series: [{
//       name: 'Speed',
//       data: [speedValue],
//       dataLabels: {
//         enabled: true,
//         format: '<span style="color:#339">{y} km/h</span>',
//         style: {
//           fontSize: '11px', // Reducido proporcionalmente
//           color: '#339'
//         },
//         align: 'center',
//         verticalAlign: 'bottom',
//         y: 15 // Reducido proporcionalmente
//       },
//       tooltip: {
//         valueSuffix: ' km/h'
//       }
//     }]
//   };

//   return (
//     <div style={{ width: 210, height: 210, margin: '0 auto' }}> {/* Reducido en un 30% */}
//       <HighchartsReact
//         highcharts={Highcharts}
//         options={options}
//         ref={chartRef}
//       />
//     </div>
//   );
// };

// export default ColoredSpeedometer;





// import React, { useEffect, useRef, useState } from 'react';
// import Highcharts from 'highcharts';
// import HighchartsMore from 'highcharts/highcharts-more';
// import HighchartsReact from 'highcharts-react-official';

// // Importa el módulo de más gráficos para Highcharts
// HighchartsMore(Highcharts);

// // Configura Highcharts globalmente para desactivar los créditos
// Highcharts.setOptions({
//   credits: {
//     enabled: false
//   }
// });

// const ColoredSpeedometer = () => {
//   const chartRef = useRef(null);
//   const [speedValue, setSpeedValue] = useState(30);

//   useEffect(() => {
//     if (chartRef.current) {
//       const chart = chartRef.current.chart;

//       // Función para ocultar los créditos
//       const hideCredits = () => {
//         const credits = document.querySelectorAll('.highcharts-credits');
//         credits.forEach(credit => {
//           credit.style.display = 'none';
//         });
//       };

//       // Llama a hideCredits después de que el gráfico se haya renderizado
//       hideCredits();

//       const updateValue = () => {
//         if (chart.axes) {
//           const point = chart.series[0].points[0];
//           const inc = Math.round((Math.random() - 0.5) * 10);
//           let newVal = point.y + inc;

//           if (newVal < 0 || newVal > 100) {
//             newVal = point.y - inc;
//           }

//           point.update(newVal);
//           setSpeedValue(newVal);
//         }
//       };

//       const intervalId = setInterval(updateValue, 3000);

//       return () => {
//         clearInterval(intervalId);
//         hideCredits(); // Asegúrate de ocultar los créditos al desmontar el componente
//       };
//     }
//   }, []);

//   const options = {
//     chart: {
//       type: 'gauge',
//       plotBackgroundColor: null,
//       plotBackgroundImage: null,
//       plotBorderWidth: 0,
//       plotShadow: false,
//       height: '100%',
//     },

//     title: {
//       text: null // Elimina el título
//     },

//     pane: {
//       startAngle: -150,
//       endAngle: 150,
//       background: [
//         {
//           backgroundColor: Highcharts.color('#90ed7d').setOpacity(0.3).get(),
//           borderWidth: 0,
//           outerRadius: '109%',
//           innerRadius: '100%',
//           shape: 'arc',
//           borderColor: 'none'
//         },
//         {
//           backgroundColor: Highcharts.color('#7cb5ec').setOpacity(0.3).get(),
//           borderWidth: 0,
//           outerRadius: '107%',
//           innerRadius: '100%',
//           shape: 'arc',
//           borderColor: 'none'
//         }
//       ]
//     },

//     yAxis: {
//       min: 0,
//       max: 100,
//       lineColor: '#339',
//       tickColor: '#339',
//       minorTickColor: '#339',
//       offset: -25,
//       lineWidth: 2,
//       tickLength: 5,
//       minorTickLength: 5,
//       endOnTick: false,
//       tickPositions: [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100],
//       labels: {
//         distance: -20,
//         rotation: 'auto'
//       },
//       plotBands: [
//         {
//           from: 0,
//           to: 20,
//           color: '#90ed7d'
//         },
//         {
//           from: 20,
//           to: 80,
//           color: '#0d6d0d'
//         },
//         {
//           from: 80,
//           to: 100,
//           color: '#ff0000'
//         }
//       ]
//     },

//     series: [{
//       name: 'Speed',
//       data: [speedValue],
//       dataLabels: {
//         enabled: true,
//         format: '<span style="color:#339">{y} km/h</span>',
//         style: {
//           fontSize: '16px',
//           color: '#339'
//         },
//         align: 'center',
//         verticalAlign: 'bottom',
//         y: 20
//       },
//       tooltip: {
//         valueSuffix: ' km/h'
//       }
//     }]
//   };

//   return (
//     <div style={{ width: 300, height: 300, margin: '0 auto' }}>
//       <HighchartsReact
//         highcharts={Highcharts}
//         options={options}
//         ref={chartRef}
//       />
//     </div>
//   );
// };

// export default ColoredSpeedometer;




// import React, { useEffect, useRef, useState } from 'react';
// import Highcharts from 'highcharts';
// import HighchartsMore from 'highcharts/highcharts-more';
// import HighchartsReact from 'highcharts-react-official';

// // Importa el módulo de más gráficos para Highcharts
// HighchartsMore(Highcharts);

// const ColoredSpeedometer = () => {
//   const chartRef = useRef(null);
//   const [speedValue, setSpeedValue] = useState(30);

//   useEffect(() => {
//     if (chartRef.current) {
//       const chart = chartRef.current.chart;

//       const updateValue = () => {
//         if (chart.axes) {
//           const point = chart.series[0].points[0];
//           const inc = Math.round((Math.random() - 0.5) * 10);
//           let newVal = point.y + inc;

//           if (newVal < 0 || newVal > 100) {
//             newVal = point.y - inc;
//           }

//           point.update(newVal);
//           setSpeedValue(newVal);
//         }
//       };

//       const intervalId = setInterval(updateValue, 3000);

//       return () => clearInterval(intervalId);
//     }
//   }, []);

//   const options = {
//     chart: {
//       type: 'gauge',
//       plotBackgroundColor: null,
//       plotBackgroundImage: null,
//       plotBorderWidth: 0,
//       plotShadow: false,
//       height: '100%',
//       credits: {
//         enabled: false // Desactiva el texto de créditos
//       }
//     },

//     title: {
//       text: null // Elimina el título
//     },

//     pane: {
//       startAngle: -150,
//       endAngle: 150,
//       background: [
//         {
//           backgroundColor: Highcharts.color('#90ed7d').setOpacity(0.3).get(),
//           borderWidth: 0,
//           outerRadius: '109%',
//           innerRadius: '100%',
//           shape: 'arc',
//           borderColor: 'none'
//         },
//         {
//           backgroundColor: Highcharts.color('#7cb5ec').setOpacity(0.3).get(),
//           borderWidth: 0,
//           outerRadius: '107%',
//           innerRadius: '100%',
//           shape: 'arc',
//           borderColor: 'none'
//         }
//       ]
//     },

//     yAxis: {
//       min: 0,
//       max: 100,
//       lineColor: '#339',
//       tickColor: '#339',
//       minorTickColor: '#339',
//       offset: -25,
//       lineWidth: 2,
//       tickLength: 5,
//       minorTickLength: 5,
//       endOnTick: false,
//       tickPositions: [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100],
//       labels: {
//         distance: -20,
//         rotation: 'auto'
//       },
//       plotBands: [
//         {
//           from: 0,
//           to: 20,
//           color: '#90ed7d'
//         },
//         {
//           from: 20,
//           to: 80,
//           color: '#0d6d0d'
//         },
//         {
//           from: 80,
//           to: 100,
//           color: '#ff0000'
//         }
//       ]
//     },

//     series: [{
//       name: 'Speed',
//       data: [speedValue],
//       dataLabels: {
//         enabled: true,
//         format: '<span style="color:#339">{y} km/h</span>',
//         style: {
//           fontSize: '16px',
//           color: '#339'
//         },
//         align: 'center',
//         verticalAlign: 'bottom',
//         y: 10
//       },
//       tooltip: {
//         valueSuffix: ' km/h'
//       }
//     }]
//   };

//   return (
//     <div style={{ width: 300, height: 300, margin: '0 auto' }}>
//       <HighchartsReact
//         highcharts={Highcharts}
//         options={options}
//         ref={chartRef}
//       />
//     </div>
//   );
// };

// export default ColoredSpeedometer;


// import React, { useEffect, useRef, useState } from 'react';
// import Highcharts from 'highcharts';
// import HighchartsMore from 'highcharts/highcharts-more';
// import HighchartsReact from 'highcharts-react-official';

// // Importa el módulo de más gráficos para Highcharts
// HighchartsMore(Highcharts);

// const ColoredSpeedometer = () => {
//   const chartRef = useRef(null);
//   const [speedValue, setSpeedValue] = useState(30);

//   useEffect(() => {
//     if (chartRef.current) {
//       const chart = chartRef.current.chart;

//       const updateValue = () => {
//         if (chart.axes) {
//           const point = chart.series[0].points[0];
//           const inc = Math.round((Math.random() - 0.5) * 10);
//           let newVal = point.y + inc;

//           if (newVal < 0 || newVal > 100) {
//             newVal = point.y - inc;
//           }

//           point.update(newVal);
//           setSpeedValue(newVal);
//         }
//       };

//       const intervalId = setInterval(updateValue, 3000);

//       return () => clearInterval(intervalId);
//     }
//   }, []);

//   const options = {
//     chart: {
//       type: 'gauge',
//       plotBackgroundColor: null,
//       plotBackgroundImage: null,
//       plotBorderWidth: 0,
//       plotShadow: false,
//       height: '100%', // Asegura que el gráfico ocupe el 100% del contenedor
//     },

//     title: {
//       text: null // Elimina el título
//     },

//     pane: {
//       startAngle: -150,
//       endAngle: 150,
//       background: [
//         {
//           backgroundColor: Highcharts.color('#90ed7d').setOpacity(0.3).get(),
//           borderWidth: 0,
//           outerRadius: '109%',
//           innerRadius: '100%',
//           shape: 'arc',
//           borderColor: 'none'
//         },
//         {
//           backgroundColor: Highcharts.color('#7cb5ec').setOpacity(0.3).get(),
//           borderWidth: 0,
//           outerRadius: '107%',
//           innerRadius: '100%',
//           shape: 'arc',
//           borderColor: 'none'
//         }
//       ]
//     },

//     yAxis: {
//       min: 0,
//       max: 100,
//       lineColor: '#339',
//       tickColor: '#339',
//       minorTickColor: '#339',
//       offset: -25,
//       lineWidth: 2,
//       tickLength: 5,
//       minorTickLength: 5,
//       endOnTick: false,
//       tickPositions: [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100],
//       labels: {
//         distance: -20,
//         rotation: 'auto'
//       },
//       plotBands: [
//         {
//           from: 0,
//           to: 20,
//           color: '#90ed7d'
//         },
//         {
//           from: 20,
//           to: 80,
//           color: '#0d6d0d'
//         },
//         {
//           from: 80,
//           to: 100,
//           color: '#ff0000'
//         }
//       ]
//     },

//     series: [{
//       name: 'Speed',
//       data: [speedValue],
//       dataLabels: {
//         enabled: true,
//         format: '<span style="color:#339">{y} km/h</span>',
//         style: {
//           fontSize: '16px',
//           color: '#339'
//         },
//         align: 'center',
//         verticalAlign: 'bottom',
//         y: 10
//       },
//       tooltip: {
//         valueSuffix: ' km/h'
//       }
//     }]
//   };

//   return (
//     <div style={{ width: 300, height: 300, margin: '0 auto' }}>
//       <HighchartsReact
//         highcharts={Highcharts}
//         options={options}
//         ref={chartRef}
//       />
//     </div>
//   );
// };

// export default ColoredSpeedometer;


// import React, { useEffect, useRef, useState } from 'react';
// import Highcharts from 'highcharts';
// import HighchartsMore from 'highcharts/highcharts-more';
// import HighchartsReact from 'highcharts-react-official';

// // Importa el módulo de más gráficos para Highcharts
// HighchartsMore(Highcharts);

// const ColoredSpeedometer = () => {
//   const chartRef = useRef(null);
//   const [speedValue, setSpeedValue] = useState(30); // Estado para almacenar el valor del velocímetro

//   useEffect(() => {
//     if (chartRef.current) {
//       const chart = chartRef.current.chart;

//       const updateValue = () => {
//         if (chart.axes) { // Asegúrate de que el gráfico no esté destruido
//           const point = chart.series[0].points[0];
//           const inc = Math.round((Math.random() - 0.5) * 10); // Ajusta el incremento
//           let newVal = point.y + inc;

//           if (newVal < 0 || newVal > 100) {
//             newVal = point.y - inc;
//           }

//           point.update(newVal);
//           setSpeedValue(newVal); // Actualiza el valor en el estado
//         }
//       };

//       const intervalId = setInterval(updateValue, 3000);

//       return () => clearInterval(intervalId); // Limpia el intervalo cuando el componente se desmonte
//     }
//   }, []);

//   const options = {
//     chart: {
//       type: 'gauge',
//       plotBackgroundColor: null,
//       plotBackgroundImage: null,
//       plotBorderWidth: 0,
//       plotShadow: false,
//       height: '100%', // Asegura que el gráfico ocupe el 100% del contenedor
//     },

//     title: {
//       text: 'Colored Speedometer'
//     },

//     pane: {
//       startAngle: -150,
//       endAngle: 150,
//       background: [
//         {
//           backgroundColor: Highcharts.color('#90ed7d').setOpacity(0.3).get(),
//           borderWidth: 0,
//           outerRadius: '109%',
//           innerRadius: '100%',
//           shape: 'arc',
//           borderColor: 'none'
//         },
//         {
//           backgroundColor: Highcharts.color('#7cb5ec').setOpacity(0.3).get(),
//           borderWidth: 0,
//           outerRadius: '107%',
//           innerRadius: '100%',
//           shape: 'arc',
//           borderColor: 'none'
//         }
//       ]
//     },

//     yAxis: {
//       min: 0,
//       max: 100,
//       lineColor: '#339',
//       tickColor: '#339',
//       minorTickColor: '#339',
//       offset: -25,
//       lineWidth: 2,
//       tickLength: 5,
//       minorTickLength: 5,
//       endOnTick: false,
//       tickPositions: [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100], // Intervalos de 10
//       labels: {
//         distance: -20,
//         rotation: 'auto'
//       },
//       plotBands: [{ // Sección verde claro
//         from: 0,
//         to: 20,
//         color: '#90ed7d'
//       }, {
//         // Sección verde oscuro
//         from: 20,
//         to: 80,
//         color: '#0d6d0d'
//       }, {
//         // Sección roja
//         from: 80,
//         to: 100,
//         color: '#ff0000'
//       }]
//     },

//     series: [{
//       name: 'Speed',
//       data: [speedValue], // Usa el valor del estado
//       dataLabels: {
//         enabled: true,
//         format: '<span style="color:#339">{y} km/h</span>',
//         style: {
//           fontSize: '16px',
//           color: '#339'
//         },
//         align: 'center', // Centra el texto horizontalmente
//         verticalAlign: 'bottom', // Alinea el texto al fondo del gráfico
//         y: 10 // Ajusta la posición vertical para un mejor ajuste
//       },
//       tooltip: {
//         valueSuffix: ' km/h'
//       }
//     }]
//   };

//   return (
//     <div style={{ width: 300, height: 300, margin: '0 auto' }}>
//       <HighchartsReact
//         highcharts={Highcharts}
//         options={options}
//         ref={chartRef}
//       />
//     </div>
//   );
// };

// export default ColoredSpeedometer;




// import React, { useEffect, useRef, useState } from 'react';
// import Highcharts from 'highcharts';
// import HighchartsMore from 'highcharts/highcharts-more';
// import HighchartsReact from 'highcharts-react-official';

// // Importa el módulo de más gráficos para Highcharts
// HighchartsMore(Highcharts);

// const ColoredSpeedometer = () => {
//   const chartRef = useRef(null);
//   const [speedValue, setSpeedValue] = useState(30); // Estado para almacenar el valor del velocímetro

//   useEffect(() => {
//     if (chartRef.current) {
//       const chart = chartRef.current.chart;

//       const updateValue = () => {
//         if (chart.axes) { // Asegúrate de que el gráfico no esté destruido
//           const point = chart.series[0].points[0];
//           const inc = Math.round((Math.random() - 0.5) * 10); // Ajusta el incremento
//           let newVal = point.y + inc;

//           if (newVal < 0 || newVal > 100) {
//             newVal = point.y - inc;
//           }

//           point.update(newVal);
//           setSpeedValue(newVal); // Actualiza el valor en el estado
//         }
//       };

//       const intervalId = setInterval(updateValue, 3000);

//       return () => clearInterval(intervalId); // Limpia el intervalo cuando el componente se desmonte
//     }
//   }, []);

//   const options = {
//     chart: {
//       type: 'gauge',
//       plotBackgroundColor: null,
//       plotBackgroundImage: null,
//       plotBorderWidth: 0,
//       plotShadow: false
//     },

//     title: {
//       text: ''
//     },

//     pane: {
//       startAngle: -150,
//       endAngle: 150,
//       background: [
//         {
//           backgroundColor: Highcharts.color('#90ed7d').setOpacity(0.3).get(),
//           borderWidth: 0,
//           outerRadius: '109%',
//           innerRadius: '100%',
//           shape: 'arc',
//           borderColor: 'none'
//         },
//         {
//           backgroundColor: Highcharts.color('#7cb5ec').setOpacity(0.3).get(),
//           borderWidth: 0,
//           outerRadius: '107%',
//           innerRadius: '100%',
//           shape: 'arc',
//           borderColor: 'none'
//         }
//       ]
//     },

//     yAxis: {
//       min: 0,
//       max: 100,
//       lineColor: '#339',
//       tickColor: '#339',
//       minorTickColor: '#339',
//       offset: -25,
//       lineWidth: 2,
//       tickLength: 5,
//       minorTickLength: 5,
//       endOnTick: false,
//       tickPositions: [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100], // Intervalos de 10
//       labels: {
//         distance: -20,
//         rotation: 'auto'
//       },
//       plotBands: [{ // Sección verde claro
//         from: 0,
//         to: 20,
//         color: '#90ed7d'
//       }, {
//         // Sección verde oscuro
//         from: 20,
//         to: 80,
//         color: '#0d6d0d'
//       }, {
//         // Sección roja
//         from: 80,
//         to: 100,
//         color: '#ff0000'
//       }]
//     },

//     series: [{
//       name: 'Speed',
//       data: [speedValue], // Usa el valor del estado
//       dataLabels: {
//         enabled: true,
//         format: '<span style="color:#339">{y} km/h</span>',
//         style: {
//           fontSize: '16px',
//           color: '#339'
//         },
//         align: 'center', // Centra el texto horizontalmente
//         verticalAlign: 'bottom', // Alinea el texto al fondo del gráfico
//         y: 10 // Ajusta la posición vertical para un mejor ajuste
//       },
//       tooltip: {
//         valueSuffix: ' km/h'
//       }
//     }]
//   };

//   return (
//     <div className='overflow-hidden pb-12' style={{ width: 300, height: 300, margin: '0 auto' }}>
//       <HighchartsReact
//         highcharts={Highcharts}
//         options={options}
//         ref={chartRef}
//       />
//       {/* Muestra el valor capturado en otro lugar */}
//       <div  style={{ textAlign: 'center', marginTop: '20px' }}>
//         <strong>Valor del velocímetro: {speedValue} km/h</strong>
//       </div>
//     </div>
//   );
// };

// export default ColoredSpeedometer;



// import React, { useEffect, useRef, useState } from 'react';
// import Highcharts from 'highcharts';
// import HighchartsMore from 'highcharts/highcharts-more';
// import HighchartsReact from 'highcharts-react-official';

// // Importa el módulo de más gráficos para Highcharts
// HighchartsMore(Highcharts);

// const ColoredSpeedometer = () => {
//   const chartRef = useRef(null);
//   const [speedValue, setSpeedValue] = useState(30); // Estado para almacenar el valor del velocímetro

//   useEffect(() => {
//     if (chartRef.current) {
//       const chart = chartRef.current.chart;

//       const updateValue = () => {
//         if (chart.axes) { // Asegúrate de que el gráfico no esté destruido
//           const point = chart.series[0].points[0];
//           const inc = Math.round((Math.random() - 0.5) * 10); // Ajusta el incremento
//           let newVal = point.y + inc;

//           if (newVal < 0 || newVal > 100) {
//             newVal = point.y - inc;
//           }

//           point.update(newVal);
//           setSpeedValue(newVal); // Actualiza el valor en el estado
//         }
//       };

//       const intervalId = setInterval(updateValue, 3000);

//       return () => clearInterval(intervalId); // Limpia el intervalo cuando el componente se desmonte
//     }
//   }, []);

//   const options = {
//     chart: {
//       type: 'gauge',
//       plotBackgroundColor: null,
//       plotBackgroundImage: null,
//       plotBorderWidth: 0,
//       plotShadow: false
//     },

//     title: {
//       text: 'Colored Speedometer'
//     },

//     pane: {
//       startAngle: -150,
//       endAngle: 150,
//       background: [
//         {
//           backgroundColor: Highcharts.color('#90ed7d').setOpacity(0.3).get(),
//           borderWidth: 0,
//           outerRadius: '109%',
//           innerRadius: '100%',
//           shape: 'arc',
//           borderColor: 'none'
//         },
//         {
//           backgroundColor: Highcharts.color('#7cb5ec').setOpacity(0.3).get(),
//           borderWidth: 0,
//           outerRadius: '107%',
//           innerRadius: '100%',
//           shape: 'arc',
//           borderColor: 'none'
//         }
//       ]
//     },

//     yAxis: {
//       min: 0,
//       max: 100,
//       lineColor: '#339',
//       tickColor: '#339',
//       minorTickColor: '#339',
//       offset: -25,
//       lineWidth: 2,
//       tickLength: 5,
//       minorTickLength: 5,
//       endOnTick: false,
//       tickPositions: [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100], // Intervalos de 10
//       labels: {
//         distance: -20,
//         rotation: 'auto'
//       },
//       plotBands: [{ // Sección verde claro
//         from: 0,
//         to: 20,
//         color: '#90ed7d'
//       }, {
//         // Sección verde oscuro
//         from: 20,
//         to: 80,
//         color: '#0d6d0d'
//       }, {
//         // Sección roja
//         from: 80,
//         to: 100,
//         color: '#ff0000'
//       }]
//     },

//     series: [{
//       name: 'Speed',
//       data: [speedValue], // Usa el valor del estado
//       dataLabels: {
//         enabled: true,
//         format: '<span style="color:#339">{y} km/h</span>',
//         style: {
//           fontSize: '16px',
//           color: '#339'
//         },
//         align: 'center', // Centra el texto horizontalmente
//         verticalAlign: 'bottom', // Alinea el texto al fondo del gráfico
//         y: 80 // Ajusta la posición vertical para un mejor ajuste
//       },
//       tooltip: {
//         valueSuffix: ' km/h'
//       }
//     }]
//   };

//   return (
//     <div style={{ width: 300, height: 300, margin: '0 auto' }}>
//       <HighchartsReact
//         highcharts={Highcharts}
//         options={options}
//         ref={chartRef}
//       />
//       {/* Muestra el valor capturado en otro lugar */}
//       <div className='absolute' >
//         <strong>Valor del velocímetro: {speedValue} km/h</strong>
//       </div>
//     </div>
//   );
// };

// export default ColoredSpeedometer;



// import React, { useEffect, useRef } from 'react';
// import Highcharts from 'highcharts';
// import HighchartsMore from 'highcharts/highcharts-more';
// import HighchartsReact from 'highcharts-react-official';

// // Importa el módulo de más gráficos para Highcharts
// HighchartsMore(Highcharts);

// const ColoredSpeedometer = () => {
//   const chartRef = useRef(null);

//   useEffect(() => {
//     if (chartRef.current) {
//       const chart = chartRef.current.chart;

//       const updateValue = () => {
//         if (chart.axes) { // Asegúrate de que el gráfico no esté destruido
//           const point = chart.series[0].points[0];
//           const inc = Math.round((Math.random() - 0.5) * 10); // Ajusta el incremento
//           let newVal = point.y + inc;

//           if (newVal < 0 || newVal > 100) {
//             newVal = point.y - inc;
//           }

//           point.update(newVal);
//         }
//       };

//       const intervalId = setInterval(updateValue, 3000);

//       return () => clearInterval(intervalId); // Limpia el intervalo cuando el componente se desmonte
//     }
//   }, []);

//   const options = {
//     chart: {
//       type: 'gauge',
//       plotBackgroundColor: null,
//       plotBackgroundImage: null,
//       plotBorderWidth: 0,
//       plotShadow: false
//     },

//     title: {
//       text: 'Colored Speedometer'
//     },

//     pane: {
//       startAngle: -150,
//       endAngle: 150,
//       background: [
//         {
//           backgroundColor: Highcharts.color('#90ed7d').setOpacity(0.3).get(),
//           borderWidth: 0,
//           outerRadius: '109%',
//           innerRadius: '100%',
//           shape: 'arc',
//           borderColor: 'none'
//         },
//         {
//           backgroundColor: Highcharts.color('#7cb5ec').setOpacity(0.3).get(),
//           borderWidth: 0,
//           outerRadius: '107%',
//           innerRadius: '100%',
//           shape: 'arc',
//           borderColor: 'none'
//         }
//       ]
//     },

//     yAxis: {
//       min: 0,
//       max: 100,
//       lineColor: '#339',
//       tickColor: '#339',
//       minorTickColor: '#339',
//       offset: -25,
//       lineWidth: 2,
//       tickLength: 5,
//       minorTickLength: 5,
//       endOnTick: false,
//       tickPositions: [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100], // Intervalos de 10
//       labels: {
//         distance: -20,
//         rotation: 'auto'
//       },
//       plotBands: [{ // Sección verde claro
//         from: 0,
//         to: 20,
//         color: '#90ed7d'
//       }, {
//         // Sección verde oscuro
//         from: 20,
//         to: 80,
//         color: '#0d6d0d'
//       }, {
//         // Sección roja
//         from: 80,
//         to: 100,
//         color: '#ff0000'
//       }]
//     },

//     series: [{
//       name: 'Speed',
//       data: [30], // Valor inicial ajustado
//       dataLabels: {
//         enabled: true,
//         format: '<span style="color:#339">{y} km/h</span>',
//         style: {
//           fontSize: '16px',
//           color: '#339'
//         },
//         align: 'center', // Centra el texto horizontalmente
//         verticalAlign: 'bottom', // Alinea el texto al fondo del gráfico
//         y: 80 // Ajusta la posición vertical para un mejor ajuste
//       },
//       tooltip: {
//         valueSuffix: ' km/h'
//       }
//     }]
//   };

//   return (
//     <div style={{ minWidth: 310, maxWidth: 400, height: 300, margin: '0 auto' }}>
//       <HighchartsReact
//         highcharts={Highcharts}
//         options={options}
//         ref={chartRef}
//       />
//     </div>
//   );
// };

// export default ColoredSpeedometer;




// import React, { useEffect, useRef } from 'react';
// import Highcharts from 'highcharts';
// import HighchartsMore from 'highcharts/highcharts-more';
// import HighchartsReact from 'highcharts-react-official';

// // Importa el módulo de más gráficos para Highcharts
// HighchartsMore(Highcharts);

// const ColoredSpeedometer = () => {
//   const chartRef = useRef(null);

//   useEffect(() => {
//     if (chartRef.current) {
//       const chart = chartRef.current.chart;

//       const updateValue = () => {
//         if (chart.axes) { // Asegúrate de que el gráfico no esté destruido
//           const point = chart.series[0].points[0];
//           const inc = Math.round((Math.random() - 0.5) * 10); // Ajusta el incremento
//           let newVal = point.y + inc;

//           if (newVal < 0 || newVal > 100) {
//             newVal = point.y - inc;
//           }

//           point.update(newVal);
//         }
//       };

//       const intervalId = setInterval(updateValue, 3000);

//       return () => clearInterval(intervalId); // Limpia el intervalo cuando el componente se desmonte
//     }
//   }, []);

//   const options = {
//     chart: {
//       type: 'gauge',
//       plotBackgroundColor: null,
//       plotBackgroundImage: null,
//       plotBorderWidth: 0,
//       plotShadow: false
//     },

//     title: {
//       text: 'Colored Speedometer'
//     },

//     pane: {
//       startAngle: -150,
//       endAngle: 150,
//       background: [
//         {
//           backgroundColor: Highcharts.color('#90ed7d').setOpacity(0.3).get(),
//           borderWidth: 0,
//           outerRadius: '109%',
//           innerRadius: '100%',
//           shape: 'arc',
//           borderColor: 'none'
//         },
//         {
//           backgroundColor: Highcharts.color('#7cb5ec').setOpacity(0.3).get(),
//           borderWidth: 0,
//           outerRadius: '107%',
//           innerRadius: '100%',
//           shape: 'arc',
//           borderColor: 'none'
//         }
//       ]
//     },

//     yAxis: {
//       min: 0,
//       max: 100,
//       lineColor: '#339',
//       tickColor: '#339',
//       minorTickColor: '#339',
//       offset: -25,
//       lineWidth: 2,
//       tickLength: 5,
//       minorTickLength: 5,
//       endOnTick: false,
//       tickPositions: [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100], // Intervalos de 10
//       labels: {
//         distance: -20,
//         rotation: 'auto'
//       },
//       plotBands: [{ // Sección verde claro
//         from: 0,
//         to: 20,
//         color: '#90ed7d'
//       }, {
//         // Sección verde oscuro
//         from: 20,
//         to: 80,
//         color: '#0d6d0d'
//       }, {
//         // Sección roja
//         from: 80,
//         to: 100,
//         color: '#ff0000'
//       }]
//     },

//     series: [{
//       name: 'Speed',
//       data: [30], // Valor inicial ajustado
//       dataLabels: {
//         enabled: true,
//         format: '<span style="absolute; color:#339; bottom:0">{y} %</span>',
//         style: {
//           fontSize: '20px',
//           color: '#339'
//         },
//         verticalAlign: 'bottom', // Alinea el texto al fondo
//         y: 60 // Ajusta la posición vertical desde el borde inferior
//       },
//       tooltip: {
//         valueSuffix: ' %'
//       }
//     }]
//   };

//   return (
//     <div style={{ minWidth: 310, maxWidth: 400, height: 300, margin: '0 auto' }}>
//       <HighchartsReact
//         highcharts={Highcharts}
//         options={options}
//         ref={chartRef}
//       />
//     </div>
//   );
// };

// export default ColoredSpeedometer;



// import React, { useEffect, useRef } from 'react';
// import Highcharts from 'highcharts';
// import HighchartsMore from 'highcharts/highcharts-more';
// import HighchartsReact from 'highcharts-react-official';

// // Importa el módulo de más gráficos para Highcharts
// HighchartsMore(Highcharts);

// const ColoredSpeedometer = () => {
//   const chartRef = useRef(null);

//   useEffect(() => {
//     if (chartRef.current) {
//       const chart = chartRef.current.chart;

//       const updateValue = () => {
//         if (chart.axes) { // Asegúrate de que el gráfico no esté destruido
//           const point = chart.series[0].points[0];
//           const inc = Math.round((Math.random() - 0.5) * 10);
//           let newVal = point.y + inc;

//           if (newVal < 0 || newVal > 100) {
//             newVal = point.y - inc;
//           }

//           point.update(newVal);
//         }
//       };

//       const intervalId = setInterval(updateValue, 3000);

//       return () => clearInterval(intervalId); // Limpia el intervalo cuando el componente se desmonte
//     }
//   }, []);

//   const options = {
//     chart: {
//       type: 'gauge',
//       plotBackgroundColor: null,
//       plotBackgroundImage: null,
//       plotBorderWidth: 0,
//       plotShadow: false
//     },

//     title: {
//       text: 'Colored Speedometer'
//     },

//     pane: {
//       startAngle: -150,
//       endAngle: 150,
//       background: [
//         {
//           backgroundColor: Highcharts.color('#90ed7d').setOpacity(0.3).get(),
//           borderWidth: 0,
//           outerRadius: '109%',
//           innerRadius: '100%',
//           shape: 'arc',
//           borderColor: 'none'
//         },
//         {
//           backgroundColor: Highcharts.color('#7cb5ec').setOpacity(0.3).get(),
//           borderWidth: 0,
//           outerRadius: '107%',
//           innerRadius: '100%',
//           shape: 'arc',
//           borderColor: 'none'
//         }
//       ]
//     },

//     yAxis: {
//       min: 0,
//       max: 100,
//       lineColor: '#339',
//       tickColor: '#339',
//       minorTickColor: '#339',
//       offset: -25,
//       lineWidth: 2,
//       tickLength: 5,
//       minorTickLength: 5,
//       endOnTick: false,
//       tickPositions: [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100], // Intervalos de 10
//       labels: {
//         distance: -20,
//         rotation: 'auto'
//       },
//       plotBands: [{ // Sección verde claro
//         from: 0,
//         to: 20,
//         color: '#90ed7d'
//       }, {
//         // Sección verde oscuro
//         from: 20,
//         to: 80,
//         color: '#0d6d0d'
//       }, {
//         // Sección roja
//         from: 80,
//         to: 100,
//         color: '#ff0000'
//       }]
//     },

//     series: [{
//       name: 'Speed',
//       data: [50], // Valor inicial ajustado al rango
//       dataLabels: {
//         enabled: true,
//         format: '<span style="color:#339; font-size: 24px;">{y} km/h</span>', // Ajusta el tamaño del texto
//         backgroundColor: {
//           linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
//           stops: [
//             [0, '#DDD'],
//             [1, '#FFF']
//           ]
//         }
//       },
//       tooltip: {
//         valueSuffix: ' km/h'
//       }
//     }]
//   };

//   return (
//     <div style={{ minWidth: 310, maxWidth: 400, height: 300, margin: '0 auto' }}>
//       <HighchartsReact
//         highcharts={Highcharts}
//         options={options}
//         ref={chartRef}
//       />
//     </div>
//   );
// };

// export default ColoredSpeedometer;

// import React, { useEffect, useRef } from 'react';
// import Highcharts from 'highcharts';
// import HighchartsMore from 'highcharts/highcharts-more';
// import HighchartsReact from 'highcharts-react-official';

// // Importa el módulo de más gráficos para Highcharts
// HighchartsMore(Highcharts);

// const ColoredSpeedometer = () => {
//   const chartRef = useRef(null);

//   useEffect(() => {
//     if (chartRef.current) {
//       const chart = chartRef.current.chart;

//       const updateValue = () => {
//         if (chart.axes) { // Asegúrate de que el gráfico no esté destruido
//           const point = chart.series[0].points[0];
//           const inc = Math.round((Math.random() - 0.5) * 10);
//           let newVal = point.y + inc;

//           if (newVal < 0 || newVal > 100) {
//             newVal = point.y - inc;
//           }

//           point.update(newVal);
//         }
//       };

//       const intervalId = setInterval(updateValue, 3000);

//       return () => clearInterval(intervalId); // Limpia el intervalo cuando el componente se desmonte
//     }
//   }, []);

//   const options = {
//     chart: {
//       type: 'gauge',
//       plotBackgroundColor: null,
//       plotBackgroundImage: null,
//       plotBorderWidth: 0,
//       plotShadow: false
//     },

//     title: {
//       text: 'Colored Speedometer'
//     },

//     pane: {
//       startAngle: -150,
//       endAngle: 150,
//       background: [
//         {
//           backgroundColor: Highcharts.color('#90ed7d').setOpacity(0.3).get(),
//           borderWidth: 0,
//           outerRadius: '109%',
//           innerRadius: '100%',
//           shape: 'arc',
//           borderColor: 'none'
//         },
//         {
//           backgroundColor: Highcharts.color('#7cb5ec').setOpacity(0.3).get(),
//           borderWidth: 0,
//           outerRadius: '107%',
//           innerRadius: '100%',
//           shape: 'arc',
//           borderColor: 'none'
//         }
//       ]
//     },

//     yAxis: {
//       min: 0,
//       max: 100,
//       lineColor: '#339',
//       tickColor: '#339',
//       minorTickColor: '#339',
//       offset: -25,
//       lineWidth: 2,
//       tickLength: 5,
//       minorTickLength: 5,
//       endOnTick: false,
//       tickPositions: [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100], // Intervalos de 10
//       labels: {
//         distance: -20,
//         rotation: 'auto'
//       },
//       plotBands: [{ // Sección verde claro
//         from: 0,
//         to: 20,
//         color: '#90ed7d'
//       }, {
//         // Sección verde oscuro
//         from: 20,
//         to: 80,
//         color: '#0d6d0d'
//       }, {
//         // Sección roja
//         from: 80,
//         to: 100,
//         color: '#ff0000'
//       }]
//     },

//     series: [{
//       name: 'Speed',
//       data: [50], // Valor inicial ajustado al rango
//       dataLabels: {
//         format: '<span style="color:#339">{y} km/h</span>',
//         backgroundColor: {
//           linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
//           stops: [
//             [0, '#DDD'],
//             [1, '#FFF']
//           ]
//         }
//       },
//       tooltip: {
//         valueSuffix: ' km/h'
//       }
//     }]
//   };

//   return (
//     <div style={{ minWidth: 310, maxWidth: 400, height: 300, margin: '0 auto' }}>
//       <HighchartsReact
//         highcharts={Highcharts}
//         options={options}
//         ref={chartRef}
//       />
//     </div>
//   );
// };

// export default ColoredSpeedometer;








// import React, { useEffect, useRef } from 'react';
// import Highcharts from 'highcharts';
// import HighchartsMore from 'highcharts/highcharts-more';
// import HighchartsReact from 'highcharts-react-official';

// // Importa el módulo de más gráficos para Highcharts
// HighchartsMore(Highcharts);

// const ColoredSpeedometer = () => {
//   const chartRef = useRef(null);

//   useEffect(() => {
//     if (chartRef.current) {
//       const chart = chartRef.current.chart;

//       const updateValue = () => {
//         if (chart.axes) { // Asegúrate de que el gráfico no esté destruido
//           const point = chart.series[0].points[0];
//           const inc = Math.round((Math.random() - 0.5) * 5);
//           let newVal = point.y + inc;

//           if (newVal < 0 || newVal > 100) {
//             newVal = point.y - inc;
//           }

//           point.update(newVal);
//         }
//       };

//       const intervalId = setInterval(updateValue, 3000);

//       return () => clearInterval(intervalId); // Limpia el intervalo cuando el componente se desmonte
//     }
//   }, []);

//   const options = {
//     chart: {
//       type: 'gauge',
//       plotBackgroundColor: null,
//       plotBackgroundImage: null,
//       plotBorderWidth: 0,
//       plotShadow: false
//     },

//     title: {
//       text: 'Colored Speedometer'
//     },

//     pane: {
//       startAngle: -150,
//       endAngle: 150,
//       background: [
//         {
//           backgroundColor: Highcharts.color('#90ed7d').setOpacity(0.3).get(),
//           borderWidth: 0,
//           outerRadius: '109%',
//           innerRadius: '100%',
//           shape: 'arc',
//           borderColor: 'none'
//         },
//         {
//           backgroundColor: Highcharts.color('#7cb5ec').setOpacity(0.3).get(),
//           borderWidth: 0,
//           outerRadius: '107%',
//           innerRadius: '100%',
//           shape: 'arc',
//           borderColor: 'none'
//         }
//       ]
//     },

//     yAxis: {
//       min: 0,
//       max: 100,
//       lineColor: '#339',
//       tickColor: '#339',
//       minorTickColor: '#339',
//       offset: -25,
//       lineWidth: 2,
//       tickLength: 5,
//       minorTickLength: 5,
//       endOnTick: false,
//       labels: {
//         distance: -20,
//         rotation: 'auto'
//       },
//       plotBands: [{ // Sección verde claro
//         from: 0,
//         to: 20,
//         color: '#90ed7d'
//       }, {
//         // Sección verde oscuro
//         from: 20,
//         to: 80,
//         color: '#0d6d0d'
//       }, {
//         // Sección roja
//         from: 80,
//         to: 100,
//         color: '#ff0000'
//       }]
//     },

//     series: [{
//       name: 'Speed',
//       data: [50], // Valor inicial ajustado al rango
//       dataLabels: {
//         format: '<span style="color:#339">{y} km/h</span>',
//         backgroundColor: {
//           linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
//           stops: [
//             [0, '#DDD'],
//             [1, '#FFF']
//           ]
//         }
//       },
//       tooltip: {
//         valueSuffix: ' km/h'
//       }
//     }]
//   };

//   return (
//     <div style={{ minWidth: 310, maxWidth: 400, height: 300, margin: '0 auto' }}>
//       <HighchartsReact
//         highcharts={Highcharts}
//         options={options}
//         ref={chartRef}
//       />
//     </div>
//   );
// };

// export default ColoredSpeedometer;








// import React, { useEffect, useRef } from 'react';
// import Highcharts from 'highcharts';
// import HighchartsMore from 'highcharts/highcharts-more';
// import HighchartsReact from 'highcharts-react-official';

// // Importa el módulo de más gráficos para Highcharts
// HighchartsMore(Highcharts);

// const SimpleSpeedometer = () => {
//   const chartRef = useRef(null);

//   useEffect(() => {
//     if (chartRef.current) {
//       const chart = chartRef.current.chart;

//       const updateValue = () => {
//         if (chart.axes) { // Asegúrate de que el gráfico no esté destruido
//           const point = chart.series[0].points[0];
//           const inc = Math.round((Math.random() - 0.5) * 20);
//           let newVal = point.y + inc;

//           if (newVal < 0 || newVal > 200) {
//             newVal = point.y - inc;
//           }

//           point.update(newVal);
//         }
//       };

//       const intervalId = setInterval(updateValue, 3000);

//       return () => clearInterval(intervalId); // Limpia el intervalo cuando el componente se desmonte
//     }
//   }, []);

//   const options = {
//     chart: {
//       type: 'gauge',
//       plotBackgroundColor: null,
//       plotBackgroundImage: null,
//       plotBorderWidth: 0,
//       plotShadow: false
//     },

//     title: {
//       text: 'Simple Speedometer'
//     },

//     pane: {
//       startAngle: -150,
//       endAngle: 150
//     },

//     yAxis: {
//       min: 0,
//       max: 200,
//       lineColor: '#339',
//       tickColor: '#339',
//       minorTickColor: '#339',
//       offset: -25,
//       lineWidth: 2,
//       labels: {
//         distance: -20,
//         rotation: 'auto'
//       },
//       tickLength: 5,
//       minorTickLength: 5,
//       endOnTick: false
//     },

//     series: [{
//       name: 'Speed',
//       data: [80],
//       dataLabels: {
//         format: '<span style="color:#339">{y} km/h</span>',
//         backgroundColor: {
//           linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
//           stops: [
//             [0, '#DDD'],
//             [1, '#FFF']
//           ]
//         }
//       },
//       tooltip: {
//         valueSuffix: ' km/h'
//       }
//     }]
//   };

//   return (
//     <div style={{ minWidth: 310, maxWidth: 400, height: 300, margin: '0 auto' }}>
//       <HighchartsReact
//         highcharts={Highcharts}
//         options={options}
//         ref={chartRef}
//       />
//     </div>
//   );
// };

// export default SimpleSpeedometer;


// import React, { useEffect, useRef } from 'react';
// import Highcharts from 'highcharts';
// import HighchartsMore from 'highcharts/highcharts-more';
// import HighchartsReact from 'highcharts-react-official';

// // Importa el módulo de más gráficos para Highcharts
// HighchartsMore(Highcharts);

// const DualAxisSpeedometer = () => {
//   const chartRef = useRef(null);

//   useEffect(() => {
//     if (chartRef.current) {
//       const chart = chartRef.current.chart;

//       const updateValue = () => {
//         if (chart.axes) { // Asegúrate de que el gráfico no esté destruido
//           const point = chart.series[0].points[0];
//           const inc = Math.round((Math.random() - 0.5) * 20);
//           let newVal = point.y + inc;

//           if (newVal < 0 || newVal > 200) {
//             newVal = point.y - inc;
//           }

//           point.update(newVal);
//         }
//       };

//       const intervalId = setInterval(updateValue, 3000);

//       return () => clearInterval(intervalId); // Limpia el intervalo cuando el componente se desmonte
//     }
//   }, []);

//   const options = {
//     chart: {
//       type: 'gauge',
//       alignTicks: false,
//       plotBackgroundColor: null,
//       plotBackgroundImage: null,
//       plotBorderWidth: 0,
//       plotShadow: false
//     },

//     title: {
//       text: ''
//     },

//     pane: {
//       startAngle: -150,
//       endAngle: 150
//     },

//     yAxis: [{
//       min: 0,
//       max: 100,
//       lineColor: '#339',
//       tickColor: '#339',
//       minorTickColor: '#339',
//       offset: -25,
//       lineWidth: 2,
//       labels: {
//         distance: -20,
//         rotation: 'auto'
//       },
//       tickLength: 5,
//       minorTickLength: 5,
//       endOnTick: false
//     }, {
//       min: 0,
//       max: 100,
//       tickPosition: 'outside',
//       lineColor: '#933',
//       lineWidth: 2,
//       minorTickPosition: 'outside',
//       tickColor: '#933',
//       minorTickColor: '#933',
//       tickLength: 5,
//       minorTickLength: 5,
//       labels: {
//         distance: 12,
//         rotation: 'auto'
//       },
//       offset: -20,
//       endOnTick: false
//     }],

//     series: [{
//       name: 'Speed',
//       data: [80],
//       dataLabels: {
//         format: '<span style="color:#339">{y} km/h</span><br/>' +
//                 '<span style="color:#933">{(multiply y 0.621):.0f} mph</span>',
//         backgroundColor: {
//           linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
//           stops: [
//             [0, '#DDD'],
//             [1, '#FFF']
//           ]
//         }
//       },
//       tooltip: {
//         valueSuffix: ' %'
//       }
//     }]
//   };

//   return (
//     <div style={{ minWidth: 310, maxWidth: 400, height: 300, margin: '0 auto' }}>
//       <HighchartsReact
//         highcharts={Highcharts}
//         options={options}
//         ref={chartRef}
//       />
//     </div>
//   );
// };

// export default DualAxisSpeedometer;