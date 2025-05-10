import { create } from "zustand";
import type { AlarmType } from "@/types/alarm.type";

interface AlarmStore {
  alarmList: AlarmType[];
  addAlarm: (alarms: AlarmType[]) => void;
  deleteAlarm: (uid: number) => void;
  updateAlarm: (alarm: AlarmType) => void;
}

export const useAlarmStore = create<AlarmStore>((set) => ({
  alarmList: [],
  addAlarm: (alarms: AlarmType[]) =>
    set((state) => ({ alarmList: [...state.alarmList, ...alarms] })),
  deleteAlarm: (uid: number) =>
    set((state) => ({
      alarmList: state.alarmList.filter((item) => item.id !== uid),
    })),
  updateAlarm: (alarm: AlarmType) =>
    set((state) => ({
      alarmList: state.alarmList.map((item) =>
        item.id === alarm.id ? alarm : item
      ),
    })),
}));
