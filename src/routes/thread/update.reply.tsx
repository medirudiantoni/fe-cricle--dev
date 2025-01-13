import useUserStore from '@/hooks/userStore'
import MainLayout from '@/layouts'
import { Box, Button, HStack, Img, Input, Skeleton, SkeletonCircle, Spinner, Text, Textarea } from '@chakra-ui/react'
// import { zodResolver } from '@hookform/resolvers/zod';
import React, { useEffect, useRef, useState } from 'react';
// import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import Cookies from 'js-cookie';
// import z from "zod";
import addImage from "@/assets/add-image.svg";
import { UserRound, X } from 'lucide-react';
import { ReplyType } from '@/types/thread.types';
import { getReplyById, updateReplyById } from '@/features/threads/services/reply.service';
import toast from 'react-hot-toast';

const UpdateReplyPage = () => {
    const { replyId } = useParams();
    const { userData } = useUserStore();
    const inputElRef = useRef<HTMLTextAreaElement>(null)

    const navigate = useNavigate();
    const [isTheReply, setTheReply] = useState<ReplyType | null>(null);
    const [isInputValue, setInputValue] = useState<any>("");
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isImageFile, setIsImageFile] = useState<any | null>(null);
    const [isImageUrl, setIsImageUrl] = useState<any>("");
    const [isLoadingRetrieve, setLoadingRetrieve] = useState(false);
    const [isLoadingSubmit, setLoadingSubmit] = useState(false);

    useEffect(() => {
        retreieveGetReplyById();
        if (inputElRef.current) {
            inputElRef.current.focus()
        };
    }, []);

    useEffect(() => {
        setIsImageUrl(isTheReply?.image);
        setInputValue(isTheReply?.content);
    }, [isTheReply]);

    async function retreieveGetReplyById() {
        setLoadingRetrieve(true)
        const token = Cookies.get("token");
        if (token && replyId)
            await getReplyById(token, replyId)
                .then(res => {
                    setTheReply(res)
                    setLoadingRetrieve(false);
                })
                .catch(error => console.log(error))
    };

    const handleImageFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setIsImageFile(file);
            const imageUrl = URL.createObjectURL(file);
            setIsImageUrl(imageUrl);
        }
    }

    // const handleSubmitUpdateReply = (inputData: ThreadInput) => {
    const handleSubmitUpdateReply = (e?: Event) => {
        e?.preventDefault();
        setLoadingSubmit(true)
        const token = Cookies.get("token");
        const data = {
            content: isInputValue,
            authorId: userData?.id,
            threadId: isTheReply?.Thread.id,
            image: isImageFile
        };
        if (token && replyId) {
            updateReplyById(token, data, replyId)
                .then(() => {
                    toast.success("Your reply has been updated succesfully!", { duration: 4000 });
                    setLoadingSubmit(false);
                    navigate(-1);
                })
                .catch(error => console.log(error))
        }
    }

    return (
        <Box overflowX="hidden">
            <MainLayout titlePage=' ' isBackBtn={() => navigate(-1)}>
                <Box w="100%" h="fit-content">

                    {userData && (
                        <Box p={{ md: 0 }} position={{ base: "relative", md: "fixed" }} zIndex="15" top={0} bottom={0} left={0} right={0} display={{ md: "flex" }} alignItems={{ md: "center" }} justifyContent={{ md: "center" }} >
                            <Box onClick={() => navigate(-1)} position="absolute" top={0} left={0} cursor="pointer" w="100%" h="100%" bg={{ base: "inherit", md: "black" }} opacity="70%"></Box>

                            <Box w={{ base: "100%", md: "50%" }} p={{ base: 5, md: 10 }} bg={{ md: "theme.800" }} borderRadius={20} position="relative" overflow="hidden">

                                {isLoadingSubmit && (
                                    <HStack justifyContent="center" position="absolute" zIndex={15} w="100%" h="100%" top="0" left="0" className='bg-black/50'>
                                        <Spinner size="xl" borderWidth="4px" color='white' />
                                    </HStack>
                                )}

                                <form
                                    onSubmit={(e: any) => handleSubmitUpdateReply(e)} className='w-full'>
                                    <HStack alignItems="start" mb={4} pb={2} borderBottomWidth={1} borderColor="#3f3f3f">
                                        {isLoadingRetrieve ? (
                                            <SkeletonCircle w="40px" h="40px" startColor='theme.700' endColor='theme.500' />
                                        ) : (
                                            <HStack justifyContent="center" w="40px" aspectRatio="1/1" borderRadius={100} overflow="hidden" bg="theme.500">
                                                {userData.profile ? (
                                                    <Img src={userData.profile} w="100%" h="100%" objectFit="cover"></Img>
                                                ) : (
                                                    <UserRound />
                                                )}
                                            </HStack>
                                        )}
                                        <Box flex="1" h="fit-content">

                                            {isLoadingRetrieve ? (
                                                <Box p={2} w="100%" h={40}>
                                                    <Skeleton w="100%" h={5} mb={2} startColor='theme.700' endColor='theme.500' />
                                                    <Skeleton w="80%" h={5} mb={2} startColor='theme.700' endColor='theme.500' />
                                                </Box>
                                            ) : (
                                                < Textarea
                                                    // {...register("content")}
                                                    onChange={(e) => setInputValue(e.target.value)}
                                                    value={isInputValue}
                                                    w="100%"
                                                    px={2}
                                                    placeholder='What is happening?!'
                                                    fontSize="xl"
                                                    outline="none"
                                                    border="none"
                                                    _placeholder={{ color: "theme.400" }}
                                                    rows={5}
                                                    minLength={1}
                                                    mb={0}
                                                    ref={inputElRef}
                                                />
                                            )}
                                            {isLoadingRetrieve ? (
                                                <HStack gap={2}>
                                                    <Skeleton h={1} flex={1} startColor='theme.700' endColor='theme.500' />
                                                    <Skeleton h={5} w={5} startColor='theme.700' endColor='theme.500' />
                                                </HStack>
                                            ) : (
                                                <HStack gap={2}>
                                                    <Box flex={1} h="fit-content" bg="theme.600" overflow="hidden">
                                                        <Box w={`${(String(isInputValue).length / 280) * 100}%`} h="1px" bg={String(isInputValue).length <= 200 ? "brand.500" : String(isInputValue).length <= 280 ? "orange.500" : "red.600"} overflow="hidden">
                                                        </Box>
                                                    </Box>
                                                    <Text w="10%" color={String(isInputValue).length <= 200 ? "brand.500" : String(isInputValue).length <= 280 ? "orange.500" : "red.600"} fontWeight="medium">
                                                        {String(isInputValue).length < 240 ? `${Math.floor((String(isInputValue).length / 280) * 100)}%` : 280 - String(isInputValue).length}
                                                    </Text>
                                                </HStack>
                                            )}
                                            {isImageUrl && (
                                                <Box w="50%" justifySelf="end" mr={10} h="fit-content" bg="theme.600" position="relative">
                                                    <Box onClick={() => { setIsImageFile(null); setIsImageUrl("") }} role="button" position="absolute" w="fit-content" aspectRatio="1/1" p={1} top="1" right="1" cursor="pointer" bg="red.600"
                                                        borderRadius={100} _hover={{ bg: "black" }}>
                                                        <X size="20px" />
                                                    </Box>
                                                    <Img src={isImageUrl} w="100%" maxH="800px" objectFit="cover"></Img>
                                                </Box>
                                            )}

                                        </Box>
                                    </HStack>
                                    {isLoadingRetrieve ? (
                                        <HStack justifyContent="flex-end">
                                            <Skeleton h={10} w={10} borderRadius={100} startColor='theme.700' endColor='theme.500' />
                                            <Skeleton h={10} w={20} borderRadius={100} startColor='theme.700' endColor='theme.500' />
                                        </HStack>
                                    ) : (
                                        <HStack justifyContent="flex-end">
                                            <Input onChange={handleImageFile} ref={fileInputRef} type='file' display="none"></Input>
                                            <Button onClick={() => fileInputRef.current!.click()} type="button" p={2} mx={0.5} borderRadius={100} bg="inherit" _hover={{ bg: "#353535" }} _active={{ transform: "scale(0.95)" }} transitionDuration="75ms">
                                                <Img src={addImage} w="100%"></Img>
                                            </Button>
                                            <Button
                                                isDisabled={String(isInputValue).length <= 0 || String(isInputValue).length > 280}
                                                opacity={String(isInputValue).length <= 0 || String(isInputValue).length > 280 ? "50%" : "100%"}
                                                type="submit"
                                                borderRadius={100}
                                                bg="#04A51E"
                                                color={"inherit"}
                                                size="md"
                                                _hover={{ bg: "#027815" }}
                                                _active={{ transform: "scale(0.95)" }} transitionDuration="75ms">
                                                Update
                                            </Button>
                                        </HStack>
                                    )}
                                </form>
                            </Box>
                        </Box>
                    )}

                </Box>
            </MainLayout >
        </Box >
    )
}

export default UpdateReplyPage;