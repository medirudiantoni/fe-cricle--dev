import { Box, Button, Heading, HStack, Img, Text, VStack } from "@chakra-ui/react";
import LeftSideOfMainLayout from "./leftSide";
import RightSideOfMainLayout from "./rightSide";
import React, { useEffect, useState } from "react";
import arrowLeft from "@/assets/arrow-left.svg";
import { Outlet, useNavigate } from "react-router-dom";
import BottomNavigation from "@/components/layouts/bottomNavigation";
import useUserStore from "@/hooks/userStore";
import { UserRound } from "lucide-react";
import Cookies from "js-cookie";

interface MainLayoutProps {
    isBackBtn?: () => void;
    titlePage?: string;
    children?: React.ReactElement;
    isUserProfilePage?: boolean;
}

const MainLayout: React.FC<MainLayoutProps> = ({ isBackBtn, titlePage, children, isUserProfilePage }) => {
    const { userData, clearUser, clearUserData } = useUserStore();
    const [isScrolled, setIsScrolled] = useState(false);
    const [isLeftPanel, setIsLeftPanel] = useState(false);
    const [isProfileMenu, setIsProfileMenu] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 50) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const handleLogOut = () => {
        Cookies.remove('token');
        clearUser();
        clearUserData();
        navigate('/login');
    }

    // useEffect(() => {
    //     if(!userData){
    //         navigate('/login');
    //     }
    // }, [userData])

    return (
        <Box w="100%" maxW="2100px" mx="auto" overflowX="hidden" minH="100vh" position="relative">

            <BottomNavigation />

            <LeftSideOfMainLayout isLeftPanelMobileActive={isLeftPanel} handleLeftPanel={() => setIsLeftPanel(!isLeftPanel)} />

            {/* Center side start */}
            <Box
                w={{ base: "100%", sm: "90%", md: "50%", lg: "43%" }}
                minH="100vh"
                position="relative"
                ml={{ sm: "84px", lg: "25.5%" }}
                pt={titlePage ? "60px" : "0px"}
                pb="40vh"
                borderLeftWidth={{ sm: 1.5 }}
                borderRightWidth={{ sm: 1.5 }}
                borderColor="#3f3f3f"
            >
                {titlePage && (
                    <HStack
                        alignItems={{ base: "start", sm: "center" }}
                        justifyContent={{ base: "space-between", sm: "start" }} gap={1}
                        position="fixed"
                        bg="#1d1d1d"
                        zIndex={10}
                        top={0}
                        w={{ base: "100%", sm: "49.5%", lg: "42.5%" }}
                        px={isBackBtn ? 2 : 5}
                        pt={{ base: 4, sm: isScrolled ? 0 : 5 }}
                        pb={2}
                        style={{ transform: "translateX(1px)" }}
                        borderBottomWidth={{ base: 1, sm: 0 }}
                        borderColor="#3f3f3f">
                        {isBackBtn && (
                            <Box display={{ base: "none", sm: "block" }} borderRadius={100} onClick={isBackBtn} p={2} bg="inherit" position="relative" top={0.5} _hover={{ bg: "#454545" }}>
                                <img src={arrowLeft} alt="<" width="30px" />
                            </Box>
                        )}
                        <Box display="flex" flex="1" justifyContent="start" alignItems="center">
                            <Heading size={isScrolled ? "lg" : "lg"} my={{ sm: isScrolled ? 2 : 0 }} fontWeight="semibold" transitionDuration="100ms">{titlePage}</Heading>
                        </Box>
                        <Box display={{ base: "flex", sm: "none" }} flex="1" justifyContent="center" alignItems="center">
                            <Text color="brand.500" fontWeight="600" fontSize="32px" lineHeight={1}>Circle</Text>
                        </Box>
                        <Box display={{ base: "flex", sm: "none" }} flex="1" justifyContent="end" position="relative">
                            <HStack role="button" onClick={() => setIsProfileMenu(!isProfileMenu)} position="relative" zIndex={14} justifyContent="center" w="40px" mb={2} aspectRatio="1/1" borderRadius={100} overflow="hidden" bg="theme.500">
                                {userData?.profile ? (
                                    <Img src={userData.profile} w="100%" h="100%" objectFit="cover"></Img>
                                ) : (
                                    <UserRound />
                                )}
                            </HStack>

                            {isProfileMenu && (
                                <Box
                                    display={{ base: "block", sm: "none" }}
                                    position="fixed"
                                    top={0}
                                    left={0}
                                    w="100vw"
                                    h="100vh"
                                    zIndex={13}
                                >
                                    <Box role="button" onClick={() => setIsProfileMenu(false)} position="absolute" top={0} left={0} w="100%" h="100%" className="backdrop-blur-md bg-black/30"></Box>
                                    <VStack position="absolute" top={16} right={5} zIndex={15} borderRadius={10} w="fit-content" h="fit-content" p="10px" bg="theme.500">
                                        <Button 
                                        onClick={() => {
                                            navigate('/profile')
                                            setIsProfileMenu(false)
                                        }}
                                        w="100%" _hover={{ bg: "brand.600" }} _active={{ bg: "brand.800" }} bg="brand.500">Profile</Button>

                                        <Button 
                                        onClick={() => {
                                            handleLogOut();
                                            setIsProfileMenu(false)
                                        }}
                                        w="100%" _hover={{ bg: "red.600" }} _active={{ bg: "red.800" }} bg="red.500">Logout</Button>
                                    </VStack>
                                </Box>
                            )}
                        </Box>
                    </HStack>
                )}
                {children ? children : <Outlet />}
            </Box>
            {/* Center side end */}

            <RightSideOfMainLayout isUserProfilePage={isUserProfilePage} />
        </Box>
    )
}

export default MainLayout