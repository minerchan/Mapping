'use strict';

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

  _setDescription() {
    // prettier-ignore
    const months = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julio', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

    this.description = `${this.type[0].toUpperCase()}${this.type.slice(1)} no dia ${this.date.getDate()} de ${months[this.date.getMonth()]}`;
  }
}

class Caminhando extends Workout {
  type = 'caminhando';
  constructor(coords, distance, duration, cadence) {
    super(coords, distance, duration);
    this.cadence = cadence;
    this.calcPace();
    this._setDescription();
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
    this._setDescription();
  }

  calcSpeed() {
    // km/h
    this.speed = this.distance / (this.duration / 60);
    return this.speed;
  } 
}



class App{
  #map;
  #mapZoomLevel = 13;
  #mapEvent;
  #workouts = [];
  constructor(){
    this._getPosition();

    this._getLocalStorage();

    form.addEventListener('submit', this._newWorkout.bind(this));
    inputType.addEventListener('change', this._toggleElevationField)
    containerWorkouts.addEventListener('click', this._moveToPopup.bind(this));

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
      

      this.#map = L.map('map').setView(coords, this.#mapZoomLevel);
      
      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(this.#map);
      
      L.marker(coords).addTo(this.#map)
          .bindPopup('Você está aqui')
          .openPopup();;
      
          this.#map.on('click', this._showForm.bind(this));

          this.#workouts.forEach(work => {
            this._renderWorkoutMarker(work);
          })
  }
  _showForm(mapE){
    this.#mapEvent = mapE;
    form.classList.remove('hidden');
    inputDistance.focus();
  }
  _hideForm(){
    inputDistance.value = inputDuration.value = inputCadence.value = inputElevation.value = '';
    form.style.display = 'none';
    form.classList.add('hidden');
    setTimeout(() => (form.style.display = 'grid'), 1000);
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
    // renderizar o novo objeto na lista
    this._renderWorkout(workout);
        // esconder o formulario e limpar os campos
    this._hideForm();
    // setar o local storage para todos os workouts
    this._setLocalStorage();
    
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
        .setPopupContent(`${workout.type === 'pedalando' ? '🚴‍♀️' : '🚶‍♀️'} ${workout.description}`)
        .openPopup();

      
}  
_renderWorkout(workout){
  let html = `
          <li class="workout workout--${workout.type}" data-id="${workout.id}">
          <h2 class="workout__title">${workout.description}</h2>
          <div class="workout__details">
            <span class="workout__icon">${workout.type === 'caminhando' ? '🏃‍♂️' : '🚴‍♀️'}</span>
            <span class="workout__value">${workout.distance}</span>
            <span class="workout__unit">km</span>
          </div>
          <div class="workout__details">
            <span class="workout__icon">⏱</span>
            <span class="workout__value">${workout.duration}</span>
            <span class="workout__unit">min</span>
          </div>`;

  if (workout.type === 'running')
    html += `
            <div class="workout__details">
              <span class="workout__icon">⚡️</span>
              <span class="workout__value">${workout.pace.toFixed(1)}</span>
              <span class="workout__unit">min/km</span>
            </div>
            <div class="workout__details">
              <span class="workout__icon">🦶🏼</span>
              <span class="workout__value">${workout.cadence}</span>
              <span class="workout__unit">spm</span>
            </div>
          </li>
        `;

  if (workout.type === 'cycling')
    html += `
            <div class="workout__details">
              <span class="workout__icon">⚡️</span>
              <span class="workout__value">${workout.speed.toFixed(1)}</span>
              <span class="workout__unit">km/h</span>
            </div>
            <div class="workout__details">
              <span class="workout__icon">⛰</span>
              <span class="workout__value">${workout.elevationGain}</span>
              <span class="workout__unit">m</span>
            </div>
          </li>
        `;

        form.insertAdjacentHTML('afterend', html);
}   
_moveToPopup(e){
  const workoutEl = e.target.closest('.workout');
  if(!workoutEl) return;
  const workout = this.#workouts.find(work => work.id === workoutEl.dataset.id);
  this.#map.setView(workout.coords, this.#mapZoomLevel, {
    animate: true,
    pan: {
      duration: 1,
    },
  });
  workout.click();
}

//Guardando no servidor e convertendo e desconvertendo pra json
_setLocalStorage(){
  localStorage.setItem('workouts', JSON.stringify(this.#workouts));
}
_getLocalStorage(){
  const data = JSON.parse(localStorage.getItem('workouts'))
  if(!data) return;
  this.#workouts = data;
  this.#workouts.forEach(work => {
    this._renderWorkout(work);
  })
}
}

const app = new App();













