const countriesContainer = document.getElementById('countries');
const searchInput = document.getElementById('search-input');
const regionFilter = document.getElementById('filter-region');
const languageFilter = document.getElementById('filter-language');
const loadMoreButton = document.getElementById('load-more');
const favoritesSidebar = document.querySelector('.favorites');
const favoritesList = document.getElementById('favorites-list');

let allCountries = [];
let displayedCountries = [];
let currentPage = 1;
const pageSize = 20;
const favorites = JSON.parse(localStorage.getItem('favorites')) || [];

async function fetchCountries() {
    try {
        const response = await fetch('https://restcountries.com/v3.1/all');
        const data = await response.json();
        allCountries = data;
        renderCountries();
    } catch (error) {
        console.error('Error fetching countries:', error);
    }
}

function renderCountries() {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = currentPage * pageSize;
    const countriesToRender = displayedCountries.slice(startIndex, endIndex);

    countriesToRender.forEach(country => {
        const card = document.createElement('div');
        card.className = 'country-card';
        card.innerHTML = `
            <img src="${country.flags.svg}" alt="Flag of ${country.name.common}">
            <h3>${country.name.common}</h3>
        `;
        card.addEventListener('click', () => openDetailsPage(country));
        countriesContainer.appendChild(card);
    });

    if (endIndex < displayedCountries.length) {
        loadMoreButton.style.display = 'block';
    } else {
        loadMoreButton.style.display = 'none';
    }
}

function openDetailsPage(country) {
    const queryParams = new URLSearchParams({
        name: country.name.common,
        capital: country.capital || 'N/A',
        region: country.region,
        population: country.population,
    }).toString();

    window.location.href = `details.html?${queryParams}`;
}

function filterCountries() {
    const query = searchInput.value.toLowerCase();
    const region = regionFilter.value;
    const language = languageFilter.value;

    displayedCountries = allCountries.filter(country => {
        const matchesSearch = country.name.common.toLowerCase().includes(query);
        const matchesRegion = region ? country.region === region : true;
        const matchesLanguage = language ? country.languages && Object.values(country.languages).includes(language) : true;
        return matchesSearch && matchesRegion && matchesLanguage;
    });

    countriesContainer.innerHTML = '';
    currentPage = 1;
    renderCountries();
}

searchInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        const query = searchInput.value.toLowerCase();
        const matchedCountry = allCountries.find(country =>
            country.name.common.toLowerCase().includes(query)
        );

        if (matchedCountry) {
            openDetailsPage(matchedCountry); // Opens the details page in the same tab.
        } else {
            alert('Country not found.');
        }
    }
});

regionFilter.addEventListener('change', filterCountries);
languageFilter.addEventListener('change', filterCountries);
loadMoreButton.addEventListener('click', () => {
    currentPage++;
    renderCountries();
});

fetchCountries();
