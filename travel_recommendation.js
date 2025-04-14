// travel_recommendation.js

fetch('travel_recommendation_api.json')
  .then(response => {
    if (!response.ok) {
      throw new Error("Không thể fetch dữ liệu");
    }
    return response.json();
  })
  .then(data => {
    const keywordMap = {
      beach: 'beaches',
      beaches: 'beaches',
      temple: 'temples',
      temples: 'temples',
      country: 'countries',
      countries: 'countries'
    };

    document.getElementById('searchButton').addEventListener('click', function() {
      const searchTerm = document.getElementById('searchInput').value.trim().toLowerCase();

      if (searchTerm === "") {
        alert("Please enter a search term.");
        return;
      }

      const resultContainer = document.getElementById('results');
      resultContainer.innerHTML = "";

      let foundResults = false;
      const category = keywordMap[searchTerm];

      // Array to store intervals for updating time
      const intervals = [];

      if (category) {
        if (category === 'beaches') {
          data.beaches.slice(0, 2).forEach(beach => {
            foundResults = true;
            const beachDiv = document.createElement("div");
            beachDiv.className = "recommendation-card";
            beachDiv.innerHTML = `
              <h3>${beach.name}</h3>
              <img src="${beach.imageUrl}" alt="${beach.name}">
              <p>${beach.description}</p>
              <button class="visit-button">Visit</button>
            `;
            resultContainer.appendChild(beachDiv);
          });
        } else if (category === 'temples') {
          data.temples.slice(0, 2).forEach(temple => {
            foundResults = true;
            const templeDiv = document.createElement("div");
            templeDiv.className = "recommendation-card";
            templeDiv.innerHTML = `
              <h3>${temple.name}</h3>
              <img src="${temple.imageUrl}" alt="${temple.name}">
              <p>${temple.description}</p>
              <button class="visit-button">Visit</button>
            `;
            resultContainer.appendChild(templeDiv);
          });
        } else if (category === 'countries') {
          let cityCount = 0;
          data.countries.some(country => {
            return country.cities.some(city => {
              if (cityCount < 2) {
                foundResults = true;
                const cityDiv = document.createElement("div");
                cityDiv.className = "recommendation-card";
                const timeId = `time-${city.name.replace(/[^a-zA-Z0-9]/g, '-')}`; // Unique ID for each city's time
                cityDiv.innerHTML = `
                  <h3>${city.name}</h3>
                  <img src="${city.imageUrl}" alt="${city.name}">
                  <p>${city.description}</p>
                  <p>Local Time: <span id="${timeId}"></span></p>
                  <button class="visit-button">Visit</button>
                `;
                resultContainer.appendChild(cityDiv);

                // Function to update the time for this city
                const updateTime = () => {
                  const options = { timeZone: city.timezone, hour12: true, hour: 'numeric', minute: 'numeric', second: 'numeric' };
                  const localTime = new Date().toLocaleTimeString('en-US', options);
                  const timeElement = document.getElementById(timeId);
                  if (timeElement) {
                    timeElement.textContent = localTime;
                  }
                };

                // Initial time update
                updateTime();

                // Update time every second
                const interval = setInterval(updateTime, 1000);
                intervals.push(interval);

                cityCount++;
                return false;
              }
              return true;
            });
          });
        }
      } else {
        data.countries.forEach(country => {
          country.cities.forEach(city => {
            if (city.name.toLowerCase().includes(searchTerm) || city.description.toLowerCase().includes(searchTerm)) {
              foundResults = true;
              const cityDiv = document.createElement("div");
              cityDiv.className = "recommendation-card";
              const timeId = `time-${city.name.replace(/[^a-zA-Z0-9]/g, '-')}`; // Unique ID for each city's time
              cityDiv.innerHTML = `
                <h3>${city.name}</h3>
                <img src="${city.imageUrl}" alt="${city.name}">
                <p>${city.description}</p>
                <p>Local Time: <span id="${timeId}"></span></p>
                <button class="visit-button">Visit</button>
              `;
              resultContainer.appendChild(cityDiv);

              // Function to update the time for this city
              const updateTime = () => {
                const options = { timeZone: city.timezone, hour12: true, hour: 'numeric', minute: 'numeric', second: 'numeric' };
                const localTime = new Date().toLocaleTimeString('en-US', options);
                const timeElement = document.getElementById(timeId);
                if (timeElement) {
                  timeElement.textContent = localTime;
                }
              };

              // Initial time update
              updateTime();

              // Update time every second
              const interval = setInterval(updateTime, 1000);
              intervals.push(interval);
            }
          });
        });

        data.temples.forEach(temple => {
          if (temple.name.toLowerCase().includes(searchTerm) || temple.description.toLowerCase().includes(searchTerm)) {
            foundResults = true;
            const templeDiv = document.createElement("div");
            templeDiv.className = "recommendation-card";
            templeDiv.innerHTML = `
              <h3>${temple.name}</h3>
              <img src="${temple.imageUrl}" alt="${temple.name}">
              <p>${temple.description}</p>
              <button class="visit-button">Visit</button>
            `;
            resultContainer.appendChild(templeDiv);
          }
        });

        data.beaches.forEach(beach => {
          if (beach.name.toLowerCase().includes(searchTerm) || beach.description.toLowerCase().includes(searchTerm)) {
            foundResults = true;
            const beachDiv = document.createElement("div");
            beachDiv.className = "recommendation-card";
            beachDiv.innerHTML = `
              <h3>${beach.name}</h3>
              <img src="${beach.imageUrl}" alt="${beach.name}">
              <p>${beach.description}</p>
              <button class="visit-button">Visit</button>
            `;
            resultContainer.appendChild(beachDiv);
          }
        });
      }

      if (!foundResults) {
        resultContainer.innerHTML = "No results found for your search.";
      }

      // Clear intervals when new search is performed
      intervals.forEach(interval => clearInterval(interval));
    });

    // Define the clearResults function
    function clearResults() {
      document.getElementById('searchInput').value = "";
      document.getElementById('results').innerHTML = "";
    }

    // Attach the clearResults function to the resetButton
    document.getElementById('resetButton').addEventListener('click', clearResults);
  })
  .catch(error => {
    console.error("Lỗi khi fetch dữ liệu:", error);
  });