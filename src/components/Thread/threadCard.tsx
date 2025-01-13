import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { Box, Button, HStack, Img, Spinner, Text, VStack } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import LikeAndReply from './likeAndReply';
import { fetchCreateLike, fetchDeleteLike } from '@/features/threads/services/like.services';
import useThreadStore from '@/hooks/threadStore';
import retrieveAllThreads from '@/features/threads/functions/thread.fetch';
import { EllipsisVertical, PenLine, Trash, UserRound } from 'lucide-react';
import { deleteThreadById } from '@/features/threads/services/thread.services';
import useUserStore from '@/hooks/userStore';
import { formatDateSince } from '@/utils/format-date';
import { fetchFollowingAction } from '@/features/relation/services/follow.service';
import { getCurrentUser } from '@/features/auth/services/auth-service';
import { deleteReplyById } from '@/features/threads/services/reply.service';
import useConfirm from '../dialog/dialog';
import { useThreadsSWR } from '@/hooks/threadSWR';

interface ThreadCardProps {
    url: string,
    isReplyContent?: boolean,
    fullname?: string,
    username?: string,
    threadUserId: string,
    profile?: string,
    createdAt: Date,
    content: string,
    image?: string,
    likes: number,
    replies?: number,
    currentUserId: number,
    threadId?: number,
    replyId?: number,
    isLiked?: boolean,
    toChildReply?: () => void;
    onReply?: () => void;
    isReply?: boolean;
    retrieveReplies?: () => void;
    actionAfterDeletePost?: () => void;
};

