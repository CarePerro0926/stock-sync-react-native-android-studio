// src/data/initialData.js

export const initialUsuarios = [
  { id: '1', username: 'admin', pass: 'admin', role: 'admin' },
  { id: '2', username: 'cliente', pass: 'cliente', role: 'cliente' }
];

export const initialProveedores = [
  { id: '1', nombre: 'NetZone', email: 'contacto@netzone.com' },
  { id: '2', nombre: 'CoolTech', email: 'ventas@cooltech.com' },
  { id: '3', nombre: 'DigitalStore', email: 'info@digitalstore.com' },
  { id: '4', nombre: 'PCMaster', email: 'soporte@pcmaster.com' },
  { id: '5', nombre: 'ElectroBits', email: 'ventas@electrobits.com' },
  { id: '6', nombre: 'GigaParts', email: 'giga@parts.com' },
  { id: '7', nombre: 'CompuWorld', email: 'ventas@compuworld.com' }
];

export const initialCategorias = [
  { id: '1', nombre: 'Procesadores' },
  { id: '2', nombre: 'Tarjetas Gráficas' },
  { id: '3', nombre: 'Memorias RAM' },
  { id: '4', nombre: 'Discos Duros' },
  { id: '5', nombre: 'Boards' },
  { id: '6', nombre: 'Fuentes de Poder' },
  { id: '7', nombre: 'Gabinetes' },
  { id: '8', nombre: 'Periféricos' },
  { id: '9', nombre: 'Monitores' },
  { id: '10', nombre: 'Refrigeración' },
  { id: '11', nombre: 'Redes' },
  { id: '12', nombre: 'Accesorios' },
  { id: '13', nombre: 'Mobiliario' }
];

export const initialProductos = [
  { id: '1', nombre: 'Procesador Intel Core i5-13400', cantidad: 12, precio: 1100000, categoria: 'Procesadores' },
  { id: '2', nombre: 'Tarjeta Gráfica RTX 4060', cantidad: 15, precio: 1600000, categoria: 'Tarjetas Gráficas' },
  { id: '3', nombre: 'Memoria RAM DDR5 16GB (3200MHz)', cantidad: 20, precio: 320000, categoria: 'Memorias RAM' },
  { id: '4', nombre: 'SSD SATA 1TB', cantidad: 25, precio: 280000, categoria: 'Discos Duros' },
  { id: '5', nombre: 'Placa Madre B660 Micro ATX', cantidad: 10, precio: 750000, categoria: 'Boards' },
];
