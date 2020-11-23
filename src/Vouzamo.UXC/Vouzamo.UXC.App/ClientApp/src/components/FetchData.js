import React, { useState, useContext, useEffect } from 'react';

import { tenantContext } from './Layout';

export const FetchData = () => {

    const [data, setData] = useState({ forecasts: [], loading: true })

    useEffect(() => {
        populateWeatherData()
    }, [])

  const renderForecastsTable = (forecasts) => {
    return (
      <table className='table table-striped' aria-labelledby="tabelLabel">
        <thead>
          <tr>
            <th>Date</th>
            <th>Temp. (C)</th>
            <th>Temp. (F)</th>
            <th>Summary</th>
          </tr>
        </thead>
        <tbody>
          {forecasts.map(forecast =>
            <tr key={forecast.date}>
              <td>{forecast.date}</td>
              <td>{forecast.temperatureC}</td>
              <td>{forecast.temperatureF}</td>
              <td>{forecast.summary}</td>
            </tr>
          )}
        </tbody>
      </table>
    );
  }

    const populateWeatherData = async() => {
        const response = await fetch('weatherforecast');
        const data = await response.json();
        setData({ forecasts: data, loading: false });
    }

    const contents = data.loading
        ? <p><em>Loading...</em></p>
        : renderForecastsTable(data.forecasts);

    return (
        <div>
            <h1 id="tabelLabel" >Weather forecast</h1>
            <p>This component demonstrates fetching data from the server.</p>
            {contents}
        </div>
    );
}
