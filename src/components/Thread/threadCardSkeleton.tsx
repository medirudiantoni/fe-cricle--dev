import { Box, HStack, Skeleton, SkeletonCircle } from '@chakra-ui/react';

const ThreadCardSkeleton = () => {
    return (
        <HStack cursor="pointer" alignItems="start" p={5} gap={4} borderBottomWidth={1} borderColor="#3f3f3f">
            <SkeletonCircle size="40px" variant="pulse" startColor='theme.700' endColor='theme.500' />
            <Box flex="1">
                <HStack gap={2} mb={2} justifyContent="space-between" alignItems="start">
                    <HStack gap={2}>
                        <HStack gap={1}>
                            <Skeleton variant="pulse" startColor='theme.700' endColor='theme.500' h={5} w="100px" />
                            <Skeleton variant="pulse" startColor='theme.700' endColor='theme.500' h={5} w="80px" />
                        </HStack>
                        <Box w={1} h={1} borderRadius={10} bg="#848484" className='translate-y-0.5'></Box>
                        <Skeleton variant="pulse" startColor='theme.700' endColor='theme.500' h={5} w="60px" />
                    </HStack>
                </HStack>
                <Box mb={4}>
                    <Skeleton variant="pulse" startColor='theme.700' endColor='theme.500' h={20} w="100%" />
                </Box>
                <HStack gap={2}>
                    <Skeleton h={5} w="120px" startColor="theme.700" endColor="theme.500" />
                    <Skeleton h={5} w="120px" startColor="theme.700" endColor="theme.500" />
                </HStack>
            </Box>
        </HStack>
    )
}

export default ThreadCardSkeleton;