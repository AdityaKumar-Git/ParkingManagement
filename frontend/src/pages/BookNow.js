import React, { useState, useEffect, useCallback } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  Polyline,
} from "react-leaflet";
import L from "leaflet";
import axios from "axios";
import "leaflet/dist/leaflet.css";

const API_KEY = "5b3ce3597851110001cf62482732b70cb495415c8ab25d0a3d344168"; // Replace with your actual API key

// Custom marker setup
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

const redIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const MapEvents = ({ onMapReady }) => {
  const map = useMap();

  useEffect(() => {
    console.log("Map is ready");
    onMapReady(map);
  }, [map, onMapReady]);

  return null;
};

const BookNow = () => {
  const [userLocation, setUserLocation] = useState(null);
  const [destination, setDestination] = useState("");
  const [destinationLocation, setDestinationLocation] = useState(null);
  const [parkingSpots, setParkingSpots] = useState([]);
  const [map, setMap] = useState(null);
  const [route, setRoute] = useState(null);

  const handleMapReady = useCallback((map) => {
    console.log("Map is ready and accessible in the component");
    setMap(map);
  }, []);

  const handleLocationFound = useCallback(
    (e) => {
      const { lat, lng } = e.latlng;
      console.log("Location detected:", lat, lng);
      setUserLocation(e.latlng);
      map.setView(e.latlng, 16);
    },
    [map]
  );

  const handleLocationError = useCallback((e) => {
    console.log("Location detection failed:", e.message);
    alert(
      "Unable to detect location. Please ensure location services are enabled and you have granted permission."
    );
  }, []);

  const handleDetectLocation = useCallback(() => {
    console.log("Detecting location...");
    if (map) {
      map.locate({ setView: true, maxZoom: 16 });
    } else {
      console.log("Map is not initialized");
    }
  }, [map]);

  useEffect(() => {
    if (map) {
      map.on("locationfound", handleLocationFound);
      map.on("locationerror", handleLocationError);
    }
    return () => {
      if (map) {
        map.off("locationfound", handleLocationFound);
        map.off("locationerror", handleLocationError);
      }
    };
  }, [map, handleLocationFound, handleLocationError]);

  const handleSearch = async () => {
    if (!destination) {
      alert("Please enter a destination");
      return;
    }

    // Clear the previous route
    setRoute(null);

    try {
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          destination
        )}&countrycodes=in`
      );

      if (response.data && response.data.length > 0) {
        const { lat, lon, display_name } = response.data[0];
        const newDestinationLocation = {
          lat: parseFloat(lat),
          lng: parseFloat(lon),
        };
        setDestinationLocation(newDestinationLocation);

        setParkingSpots([
          {
            id: 1,
            name: display_name,
            position: [newDestinationLocation.lat, newDestinationLocation.lng],
          },
        ]);

        if (map) {
          map.setView(
            [newDestinationLocation.lat, newDestinationLocation.lng],
            16
          );
        }
      } else {
        alert("Destination not found");
      }
    } catch (error) {
      console.error("Error searching destination:", error);
      alert("Error searching for destination. Please try again.");
    }
  };

  const handleBook = (spotId) => {
    console.log(`Booking spot ${spotId}`);
  };

  const handleNavigate = async (spotPosition) => {
    if (userLocation && map) {
      try {
        const response = await axios.get(
          `https://api.openrouteservice.org/v2/directions/driving-car?api_key=${API_KEY}&start=${userLocation.lng},${userLocation.lat}&end=${spotPosition[1]},${spotPosition[0]}`
        );
        const coords = response.data.features[0].geometry.coordinates;
        const routePoints = coords.map((coord) => [coord[1], coord[0]]);
        setRoute(routePoints);
        map.fitBounds(L.latLngBounds(routePoints));
      } catch (error) {
        console.error("Error fetching route:", error);
        alert("Error calculating route. Please try again.");
      }
    } else {
      alert(
        "User location is not available. Please detect your location first."
      );
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <div className="bg-gray-100 p-4 shadow-md">
        <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
          <input
            type="text"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            placeholder="Search destination"
            className="flex-grow px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <div className="flex space-x-2">
            <button
              onClick={handleSearch}
              className="flex items-center justify-center px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 transition-colors duration-300"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                  clipRule="evenodd"
                />
              </svg>
              Search
            </button>
            <button
              onClick={handleDetectLocation}
              className="flex items-center justify-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors duration-300"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                  clipRule="evenodd"
                />
              </svg>
              Detect Location
            </button>
          </div>
        </div>
      </div>
      <div className="flex-grow">
        <MapContainer
          center={[21.2497, 81.605]}
          zoom={16}
          className="h-full w-full"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {userLocation && (
            <Marker position={[userLocation.lat, userLocation.lng]}>
              <Popup>Your Location</Popup>
            </Marker>
          )}
          {destinationLocation && (
            <Marker
              position={[destinationLocation.lat, destinationLocation.lng]}
              icon={redIcon}
            >
              <Popup>{destination}</Popup>
            </Marker>
          )}
          {parkingSpots.map((spot) => (
            <Marker key={spot.id} position={spot.position}>
              <Popup>
                <div className="text-center">
                  <h3 className="font-bold mb-2">{spot.name}</h3>
                  <div className="flex justify-center space-x-2">
                    <button
                      onClick={() => handleBook(spot.id)}
                      className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors duration-300"
                    >
                      Book
                    </button>
                    <button
                      onClick={() => handleNavigate(spot.position)}
                      className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 transition-colors duration-300"
                    >
                      Navigate
                    </button>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
          {route && <Polyline positions={route} color="blue" />}
          <MapEvents onMapReady={handleMapReady} />
        </MapContainer>
      </div>
    </div>
  );
};

export default BookNow;
