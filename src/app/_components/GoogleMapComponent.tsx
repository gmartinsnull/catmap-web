"use client";

import { Listing } from "@/types/listing";
import {
  useLoadScript,
  GoogleMap,
  MarkerF,
  CircleF,
} from "@react-google-maps/api";
import { useEffect, useMemo, useState } from "react";

const containerStyle = {
  width: "100%",
  height: "100%",
};

export const GoogleMapComponent = () => {
  const [data, setData] = useState<Listing[]>([]);
  const [currentPosition, setCurrentPosition] =
    useState<google.maps.LatLngLiteral>();
  const libraries = useMemo(() => ["places"], []);
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string,
    libraries: libraries as any,
  });

  const fetchData = async () => {
    const response = await fetch("http://localhost:3000/api/listings").then(
      (res) => res.json()
    );
    setData(response);
  };

  const setGelolocation = async (error: any, options: any) => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCurrentPosition({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      error,
      options
    );
  };

  useEffect(() => {
    fetchData();
    if (navigator.geolocation) {
      // check for permission
      navigator.permissions.query({ name: "geolocation" }).then((result) => {
        if (result.state === "granted") {
          setGelolocation(null, null);
        } else if (result.state === "prompt") {
          setGelolocation(console.log("Error getting user location: "), {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0,
          });
          console.log("Gelolocation permission prompt state: ", result.state);
        } else if (result.state === "denied") {
          console.log("Gelolocation permission denied state: ", result.state);
        }
        result.onchange = () => {
          console.log("Gelolocation permission changed state: ", result.state);
        };
      });
    } else {
      console.log("Geolocation is not supported by this browser.");
      alert("Geolocation is not available");
    }
  }, []);

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <GoogleMap
        zoom={14}
        center={{ lat: 49.283832198, lng: -123.119332856 }}
        mapTypeId={google.maps.MapTypeId.ROADMAP}
        mapContainerStyle={containerStyle}
        onLoad={() => console.log("Map Component Loaded...")}
      >
        {data.map((poi) => (
          <MarkerF
            key={poi.id}
            position={{ lat: poi.lat, lng: poi.lng }}
            onClick={() => console.log("Marker clicked: ", poi.id)}
            options={{
              icon: {
                url: "http://maps.google.com/mapfiles/ms/icons/yellow-dot.png",
              },
            }}
          />
        ))}
        {[30].map((radius, idx) => {
          return (
            <CircleF
              key={idx}
              center={currentPosition}
              radius={radius}
              onLoad={() => console.log("Circle Load...")}
              options={{
                fillColor: "blue",
                strokeColor: "blue",
                strokeOpacity: 0.8,
              }}
            />
          );
        })}
      </GoogleMap>
    </>
  );
};
