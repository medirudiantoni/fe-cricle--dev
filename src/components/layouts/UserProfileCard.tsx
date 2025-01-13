import useUserStore from '@/hooks/userStore';
import { Box, Button, Heading, HStack, Img, Spinner, Text, VStack } from '@chakra-ui/react'
import { Image, UserRound } from 'lucide-react';
import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { fetchFollowingAction, fetchUnfollowingAction } from '@/features/relation/services/follow.service';
import retrieveCurrentUser from '@/features/auth/functions/user.current';

interface UserProfileCardProps {
    profile?: string,
    background?: string,
    fullname: string,
    username: string,
    objectUserId?: string,
    bio?: string,
    following: number | undefined,
    follower: number | undefined,
    onEditProfile?: () => void;
}

const UserProfileCard: React.FC<UserProfileCardProps> = ({ profile, background, fullname, username, objectUserId, bio, following, follower, onEditProfile }) => {
    const { userData, setUserData, setUser } = useUserStore();
    const [isLoading, setIsLoading] = useState(false);
    const [isShowFollowBtn, setIsShowFollowBtn] = useState(false);
    useEffect(() => {
        const isFollowing = userData?.following?.map(user => user.follower?.username);
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
        fetchFollowingAction(token, data, String(objectUserId))
            .then(() => {
                retrieveCurrentUser(setUserData, setUser);
                setIsLoading(false)
            })
            .catch(error => {
                setIsLoading(false);
                console.log(error);
            })
    }
    const handleUnfollow = (e: React.FormEvent) => {
        e.stopPropagation();
        setIsLoading(true);
        const token = Cookies.get('token')!;
        const data = {
            followingId: String(userData?.id),
        }
        const isUnfollow = confirm("are you sure?");
        if (isUnfollow) {
            fetchUnfollowingAction(token, data, String(objectUserId))
                .then(() => {
                    retrieveCurrentUser(setUserData, setUser);
                    setIsLoading(false)
                    console.log('unfol')
                })
                .catch(error => {
                    setIsLoading(false);
                    console.log(error);
                })
        } else {
            setIsLoading(false)
        }
    }
    return (
        <Box
            w="100%"
            px="0px"
            pb="0px"
        >
            <VStack
                w="100%"
                position="relative"
                gap={0}>
                <HStack justifyContent="center" w="100%" h="120px" bg="theme.400" borderRadius={10} overflow="hidden">
                    {background ? (
                        <Img
                            src={background}
                            w="100%"
                            h="100%"
                            borderRadius={10}
                            objectFit="cover"
                            objectPosition="center"
                        ></Img>
                    ) : (
                        <Image />
                    )}
                </HStack>
                <HStack
                    justifyContent="flex-end"
                    alignItems="end"
                    w="100%"
                    h="fit-content"
                    py="10px"
                    borderRadius={10}
                    objectFit="cover"
                    position="relative">
                    <HStack
                        justifyContent="center"
                        w="80px"
                        aspectRatio="1/1"
                        bg="theme.500"
                        position="absolute"
                        left="5%"
                        overflow="hidden"
                        borderRadius={100}
                        borderWidth={4}
                        borderColor="#262626">
                        {profile ? (
                            <Img
                                src={profile}
                                w="100%"
                                h="100%"
                                objectFit="cover"
                                className='object-bottom'
                            ></Img>
                        ) : (
                            <UserRound />
                        )}
                    </HStack>
                    {userData && onEditProfile ? (
                        <Button
                            onClick={onEditProfile}
                            borderRadius={100}
                            borderWidth={1}
                            bg="inherit"
                            color="inherit"
                            size="sm"
                            _hover={{ bg: "#323232" }}
                            _active={{ bg: "green.500" }}
                        >Edit Profile</Button>
                    ) : (
                        <Box p={4}></Box>
                    )}
                </HStack>
                <HStack w="100%" pt="10px" justifyContent="space-between" alignItems="start">
                    <Box w="fit-content">
                        <Heading size="md" fontWeight="semibold" mb={0.5}>{fullname}</Heading>
                        <Text fontSize="xs" color="#767676" mb={0.5}>@{username}</Text>
                        <Text fontSize="md" mb={1.5}>{bio ? bio : "no bio yet"}</Text>
                        <HStack gap={3}>
                            <Text>
                                <span>{following}</span>
                                <span style={{ fontSize: "14px", marginLeft: "4px", color: "#808080" }}>Following</span>
                            </Text>
                            <Text>
                                <span>{follower}</span>
                                <span style={{ fontSize: "14px", marginLeft: "4px", color: "#808080" }}>Followers</span>
                            </Text>
                        </HStack>
                    </Box>
                    {objectUserId && username !== userData?.username && (
                        isShowFollowBtn ? (
                            <Button onClick={handleFollow} size="sm" borderWidth={1} borderRadius={100} className='hover:bg-slate-200 active:bg-theme-700'>
                                {isLoading ? (
                                    <Spinner size="sm" />
                                ) : (
                                    <span>Follow</span>
                                )}
                            </Button>
                        ) : (
                            <Button onClick={handleUnfollow} size="sm" borderWidth={1} borderRadius={100} bg="transparent" borderColor="theme.400" color="theme.400" className='hover:bg-slate-200 active:bg-theme-700'>
                                {isLoading ? (
                                    <Spinner size="sm" />
                                ) : (
                                    <span>Following</span>
                                )}
                            </Button>
                        )
                    )}
                </HStack>
            </VStack>
        </Box>
    )
}

export default UserProfileCard