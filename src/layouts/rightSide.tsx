import Suggestion from "@/components/layouts/suggestion";
import Cookies from "js-cookie";
import { Box, Button, Heading, HStack, Img, Skeleton, SkeletonCircle, Text, VStack } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { getCurrentUser, getSuggestionUsers } from "@/features/auth/services/auth-service";
import { Link, useNavigate } from "react-router-dom";
import useUserStore from "@/hooks/userStore";
import { UserDataType } from "@/types/user.types";
import { UserRound } from "lucide-react";
import SuggestionSkeleton from "@/components/layouts/suggestionSkeleton";

interface RightSideOfMainLayoutProps {
    isUserProfilePage?: boolean;
}

const RightSideOfMainLayout: React.FC<RightSideOfMainLayoutProps> = ({ isUserProfilePage = true }) => {
    const navigate = useNavigate();

    const { setUser, setUserData, userData } = useUserStore();
    const [suggUsers, setSuggUsers] = useState<UserDataType[] | null>(null);

    useEffect(() => {
        if (!userData) {
            retrieveCurrentUser();
        };
        retrieveSuggestionUsers();
    }, [userData])

    async function retrieveCurrentUser() {
        const token = Cookies.get('token');
        try {
            if (token) {
                const currentUser = await getCurrentUser(token);
                setUserData(currentUser.data);
                setUser(currentUser.user)
            } else {
                throw new Error('Invalid token')
            };
        } catch (error) {
            console.log(error)
        }
    };

    async function retrieveSuggestionUsers() {
        const token = Cookies.get('token');
        try {
            if (token) {
                const suggestionUsers = await getSuggestionUsers(token);
                setSuggUsers(suggestionUsers.data);
            } else {
                throw new Error('Invalid token')
            };
        } catch (error) {
            console.log(error)
        }
    };

    return (
        <VStack
            w={{ base: "0", md: "40%", lg: "30%" }}
            h="100vh"
            position="fixed"
            top={0}
            right={0}
            padding={{ base: 0, md: "20px" }}
            paddingLeft={{ base: 0, lg: "5px" }}
            gap={2.5}
            overflowY="auto"
        >
            {userData ? (
                <>
                    {isUserProfilePage && (
                        <Box
                            w="100%"
                            h="fit-content"
                            bg="#262626"
                            borderRadius={12}
                        >
                            <Heading
                                size="sm"
                                py="14px"
                                px="20px"
                                fontWeight="semibold">My Profile</Heading>
                            <Box
                                w="100%"
                                px="20px"
                                pb="20px">
                                <VStack
                                    w="100%"
                                    position="relative"
                                    gap={0}>

                                    <Box w="100%" h="90px" borderRadius={10} bg="theme.400" overflow="hidden">
                                        {userData.background && (
                                            <Img
                                                src={userData.background}
                                                w="100%"
                                                h="90px"
                                                borderRadius={10}
                                                objectFit="cover"></Img>
                                        )}
                                    </Box>

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
                                            bg="theme.500"
                                            w="80px"
                                            aspectRatio="1/1"
                                            position="absolute"
                                            left="5%"
                                            overflow="hidden"
                                            borderRadius={100}
                                            borderWidth={4}
                                            borderColor="#262626">
                                            {userData.profile ? (
                                                <Img
                                                    src={userData.profile}
                                                    objectFit="cover"
                                                    w="100%" h="100%"></Img>
                                            ) : (
                                                <UserRound />
                                            )}
                                        </HStack>
                                        <Button
                                            onClick={() => navigate('/profile')}
                                            borderRadius={100}
                                            borderWidth={1}
                                            bg="inherit"
                                            color="inherit"
                                            size="sm"
                                            _hover={{ bg: "#323232" }}
                                            _active={{ bg: "green.500" }}
                                        >Edit Profile</Button>
                                    </HStack>
                                    <Box w="100%" pt="10px">
                                        <Heading size="md" fontWeight="semibold" mb={0.5}>{userData?.fullname ? userData.fullname : userData?.username}</Heading>
                                        <Text fontSize="xs" color="#767676" mb={0.5}>@{userData?.username}</Text>
                                        <Text fontSize="sm" mb={1.5}>{userData.bio}</Text>
                                        <HStack gap={3}>
                                            <Link to='/following'>
                                                <span>{userData.following ? userData.following.length : null}</span>
                                                <span style={{ fontSize: "14px", marginLeft: "4px", color: "#808080" }}>Following</span>
                                            </Link>
                                            <Link to='/followers'>
                                                <span>{userData.follower ? userData.follower.length : null}</span>
                                                <span style={{ fontSize: "14px", marginLeft: "4px", color: "#808080" }}>Followers</span>
                                            </Link>
                                        </HStack>
                                    </Box>
                                </VStack>
                            </Box>
                        </Box>
                    )}
                    <Box
                        w="100%"
                        h="fit-content"
                        bg="#262626"
                        borderRadius={12}
                    // overflow="hidden"
                    >
                        <Heading
                            size="sm"
                            py="14px"
                            px="20px"
                            mb={1}
                            fontWeight="semibold">Suggested for you</Heading>
                        <Box
                            w="100%"
                            pb="20px"
                        >
                            {suggUsers && suggUsers.map(user => (
                                <Suggestion
                                    key={user.id}
                                    idSubject={userData.id}
                                    idObject={user.id}
                                    fullname={user.fullname ? user.fullname : user.username}
                                    username={user.username}
                                    image={user.profile}
                                    following={false} />
                            ))}
                        </Box>
                    </Box>
                    <Box
                        w="100%"
                        h="fit-content"
                        bg="#262626"
                        borderRadius={12}
                        overflow="hidden"
                    >
                        <HStack alignItems="center">
                            <Heading
                                size="sm"
                                py="14px"
                                pl="20px"
                                pr={1}
                            >
                                <span style={{ fontWeight: "normal" }}>Developed by </span>
                                <span style={{ fontWeight: "bold" }}>Medi Rudiant</span>
                            </Heading>
                            <Box w={1.5} h={1.5} borderRadius={8} bg="#929292"></Box>

                        </HStack>
                    </Box>
                </>
            ) : (
                <>
                    <Box w="100%" h="fit-content" bg="#262626" borderRadius={12} py="14px" px="20px">
                        <Skeleton startColor="theme.600" endColor="theme.500" h={5} w="100px" mb="14px" />
                        <Skeleton variant="pulse" startColor="theme.600" endColor="theme.500" h={20} w="100%" mb="10px" borderRadius={12} />
                        <HStack justifyContent="flex-end" alignItems="end" w="100%" h="fit-content" borderRadius={10} objectFit="cover" position="relative" mb="14px">
                            <Box w="80px" aspectRatio="1/1" borderRadius={100} position="absolute" left="5%" bottom={1} bg="theme.700" borderWidth={4} borderColor="theme.700">
                                <SkeletonCircle variant="pulse" startColor="theme.600" endColor="theme.500" w="100%" h="100%" />
                            </Box>
                            <Skeleton startColor="theme.600" endColor="theme.500" h={8} w="100px" mb="14px" borderRadius={100} />
                        </HStack>
                        <Skeleton startColor="theme.600" endColor="theme.500" h={6} w="160px" mb="10px" />
                        <Skeleton startColor="theme.600" endColor="theme.500" h={4} w="100px" mb="11px" />
                        <Skeleton startColor="theme.600" endColor="theme.500" h={4} w="260px" mb="12px" />
                        <HStack gap={3}>
                            <Skeleton startColor="theme.600" endColor="theme.500" h={4} w="100px" mb="10px" />
                            <Skeleton startColor="theme.600" endColor="theme.500" h={4} w="100px" mb="10px" />
                        </HStack>
                    </Box>

                    <Box w="100%" h="fit-content" py="14px" px="20px" bg="theme.700" borderRadius={12}>
                        <Skeleton startColor="theme.600" endColor="theme.500" h={5} w="150px" mb="14px" />
                        <SuggestionSkeleton />
                        <SuggestionSkeleton />
                        <SuggestionSkeleton />
                    </Box>
                </>
            )}

        </VStack>
    )
}

export default RightSideOfMainLayout