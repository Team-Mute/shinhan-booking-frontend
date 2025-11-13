import axiosClient from "./axiosClient";

// 사전 답사 생성: createPrevisitApi
export async function createPrevisitApi(
  reservationId: number,
  previsitFrom: string,
  previsitTo: string
) {
  const { data } = await axiosClient.post(`/api/previsit`, {
    reservationId: reservationId,
    previsitFrom: previsitFrom,
    previsitTo: previsitTo,
  });
  return data;
}
