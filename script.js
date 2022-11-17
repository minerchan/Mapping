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
let map;
let mapEvent;


// ORIENTAÇÃO A OBJETOS
class App{
  constructor(){}

  _getPosition(){
    if(navigator.geolocation)
navigator.geolocation.getCurrentPosition(this._loadMap(), function(){
  alert('Não conseguimos encontrar sua posição, por favor recarregue a página e aceite o acesso a sua localização');
})
  }

  _loadMap(position){

      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude; 
      
      const coords = [latitude, longitude];
      
      console.log(coords)
      map = L.map('map').setView(coords, 13);
      
      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(map);
      
      L.marker(coords).addTo(map)
          .bindPopup('Você está aqui')
          .openPopup();;
      
          map.on('click', function(mapE){
            mapEvent = mapE;
            form.classList.remove('hidden');
            inputDistance.focus();
      
          })
          // map.on
      , function(){
        alert('Não conseguimos encontrar sua posição, por favor recarregue a página e aceite o acesso a sua localização');
      }
  }
  _showForm(){}
  _toggleElevationField(){}
  _newWorkout(){}
}















form.addEventListener('submit', (event)=>{
  event.preventDefault();

  // Clear input fields
  inputDistance.value = inputDuration.value = inputCadence.value = inputElevation.value = '';
      const lat = mapEvent.latlng.lat;
      const long = mapEvent.latlng.lng;
    L.marker([lat, long]).addTo(map)
    .bindPopup('Esteve aqui')
    .openPopup();;
})

inputType.addEventListener('change', function(){
  inputElevation.closest('.form__row').classList.toggle('form__row--hidden');
  inputCadence.closest('.form__row').classList.toggle('form__row--hidden');
  })

  