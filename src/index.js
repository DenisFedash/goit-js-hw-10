import './css/styles.css';
import countryCardsTemp from '../src/templates/country-cards.hbs';
import countryList from '../src/templates/country-list.hbs'
import API from './js/fetchCountries'
import getRefs from './js/get-refs';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';

const DEBOUNCE_DELAY = 300;

const refs = getRefs();

refs.searchInput.addEventListener('input', debounce(onSearch, DEBOUNCE_DELAY));

function onSearch(e) {
    e.preventDefault();

    let searchValue = e.target.value.trim();
    clearList();
    
    API.fetchCountries(searchValue)
        .then(data => {
            if (data.length > 10) {
        Notiflix.Notify.info('Too many matches found. Please enter a more specific query!');        
    }
    else if (data.length <= 10 && data.length >= 2) {
        const markuplist = buildListMarkupList(data);
        refs.countryList.innerHTML = markuplist;
        
    }
    else {
        const markup = countryCardsTemp(data);
        // refs.list.innerHTML = markup;
        
    }
        })
                
}

function renderCountriesCard(country) {    
    const markup = countryCardsTemp(country);
    refs.list.innerHTML = markup;
}

function renderCountriesList(countries) {
    const list = countryList(countries);
    refs.countryList.innerHTML = list;
};

function onFetchError() {
    Notiflix.Notify.failure('Fuck!!!!')
};

function insertItemCountrie(items) {
  refs.countryList.insertAdjacentHTML('beforeend', items);
}

function buildListMarkupList(items) {
  return countryCardsTemp(items);
}

function clearList() {
  refs.countryList.innerHTML = '';
}