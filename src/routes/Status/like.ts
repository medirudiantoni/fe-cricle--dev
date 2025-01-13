import { ThreadDataType } from "@/types/thread.types";
import Cookies from "js-cookie";
import { SWRResponse } from "swr";

export const likeActionTs = async (userId: number, threadId: number, mutate: SWRResponse<ThreadDataType, unknown>['mutate'], setIsLike: any, fetchCreateLike: (token: string, data: any) => void ) => {
    const token = Cookies.get("token");
    const data = {
        userId: userId,
        threadId: threadId,
    }
    if (token) {
        await mutate(currentThread => currentThread ? {...currentThread, Like: [...currentThread.Like, { userId: userId, threadId: threadId }]} : currentThread, false);
        setIsLike(true);
    }
    try {
        if (token) {
            const liking: any = await fetchCreateLike(token, data);
            if (liking) {
                setIsLike(true)
                // retrieveTheThread();
            }
        }
    } catch (error) {
        console.log(error, "maybe the token is expired hehe...")
    }
};

export const unlikeActionTs = async (userId: number, threadId: number, mutate: SWRResponse<ThreadDataType, unknown>['mutate'], setIsLike: any, fetchDeleteLike: (token: string, data: any) => Promise<any> ) => {
    const token = Cookies.get("token");
    const data = {
        userId: userId,
        threadId: threadId,
    }
    if(token){
        await mutate(currentThread => currentThread ? {...currentThread, Like: currentThread.Like.filter(like => like.userId !== Number(userId))} : currentThread);
        setIsLike(false);
    }
    if (token) {
        await fetchDeleteLike(token, data)
            .then(() => setIsLike(false))
            .catch(error => console.log(error))
    }
};

export const likeReplyMutationTs = async (userId: number, replyId: number, mutate: SWRResponse<ThreadDataType, unknown>['mutate']) => {
    mutate(theThread => theThread ? {...theThread, Reply: theThread.Reply.map(reply => reply.id === replyId ? {...reply, Like: [...reply.Like, { replyId, userId }]} : reply )} : theThread, false);
}

export const unlikeReplyMutationTs = async (userId: number, replyId: number, mutate: SWRResponse<ThreadDataType, unknown>['mutate']) => {
    mutate(theThread => theThread ? {...theThread, Reply: theThread.Reply.map(reply => reply.id === replyId ? {...reply, Like: reply.Like.filter(like => like.userId !== userId)} : reply )} : theThread)
}