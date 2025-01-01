const urlParams = new URLSearchParams(window.location.search);
const countryName = urlParams.get("name");
const countryDetails = document.getElementById("country-details");

async function fetchCountryDetails() {
  try {
    const response = await fetch(`https://restcountries.com/v3.1/name/${countryName}`);
    const [country] = await response.json();
    displayCountryDetails(country);
  } catch (error) {
    console.error("Error fetching country details:", error);
  }
}

function displayCountryDetails(country) {
  countryDetails.innerHTML = `
    <h2>${country.name.common}</h2>
    <p><strong>Capital:</strong> ${country.capital || "N/A"}</p>
    <p><strong>Region:</strong> ${country.region}</p>
    <p><strong>Population:</strong> ${country.population}</p>
    <p><strong>Area:</strong> ${country.area} km²</p>
    <p><strong>Languages:</strong> ${Object.values(country.languages || {}).join(", ")}</p>
    <img src="${country.flags.png}" alt="${country.name.common}">
  `;
}

// Initial load
fetchCountryDetails();
