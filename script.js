'use strict';

let map;
let searchMarkers = []; 

function initMap() {
    
    map = L.map('map').setView([42.87, 74.59], 13);

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; OpenStreetMap'
    }).addTo(map);

   
    setTimeout(() => {
        map.invalidateSize();
    }, 100);

    setupEventListeners();
}

function setupEventListeners() {
    const searchBtn = document.getElementById('search-btn');
    const searchInput = document.getElementById('search-input');

    if (searchBtn) searchBtn.addEventListener('click', searchPlaces);
    
    if (searchInput) {
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') searchPlaces();
        });
    }
}

function searchPlaces() {
    const query = document.getElementById('search-input').value;
    
    if (!query) {
        showStatus("Введите название места", "red", 2000);
        return;
    }

    showStatus("Поиск...", "#333");

    
    fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`)
        .then(response => response.json())
        .then(data => {
            if (data.length === 0) {
                showStatus("Ничего не найдено", "red", 3000);
                return;
            }

            
            searchMarkers.forEach(marker => map.removeLayer(marker));
            searchMarkers = [];

            
            const place = data[0];
            const lat = place.lat;
            const lon = place.lon;

            
            const marker = L.marker([lat, lon]).addTo(map)
                .bindPopup(`<b>${place.display_name}</b>`)
                .openPopup();
            
            searchMarkers.push(marker);

            
            map.setView([lat, lon], 16);
            showStatus("");
        })
        .catch(err => {
            console.error(err);
            showStatus("Ошибка поиска", "red", 3000);
        });
}

function showStatus(text, color, hideAfter = 0) {
    const statusDiv = document.getElementById('status');
    if (!statusDiv) return;

    if (!text) {
        statusDiv.style.display = 'none';
        return;
    }

    statusDiv.style.display = 'block';
    statusDiv.textContent = text;
    statusDiv.style.color = color;

    if (hideAfter > 0) {
        setTimeout(() => {
            statusDiv.style.display = 'none';
        }, hideAfter);
    }
}

document.addEventListener('DOMContentLoaded', initMap);