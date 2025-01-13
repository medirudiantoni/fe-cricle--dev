import React, { useEffect, useRef, useState } from 'react';
import { Box, Button, HStack, Img, Input, Spinner, Text } from '@chakra-ui/react';
import Cookies from 'js-cookie';
import addImage from "@/assets/add-image.svg";
import UserProfile from '@/components/userProfile';
import { ThreadDataType } from '@/types/thread.types';
import LikeAndReply from '../Thread/likeAndReply';
import { UserDataType } from '@/types/user.types';
import { UserRound, X } from 'lucide-react';
import ThreadCard from '../Thread/threadCard';
import { fetchCreateLike, fetchDeleteLike } from '@/features/threads/services/like.services';
import { createNewReply } from '@/features/threads/services/reply.service';
import toast from 'react-hot-toast';
import ThreadCardSkeleton from '../Thread/threadCardSkeleton';

interface ImageViewDetailProps {
    isViewImageThread: boolean,
    thread: ThreadDataType,
    postHour: string,
    postDate: string,
    userData: UserDataType | null,
    retrieveUserThreads: VoidFunction,
}

const ImageViewDetail: React.FC<ImageViewDetailProps> = ({
    isViewImageThread,
    thread,
    postHour,
    postDate,
    userData,
    retrieveUserThreads
}) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isLike, setIsLike] = useState(false);
    const [isReplyInputValue, setIsReplyInputValue] = useState("");
    const [isImageFile, setIsImageFile] = useState<any | null>(null);
    const [isImageUrl, setIsImageUrl] = useState("");
    const [isLoadingReply, setIsLoadingReply] = useState(false);

    useEffect(() => {
        if (userData && thread?.Like.find(like => like.userId === Number(userData!.id))) {
            setIsLike(true)
        };
    }, [userData, thread])

    const likeAction = async () => {
        const token = Cookies.get("token");
        const data = {
            userId: userData?.id,
            threadId: thread.id,
        }
        try {
            if (token) {
                const liking = await fetchCreateLike(token, data);
                if (liking) {
                    setIsLike(true)
                    retrieveUserThreads();
                }
            }
        } catch (error) {
            console.log(error, "maybe the token is expired hehe...")
        }
    };

    const unlikeAction = async () => {
        const token = Cookies.get("token");
        const data = {
            userId: userData?.id,
            threadId: thread.id,
        }
        if (token) {
            await fetchDeleteLike(token, data)
                .then(() => setIsLike(false))
                .then(() => retrieveUserThreads())
                .catch(error => console.log(error))
        }
    };

    const handleLike = () => {
        if (!isLike) {
            likeAction();
        } else {
            unlikeAction();
        }
    };

    const handleImageFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setIsImageFile(file);
            const imageUrl = URL.createObjectURL(file);
            setIsImageUrl(imageUrl);
        }
    }

    const handleSubmitReply = () => {
        setIsLoadingReply(true);
        const token = Cookies.get("token");
        const data = {
            content: isReplyInputValue,
            authorId: userData?.id,
            threadId: thread.id,
            image: isImageFile
        };
        if (isReplyInputValue.length === 0) {
            alert("input must have not be blank")
            return false;
        }
        createNewReply(token!, data)
            .then(() => {
                toast.success("Reply posted successfully!");
                setIsImageFile(null);
                setIsImageUrl("");
                setIsReplyInputValue("");
                retrieveUserThreads();
                setIsLoadingReply(false);
            })
            .catch(error => {
                console.log(error)
            })
    };

    return (
        <>
            <div className={`absolute z-10 right-0 sm:relative h-full overflow-hidden bg-theme-900/70 backdrop-blur-md sm:bg-theme-800 border-l border-theme-500 transition-all duration-200 ease-in-out overflow-y-auto py-10 ${isViewImageThread ? "translate-x-0 w-5/6 sm:w-2/6" : "translate-x-full w-0 "}`}>

                {/* the thread about image start */}
                <Box p={5} w="100%" borderBottomWidth={1} borderColor="#3f3f3f">
                    <UserProfile
                        userId={String(thread?.User.id)}
                        image={thread?.User.profile}
                        fullname={thread?.User.fullname ? thread?.User.fullname : String(thread?.User.username)}
                        username={String(thread?.User.username)}
                        threadId={thread.id}
                    />
                    <Text mt="10px" mb="12px">{thread?.content}</Text>

                    <HStack color="#767676" fontWeight="medium" fontSize="sm" mb="12px">
                        <Text>{postHour}</Text>
                        <Box w={1} h={1} bg="#767676" borderRadius={100}></Box>
                        <Text>{postDate}</Text>
                    </HStack>

                    {/* Like and reply */}
                    <LikeAndReply
                        onReply={() => console.log('first')}
                        likeFunction={() => handleLike()}
                        isLike={isLike}
                        likeLength={`${thread?.Like.length}`}
                        replyLength={`${thread?.Reply.length}`} />
                </Box>
                {/* the thread about image end */}

                {/* input start */}
                {userData && (
                    <Box p={5} borderBottomWidth={1} borderColor="#3f3f3f" position="relative">
                        {isLoadingReply && (
                            <HStack justifyContent="center" position="absolute" zIndex={1} top={0} left={0} right={0} bottom={0} className='bg-theme-800/70'>
                                <Spinner size="md" borderWidth="2px" color='white' />
                            </HStack>
                        )}
                        <HStack>
                            <HStack justifyContent="center" w="40px" aspectRatio="1/1" borderRadius={100} overflow="hidden" bg="theme.500">
                                {userData.profile ? (
                                    <Img src={userData.profile} w="100%" h="100%" objectFit="cover"></Img>
                                ) : (
                                    <UserRound />
                                )}
                            </HStack>

                            {/* Input reply start */}
                            <Box flex="1" h="100%">
                                <Input
                                    onChange={e => setIsReplyInputValue(e.target.value)}
                                    value={isReplyInputValue}
                                    w="100%" px={2} placeholder="Type your reply" fontSize="xl" outline="none" border="none" _placeholder={{ color: "#848484" }} _focus={{ outline: "none", border: "none", ring: "none" }}></Input>
                            </Box>
                            {/* input reply end */}

                            {/* +image button start */}
                            <Button onClick={() => fileInputRef.current!.click()} p={2} mx={0.5} borderRadius={100} bg="inherit" _hover={{ bg: "#353535" }} _active={{ transform: "scale(0.95)" }} transitionDuration="75ms">
                                <Img src={addImage} w="100%"></Img>
                            </Button>
                            {/* +image button end */}

                            {/* reply button start */}
                            <Button
                                onClick={() => handleSubmitReply()}
                                borderRadius={100} bg="#04A51E" color={"inherit"} size="md" mr={10} _disabled={{ opacity: "50%" }} _hover={{ bg: "#027815" }} _active={{ transform: "scale(0.95)" }} transitionDuration="75ms">Reply</Button>
                            {/* reply button end */}

                            <Input onChange={handleImageFile} ref={fileInputRef} type='file' display="none"></Input>
                        </HStack>
                        {isImageUrl && (
                            <Box mt={4} w="60%" borderRadius={10} ml="12%" overflow="hidden" position="relative">
                                <Img src={isImageUrl} w="100%" maxH="600px" objectFit="cover"></Img>
                                <Box onClick={() => { setIsImageFile(null); setIsImageUrl("") }} role="button" position="absolute" w="fit-content" aspectRatio="1/1" p={1} top="1" right="1" cursor="pointer" bg="red.600"
                                    borderRadius={100} _hover={{ bg: "black" }}>
                                    <X size="20px" />
                                </Box>
                            </Box>
                        )}
                    </Box>
                )}
                {/* input end */}

                {isLoadingReply && (
                    <ThreadCardSkeleton />
                )}

                {/* Thread reply start */}
                {thread?.Reply ? thread.Reply.map(reply => (
                    <ThreadCard
                        isReplyContent={true}
                        key={reply.id}
                        content={reply.content}
                        image={reply.image}
                        currentUserId={Number(userData?.id)}
                        fullname={reply.User.fullname ?? reply.User.username}
                        username={reply.User.username}
                        threadUserId={thread.User.id}
                        likes={reply.Like.length}
                        url={`/reply/${reply.id}`}
                        isReply={true}
                        threadId={reply.id}
                        replyId={reply.id}
                        profile={reply.User.profile}
                        createdAt={reply.createdAt}
                        replies={reply.Children.length}
                        isLiked={userData && reply.Like.find(like => like.userId === Number(userData!.id)) ? true : false}
                        // onReply={() => navigate(`/reply${reply.id}/reply`)}
                        retrieveReplies={() => retrieveUserThreads()}
                    />
                )) : (
                    <HStack w="100%" h="fit-content" justifyContent="center" py={20}>
                        <Text color="theme.400">No reply yet</Text>
                    </HStack>
                )}
                {/* Thread reply end */}

            </div>
        </>
    )
}

export default ImageViewDetail