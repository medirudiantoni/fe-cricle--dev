import MainLayout from "@/layouts";
import { Box, HStack, Skeleton, Text } from "@chakra-ui/react";
import UserProfileCard from "@/components/layouts/UserProfileCard";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import useUserStore from "@/hooks/userStore";
import { ThreadDataType } from "@/types/thread.types";
import { getThreadByUserId } from "@/features/threads/services/thread.services";
import ThreadCard from "@/components/Thread/threadCard";
import EditProfileModal from "@/components/userProfile/editProfile";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { monthsName } from "@/utils/format-date";
import ImageViewDetail from "@/components/userProfile/ImageViewDetail";
import toast from "react-hot-toast";
import ThreadCardSkeleton from "@/components/Thread/threadCardSkeleton";

const UserProfilePage = () => {
  const { userData } = useUserStore();
  const [threads, setThreads] = useState<ThreadDataType[] | null>(null);
  const [isEditProfile, setEditProfile] = useState(false);
  const [isMediaTab, setIsMediaTab] = useState(false);
  const [isThreadWithMedia, setIsThreadWithMedia] = useState<ThreadDataType[]>([]);
  const [isViewImage, setIsViewImage] = useState<string | null>(null);
  const [isViewImageThread, setIsViewImageThread] = useState<boolean>(false);
  const [isLoadingUserThreads, setIsLoadingUserThreads] = useState(false);

  useEffect(() => {
    document.title = `Profile ${userData ? `| ${userData.username}` : ""}`
  }, [userData]);

  useEffect(() => {
    retrieveUserThreads();
  }, [userData]);

  async function retrieveUserThreads() {
    setIsLoadingUserThreads(true);
    const token = Cookies.get('token');
    if (token) {
      await getThreadByUserId(token, userData!.id)
        .then(res => {
          setThreads(res);
          setIsLoadingUserThreads(false)
        })
        .catch(error => {
          console.log(error);
          toast.error("Failed to get all user's threads");
          setIsLoadingUserThreads(false)
        });
    } else {
      throw new Error('Invalid token')
    };
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
      <MainLayout titlePage={userData?.username} isUserProfilePage={false}>
        <Box w="100%" h="fit-content">
          <Box p={5} pb={0} borderBottomWidth={1} borderColor="#3f3f3f">
            {userData ? (
              <UserProfileCard
                profile={userData.profile}
                background={userData.background}
                username={userData?.username as string}
                fullname={userData?.fullname ? userData.fullname : userData?.username as string}
                bio={userData?.bio}
                following={userData?.following ? userData.following.length : 0}
                follower={userData?.follower.length}
                onEditProfile={() => setEditProfile(true)} />
            ) : (
              <UserProfileCard username="none" fullname="none" bio="none" following={0} follower={0} />
            )}

            {/* Content navigation start */}
            <HStack w="100%" gap={0} position="relative" mt={5}>
              <Box role="button" onClick={() => setIsMediaTab(false)} p={2} flex={1} borderTopRadius={10} textAlign="center" fontSize="md" _hover={{ bg: "theme.600" }}>All Post</Box>
              <Box role="button" onClick={() => setIsMediaTab(true)} p={2} flex={1} borderTopRadius={10} textAlign="center" fontSize="md" _hover={{ bg: "theme.600" }}>Media</Box>
              <Box w="50%" position="absolute" bottom={0} borderBottomWidth={3} borderBottomColor="brand.500" transitionDuration="100ms" left={0} style={isMediaTab ? { transform: "translateX(100%)" } : { transform: "translateX(0%)" }} ></Box>
            </HStack>
            {/* Content navigation end */}

          </Box>
          {isEditProfile && (
            <EditProfileModal onClose={() => setEditProfile(false)} />
          )}

          {!isMediaTab ? (
            <Box w="100%">
              {isLoadingUserThreads && (
                <Box p={0}>
                  <ThreadCardSkeleton />
                  <ThreadCardSkeleton />
                  <ThreadCardSkeleton />
                </Box>
              )}
              {threads && threads.length > 0 ? threads.map(thread => (
                <ThreadCard
                  createdAt={thread.createdAt}
                  key={thread.id}
                  isLiked={thread.Like.find(like => like.userId === Number(userData!.id)) ? true : false}
                  url={`/status/${thread.id}`}
                  content={thread.content}
                  fullname={userData?.fullname ? userData.fullname : userData?.username as string}
                  username={thread.User.username}
                  threadUserId={thread.User.id}
                  likes={thread.Like.length}
                  replies={thread.Reply.length}
                  profile={thread.User.profile}
                  image={thread.image}
                  currentUserId={parseInt(userData!.id)}
                  threadId={thread.id}
                  retrieveReplies={() => retrieveUserThreads()}
                  actionAfterDeletePost={() => retrieveUserThreads()}
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
              {isLoadingUserThreads && (
                <HStack gap="2px" flexWrap="wrap">
                  <Skeleton flex={1} w="100%" aspectRatio="1/1" startColor="theme.700" endColor="theme.500"></Skeleton>
                  <Skeleton flex={1} w="100%" aspectRatio="1/1" startColor="theme.700" endColor="theme.500"></Skeleton>
                  <Skeleton flex={1} w="100%" aspectRatio="1/1" startColor="theme.700" endColor="theme.500"></Skeleton>
                </HStack>
              )}
              {isThreadWithMedia.length > 0 ? (
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
                              <div role="button" onClick={(e: any) => handleCloseViewImage(e)} className="fixed z-20 left-2 sm:left-10 top-2 sm:top-10 w-fit p-2 aspect-square rounded-full bg-neutral-50 hover:bg-neutral-200 active:bg-neutral-400 text-neutral-900">
                                <X />
                              </div>
                              <div role="button" onClick={(e: any) => handleToggleImageThread(e)} className="fixed z-20 right-2 sm:right-10 top-2 sm:top-10 w-fit p-2 aspect-square rounded-full border-2 border-neutral-50 hover:bg-neutral-500 active:bg-neutral-600 text-neutral-50">
                                {isViewImageThread ? (
                                  <ChevronRight />
                                ) : (
                                  <ChevronLeft />
                                )}
                              </div>
                            </>
                          )}

                          <div className={`${isViewImage ? "flex-1 h-fit px-0 sm:px-5 relative z-10 flex items-center justify-center transition-all duration-200 ease-in-out" : "w-full h-full"}`}>
                            <img src={thread.image} className={` object-cover overflow-hidden ${isViewImage ? `object-contain w-fit h-fit max-h-full relative z-10 transition-all duration-200 ease-in-out ${isViewImageThread ? "max-w-full" : "sm:max-w-[80%]"}` : "w-full h-full"}`}></img>
                          </div>

                          <ImageViewDetail
                            thread={thread}
                            userData={userData}
                            isViewImageThread={isViewImageThread}
                            retrieveUserThreads={retrieveUserThreads}
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

export default UserProfilePage;