const ThreadCard: React.FC<ThreadCardProps> = ({ isReplyContent = false, url, fullname, username, threadUserId, profile, createdAt, content, image, likes, replies, currentUserId, threadId, replyId, isLiked = false, onReply, toChildReply, isReply, retrieveReplies, actionAfterDeletePost }) => {
    const { setThreads } = useThreadStore();
    const { userData } = useUserStore();
    const { confirmDialog, AlertDialogComponent } = useConfirm();
    const [isLike, setIsLike] = useState(false);
    const [isOption, setIsOption] = useState(false);
    const [sincePosted, setSincePosted] = useState("");
    const [isShowFollowBtn, setIsShowFollowBtn] = useState(false);
    const [isLoadingFollow, setIsLoadingFollow] = useState(false);
    // tes SWR
    const { mutate: mutateAllThreads } = useThreadsSWR();
    const navigate = useNavigate();

    useEffect(() => {
        setIsLike(isLiked)
    }, [isLiked])

    useEffect(() => {
        const postDate = new Date(createdAt);
        setSincePosted(formatDateSince(postDate))
    }, [])

    const likeAction = async () => {
        const token = Cookies.get("token");

        const data = isReplyContent ?
            { userId: currentUserId, replyId } :
            { userId: currentUserId, threadId }

        if (token) {
            mutateAllThreads(currentThreads => currentThreads?.map(thread => thread.id === Number(threadId) ? { ...thread, Like: [...thread.Like, data] } : thread), false
            );
        }

        retrieveReplies && retrieveReplies(); // props

        try {
            if (token) {
                const liking = await fetchCreateLike(token, data);
                if (liking) {
                    setIsLike(true);
                    // retrieveAllThreads(setThreads);
                }
            }
        } catch (error) {
            console.log(error, "maybe the token is expired hehe...")
        }
    };

    const unlikeAction = async () => {
        const token = Cookies.get("token");

        const data = isReplyContent ?
            { userId: currentUserId, replyId } :
            { userId: currentUserId, threadId }

        if (token) {
            // Optimistic update: Hapus data like dari cache lokal
            mutateAllThreads((currentThread) =>
                currentThread?.map((thread) =>
                    thread.id === Number(threadId)
                        ? {
                            ...thread,
                            Like: thread.Like.filter(
                                (like) =>
                                    !(like.userId === currentUserId &&
                                        (isReplyContent
                                            ? like.replyId === replyId
                                            : like.threadId === threadId))
                            ),
                        }
                        : thread
                ),
                false // Jangan re-fetch untuk sementara waktu
            );
            setIsLike(false); // Perbarui UI
        }
        
        retrieveReplies && retrieveReplies();

        if (token) {
            await fetchDeleteLike(token, data)
                .then(() => setIsLike(false))
                .then(() => {
                    retrieveAllThreads(setThreads);
                })
                .catch(error => console.log(error))
        }
    };

    const handleLikeButton = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        if (!isLike) {
            likeAction();
        } else {
            unlikeAction();
        }
    };

    const handleDeleteThread = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        const token = Cookies.get("token");
        try {
            console.log('masuk delete thread')
            const res = await deleteThreadById(String(token), String(threadId));
            if (res) {
                console.log('success delete thread')
                retrieveAllThreads(setThreads);
                actionAfterDeletePost && actionAfterDeletePost();
                return;
            }
        } catch (error) {
            console.log(error)
        }
    }

    const handleDeleteReply = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        const token = Cookies.get("token");
        try {
            console.log('masuk delete reply')
            const res = await deleteReplyById(String(token), String(replyId));
            if (res) {
                console.log('success delete reply')
                retrieveReplies && retrieveReplies();
                actionAfterDeletePost && actionAfterDeletePost();
                return;
            } else {
                console.log('gagal')
            }
        } catch (error) {
            console.log(error)
        }
    }

    const handleDelete = async (e: any) => {
        const isDelete = await confirmDialog({ title: "Confirm Delete", text: "Are you sure want to delete this post?", theme: "danger", falseText: "Cancel", trueText: "Delete" });
        if (isDelete) {
            if (isReply) {
                handleDeleteReply(e)
            } else {
                handleDeleteThread(e)
            }
        }
    }

    const handleReplyButton = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        onReply && onReply();
    }

    const handleNavigate = () => {
        navigate(url)
        toChildReply && toChildReply();
    }

    const handleEditButton = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        if (isReply) {
            navigate(`/edit-reply/${threadId}`)
        } else {
            navigate(`/edit/${threadId}`)
        }
    };

    const handleOptionButton = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        setIsOption(!isOption);
    }

    const handleRedirectToTheUser = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        navigate(`/profile/${threadUserId}`)
    }

    const setTheUserFollowingInfo = () => {
        const isFollowing = userData?.following?.map(user => user.follower?.username);
        if (!isFollowing?.includes(username)) {
            setIsShowFollowBtn(true)
        } else {
            setIsShowFollowBtn(false)
        }
    }

    useEffect(() => {
        setTheUserFollowingInfo();
    }, [userData, username, isShowFollowBtn]);

    const handleFollow = (e: React.FormEvent) => {
        e.stopPropagation();
        setIsLoadingFollow(true);
        const token = Cookies.get('token')!;
        const data = {
            followingId: String(userData?.id),
        }
        fetchFollowingAction(token, data, String(threadUserId))
            .then(() => {
                retrieveCurrentUser();
                retrieveAllThreads(setThreads)
                    .then(() => {
                        setIsLoadingFollow(false)
                    })
            })
            .catch(error => {
                setIsLoadingFollow(false);
                console.log(error);
            })
    }

    const { setUser, setUserData } = useUserStore();

    async function retrieveCurrentUser() {
        const token = Cookies.get('token');
        try {
            if (token) {
                const currentUser = await getCurrentUser(token);
                if (currentUser) {
                    setUserData(currentUser.data);
                    setUser(currentUser.user);
                    console.log('sukses set current user');
                }
            } else {
                throw new Error('Invalid token')
            };
        } catch (error) {
            console.log(error)
        }
    };

    return (
        <HStack onClick={handleNavigate} cursor="pointer" alignItems="start" p={5} gap={4} borderBottomWidth={1} borderColor="#3f3f3f">
            {AlertDialogComponent}
            <HStack justifyContent="center" role='button' onClick={(e: any) => handleRedirectToTheUser(e)} w="40px" aspectRatio="1/1" borderRadius={100} overflow="hidden" bg="theme.500">
                {profile ? (
                    <Img src={profile} w="100%" aspectRatio="1/1" objectFit="cover"></Img>
                ) : (
                    <UserRound />
                )}
            </HStack>
            <Box flex="1">
                <HStack gap={2} mb={2} justifyContent="space-between" alignItems="start">
                    <HStack gap={2}>
                        <HStack gap={1}>
                            <Text>{fullname}</Text>
                            <Text color="theme.400">@{username}</Text>
                        </HStack>
                        <Box w={1} h={1} borderRadius={10} bg="#848484" className='translate-y-0.5'></Box>
                        <Text style={{ color: "#848484" }}> {sincePosted}</Text>
                    </HStack>
                    {isShowFollowBtn && username !== userData?.username && (
                        <Button onClick={handleFollow} size="sm" borderWidth={1} borderRadius={100} className='hover:bg-slate-200 active:bg-theme-300'>
                            {isLoadingFollow ? (
                                <Spinner size="sm" />
                            ) : (
                                <span>Follow</span>
                            )}
                        </Button>
                    )}
                    {userData?.username === username && (
                        <Box role='button' onClick={(e: any) => handleOptionButton(e)} onBlur={(e: any) => handleOptionButton(e)} p={1} position="relative" borderRadius={100} bg="theme.700">
                            <EllipsisVertical />
                            {isOption && (
                                <VStack gap={2} position="absolute" top="120%" right={0} p={1} borderRadius={12} bg="theme.600">
                                    <HStack role='button' onClick={(e: any) => handleEditButton(e)} w="100%" borderRadius={8} py={2} px={4} bg="orange.600" _hover={{ bg: "orange.700" }} color="white">
                                        <PenLine />
                                        <Text>Edit</Text>
                                    </HStack>
                                    <HStack role='button' onClick={(e: any) => handleDelete(e)} w="100%" borderRadius={8} py={2} px={4} bg="red.600" _hover={{ bg: "red.700" }} color="white">
                                        <Trash />
                                        <Text>Delete</Text>
                                    </HStack>
                                </VStack>
                            )}
                        </Box>
                    )}

                </HStack>
                <Text mb={4}>
                    {content}
                </Text>
                {image && (
                    <Img src={image} maxW="80%" mb={4}></Img>
                )}
                <LikeAndReply onReply={(e: any) => handleReplyButton(e)} likeFunction={(e: any) => handleLikeButton(e)} isLike={isLike} likeLength={String(likes)} replyLength={String(replies)} />
            </Box>
        </HStack>
    )
}

export default ThreadCard;