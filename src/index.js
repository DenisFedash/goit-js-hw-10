import './css/styles.css';
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
        .catch(error)
}

function toSelectionData(data) {
    if (data.length > 10) {
        onPageReset();
        return Notiflix.Notify.info('Too many matches found. Please enter a more specific name.');
    } else {
       function CountryCards (data) {
            return data.map((country, index, array) => {
                if (array.length === 1) {
                    return `<li class="list"><p class = "country-text">Country: <span class="span-text">${country.name.official}</span></p>
              <p class = "country-text">Capital: <span class="span-text">${country.capital.join('')}</span></p>
              <p class = "country-text">Population: <span class="span-text">${country.population}</span></p></li>
              <p class = "country-text">Language: <span class="span-text">${Object.values(country.languages).join(', ')}</span></p>              
              <div class = "country-text">Flag: <img class='flag' src="${country.flags.svg}" alt="flag" /></div>`
                } else {
                    return `<li class="list short-list">
                <div><img class='flag' src="${country.flags.svg}" alt="flag" /></div>
                <p><span class="name-official">${country.name.official}</span></p>
                </li>`;
                }
            });
        };
        refs.countryList.innerHTML = CountryCards(data).join('');
    }
     
}
function error() {
    onPageReset()
        Notiflix.Notify.failure(`Oops, there is no country with that name`);
}

function onPageReset() {
    refs.countryList.innerHTML = '';       
};

