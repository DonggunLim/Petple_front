import baseInstance from "./axios";

const getAlarmList = async (userId: string) => {
  try {
    const response = await baseInstance.get(`/alarms?userId=${userId}`);
    return response.data.alarms;
  } catch (error) {
    throw error;
  }
};

const updateAlarmRead = async (id: number) => {
  try {
    await baseInstance.patch(`/alarms/${id}`);
  } catch (error) {
    throw error;
  }
};

const deleteAlarm = async (id: number) => {
  try {
    await baseInstance.delete(`/alarms/${id}`);
  } catch (error) {
    throw error;
  }
};

export { getAlarmList, updateAlarmRead, deleteAlarm };
