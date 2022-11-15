'use strict';

// prettier-ignore
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const form = document.querySelector('.form');
const containerWorkouts = document.querySelector('.workouts');
const inputType = document.querySelector('.form__input--type');
const inputDistance = document.querySelector('.form__input--distance');
const inputDuration = document.querySelector('.form__input--duration');
const inputCadence = document.querySelector('.form__input--cadence');
const inputElevation = document.querySelector('.form__input--elevation');

if(navigator.geolocation)
navigator.geolocation.getCurrentPosition(function(position){
// console.log(position)
const latitude = position.coords.latitude;
const longitude = position.coords.longitude; 

console.log(position)
const coords = [latitude, longitude];

console.log(coords)
const map = L.map('map').setView(coords, 13);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

L.marker(coords).addTo(map)
    .bindPopup('Você está aqui')
    .openPopup();;

    map.on('click', function(mapEvent){
      console.log(mapEvent)
      const lat = mapEvent.latlng.lat;
      const long = mapEvent.latlng.lng;
    L.marker([lat, long]).addTo(map)
    .bindPopup('Esteve aqui')
    .openPopup();;
    })
    // map.on
}, function(){
  alert('Não conseguimos encontrar sua posição, por favor recarregue a página e aceite o acesso a sua localização');
})