import GoogleMapView from "@/components/GoogleMapView";
import { useMemo } from "react";

export default function Home() {
  return (
    <div className="flex justify-center items-center h-screen">
      <GoogleMapView />
    </div>
  );
}
