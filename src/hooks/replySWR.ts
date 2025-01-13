import useSWR from 'swr';
import { getReplyById } from '@/features/threads/services/reply.service';

export const useReplySWRbyId = (threadId: string, token: string) => {
    const { data, error, isLoading, mutate } = useSWR(threadId ? `threads/${threadId}` : null, () => getReplyById(token, threadId));

    return { threads: data, error, isLoading, mutate }
};