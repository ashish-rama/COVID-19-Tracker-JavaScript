import React, { useEffect, useState } from 'react';
import { MenuItem, FormControl, Select, Card, CardContent } from '@material-ui/core';
import InfoBox from './components/InfoBox/InfoBoxComponent';
import Map from './components/Map/MapComponent';
import Table from './components/Table/TableComponent';
import LineGraph from './components/LineGraph/LineGraphComponent';
import './App.css';
import "leaflet/dist/leaflet.css";
import { sortData, prettyPrintStat } from './util';

function App() {
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState('worldwide');
  const [countryInfo, setCountryInfo] = useState({});
  const [tableData, setTableData] = useState([]);
  const [mapCenter, setMapCenter] = useState({ lat: 20, lng: 0 });
  const [mapZoom, setMapZoom] = useState(2);
  const [mapCountries, setMapCountries] = useState([]);
  const [casesType, setCasesType] = useState("cases");
  const [latest, setLatest] = useState([]);

  const lastUpdated = new Date(parseInt(latest.updated)).toString();

  useEffect(() => {
    fetch("https://disease.sh/v3/covid-19/all")
    .then(response => response.json())
    .then(data => {
      setCountryInfo(data);
      setLatest(data);
    });
  }, []);

  useEffect(() => {
    const getCountriesData = async () => {
      await fetch("https://disease.sh/v3/covid-19/countries")
      .then((response) => response.json())
      .then((data) => {
        const countries = data.map((country) => ({
            name: country.country, // United States, United Kingdom
            value: country.countryInfo.iso2 // UK, USA, FR
          }));

          const sortedData = sortData(data);
          setTableData(sortedData);
          setMapCountries(data);
          setCountries(countries);
      });
    };
    getCountriesData();
  }, []);

  const onCountryChange = async (event) => {
    const countryCode = event.target.value;

    const url = countryCode === "worldwide" ? "https://disease.sh/v3/covid-19/all" : `https://disease.sh/v3/covid-19/countries/${countryCode}`

    await fetch(url)
    .then(response => response.json())
    .then(data => {
      setCountry(countryCode);
      setCountryInfo(data);

      setMapCenter(countryCode === "worldwide" ? { lat: 20, lng: 0 } : [data.countryInfo.lat, data.countryInfo.long]);
      setMapZoom(countryCode === "worldwide" ? 2 : 4);
    })
  };

  return (
    <div className="app">
      <div className="app__left">
      {/* Header */}
      {/* Title + Select input dropdown field */}
      <div className="app__header">
        <h1>COVID-19 TRACKER</h1>
        <FormControl className="app__dropdown">
          <Select variant="outlined" value={country} onChange={onCountryChange}>  
            {/* Loop through all the countries and show a drop down list of the options*/}
            <MenuItem value="worldwide">Worldwide</MenuItem>
            {countries.map(country => (
                <MenuItem value={country.value}>{country.name}</MenuItem>
              ))}
          </Select>
        </FormControl>
      </div>
      
      <div className="app__stats">
        <InfoBox 
          isRed
          active={casesType === 'cases'}
          onClick={e => setCasesType('cases')} 
          title="Coronavirus Cases" 
          cases={prettyPrintStat(countryInfo.todayCases)} 
          total={prettyPrintStat(countryInfo.cases)}/>
        <InfoBox 
          active={casesType === 'recovered'}
          onClick={e => setCasesType('recovered')} 
          title="Recovered" 
          cases={prettyPrintStat(countryInfo.todayRecovered)} 
          total={prettyPrintStat(countryInfo.recovered)}/>
        <InfoBox 
          isRed
          active={casesType === 'deaths'}
          onClick={e => setCasesType('deaths')} 
          title="Deaths" 
          cases={prettyPrintStat(countryInfo.todayDeaths)} 
          total={prettyPrintStat(countryInfo.deaths)}/>
      </div>

      {/* Map */}
      <Map
        countries={mapCountries}
        casesType={casesType}
        center={mapCenter}
        zoom={mapZoom}
      />
      <p style={{color: "black", padding: "20px"}}>Last Updated: {lastUpdated}</p>
      <p style={{color: "black", padding: "20px"}}>Source code: <a href={"https://github.com/ashish-rama/COVID-19-Tracker-JavaScript"}>GitHub</a></p>
      </div>
      <Card className="app__right">
        <CardContent>
          <h3>Live Cases by Country</h3>
          <Table countries={tableData} />
          {/* Table */}
          <h3 className="app__graphTitle">Worldwide new {casesType}</h3>
          <LineGraph className="app__graph" casesType={casesType}/>
          {/* Graph */}
        </CardContent>
      </Card>
    </div>
  );
}

export default App;
