import { useQuery } from "@tanstack/react-query";
import userStore from "@/zustand/userStore";
import { getWalks } from "@/apis/public.api";
import styles from "./petWalkDetail.module.css";
import { Button } from "@/components";
import { useNavigate } from "react-router-dom";
import usePagination from "@/components/UI/Pagination/hooks/usePaginationData";
import { useEffect } from "react";
import useToast from "@/components/UI/Toast/hooks/useToast";
import Pagination from "@/components/UI/Pagination";
import { Helmet } from "react-helmet-async";

const PetWalkDetail = () => {
  const { user } = userStore();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!user?.id) {
      toast({ type: "ERROR", description: "로그인이 필요합니다." });
      navigate("/login");
    }
  }, [user?.id, navigate]);

  if (!user?.id) return null;

  const { data: walks = [] } = useQuery({
    queryKey: ["walks", user.id],
    queryFn: () => (user.id ? getWalks(user?.id) : Promise.resolve([])),
    enabled: !!user.id,
  });

  // 페이지네이션 훅 적용
  const { page, setPage, paginatedData, totalPages, startPage, endPage } =
    usePagination(walks);

  return (
    <div className={styles.cardContainer}>
      <Helmet>
        <title>{`${user.nickname ?? "사용자"}님의 펫워크 | PetPle`}</title>
        <meta
          name="description"
          content={`${
            user.nickname ?? "사용자"
          }님의 반려동물 산책 기록을 확인할 수 있습니다.`}
        />
      </Helmet>
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
                  src={walk.userProfileImage || "/images/profile.png"}
                  alt="사용자 프로필"
                  className={styles.userImage}
                />
                🩷
                <img
                  src={walk.petImage || "/images/pet.png"}
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
                  <strong
                    className={styles.listTitle}
                    style={{ color: "#002daa" }}
                  >
                    총 시간:
                  </strong>
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
        >
          <Pagination.Navigator type="prev" />
          <Pagination.PageButtons />
          <Pagination.Navigator type="next" />
        </Pagination>
      )}
    </div>
  );
};

export default PetWalkDetail;
