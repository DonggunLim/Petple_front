import { useQuery } from "@tanstack/react-query";
import userAuthStore from "@/zustand/userAuth";
import { getWalks } from "@/apis/public.api";
import styles from "./petWalkDetail.module.css";
import { Button } from "@/components";
import { useNavigate } from "react-router-dom";
import usePagination from "@/hooks/usePagination";
import Pagination from "@/components/Pagination";

const PetWalkDetail = () => {
  const { userId } = userAuthStore();
  const navigate = useNavigate();

  const { data: walks = [] } = useQuery({
    queryKey: ["walks", userId],
    queryFn: () => (userId ? getWalks(userId) : Promise.resolve([])),
    enabled: !!userId,
  });

  // 페이지네이션 훅 적용
  const { page, setPage, paginatedData, totalPages, startPage, endPage } =
    usePagination(walks);

  return (
    <div className={styles.cardContainer}>
      <h2 className={styles.title}>펫워크 기록 🐾</h2>
      <Button onClick={() => navigate(-1)} className={styles.backButton}>
        ◀ 산책 하러가기
      </Button>
      <ul>
        {paginatedData.length > 0 ? (
          paginatedData.map((walk, index) => (
            <li key={walk.startTime.toString()} className={styles.list}>
              <div className={styles.userPetImages}>
                <img
                  src={walk.userProfileImage || "/default-user.png"}
                  alt="사용자 프로필"
                  className={styles.userImage}
                /> 🩷
                <img
                  src={walk.petImage || "/default-pet.png"}
                  alt="반려동물"
                  className={styles.petImage}
                />
              </div>
              <div>
                <p className={styles.text}>
                  <strong className={styles.listNum}>#{index + 1}</strong>
                </p>
                <p className={styles.text}>
                  <strong className={styles.listTitle}>반려동물:</strong>
                  {walk.petName || "알 수 없음"}
                </p>
                <p className={styles.text}>
                  <strong className={styles.listTitle}>시작 시간:</strong>
                  {new Date(walk.startTime).toLocaleString()}
                </p>
                <p className={styles.text}>
                  <strong className={styles.listTitle}>출발지:</strong>
                  {walk.startLocation.address} (
                  {walk.startLocation.buildingName})
                </p>
                <p className={styles.text}>
                  <strong className={styles.listTitle}>종료 시간:</strong>
                  {new Date(walk.endTime).toLocaleString()}
                </p>
                <p className={styles.text}>
                  <strong className={styles.listTitle}>도착지:</strong>
                  {walk.endLocation.address} ({walk.endLocation.buildingName})
                </p>
                <p className={styles.text}>
                  <strong className={styles.listTitle} style={{color: "#002daa"}}>총 시간:</strong>
                  {walk.duration}
                </p>
              </div>
            </li>
          ))
        ) : (
          <p className={styles.noData}>기록이 없습니다.</p>
        )}
      </ul>
      {totalPages > 1 && (
        <Pagination
          page={page}
          totalPages={totalPages}
          startPage={startPage}
          endPage={endPage}
          setPage={setPage}
        />
      )}
    </div>
  );
};

export default PetWalkDetail;
