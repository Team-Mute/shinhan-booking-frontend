import axiosClient from "./axiosClient";
import { InvitationDetails } from "@user/types/invitation.dto";


export async function getInvitationDetails(reservationId: number){
    try {
        const response = await axiosClient.get<InvitationDetails>(`/api/invitations/${reservationId}`);
        return response.data;
    } catch (error) {
        console.error('Failed to fetch invitation details:', error);
        throw new Error('초대장 정보를 불러오는 데 실패했습니다.');
    }
};