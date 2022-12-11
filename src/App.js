import { useEffect, useState } from "react";
import "./styles.css";
// import cities from "./Database/cities";

export default function App() {
  // const [cityData] = useState(cities);
  const [city] = useState({
    id: 37517,
    name: "Malatya",
    lat: 38.3554,
    lng: -38.3337
  });
  const [response, setResponse] = useState({});

  useEffect(() => {
    fetch(
      `https://api.sunrise-sunset.org/json?lat=${city.lat}&lng=${city.lng}&date=today`
    )
      .then((response) => response.json())
      .then((data) => setResponse(data.results));
  }, [city]);

  return (
    <div
      className="App"
      style={{ backgroundColor: "black", color: "white", height: "100%" }}
    >
      <h1>{city.name}</h1>
      <h2>Sunrise: {response.sunrise}</h2>
      <h2>Sunset: {response.sunset}</h2>
    </div>
  );
}
