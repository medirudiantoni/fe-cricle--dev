import MainLayout from "@/layouts";
import { Box, HStack, Text } from "@chakra-ui/react";
import UserProfileCard from "@/components/layouts/UserProfileCard";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { ThreadDataType } from "@/types/thread.types";
import ThreadCard from "@/components/Thread/threadCard";
import { useParams } from "react-router-dom";
import { UserDataType } from "@/types/user.types";
import { fetchUserById } from "@/features/relation/services/users.service";
import useUserStore from "@/hooks/userStore";
import { monthsName } from "@/utils/format-date";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import ImageViewDetail from "@/components/userProfile/ImageViewDetail";

const UsersProfilePage = () => {
  const { userId } = useParams();
  const { userData } = useUserStore();
  const [threads, setThreads] = useState<ThreadDataType[] | null>(null);
  const [userProfile, setUserProfile] = useState<UserDataType | null>(null);
  const [isMediaTab, setIsMediaTab] = useState(false);
  const [isThreadWithMedia, setIsThreadWithMedia] = useState<ThreadDataType[]>([]);
  const [isViewImage, setIsViewImage] = useState<string | null>(null);
  const [isViewImageThread, setIsViewImageThread] = useState<boolean>(false);
  
  useEffect(() => {
    document.title = `Following ${userProfile ? `| ${userProfile.username}` : ""}`
  }, [userProfile]);

  useEffect(() => {
    retrieveTheUsersThreads();
  }, [userId]);

  async function retrieveTheUsersThreads() {
    const token = Cookies.get('token');
    try {
      if (token) {
        const theUser: UserDataType = await fetchUserById(token, userId!).then(res => res.data);
        setUserProfile(theUser);
        setThreads(theUser.Thread);
      } else {
        throw new Error('Invalid token')
      };
    } catch (error) {
      console.log(error)
    }
  };

  const handleCloseViewImage = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()
    setIsViewImage(null);
    setIsViewImageThread(false);
  }
  const handleToggleImageThread = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()
    setIsViewImageThread(!isViewImageThread);
  };

  useEffect(() => {
    if (threads) setIsThreadWithMedia(threads?.filter(th => th.image));
  }, [threads]);

  return (
    <Box overflowX="hidden">
      <MainLayout titlePage={userProfile?.username} isUserProfilePage={false}>
        <Box w="100%" h="fit-content">
          <Box p={5} pb={0} borderBottomWidth={1} borderColor="#3f3f3f">
            <UserProfileCard
              profile={userProfile?.profile}
              background={userProfile?.background}
              username={userProfile?.username as string}
              fullname={userProfile?.fullname ? userProfile.fullname as string : userProfile?.username as string}
              bio={userProfile?.bio}
              following={userProfile?.following.length}
              follower={userProfile?.follower.length} 
              objectUserId={userProfile?.id}
            />

            {/* Content navigation start */}
            <HStack w="100%" gap={0} position="relative" mt={5}>
              <Box role="button" onClick={() => setIsMediaTab(false)} p={2} flex={1} borderTopRadius={10} textAlign="center" fontSize="md" _hover={{ bg: "theme.600" }}>All Post</Box>
              <Box role="button" onClick={() => setIsMediaTab(true)} p={2} flex={1} borderTopRadius={10} textAlign="center" fontSize="md" _hover={{ bg: "theme.600" }}>Media</Box>
              <Box w="50%" position="absolute" bottom={0} borderBottomWidth={3} borderBottomColor="brand.500" transitionDuration="100ms" left={0} style={isMediaTab ? { transform: "translateX(100%)" } : { transform: "translateX(0%)" }} ></Box>
            </HStack>
            {/* Content navigation end */}
          </Box>

          {!isMediaTab ? (
            <Box w="100%">
              {threads ? threads.map(thread => (
                <ThreadCard
                  threadUserId={thread.User.id}
                  createdAt={thread.createdAt}
                  key={thread.id}
                  url={`/status/${thread.id}`}
                  isLiked={thread.Like.find(like => like.userId === Number(userData?.id)) ? true : false}
                  content={thread.content}
                  fullname={thread.User.fullname ? thread.User.fullname : thread.User.username as string}
                  username={thread.User.username}
                  likes={thread.Like.length}
                  replies={thread.Reply.length}
                  profile={thread.User.profile}
                  image={thread.image}
                  currentUserId={Number(userData?.id)}
                  threadId={thread.id}
                  retrieveReplies={() => retrieveTheUsersThreads()}
                />
              )) : (
                <HStack w="100%" aspectRatio="4/3" alignItems="center" justifyContent="center">
                  <Box textAlign="center">
                    <Text color="theme.400">There is no post</Text>
                  </Box>
                </HStack>
              )}
            </Box>
          ) : (
            <Box w="100%" p={2}>
              {isThreadWithMedia.length > 0 ? (
                // <div role="button" className="w-full h-fit grid gap-2 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                //   {isThreadWithMedia?.map((thread, index) => {
                //     return thread.image && (
                //       <div key={thread.id} className={`${index == 4 ? "col-span-2 aspect-[4/2]" : "col-span-1 aspect-square"} overflow-hidden rounded-sm`}>
                //         <img src={thread.image} className="w-full h-full object-cover"></img>
                //       </div>
                //     )
                //   })}
                // </div>
                <div className="w-full h-fit grid gap-0.5 md:gap-2 grid-cols-3 relative">
                    {isThreadWithMedia?.map((thread, index) => {
                      const postTime = new Date(thread.createdAt);
                      const postHour = `${postTime.getHours()}:${postTime.getMinutes()}`;
                      const postDate = `${monthsName[postTime.getMonth()]} ${postTime.getDate()}, ${postTime.getFullYear()}`
                      return thread.image && (
                        <div role="button" onClick={() => setIsViewImage(String(thread.id))} key={thread.id} className={`${index == 4 ? "col-span-2 aspect-[4/2]" : "col-span-1 aspect-square"} transition-all duration-200 ease-in-out overflow-hidden rounded-sm`}>

                          <div className={`w-full h-full ${isViewImage == String(thread.id) ? "fixed z-20 top-0 left-0 flex gap-0 items-center justify-center duration-200 ease-in-out transition-all bg-theme-800" : ""}`}>

                            {isViewImage && (
                              <>
                                <div role="button" onClick={(e: any) => handleCloseViewImage(e)} className="fixed z-20 left-10 top-10 w-fit p-2 aspect-square rounded-full bg-neutral-50 hover:bg-neutral-200 active:bg-neutral-400 text-neutral-900">
                                  <X />
                                </div>
                                <div role="button" onClick={(e: any) => handleToggleImageThread(e)} className="fixed z-20 right-10 top-10 w-fit p-2 aspect-square rounded-full border-2 border-neutral-50 hover:bg-neutral-500 active:bg-neutral-600 text-neutral-50">
                                  {isViewImageThread ? (
                                    <ChevronRight />
                                  ) : (
                                    <ChevronLeft />
                                  )}
                                </div>
                              </>
                            )}

                            {/* <img src={thread.image} className={`object-cover ${isViewImage ? "w-fit h-fit max-w-[80%] max-h-full relative z-10 transition-all duration-200 ease-in-out " : "w-full h-full"}`}></img> */}

                            <div className={`${isViewImage ? "flex-1 h-fit px-5 relative z-10 flex items-center justify-center transition-all duration-200 ease-in-out" : "w-full h-full"}`}>
                              <img src={thread.image} className={`object-cover overflow-hidden ${isViewImage ? `object-contain w-fit h-fit max-h-full relative z-10 transition-all duration-200 ease-in-out ${isViewImageThread ? "max-w-full" : "max-w-[80%]"}` : "w-full h-full"}`}></img>
                            </div>

                            <ImageViewDetail 
                              thread={thread}
                              userData={userData}
                              isViewImageThread={isViewImageThread}
                              retrieveUserThreads={retrieveTheUsersThreads}
                              postDate={postDate}
                              postHour={postHour}
                              key={thread.id}
                            />

                          </div>

                        </div>
                      )
                    })}
                  </div>
              ) : (
                <div className="w-full aspect-video flex items-center justify-center">
                  <p className="text-neutral-600">No Media here</p>
                </div>
              )}
            </Box>
          )}

        </Box>
      </MainLayout>
    </Box>
  )
};

export default UsersProfilePage;