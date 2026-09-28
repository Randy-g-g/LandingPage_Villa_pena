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
    nombre: "Paquete Básico",
    descripcion: "Una opción sencilla para disfrutar del rancho y compartir con tus invitados.",
    servicios: [
      "Uso de rancho",
      "Piscina",
      "Palomitas",
      "Algodón de azúcar"
    ]
  },
  {
    id: 2,
    nombre: "Paquete Full",
    descripcion: "Una alternativa con servicios adicionales para complementar tu celebración.",
    servicios: [
      "Uso de rancho",
      "Piscina",
      "Parrilla BBQ",
      "Palomitas",
      "Algodón de azúcar"
    ]
  },
  {
    id: 3,
    nombre: "Paquete Premium",
    descripcion: "Una opción más completa con entretenimiento y productos adicionales.",
    servicios: [
      "Uso de rancho",
      "Piscina",
      "Playground",
      "Sonido",
      "Palomitas",
      "Algodón de azúcar",
      "Fuente de chocolate"
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