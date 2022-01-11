import './css/styles.css';
import countryCardsTemp from '../src/templates/country-cards.hbs';
import countryListTemp from '../src/templates/country-list.hbs'
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
   
    
    API.fetchCountries(searchValue)
        .then(toSelectionData)
        .catch(console.log)
}

function toSelectionData(data) {
    if (data.length > 10) {
        onPageReset();
        return Notiflix.Notify.info('Too many matches found. Please enter a more specific name.');
    }
    else if (data.length <= 10 && data.length >= 2) {
        onPageReset();
        return renderListCountry(data);
    } 
    else if (data.length === 1) {
        onPageReset();
        return renderDeployedCountry(data);
    }
    else if (data.status === 404) {
        onPageReset();
        return Notiflix.Notify.failure('Oops, there is no country with that name');
    }    
}

function renderListCountry(nameCountry) {
    const markupList = countryListTemp(nameCountry);
    refs.countryList.innerHTML = markupList;    
};

function renderDeployedCountry(nameCountry) {
    const markupList = countryCardsTemp(nameCountry);
    refs.countryInfo.innerHTML = markupList;
};

function onPageReset() {
    refs.countryList.innerHTML = '';
    refs.countryInfo.innerHTML = '';    
};

