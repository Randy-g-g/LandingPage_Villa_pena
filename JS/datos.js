
/*
 * DATOS DE VILLA PEÑAS
 * Se utilizan arreglos de objetos para cumplir con el requisito
 * de mostrar información dinámicamente mediante JavaScript.
 *
 * Los nombres y servicios de los tres paquetes "Básico", "Full"
 * y "Premium" se basan en la referencia visual proporcionada
 * por el cliente.
 *
 * Los documentos proporcionados también contienen información
 * de paquetes "Essentials" y "Premium"; esos datos podrán
 * integrarse cuando el cliente confirme la nomenclatura definitiva.
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
    categoria: "Palomitas",
    paquete: "Paquete #1",
    cantidad: "15 porciones",
    detalle: "15 bolsitas individuales",
    precio: 10000
  },
  {
    id: 2,
    categoria: "Palomitas",
    paquete: "Paquete #2",
    cantidad: "30 porciones",
    detalle: "30 bolsitas individuales",
    precio: 15000
  },
  {
    id: 3,
    categoria: "Palomitas",
    paquete: "Paquete #3",
    cantidad: "50 porciones",
    detalle: "50 bolsitas individuales",
    precio: 20000
  },
  {
    id: 4,
    categoria: "Algodón de azúcar",
    paquete: "Paquete #1",
    cantidad: "15 porciones",
    detalle: "15 envases de 24 oz.",
    precio: 10000
  },
  {
    id: 5,
    categoria: "Algodón de azúcar",
    paquete: "Paquete #2",
    cantidad: "30 porciones",
    detalle: "30 envases de 24 oz.",
    precio: 15000
  },
  {
    id: 6,
    categoria: "Algodón de azúcar",
    paquete: "Paquete #3",
    cantidad: "50 porciones",
    detalle: "50 envases de 24 oz.",
    precio: 22000
  },
  {
    id: 7,
    categoria: "Fuente de chocolate",
    paquete: "Paquete #1",
    cantidad: "15 personas",
    detalle: "Fuente + 18 pinchos",
    precio: 30000
  },
  {
    id: 8,
    categoria: "Fuente de chocolate",
    paquete: "Paquete #2",
    cantidad: "30 personas",
    detalle: "Fuente + 36 pinchos",
    precio: 35000
  },
  {
    id: 9,
    categoria: "Fuente de chocolate",
    paquete: "Paquete #3",
    cantidad: "50 personas",
    detalle: "Fuente + 55 pinchos",
    precio: 40000
  }
];
