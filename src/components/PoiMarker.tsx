"use client";
import { AdvancedMarker, Pin, useMap } from "@vis.gl/react-google-maps";
import { useCallback } from "react";

type Poi = { key: string; location: google.maps.LatLngLiteral };

export const PoiMarker = (props: { pois: Poi[] }) => {
  const map = useMap();
  // TODO: add click handler
  const handleClick = (key: string) =>
    useCallback((ev: google.maps.MapMouseEvent) => {
      if (!map) return;
      if (!ev.latLng) return;
      console.log("marker clicked:", ev.latLng.toString(), key);
      map.panTo(ev.latLng);
    }, []);

  return (
    <>
      {props.pois.map((poi: Poi) => (
        <AdvancedMarker
          key={poi.key}
          position={poi.location}
          clickable={true}
          onClick={handleClick(poi.key)}
        >
          <Pin
            background={"#FBBC04"}
            glyphColor={"#000"}
            borderColor={"#000"}
          />
        </AdvancedMarker>
      ))}
    </>
  );
};
