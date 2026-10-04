
/*
 * Paquetes dE Villa Peñas
 */

const paquetes = [
  {
    id: 1,
    nombre: "Paquete Essentials",
    descripcion: "Una opción sencilla para disfrutar del rancho y compartir con tus invitados.",
    servicios: [
      "Uso del rancho",
      "Cocina equipada",
      " Playground",
      "Trampolín",
      "Piscina",
      "Wi-Fi"
    ],
     precio:60000,
    detalles: [
       {
        nombre:"Rancho",
        descripcion:"Uso del rancho y sus áreas principales durante el evento."
      },
      {
        nombre:"Cocina equipada",
        descripcion:"Uso de cocina completamente equipada para preparar y almacenar alimentos."
      },

      {
        nombre:"Playground",
        descripcion:"Acceso al área de juegos infantiles durante el evento."
      },
      {
        nombre:"Trampolín",
        descripcion:"Uso del trampolín durante el evento."
      },
      {
        nombre:"Piscina",
        descripcion:"Uso de piscina de 1,40 metros de profundidad, equipada con cascada e iluminación de colores."
      },
      {
         nombre:"Wi-Fi",
        descripcion:"Acceso a conexión inalámbrica a Internet para los asistentes."
      }
    ]
  },

  {
    id: 2,
    nombre: "Paquete Premium",
    descripcion: "Una opción más completa con entretenimiento y productos adicionales.",
    servicios: [
      "Uso del rancho",
      "Cocina equipada",
      "Parrilla de gas Premium",
      "Playground",
      "Sistema de sonido",
      "Trampolín",
      "Micrófonos inalámbricos",
      "Piscina",
      "Smart TV",
      "Wi-Fi"
    ],
     precio:80000,
    detalles: [
       {
        nombre:"Rancho",
        descripcion:"Uso del rancho y sus áreas principales durante el evento."
      },
      {
        nombre:"Cocina equipada",
        descripcion:"Uso de cocina completamente equipada para preparar y almacenar alimentos."
      },
      
      {
        nombre:"Parrilla de gas Premium",
        descripcion:"Uso de parrilla de gas Premium para preparar alimentos durante el evento."
      },
      {
        nombre:"Playground",
        descripcion:"Acceso al área de juegos infantiles durante el evento."
      },
      {
        nombre:"Sistema de sonido JBL PartyBox 720",
        descripcion:"Uso del sistema de sonido JBL PartyBox 720 para música y entretenimiento."
      },
      {
        nombre:"Trampolín",
        descripcion:"Uso del trampolín durante el evento."
      },
      {
        nombre:"Micrófonos inalámbricos",
        descripcion:"Uso de micrófonos inalámbricos conectados al sistema de sonido."
      },
      {
        nombre:"Piscina",
        descripcion:"Uso de piscina de 1,40 metros de profundidad, equipada con cascada e iluminación de colores."
      },
       {
        nombre:"Smart TV de 75 pulgadas",
        descripcion:"Uso de Smart TV de 75 pulgadas para proyección de contenido y entretenimiento."
      },
      {
         nombre:"Wi-Fi",
        descripcion:"Acceso a conexión inalámbrica a Internet para los asistentes."
      }
    ]
  }
];

const adicionales = [

    {
        id: 1,
        categoria: "Palomitas de maíz",
        descripcion: "Preparación y servicio de palomitas recién hechas durante el evento.",
        paquetes: [
            {
                id: 1,
                nombre: "Paquete #1",
                cantidad: "15 porciones para 15 personas",
                detalle: "15 bolsitas individuales, ya sea en papel o en bolsa transparente",
                precio: 10000
            },
            {
                id: 2,
                nombre: "Paquete #2",
                cantidad: "30 porciones para 30 personas",
                detalle: "30 bolsitas individuales, ya sea en papel o en bolsa transparente",
                precio: 15000
            },
            {
                id: 3,
                nombre: "Paquete #3",
                cantidad: "50 porciones para 50 personas",
                detalle: "50 bolsitas individuales, ya sea en papel o en bolsa transparente",
                precio: 20000
            }
        ]
    },


    {
        id: 2,
        categoria: "Algodón de azúcar",
        descripcion: "Preparación de algodón de azúcar servido individualmente durante el evento.",
        paquetes: [
            {
                id: 1,
                nombre: "Paquete #1",
                cantidad: "15 porciones para 15 personas",
                detalle: "15 envases plásticos transparentes de 24 oz.",
                precio: 10000
            },
            {
                id: 2,
                nombre: "Paquete #2",
                cantidad: "30 porciones para 30 personas",
                detalle: "30 envases plásticos transparentes de 24 oz.",
                precio: 15000
            },
            {
                id: 3,
                nombre: "Paquete #3",
                cantidad: "50 porciones para 50 personas",
                detalle: "50 envases plásticos transparentes de 24 oz.",
                precio: 22000
            }
        ]
    },


    {
        id: 3,
        categoria: "Fuente de chocolate",
        descripcion: "Servicio de fuente de chocolate con acompañamientos de pinchos de marshmallow para los asistentes.",
        paquetes: [
            {
                id: 1,
                nombre: "Paquete #1",
                cantidad: "15 porciones para 15 personas",
                detalle: "18 porciones",
                precio: 30000
            },
            {
                id: 2,
                nombre: "Paquete #2",
                cantidad: "30 porciones para 30 personas",
                detalle: "36 porciones",
                precio: 35000
            },
            {
                id: 3,
                nombre: "Paquete #3",
                cantidad: "50 porciones para 50 personas",
                detalle: "55 porciones",
                precio: 40000
            }
        ]
    },


    {
        id: 4,
        categoria: "Adicional por personas",
        descripcion: "Cargo adicional cuando la cantidad de personas supera las porciones establecidas en el paquete seleccionado.",
        paquetes: [
            {
                id: 1,
                nombre: "Paquete #1",
                cantidad: "20 porciones adicionales",
                detalle: "Se aplica cuando la cantidad de asistentes supera las porciones incluidas en el paquete contratado.",
                precio: 20000
            }
        ]
    }

];
