import React, { useEffect, useState } from "react";
import styles from "./Map.module.css";

const MapComponent = ({ coordinates }) => {
  const [map, setMap] = useState(null);
  const [marker, setMarker] = useState(null);
  const [userPosition, setUserPosition] = useState(null);

  useEffect(() => {
    const script = document.createElement("script");
    const api_key = "7e4eb087293f86fae130bfa4231e7f99";
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${api_key}&libraries=services&autoload=false`;
    script.async = true;
    document.head.appendChild(script);

    script.onload = () => {
      window.kakao.maps.load(() => {
        const container = document.getElementById("map");
        const initialPosition = userPosition
          ? new window.kakao.maps.LatLng(userPosition.lat, userPosition.lng)
          : new window.kakao.maps.LatLng(35.1595, 126.8526); // 기본 위치: 광주시청

        const options = {
          center: initialPosition,
          level: 3,
        };
        const mapInstance = new window.kakao.maps.Map(container, options);
        setMap(mapInstance);
      });
    };

    return () => {
      document.head.removeChild(script);
    };
  }, [userPosition]);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          setUserPosition({ lat, lng });
        },
        (error) => {
          console.error("Geolocation error:", error);
          setUserPosition({ lat: 35.1595, lng: 126.8526 }); // 위치 오류 시 기본 위치
        }
      );
    } else {
      setUserPosition({ lat: 35.1595, lng: 126.8526 }); // 위치 서비스를 지원하지 않을 때 기본 위치
    }
  }, []);

  useEffect(() => {
    if (map) {
      // 현재 위치 또는 기본 위치로 지도의 중심을 설정합니다.
      const centerPosition = coordinates
        ? new window.kakao.maps.LatLng(coordinates.lat, coordinates.lng)
        : userPosition
        ? new window.kakao.maps.LatLng(userPosition.lat, userPosition.lng)
        : new window.kakao.maps.LatLng(35.1595, 126.8526);

      map.setCenter(centerPosition);

      // 마커 업데이트
      if (marker) {
        marker.setMap(null);
      }

      const newMarker = new window.kakao.maps.Marker({
        map: map,
        position: centerPosition,
      });

      setMarker(newMarker);
    }
  }, [map, coordinates, userPosition]);

  return (
    <div className={styles.mapContainer}>
      <div id="map" style={{ width: "100%", height: "200px" }}></div>
    </div>
  );
};

export default MapComponent;
