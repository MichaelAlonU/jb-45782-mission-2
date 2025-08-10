"use strict";

(async () => {

    const getData = url => fetch(url).then(response => response.json())

    // getData (input)
    const fetchCountries = async (countrySearchId) => {
        if (!countrySearchId) {
            const countries = await getData('https://restcountries.com/v3.1/all?fields=name,population,currencies,region')
            return countries
        }
        const country = await getData(`https://restcountries.com/v3.1/${countrySearchId}?fields=name,population,currencies,region`)
        return country
    }

    // generateHTML (process input)
    const generateCountriesHTML = (countries) => {

        if (!countries) return `<p class="text-danger">No countries were found..</p>`;

        const sumPop = countries.reduce((cumulative, { population }) => {
            const current = { ...cumulative }
            return current + population;
        }, 0)
        let html = `
            <div class="card shadow-sm border-primary  mx-auto w-50">
                <div class="card-body">
                    <div class="card-header bg-primary text-white">
                        <h4 class="mb-0"> These are the countries details that were found</h4>
                    </div>

                    <ul class="list-group list-group-flush">
                        <li class="list-group-item"><strong> Total countries result: </strong> ${countries.length} </li>
                        <li class="list-group-item"><strong> Total countries population: </strong> ${sumPop} </li>
                        <li class="list-group-item"><strong> Average Population:</strong> ${(sumPop / countries.length)}</li>
                    </ul>
                    </div>
            </div>
            <table class="table">
                <thead>
                    <tr>
                        <th>Country name</th>
                        <th>Number of citizens</th>
                     </tr>
                </thead>
                <tbody id="table-country-citizens">
`       //adding country-citizens info
        html = html + countries.map(({ name: { official }, population }) =>
            `
                                <tr> 
                                    <td> ${official} </td>
                                    <td> ${population}</td>
                                </tr>`
        ).join(``);
        html = html + `  
                            </tbody>
                        </table>
                        <table class="table">
                            <thead>
                                <tr>
                                    <th>Region</th>
                                    <th>Number of countries</th>
                                </tr>
                            </thead>
                            <tbody id="table-region-countries">`
        //adding region-countries info

        const regionCountries = Object.entries(
            countries.reduce((cumulative, { region }) => {
                if (cumulative[region]) cumulative[region] += 1;
                else cumulative[region] = 1;
                return cumulative;
            }, {})
        ).map(([region, count]) => `
            <tr>
                <td>${region}</td>
                <td>${count}</td>
            </tr>
        `).join('');

        html = html + regionCountries;
        html = html + `
                            </tbody >
                        </table >
                </div >
            </div >
        `
        return html
    }

    // renderHTML (generate output)
    const renderCountriesHTML = html => {
        document.getElementById('countries-container').innerHTML = html
    }

    // all countries data
    try {
        const countries = await fetchCountries()
        let html = generateCountriesHTML(countries)
        renderCountriesHTML(html)
    }
    catch (error) {
        document.getElementById('countries-container').innerHTML = `<h5> Woops, something's wrong.. ${error.message}</h5>`
    }

    // main...
    // const countries = await fetchCountries()

    document.getElementById("country-id-button").addEventListener("click", async event => {
        const countrySearchId = document.getElementById("country-id").value;

        try {
            const country = await fetchCountries(countrySearchId)
            let html = generateCountriesHTML(countries)
            renderCountriesHTML(html)
        }
        catch (error) {
            document.getElementById('countries-container').innerHTML = `<h5> Woops, something's wrong.. ${error.message}</h5>`
        }


        const html = generateCountriesHTML(country)
        renderCountriesHTML(html)

    })
    document.getElementById("all-countries").addEventListener("click", event => {
        const html = generateCountriesHTML(country)
        renderCountriesHTML(html)

    })


})()
