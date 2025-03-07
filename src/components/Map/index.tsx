import { FC, useEffect, useRef } from "react";
// import markerImg from "/images/marker.png";
import styles from "./map.module.css";
import useKakaoLoader from "./MapLoader";

interface MapProps {
  locations?: { lat: number; lng: number; name: string }[];
}

const Map: FC<MapProps> = ({ locations = [] }) => {
  const container = useRef<HTMLDivElement | null>(null);
  const { isSuccess } = useKakaoLoader();

  // 마커, 인포윈도우
  const createMarker = (
    kakao: any,
    map: any,
    location: { lat: number; lng: number; name: string },
    bounds: any
  ) => {
    const markerPosition = new kakao.maps.LatLng(location.lat, location.lng);
    const markerImage = new kakao.maps.MarkerImage(
      "/images/marker.png",
      new kakao.maps.Size(24, 35)
    );

    const marker = new kakao.maps.Marker({
      position: markerPosition,
      image: markerImage,
    });

    marker.setMap(map);
    bounds.extend(markerPosition);

    const infoWindow = new kakao.maps.InfoWindow({
      content: `
        <div style="
          padding: 5px;
          font-size: 12px;
          font-weight: bold;
          color: #333;
        ">
          ${location.name}
        </div>`,
      removable: true,
    });

    kakao.maps.event.addListener(marker, "click", () => {
      infoWindow.open(map, marker);
    });
  };

  // 지도 초기화
  const initializeMap = (kakao: any) => {
    if (!container.current) return;

    const defaultPosition = new kakao.maps.LatLng(36.35, 127.384);
    const zoomLevel = locations.length > 0 ? 5 : 14;
    const options = { center: defaultPosition, level: zoomLevel };
    const map = new kakao.maps.Map(container.current, options);

    const bounds = new kakao.maps.LatLngBounds();

    locations.forEach((location) => {
      createMarker(kakao, map, location, bounds);
    });

    if (locations.length > 0) {
      map.setBounds(bounds); // 모든 마커가 화면에 다 보이게 지도 크기 조정
    }
  };

  useEffect(() => {
    if (!isSuccess) return;

    const { kakao } = window;
    if (!kakao?.maps) return;

    initializeMap(kakao);
  }, [isSuccess, locations]);

  return <div id="map" className={styles.mapContainer} ref={container}></div>;
};

export default Map;
