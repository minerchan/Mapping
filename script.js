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


// ORIENTAÇÃO A OBJETOS
class Workout {
  date = new Date();
  id = (Date.now() + '').slice(-10);
  constructor(coords, distance, duration) {
    this.coords = coords; // lat, lng
    this.distance = distance; // in km
    this.duration = duration; // in min
  }
}

class Caminhando extends Workout {
  type = 'caminhando';
  constructor(coords, distance, duration, cadence) {
    super(coords, distance, duration);
    this.cadence = cadence;
    this.calcPace();
  }

  calcPace() {
    // min/km
    this.pace = this.duration / this.distance;
    return this.pace;
  }
}
class Pedalando extends Workout {
  type = 'pedalando';
  constructor(coords, distance, duration, elevationGain) {
    super(coords, distance, duration);
    this.elevationGain = elevationGain;
    this.calcSpeed();
  }

  calcSpeed() {
    // km/h
    this.speed = this.distance / (this.duration / 60);
    return this.speed;
  } 
}



class App{
  #map;
  #mapEvent;
  #workouts = [];
  constructor(){
    this._getPosition();

    form.addEventListener('submit', this._newWorkout.bind(this));

inputType.addEventListener('change', this._toggleElevationField)

  }

  _getPosition(){
    if(navigator.geolocation)
navigator.geolocation.getCurrentPosition(this._loadMap.bind(this), function(){
  alert('Não conseguimos encontrar sua posição, por favor recarregue a página e aceite o acesso a sua localização');
})
  }

  _loadMap(position){

      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude; 
      
      const coords = [latitude, longitude];
      
      // console.log(this.#map)
      this.#map = L.map('map').setView(coords, 13);
      
      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(this.#map);
      
      L.marker(coords).addTo(this.#map)
          .bindPopup('Você está aqui')
          .openPopup();;
      
          this.#map.on('click', this._showForm.bind(this));
  }
  _showForm(mapE){
    this.#mapEvent = mapE;
    form.classList.remove('hidden');
    inputDistance.focus();
  }
  _toggleElevationField(){
    inputElevation.closest('.form__row').classList.toggle('form__row--hidden');
    inputCadence.closest('.form__row').classList.toggle('form__row--hidden');
  }
  _newWorkout(event){
    const validInputs = (...inputs) => 
    inputs.every(inp => Number.isFinite(inp));
    const allPositive = (...inputs) => inputs.every(inp => inp > 0);
    event.preventDefault();

    // pegar os dados do formulario
    const type = inputType.value;
    const distance = +inputDistance.value;
    const duration = +inputDuration.value;
    const lat = this.#mapEvent.latlng.lat;
    const long = this.#mapEvent.latlng.lng;
    let workout;
    // if(distance > 0 && duration > 0){}
    // se for, criar um novo objeto de caminhando
    if(type === 'caminhando'){
      const cadence = +inputCadence.value;
          // cheacar se o dado é valido
    if(
    !validInputs(distance, duration, cadence) ||
    !allPositive(distance, duration, cadence)
    )
    return alert('O formulário precisa ser um número positivo!');

    workout = new Caminhando ([lat, long], distance, duration, cadence);

    }
    // se for, criar um novo objeto de pedalando
    if(type === 'pedalando'){
      const elevation = +inputElevation.value;
          // cheacar se o dado é valido
    if(
      !validInputs(distance, duration, elevation) ||
      !allPositive(distance, duration, elevation)
    )
    return alert('O formulário precisa ser um número positivo!');

    workout = new Pedalando([lat, long], distance, duration, elevation);
    ;}
    // adicionar novo objeto ao array de workout
    this.#workouts.push(workout);
    // renderizar o novo objeto no mapa
    this._renderWorkoutMarker(workout);
        // esconder o formulario e limpar os campos
    inputDistance.value = inputDuration.value = inputCadence.value = inputElevation.value = '';
    
      }

 _renderWorkoutMarker(workout){

  L.marker(workout.coords)
      .addTo(this.#map)
      .bindPopup(
        L.popup({
          maxWidth: 250,
          minWidth: 100,
          autoClose: false,
          closeOnClick: false,
          className: `${workout.type}-popup`,  
          // workout--pedalando 
        })
        )
        .setPopupContent('workout')
        .openPopup();


        console.log(workout.type)
 }     






    // Clear input fields
}

const app = new App();













