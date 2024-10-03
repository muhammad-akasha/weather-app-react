import axios from "axios";
import "@fortawesome/fontawesome-free/css/all.min.css";
import React, { useEffect, useRef, useState } from "react";
import Swal from "sweetalert2";

function App() {
  const [weatherArr, setWeatherArr] = useState([]);
  const [cities, setCIties] = useState([]);
  const appId = "f6a0f36fb383472394974653240409";
  const city = useRef(null);

  function setTimePeriod(time) {
    let oldTime = time.slice(10, 13);
    let timeAfterSet = null;
    if (oldTime.includes("00")) {
      return (timeAfterSet = time.slice(0, 11) + `12${time.slice(13)} AM`);
    } else if (oldTime.includes("12")) {
      return (time = time + " PM");
    } else if (oldTime > 12) {
      return (timeAfterSet =
        time.slice(0, 11) + (oldTime % 12) + time.slice(13) + " PM");
    } else {
      return (timeAfterSet = time + " AM");
    }
  }

  function manageWeatherIcon(weatherInfo) {
    if (weatherInfo.includes("rain")) {
      return <i className="text-[150px] fa-solid fa-cloud-rain"></i>;
    } else if (weatherInfo.includes("smog")) {
      return <i className="text-[150px] fa-solid fa-smog"></i>;
    } else if (weatherInfo.includes("clouds")) {
      return <i className="text-[150px] fa-solid fa-cloud"></i>;
    } else if (weatherInfo.includes("unny")) {
      return <i className="text-[150px] fa-solid fa-sun"></i>;
    } else if (weatherInfo.includes("lear")) {
      return <i className="text-[150px] fa-solid fa-moon"></i>;
    } else {
      return <i className="text-[150px] fa-solid fa-cloud"></i>;
    }
  }

  function getWeather(e) {
    e.preventDefault();
    const currCity = city.current.value;
    if (!currCity) {
      Swal.fire({
        icon: "error",
        title: "Please Enter Any City",
        position: "top",
      });
      return;
    }
    if (cities.includes(currCity)) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "City Already Searched",
        position: "top",
      });
      return;
    }
    cities.push(currCity);
    setCIties([...cities]);
    axios(
      `https://api.weatherapi.com/v1/forecast.json?key=${appId}&q=${currCity}&aqi=yes&days=7`
    )
      .then((res) => {
        weatherArr.unshift(res.data);
        setWeatherArr([...weatherArr]);
      })
      .catch((err) => {
        alert(err.response.data.error.message);
      });
    city.current.value = "";
  }

  return (
    <div>
      <div
        className="navbar text-center py-5"
        style={{
          background: "linear-gradient(0deg, #3E2D8F 0%, #9D52AC 100%)",
        }}
      >
        <a className="btn btn-ghost m-auto text-3xl text-slate-300 font-semibold">
          Weather App
        </a>
      </div>
      <div
        className={
          weatherArr.length > 0
            ? "weather-container h-[100%]"
            : "weather-container h-[100vh]"
        }
      >
        <h1
          style={{ letterSpacing: "2px" }}
          className="text-center text-slate-300 font-semibold text-[33px]"
        >
          Welcome to the weather app
        </h1>
        <form onSubmit={getWeather}>
          <div className="text-center mt-[70px] flex gap-3 justify-center mb-[50px]">
            <input
              type="text"
              ref={city}
              placeholder="Type here"
              className="input input-bordered w-full max-w-[28rem]"
            />
            <button type="submit" className="btn btn-outline">
              Search
            </button>
          </div>
        </form>
        {weatherArr.length > 0 && (
          <>
            {weatherArr.map((weather, index) => {
              const {
                location: { name, country, localtime },
                current: {
                  temp_c,
                  feelslike_c,
                  wind_kph,
                  condition: { icon, text },
                },
                forecast: { forecastday },
              } = weather;
              return (
                <div
                  key={index}
                  className="mb-4 text-[#fff] w-[100%] md:w-[700px] lg:w-[800px] px-[20px] py-[40px] my-[20px] rounded-md mx-auto"
                  style={{
                    background:
                      "linear-gradient(0deg, #3E2D8F 0%, #9D52AC 100%)",
                  }}
                >
                  <h2
                    style={{ letterSpacing: "5px" }}
                    className="text-center text-[30px]"
                  >
                    {setTimePeriod(localtime)}
                  </h2>
                  <div className="flex flex-col-reverse text-center md:justify-around sm:text-left sm:flex-row mt-[20px]">
                    <div>
                      <h2>
                        {name}, {country}
                      </h2>
                      <h2>Temperature: {temp_c}°C</h2>
                      <h2>Feels Like: {feelslike_c}°C</h2>
                      <h2>
                        Wind Speed {wind_kph}{" "}
                        <i className="fa-solid fa-wind"></i> km/h
                      </h2>
                      <h2 className="flex justify-center sm:justify-start md:gap-2 md:items-center">
                        {text} <img src={icon} alt={text} />
                      </h2>
                    </div>
                    <div>{manageWeatherIcon(text)}</div>
                  </div>
                  <div className="mt-4">
                    <h3 className="text-center text-[24px]">7-Day Forecast</h3>
                    <div className="flex gap-3 justify-center text-center flex-wrap">
                      {forecastday.map((forecast, dayIndex) => {
                        const {
                          date,
                          day: {
                            condition: { text: foreText, icon: foreIcon },
                            mintemp_c,
                            maxtemp_c,
                          },
                        } = forecast;
                        return (
                          <div
                            key={dayIndex}
                            className="text-center mt-4 text-[14px] shadow-lg p-[5px]"
                          >
                            <h6>
                              {" "}
                              <span>Date</span> {date.slice(8)}
                            </h6>
                            <img
                              className="m-auto"
                              src={foreIcon}
                              alt={foreText}
                            />
                            <h6>{foreText}</h6>
                            <h6>Min:{mintemp_c}°C</h6>
                            <h6>Max: {maxtemp_c}°C</h6>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })}
          </>
        )}
      </div>
    </div>
  );
}

export default App;
