import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Cookies from 'js-cookie';
import { Box, Button, HStack, Image, Spinner, Text, VStack } from '@chakra-ui/react'
import { EllipsisVertical, PenLine, Trash, UserRound } from 'lucide-react'
import useUserStore from '@/hooks/userStore';
import { fetchFollowingAction } from '@/features/relation/services/follow.service';
import retrieveCurrentUser from '@/features/auth/functions/user.current';
import { deleteThreadById } from '@/features/threads/services/thread.services';
import { deleteReplyById } from '@/features/threads/services/reply.service';
import useConfirm from '../dialog/dialog';

interface UserProfileProps {
    userId: string,
    image?: string,
    fullname: string,
    username: string,
    bio?: string,
    followBtn?: boolean,
    threadId?: number,
    replyId?: number,
    retireveAction?: () => void;
}

const UserProfile: React.FC<UserProfileProps> = ({ userId, image, fullname, username, bio, followBtn = false, threadId, replyId, retireveAction }) => {
    const { userData, setUserData, setUser } = useUserStore();
    const { confirmDialog, AlertDialogComponent } = useConfirm();
    const [isLoading, setIsLoading] = useState(false);
    const [isShowFollowBtn, setIsShowFollowBtn] = useState(false);
    const [isOption, setIsOption] = useState(false);
    const navigate = useNavigate();
    useEffect(() => {
        const isFollowing = userData?.following.map(user => user.follower?.username);
        if (!isFollowing?.includes(username)) {
            setIsShowFollowBtn(true)
        } else {
            setIsShowFollowBtn(false)
        }
    }, [userData, username]);
    const handleFollow = (e: React.FormEvent) => {
        e.stopPropagation();
        setIsLoading(true);
        const token = Cookies.get('token')!;
        const data = {
            followingId: String(userData?.id),
        }
        fetchFollowingAction(token, data, String(userId))
            .then(() => {
                retrieveCurrentUser(setUserData, setUser);
                setIsLoading(false)
            })
            .catch(error => {
                setIsLoading(false);
                console.log(error);
            })
    };
    const handleOptionButton = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        setIsOption(!isOption);
    }

    const handleEditButton = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        if(replyId){
            navigate(`/edit-reply/${replyId}`)
        } else {
            navigate(`/edit/${threadId}`)
        }
    };

    const handleDeleteThread = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        const token = Cookies.get("token");
        try {
            const res = await deleteThreadById(String(token), String(threadId));
            if (res) {
                console.log('success delete thread')
                retireveAction && retireveAction();
                navigate(-1);
                return;
            }
        } catch (error) {
            console.log(error);
        }
    }
    const handleDeleteReply = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        const token = Cookies.get("token");
        try {
            const res = await deleteReplyById(String(token), String(replyId));
            if (res) {
                console.log('success delete reply')
                retireveAction && retireveAction();
                navigate(-1);
                return;
            }
        } catch (error) {
            console.log(error);
        }
    }
    const handleDelete = async (e: any) => {
        const isDelete = await confirmDialog({ title: "Confirm Delete", text: "Are you sure want to delete this post?", theme: "danger", falseText: "Cancel", trueText: "Delete" });
        if(isDelete)
            if(replyId){
                handleDeleteReply(e)
            } else {
                handleDeleteThread(e)
            }
    };
    
    return (
        <HStack w="100%" justifyContent="space-between">
            {AlertDialogComponent}
            <HStack w="fit-content" alignItems={bio ? "start" : "center"}>
                <HStack
                    role="button"
                    onClick={() => navigate(`/profile/${userId}`)}
                    justifyContent="center"
                    w="40px"
                    aspectRatio="1/1"
                    bg="theme.500"
                    borderRadius={100}
                    overflow="hidden"
                >
                    {image ? (
                        <Image src={image} w="100%" aspectRatio="1/1" objectFit="cover" borderRadius={100}></Image>
                    ) : (
                        <UserRound />
                    )}
                </HStack>
                <Box flex="1" h="fit-content">
                    <Text fontSize="md" lineHeight={1.2}>{fullname}</Text>
                    <Text fontSize="sm" color="#767676">@{username}</Text>
                    {bio && (
                        <Text>{bio}</Text>
                    )}
                </Box>
            </HStack>
            <HStack w="fit-content" gap={2}>
                {followBtn && isShowFollowBtn && username !== userData?.username && (
                    <Button onClick={handleFollow} size="sm" borderWidth={1} borderRadius={100} className='hover:bg-slate-200 active:bg-theme-700'>
                        {isLoading ? (
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
        </HStack>
    )
}

export default UserProfile