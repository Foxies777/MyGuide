import React, { useEffect, useState, useCallback } from "react";
import MobileNotifications from "./MobileNotifications";

const APIkey = "d798438582cb4b7eb243adca60f3bc61";

function Map() {
  const [location, setLocation] = useState();
  const [lastCoords, setLastCoords] = useState({ latitude: null, longitude: null });

  const getLocationInfo = useCallback((latitude, longitude) => {
    if (latitude === lastCoords.latitude && longitude === lastCoords.longitude) {
      return;
    }

    setLastCoords({ latitude, longitude });

    const url = `https://api.opencagedata.com/geocode/v1/json?q=${latitude},${longitude}&key=${APIkey}`;
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        if (data.status.code === 200) {
          setLocation(data.results[0].formatted);
        } else {
          console.log("Reverse geolocation request failed.");
        }
      })
      .catch((error) => console.error(error));
  }, [lastCoords]);

  const options = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0,
  };

  function success(pos) {
    var crd = pos.coords;
    getLocationInfo(crd.latitude, crd.longitude);
  }

  function errors(err) {
    console.warn(`ERROR(${err.code}): ${err.message}`);
  }

  useEffect(() => {
    let intervalId;
    if (navigator.geolocation) {
      navigator.permissions
        .query({ name: "geolocation" })
        .then((result) => {
          if (result.state === "granted" || result.state === "prompt") {
            intervalId = setInterval(() => {
              navigator.geolocation.getCurrentPosition(success, errors, options);
            }, 60000);
          }
        });
    } else {
      console.log("Geolocation is not supported by this browser.");
    }
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, []);

  return (
    <div className="Map">
      <MobileNotifications currentStreet={location}/>
      {location ? <>Your location: {location}</> : null}
    </div>
  );
}

export default Map;
