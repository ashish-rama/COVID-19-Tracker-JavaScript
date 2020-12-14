import React, { useEffect, useState } from 'react';
import { MenuItem, FormControl, Select } from '@material-ui/core';
import './App.css';

function App() {
  const [countries, setCountries] = useState([]);

  useEffect(() => {
    const getCountriesData = async () => {
      await fetch("https://disease.sh/v3/covid-19/countries")
      .then((response) => response.json())
      .then((data) => {
        const countries = data.map((country) => ({
            name: country.country, // United States, United Kingdom
            value: country.countryInfo.iso2 // UK, USA, FR
          }));
          
          setCountries(countries);
      });
    };
    getCountriesData();
  }, []);


  return (
    <div className="app">
      <div className="app__header">
        <h1>COVID-19 TRACKER</h1>
        <FormControl className="app__dropdown">
          <Select variant="outlined" value="abc">
            {/* Loop through all the countries and show a drop down list of the options*/}

            {
              countries.map(country => (
                <MenuItem value={country.value}>{country.name}</MenuItem>
              ))
            }
            
          </Select>
        </FormControl>
      </div>
      

      {/* Header */}
      {/* Title + Select input dropdown field */}

      {/* InfoBoxs */}
      {/* InfoBoxs */}
      {/* InfoBoxs */}

      {/* Table */}
      {/* Graph */}

      {/* Map */}

    </div>
  );
}

export default App;
