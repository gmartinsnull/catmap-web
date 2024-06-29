"use client";

import {
  APIProvider,
  MapCameraChangedEvent,
  Map,
} from "@vis.gl/react-google-maps";
import { useEffect, useState } from "react";
import { PoiMarker } from "./PoiMarker";

const containerStyle = {
  width: "100%",
  height: "100%",
};

type Poi = { key: string; location: google.maps.LatLngLiteral };
const locations: Poi[] = [
  {
    key: "scotiabank theater",
    location: { lat: 49.2820003, lng: -123.1243291 },
  },
  { key: "science world", location: { lat: 49.273376, lng: -123.103834 } },
  {
    key: "vancouver art gallery",
    location: { lat: 49.2829607, lng: -123.1204715 },
  },
];

const GoogleMapView = () => {
  const [data, setData] = useState<Poi[]>([]);
  const [userLocation, setUserLocation] = useState<google.maps.LatLngLiteral>();

  const fetchData = async () => {
    // const response = await fetch("https://jsonplaceholder.typicode.com/posts");
    // const json = await response.json();
    // setData(json);
  };

  const setGelolocation = async (error: any, options: any) => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        // TODO: add user location dot to map
      },
      error,
      options
    );
  };

  useEffect(() => {
    // fetchData();
    setData(locations);
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

  const key = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string;
  const mapId = process.env.NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID as string;

  return (
    <>
      <APIProvider
        apiKey={key}
        onLoad={() => console.log("Maps API has loaded.")}
      >
        <div style={containerStyle}>
          <Map
            defaultZoom={13}
            defaultCenter={{ lat: 49.283832198, lng: -123.119332856 }}
            mapId={mapId}
            onCameraChanged={(ev: MapCameraChangedEvent) =>
              console.log(
                "camera changed:",
                ev.detail.center,
                "zoom:",
                ev.detail.zoom
              )
            }
          >
            <PoiMarker pois={data} />
          </Map>
        </div>
      </APIProvider>
    </>
  );
};

export default GoogleMapView;
