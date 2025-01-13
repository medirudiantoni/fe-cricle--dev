import { HStack, Skeleton, SkeletonCircle, VStack } from "@chakra-ui/react"

const SuggestionSkeleton = () => {
    return (
        <HStack w="100%" justifyContent="space-between" mb={4}>
            <HStack gap={2}>
                <SkeletonCircle w="42px" h="42px" variant="pulse" startColor="theme.600" endColor="theme.500" />
                <VStack alignItems="start">
                    <Skeleton w="100px" h={4} variant="pulse" startColor="theme.600" endColor="theme.500"></Skeleton>
                    <Skeleton w="90px" h={4} variant="pulse" startColor="theme.600" endColor="theme.500"></Skeleton>
                </VStack>
            </HStack>
            <Skeleton borderRadius={100} w="65px" h={7} variant="pulse" startColor="theme.600" endColor="theme.500" justifySelf="flex-end" />
        </HStack>
    )
}

export default SuggestionSkeleton