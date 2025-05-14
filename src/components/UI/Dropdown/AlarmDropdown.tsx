import styles from "./dropdown.module.css";
import Dropdown from "./components";
import AlaramIcon from "@/assets/icons/alarm_icon.svg?react";
import CloseIcon from "@/assets/icons/close.svg?react";
import { useMemo } from "react";
import { useAlarmStore } from "@/zustand/alarmStore";
import { useNavigate, useLocation } from "react-router-dom";
import { AlarmType } from "@/types/alarm.type";
import { updateAlarmRead, deleteAlarm } from "@/apis/alarm.api";
import useToast from "../Toast/hooks/useToast";
import Avartar from "../Avartar";
const AlarmDropdown = () => {
  const {
    alarmList,
    deleteAlarm: deleteAlarmStore,
    updateAlarm: updateAlarmStore,
  } = useAlarmStore();
  const { pathname: currentPath } = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();

  const unreadAlarmCount = useMemo(
    () => alarmList.filter((alarm) => !alarm.is_read).length,
    [alarmList]
  );
  const sortedAlarmList = useMemo(
    () =>
      [...alarmList].sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      ),
    [alarmList]
  );

  const handleAlarmClick = async (alarm: AlarmType) => {
    if (alarm.is_read) {
      return;
    }
    try {
      await updateAlarmRead(alarm.id);
      updateAlarmStore({ ...alarm, is_read: true });
    } catch (error) {
      toast({ type: "ERROR", description: "알림 업데이트 실패하였습니다." });
    } finally {
      if (decodeURIComponent(currentPath) === `/chat/${alarm.from.nickname}`) {
        return;
      }
      navigate(`/chat/${alarm.from.nickname}`);
    }
  };

  const handleDeleteAlarm = async (alarm: AlarmType) => {
    try {
      await deleteAlarm(alarm.id);
      deleteAlarmStore(alarm.id);
    } catch (error) {
      toast({
        type: "ERROR",
        description: "알림을 삭제하는데 실패하였습니다.",
      });
    }
  };
  return (
    <>
      <Dropdown.Root>
        <Dropdown.Trigger className={styles.trigger}>
          <AlaramIcon className={styles.icon} />
          <span className={styles.badge}>{unreadAlarmCount}</span>
        </Dropdown.Trigger>
        <Dropdown.Content className={styles.dropdown_content}>
          <ul className={styles.dropdown_container}>
            <div className={styles.dropdown_header}>
              <p className={styles.dropdown_title}>알림</p>
              <p className={styles.dropdown_description}>
                최근 30일간 알림내역 노출
              </p>
            </div>
            {sortedAlarmList.map((alarm) => (
              <Dropdown.Item
                key={alarm.id}
                className={`${styles.item} ${alarm.is_read && styles.read}`}
                onClick={() => {
                  handleAlarmClick(alarm);
                }}
              >
                <div className={styles.text_container}>
                  <p className={styles.date}>
                    {alarm.created_at
                      .toLocaleString()
                      .slice(0, 10)
                      .replaceAll("-", ".")}{" "}
                  </p>
                  <div className={styles.text_main}>
                    <Avartar
                      image={alarm.from.profileImage}
                      className={styles.avartar}
                    />
                    <div>
                      <p className={styles.text}>
                        <span className={styles.sender}>
                          {alarm.from.nickname}
                        </span>{" "}
                        님으로부터 메시지가 도착하였습니다.
                      </p>
                      <p className={styles.content}>{alarm.content}</p>
                    </div>
                  </div>
                </div>
                <button
                  className={styles.close_icon_container}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteAlarm(alarm);
                  }}
                >
                  <CloseIcon className={styles.close_icon} />
                </button>
              </Dropdown.Item>
            ))}
            {sortedAlarmList.length === 0 && (
              <li className={styles.empty_alarm}>
                <p className={styles.empty_alarm_text}>알림이 없습니다.</p>
              </li>
            )}
          </ul>
        </Dropdown.Content>
      </Dropdown.Root>
    </>
  );
};

export default AlarmDropdown;
