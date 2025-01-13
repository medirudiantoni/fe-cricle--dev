import useSWR, { mutate, SWRResponse } from 'swr';
import { createNewThread, getAllThreads, getThreadById, getThreadByUserId } from '@/features/threads/services/thread.services';
import { ThreadDataType } from '@/types/thread.types';

export const useThreadsSWR = () => {
    const { data, error, isLoading, mutate }: {data: ThreadDataType[], error: any, isLoading: boolean, mutate: SWRResponse<ThreadDataType[], unknown>['mutate']} = useSWR(`threads`, getAllThreads);

    return { threads: data, error, isLoading, mutate }
};

export const useThreadSWRbyId = (threadId: string, token: string) => {
    const { data, error, isLoading, mutate } = useSWR(threadId ? `threads/${threadId}` : null, () => getThreadById(token, threadId));

    return { thread: data, error, isLoading, mutate }
};

export const useThreadSWRbyUserId = (userId: string, token: string) => {
    const { data, error, isLoading, mutate } = useSWR(userId ? `threads/user/${userId}` : null, () => getThreadByUserId(token, userId));

    return { threads: data, error, isLoading, mutate }
};

export const useCreateThread = async (token: string, data: any) => {
    try {
        const newThread = await createNewThread(token, data);

        mutate(`threads`, (threads: ThreadDataType[] = []) => [newThread, ...threads], false);

        return newThread;
    } catch (error) {
        console.error(error)
        throw error;
    }
}