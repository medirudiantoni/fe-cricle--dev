import MainLayout from "@/layouts";
import { Box, Button, HStack, Img, Input } from "@chakra-ui/react";
import addImage from "@/assets/add-image.svg";
import ThreadCard from "@/components/Thread/threadCard";
import useUserStore from "@/hooks/userStore";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import useThreadStore from "@/hooks/threadStore";
// import retrieveAllThreads from "@/features/threads/functions/thread.fetch";
import { UserRound } from "lucide-react";
import ThreadCardSkeleton from "@/components/Thread/threadCardSkeleton";
import { useThreadsSWR } from "@/hooks/threadSWR";

const Home = () => {
  useEffect(() => {
    document.title = "Circle"
  }, []);

  const { threads: swrThreadsAllData } = useThreadsSWR();

  const navigate = useNavigate();
  const { userData } = useUserStore();
  const { threads, setThreads } = useThreadStore();

  // Coba SWR
  useEffect(() => {
    console.log("data dari swr: ", swrThreadsAllData);
  }, [swrThreadsAllData, threads]);

  useEffect(() => {
    setThreads(swrThreadsAllData);
  }, [swrThreadsAllData]);

  // useEffect(() => {
  //   retrieveAllThreads(setThreads);
  // }, []);

  return (
    <Box overflowX="hidden">
      <MainLayout titlePage="Home">
        <Box w="100%" h="fit-content">

          {userData && (
            <Box display={{ base: "none", sm: "flex" }} p={5} borderBottomWidth={1} borderColor="#3f3f3f">
              <form>
                <HStack onClick={() => navigate('/create')}>

                  {/* profile current User start */}
                  <HStack justifyContent="center" w="40px" aspectRatio="1/1" borderRadius={100} bg="theme.500" overflow="hidden">
                    {userData.profile ? (
                      <Img src={userData.profile} w="100%" h="100%" objectFit="cover" />
                    ) : (
                      <UserRound />
                    )}
                  </HStack>
                  {/* profile current User end */}

                  <Box flex="1" h="100%">
                    <Input
                      w="100%" px={2} placeholder="What is happening?!" fontSize="xl" outline="none" border="none" _placeholder={{ color: "#848484" }} _focus={{ outline: "none", border: "none", ring: "none" }}></Input>

                  </Box>
                  <Button type="button" p={2} mx={0.5} borderRadius={100} bg="inherit" _hover={{ bg: "#353535" }} _active={{ transform: "scale(0.95)" }} transitionDuration="75ms">
                    <Img src={addImage} w="100%"></Img>
                  </Button>
                  <Button type="submit" borderRadius={100} bg="#04A51E" color={"inherit"} size="md" mr={10} _hover={{ bg: "#027815" }} _active={{ transform: "scale(0.95)" }} transitionDuration="75ms">Post</Button>
                </HStack>
              </form>
            </Box>
          )}

          {threads && threads.length > 0 ? threads.map(thread => (
            <ThreadCard
              key={thread.id}
              url={`/status/${thread.id}`}
              content={thread.content}
              likes={thread.Like.length}
              replies={thread.Reply.length}
              image={thread.image}
              fullname={thread.User.username}
              username={thread.User.username}
              threadUserId={thread.User.id}
              createdAt={thread.createdAt}
              profile={thread.User.profile}
              isLiked={userData && thread.Like.find(like => like.userId === Number(userData!.id)) ? true : false}
              currentUserId={Number(userData?.id)}
              threadId={thread.id}
              onReply={() => navigate(`/status/${thread.id}/reply`)}
            />
          )) : (
            <>
              <ThreadCardSkeleton />
              <ThreadCardSkeleton />
              <ThreadCardSkeleton />
              <ThreadCardSkeleton />
            </>
          )}

        </Box>
      </MainLayout >
    </Box >
  )
};

export default Home;