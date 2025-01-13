import MainLayout from "@/layouts"
import { Box, HStack, Skeleton, SkeletonCircle, VStack } from "@chakra-ui/react"
import { useNavigate } from "react-router-dom"
import ThreadCardSkeleton from "./threadCardSkeleton";

const StatusSkeleton = () => {
    const navigate = useNavigate();
    return (
        <Box w="100%" h="100%">
            <MainLayout titlePage="Status" isBackBtn={() => navigate(-1)}>
                <>
                    <Box w="100%" h="fit-content">
                        <Box p={5} w="100%" borderBottomWidth={1} borderColor="theme.500">
                            <HStack gap={2} mb="14px">
                                <SkeletonCircle w="40px" h="40px" startColor="theme.700" endColor="theme.500" />
                                <VStack alignItems="start" gap={1}>
                                    <Skeleton h={4} w="120px" startColor="theme.700" endColor="theme.500" />
                                    <Skeleton h={4} w="100px" startColor="theme.700" endColor="theme.500" />
                                </VStack>
                            </HStack>
                            <Skeleton h={5} w="50%" startColor="theme.700" endColor="theme.500" mb={2} />
                            <Skeleton h={20} w="70%" startColor="theme.700" endColor="theme.500" mb={2} />
                            <Skeleton h={5} w="50%" startColor="theme.700" endColor="theme.500" mb="14px" />
                            <HStack gap={2}>
                                <Skeleton h={5} w="120px" startColor="theme.700" endColor="theme.500" />
                                <Skeleton h={5} w="120px" startColor="theme.700" endColor="theme.500" />
                            </HStack>
                        </Box>
                    </Box>

                    <ThreadCardSkeleton />
                </>
            </MainLayout>
        </Box>
    )
}

export default StatusSkeleton