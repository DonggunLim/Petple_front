import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components";
import styles from "./petWalk.module.css";
import Map from "@/components/Map";
import { WalkData } from "@/types/petApi.type";
import { postWalkData } from "@/apis/public.api";
import userStore from "@/zustand/userStore";
import useToast from "@/components/UI/Toast/hooks/useToast";

const PetWalk = () => {
  const [tracking, setTracking] = useState(false);
  const [watchId, setWatchId] = useState<number | null>(null);
  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lng: number;
    name: string;
  } | null>(null);
  const [startTime, setStartTime] = useState<string | null>(null);
  const [selectedPet, setSelectedPet] = useState<string | null>(null);
  const [startLocation, setStartLocation] = useState<{
    lat: number;
    lng: number;
    address: string;
    buildingName: string;
  } | null>(null);
  const navigate = useNavigate();

  const { user } = userStore();
  const { toast } = useToast();

  const mutation = useMutation({
    mutationFn: postWalkData,
    onSuccess: () => {
      console.log("산책 기록이 성공적으로 저장되었습니다.");
    },
    onError: (error) => {
      console.error("산책 기록 저장 중 오류 발생:", error);
    },
  });

  const requestLocation = () => {
    if (!navigator.geolocation) {
      toast({
        type: "ERROR",
        description: "이 브라우저에서는 위치 정보를 지원하지 않습니다.",
      });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          name: "현재 위치",
        });
      },
      (error) => {
        toast({
          type: "ERROR",
          description: `위치 가져오기 실패: ${error.message}`,
        });
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 3000 }
    );
  };

  const startTracking = () => {
    if (!user?.id) {
      toast({ type: "INFO", description: "로그인이 필요합니다." });
      navigate("/login");
      return;
    }

    if (!selectedPet) {
      toast({
        type: "ERROR",
        description: "산책을 시작할 반려동물을 선택해주세요!",
      });
      return;
    }

    toast({ type: "INFO", description: "산책이 시작되었습니다!" });
    setStartTime(new Date().toISOString());

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            name: "",
          });
          setStartLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            address: "",
            buildingName: "",
          });

          const id = navigator.geolocation.watchPosition(
            (position) => {
              setUserLocation({
                lat: position.coords.latitude,
                lng: position.coords.longitude,
                name: "",
              });
            },
            (error) => console.error("Geolocation error:", error),
            { enableHighAccuracy: true, maximumAge: 1000 }
          );
          setWatchId(id);
          setTracking(true);
        },
        (error) => console.error("Geolocation error:", error),
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    }
  };

  const stopTracking = () => {
    if (!user?.id) {
      toast({ type: "INFO", description: "로그인이 필요합니다." });
      return;
    }

    if (watchId !== null) {
      navigator.geolocation.clearWatch(watchId);
      setWatchId(null);
    }
    setTracking(false);

    toast({
      type: "SUCCESS",
      description: "산책이 종료되었습니다! 기록보기에서 확인해주세요.",
    });

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const selectedPetId =
          user.pets?.find((pet) => pet.id === selectedPet)?.id || "";
        const walkData: WalkData = {
          user: user.id,
          pet: selectedPetId,
          startTime: startTime ?? new Date().toISOString(),
          startLocation: startLocation ?? {
            lat: 0,
            lng: 0,
            address: "",
            buildingName: "",
          },
          endTime: new Date().toISOString(),
          endLocation: {
            address: "",
            buildingName: "",
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          },
        };
        mutation.mutate(walkData);
      },
      (error) => console.error("Geolocation error:", error),
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  const handleClickList = () => {
    if (!user?.id) {
      // alert("로그인이 필요합니다.");
      toast({ type: "INFO", description: "로그인이 필요합니다." });
      navigate("/login");
      return;
    }
    navigate("/petwalk/detail");
  };
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>매일매일 산책 기록 🌱</h2>

      <p className={styles.description}>
        반려동물과 함께 산책을 다녀오셨나요?
        <br />
        이제 산책을 다녀온 장소를 기록하여 추억으로 남겨보세요.
        <br />
        시작 버튼을 누르고 종료 버튼을 누르면 자동으로 지도에 마커가 찍히며
        <br />
        거리를 계산해줍니다.
      </p>

      <Button label="위치 가져오기" onClick={requestLocation} />
      <div className={styles.petSelection}>
        <p>산책할 반려동물을 선택하세요:</p>
        <select
          value={selectedPet || ""}
          onChange={(e) => setSelectedPet(e.target.value)}
          disabled={tracking}
        >
          <option value="" disabled>
            반려동물 선택
          </option>
          {user?.pets?.map((pet) => (
            <option key={pet.id} value={pet.id}>
              {pet.name}
            </option>
          ))}
        </select>
      </div>

      <div className={styles.tabContainer}>
        <Button label="시작" onClick={startTracking} disabled={tracking} />
        <Button
          label="종료"
          onClick={stopTracking}
          disabled={!tracking || mutation.isPending}
        />
        <Button
          label="기록보기"
          className={styles.listBtn}
          onClick={handleClickList}
        />
      </div>

      <div style={{ width: "360px" }}>
        <Map locations={userLocation ? [userLocation] : []} />
      </div>

      <div className={styles.description}>
        <span className={styles.description_span}>사용방법: </span>
        <ul className={styles.description_list}>
          <li style={{ color: "red", fontWeight: "bold" }}>
            1️⃣ 정확한 기록을 위해 모바일 버전에서 사용해주세요.📱
          </li>
          <li>2️⃣ 현재 위치에서 시작 버튼을 눌러주세요.</li>
          <li>3️⃣ 반려동물과 함께 산책을 다니시면 돼요.</li>
          <li>
            <span className={styles.description_p_span}>
              🌱 종료되지 않게 주의해주세요.
            </span>
          </li>
          <li>4️⃣ 산책이 완료되면 종료 버튼을 눌러주세요.</li>
        </ul>
      </div>
    </div>
  );
};

export default PetWalk;
