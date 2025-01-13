import useSWR, { mutate, SWRResponse } from 'swr';
import { createNewReply, getReplyById } from '@/features/threads/services/reply.service';
import { ReplyType } from '@/types/thread.types';

export const useReplySWRbyId = (threadId: string, token: string) => {
    const { data, error, isLoading, mutate } = useSWR(threadId ? `threads/${threadId}` : null, () => getReplyById(token, threadId));

    return { threads: data, error, isLoading, mutate }
};