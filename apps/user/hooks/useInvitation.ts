import { useState, useEffect } from 'react';
import { getInvitationDetails, InvitationDetails } from '@user/lib/api/invitation';

export const useInvitation = (reservationId: number) => {
    const [invitation, setInvitation] = useState<InvitationDetails | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!reservationId) return;

        const fetchInvitation = async () => {
            try {
                setLoading(true);
                const data = await getInvitationDetails(reservationId);
                setInvitation(data);
            } catch (err) {
                setError((err as Error).message);
            } finally {
                setLoading(false);
            }
        };

        fetchInvitation();
    }, [reservationId]);

    return { invitation, loading, error };
};