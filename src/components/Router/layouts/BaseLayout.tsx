import "../../../index.css";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import Header from "../../Header";
import MenuBar from "../../MenuBar";
import HelmetMetaTags from "../../HelmetMetaTags";
import { useEffect, useMemo } from "react";
import { simpleLayoutPath } from "@/consts/simpleLayoutPath";

import useUserStore from "@/zustand/userStore";
import { useAlarmStore } from "@/zustand/alarmStore";
import useToast from "@/components/UI/Toast/hooks/useToast";
import { AlarmType } from "@/types/alarm.type";
import styles from "@/components/UI/Toast/default.module.css";

const BaseLayout = () => {
  const { pathname: currentPath } = useLocation();
  const isSimpleLayout = useMemo(
    () => simpleLayoutPath.some((path) => currentPath.startsWith(path)),
    [currentPath]
  );

  const { user } = useUserStore();
  const { addAlarm } = useAlarmStore();
  const { toast, removeToast } = useToast();
  const navigate = useNavigate();

  const handleClickToast = (alarm: AlarmType) => {
    navigate(`/chat/${alarm.from.nickname}`);
    removeToast();
  };

  // sse연결
  useEffect(() => {
    // 로그인한 유저만 SSE 연결
    if (!user?.id) {
      return;
    }
    // eventSource instance 생성
    const eventSource = new EventSource(
      `${import.meta.env.VITE_API_BASE_URL}/api/alarms/connect`,
      { withCredentials: true }
    );

    eventSource.onmessage = (event) => {
      const currentPath = window.location.pathname;
      const alarm: AlarmType = JSON.parse(event.data);
      // 해당하는 알림 채팅방에 있을떄에는 알림 수신x
      if (decodeURIComponent(currentPath) === `/chat/${alarm.from.nickname}`) {
        return;
      }
      addAlarm([alarm]);
      toast({
        type: "NONE",
        time: 3000,
        description: (
          <div
            className={styles.alarm_toast}
            onClick={() => {
              handleClickToast(alarm);
            }}
          >
            <p>
              <span className={styles.alarm_toast_title}>펫프렌즈</span>에
              새로운 메시지가 있습니다.
            </p>
            <div className={styles.alarm_toast_content}>
              <img
                className={styles.alarm_toast_content_img}
                src={alarm.from.profileImage}
                alt="프로필 이미지"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/profile/${alarm.from.nickname}`);
                }}
              />
              <div className={styles.alarm_toast_content_text_container}>
                <p className={styles.alarm_toast_content_text}>
                  {alarm.content}
                </p>
              </div>
            </div>
          </div>
        ),
      });
    };

    return () => {
      eventSource.close();
    };
  }, [user?.id]);

  return (
    <>
      <HelmetMetaTags currentPath={currentPath} />
      <div className="wrapper">
        <Header />
        <div className="content">
          <Outlet />
        </div>
        {isSimpleLayout || <MenuBar />}
      </div>
    </>
  );
};

export default BaseLayout;
