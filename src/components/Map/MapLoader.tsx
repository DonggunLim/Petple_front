import { useQuery } from "@tanstack/react-query";
import baseInstance from "@/apis/axios";

const KAKAO_MAP_SCRIPT_ID = "kakao-map-script";

const fetchKakaoMapScriptUrl = async (): Promise<string> => {
  const response = await baseInstance.get("/public/kakao/map-script");
  return response.data.scriptUrl;
};

const loadKakaoMap = async (): Promise<boolean> => {
  try {
    const scriptUrl = await fetchKakaoMapScriptUrl();

    if (typeof window === "undefined") {
      return false;
    }

    return new Promise((resolve, reject) => {
      if (window.kakao && window.kakao.maps) {
        resolve(true);
        return;
      }

      const script = document.createElement("script");
      script.id = KAKAO_MAP_SCRIPT_ID;
      script.src = scriptUrl;
      script.async = true;

      script.onload = () => {
        window.kakao.maps.load(() => resolve(true));
      };

      script.onerror = () => reject(new Error("Kakao Maps API 로드 실패"));

      document.head.appendChild(script);
    });
  } catch (error) {
    console.error("카카오 지도 API 스크립트 URL 요청 실패:", error);
    return false;
  }
};

// 클린업 추가
const cleanupKakaoScript = () => {
  if (typeof window === "undefined") return;
  const script = document.getElementById(KAKAO_MAP_SCRIPT_ID);
  if (script) {
    document.head.removeChild(script);
  }
};

const useKakaoLoader = () => {
  const query = useQuery<boolean, Error>({
    queryKey: ["kakaoMap"],
    queryFn: loadKakaoMap,
    staleTime: 7 * 24 * 60 * 60 * 1000,
    enabled: typeof window !== "undefined",
  });

  return { ...query, cleanup: cleanupKakaoScript };
};

export default useKakaoLoader;
