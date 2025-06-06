// Clase que representa un punto en un río o laguna con nombre y coordenadas
class PuntoAgua {
  #nombre;
  #lat;
  #lng;

  constructor(nombre, lat, lng) {
    this.#nombre = nombre;
    this.#lat = lat;
    this.#lng = lng;
  }

  // Retorna el nombre del punto de agua
  getNombre() {
    return this.#nombre;
  }

  // Retorna la posición en formato [lat, lng]
  getPosicion() {
    return [this.#lat, this.#lng];
  }

  // Retorna la latitud
  getLat() {
    return this.#lat;
  }

  // Retorna la longitud
  getLng() {
    return this.#lng;
  }
}

// Clase que representa una ruta optimizada entre varios puntos de agua
class RutaAgua {
  #puntos;

  constructor(puntos) {
    // Creamos una copia del arreglo de puntos y luego optimizamos el orden
    this.#puntos = puntos.slice();
    this.optimizar();
  }

  // Devuelve el arreglo de puntos en el orden optimizado
  getPuntos() {
    return this.#puntos;
  }

  // Calcula distancia euclidiana simple entre dos puntos
  static distancia(a,b) {
    const dx = a.getLat() - b.getLat();
    const dy = a.getLng() - b.getLng();
    return Math.sqrt(dx*dx + dy*dy);
  }

  // Optimiza la ruta ordenando los puntos por latitud decreciente (de sur a norte),
  // simulando el flujo natural del río para mejorar la coherencia en la visualización
  optimizar() {
    this.#puntos.sort((a,b) => b.getLat() - a.getLat());
  }
}

// Ubicaciones representativas de ríos y lagunas en Bogotá (aproximadas)
const lugaresAguaBogota = [
  // Ríos
  new PuntoAgua("Nacimiento Río Bogotá (Alto del Sol)", 4.508, -74.190),
  new PuntoAgua("Estación Hidrométrica Bosa", 4.596, -74.191),
  new PuntoAgua("Puente La Virgen (Kennedy)", 4.626, -74.130),
  new PuntoAgua("Centro de Bogotá (Parque Tercer Milenio)", 4.611, -74.080),
  new PuntoAgua("Puente de Guadua (Usaquén)", 4.737, -74.028),
  new PuntoAgua("Desembocadura Río Bogotá en Río Magdalena", 8.91, -74.79), // fuera de Bogotá para referencia

  // Ríos contaminados
  new PuntoAgua("Río Salitre", 4.634, -74.086), // Aproximado
  new PuntoAgua("Río Fucha", 4.590, -74.090), // Aproximado
  new PuntoAgua("Río Tunjuelo", 4.590, -74.180), // Aproximado
  new PuntoAgua("Río Torca", 4.688, -74.063), // Aproximado

  // Lagunas y humedales
  new PuntoAgua("Laguna Tibanica", 4.5246, -74.1805),
  new PuntoAgua("Humedal La Conejera", 4.7201, -74.1034),
  new PuntoAgua("Humedal Juan Amarillo", 4.7223, -74.1056),
  new PuntoAgua("Humedal Santa María del Lago", 4.8224, -74.0513),
  new PuntoAgua("Humedal El Burro", 4.7067, -74.0932),
  new PuntoAgua("Quebrada La Vieja", 4.6948, -74.0703),
];

// Coordenadas aproximadas para centrar el mapa en Bogotá
const centroBogota = [4.65, -74.10];

// Crear el mapa y establecer la vista en Bogotá
const mapa = L.map('map').setView(centroBogota, 11);

// Añadir los tiles de OpenStreetMap al mapa
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: '&copy; OpenStreetMap contributors'
}).addTo(mapa);

// Crear una nueva ruta optimizada a partir de los lugares de agua en Bogotá
const rutaBogota = new RutaAgua(lugaresAguaBogota);

// Obtener las coordenadas en el orden optimizado para dibujar la ruta
const coordsRuta = rutaBogota.getPuntos().map(punto => punto.getPosicion());

// Dibujar la ruta en el mapa como una polilínea azul
const polyline = L.polyline(coordsRuta, { color: "#2563eb", weight: 5, opacity: 0.75 }).addTo(mapa);

// Añadir marcadores numerados para cada punto en la ruta
rutaBogota.getPuntos().forEach((punto, index) => {
  const marker = L.marker(punto.getPosicion(), {
    icon: L.divIcon({
      className: "",
      html: `<div class="custom-label">${index + 1}</div>`,
      iconSize: [28, 28],
      iconAnchor: [14, 14],
      popupAnchor: [0, -14]
    })
  }).addTo(mapa);
  marker.bindPopup(`<strong>${index + 1}. ${punto.getNombre()}</strong>`);
});

// Ajustar la vista para mostrar toda la ruta y sus puntos
mapa.fitBounds(polyline.getBounds().pad(0.5));
