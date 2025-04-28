import baseInstance from "./axios";

const getAlarmList = async (userId: string) => {
  try {
    const response = await baseInstance.get(`/alarms?userId=${userId}`);
    return response.data.alarms;
  } catch (error) {
    throw error;
  }
};

const updateAlarmRead = async (uid: number) => {
  try {
    await baseInstance.patch(`/alarms?uid=${uid}`);
  } catch (error) {
    throw error;
  }
};

const deleteAlarm = async (uid: number) => {
  try {
    await baseInstance.delete(`/alarms?uid=${uid}`);
  } catch (error) {
    throw error;
  }
};

export { getAlarmList, updateAlarmRead, deleteAlarm };
