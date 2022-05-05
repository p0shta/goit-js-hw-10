import './css/styles.css';
import { Notify } from 'notiflix';
import debounce from 'lodash.debounce';
import { fetchCountries } from './js/fetchCountries';

const DEBOUNCE_DELAY = 300;
const refs = {
  input: document.querySelector('#search-box'),
  list: document.querySelector('.country-list'),
  item: document.querySelector('.country-info'),
};

refs.input.addEventListener('input', debounce(onInput, DEBOUNCE_DELAY));
function onInput(e) {
  const cityName = e.target.value.trim().toLowerCase();

  if (cityName !== '') {
    fetchCountries(cityName).then(countries => {
      if (countries.length > 10) {
        refs.list.innerHTML = '';
        Notify.info('Too many matches found. Please enter a more specific name.');
      } else if (countries.length >= 2 && countries.length <= 10) {
        refs.list.innerHTML = createListMarkup(countries);
      } else if (countries.length === 1) {
        refs.item.innerHTML = createItemMarkup(countries);
      }
    });
  }
  refs.list.innerHTML = '';
  refs.item.innerHTML = '';
}

function createListMarkup(countries) {
  refs.item.innerHTML = '';

  const markup = countries
    .map(country => {
      return `
      <li class="country-list-item">
        <img class="country-list-img" src="${country.flags.svg}" alt="${country.name.official}" /><span>${country.name.official}</span>
      </li>`;
    })
    .join('');

  return markup;
}

function createItemMarkup(country) {
  refs.list.innerHTML = '';

  const markupItem = country
    .map(country => {
      const markupLang = Object.values(country.languages).join(', ');

      return `
        <div class="country-info-wrap">
            <img class="country-info-img" src="${country.flags.svg}" alt="${country.name.official}" /><span class="country-info-title">${country.name.official}</span>
        </div>
        <p class="country-info-text">Capital: <span class="country-info-subject">${country.capital}</span></p>
        <p class="country-info-text">Population: <span class="country-info-subject">${country.population} people</span></p>
        <p class="country-info-text">Languages: <span class="country-info-subject">${markupLang}</span></p>
      `;
    })
    .join('');

  return markupItem;
}
