// =====================
// CONFIGURACIÓN
// =====================
const API_KEY = "at_UibTKMbN6PtmLzeW9V2u66HXCCZM5";
const API_URL = "https://geo.ipify.org/api/v2/country,city";

// Elementos del DOM
const form = document.getElementById("search-form");
const input = document.getElementById("search-input");
const ipEl = document.getElementById("ip");
const locationEl = document.getElementById("location");
const timezoneEl = document.getElementById("timezone");
const ispEl = document.getElementById("isp");

// =====================
// MAPA (Leaflet)
// =====================
const map = L.map("map", { zoomControl: false }).setView([0, 0], 2);

L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: "&copy; OpenStreetMap"
}).addTo(map);

let marker;

// =====================
// FUNCIÓN: pedir datos a la API
// =====================
async function fetchIp(query = "") {
    try {
        let url = `${API_URL}?apiKey=${API_KEY}`;

        // Si hay búsqueda, decidimos si es IP o dominio
        if (query) {
            const isIp = /^(\d{1,3}\.){3}\d{1,3}$/.test(query);
            url += isIp ? `&ipAddress=${query}` : `&domain=${query}`;
        }

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error("No se pudo obtener la información");
        }

        const data = await response.json();
        updateUI(data);

    } catch (error) {
        alert("Error: " + error.message);
        console.error(error);
    }
}

// =====================
// FUNCIÓN: imprimir datos en pantalla
// =====================
function updateUI(data) {
    ipEl.textContent = data.ip;
    locationEl.textContent =
        `${data.location.city}, ${data.location.region} ${data.location.postalCode}`;
    timezoneEl.textContent = `UTC ${data.location.timezone}`;
    ispEl.textContent = data.isp;

    updateMap(data.location.lat, data.location.lng);
}

// =====================
// FUNCIÓN: mover el mapa
// =====================
function updateMap(lat, lng) {
    map.setView([lat, lng], 13);

    if (marker) {
        map.removeLayer(marker);
    }

    marker = L.marker([lat, lng]).addTo(map);
}

// =====================
// EVENTOS
// =====================
form.addEventListener("submit", (e) => {
    e.preventDefault();
    const value = input.value.trim();
    fetchIp(value);
});

// Cargar la IP del visitante al abrir
fetchIp();
