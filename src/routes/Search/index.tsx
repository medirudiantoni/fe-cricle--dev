import Cookies from "js-cookie";
import Suggestion from "@/components/layouts/suggestion";
import { fetchSearchUser } from "@/features/relation/services/users.service";
import useUserStore from "@/hooks/userStore";
import MainLayout from "@/layouts";
import { UserDataType } from "@/types/user.types";
import { Box, Heading, HStack, Input, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import SuggestionSkeleton from "@/components/layouts/suggestionSkeleton";

const SearchPage = () => {
  const [isInputSearch, setIsInputSearch] = useState("");
  const [isResults, setIsResults] = useState<UserDataType[]>([]);
  const [isFollowings, setIsFollowings] = useState<UserDataType[]>([]);
  const [isLoadingResults, setIsLoadingResults] = useState(false);
  const { userData } = useUserStore();

  useEffect(() => {
    document.title = `Search | Circle`
}, []);

  useEffect(() => {
    if (isResults.length > 0) {
      const followedUsers = isResults.filter(user => user.follower.find(data => data.following?.id == userData?.id));
      setIsFollowings(followedUsers);
    }
  }, [isResults])

  useEffect(() => {
    isInputSearch.length > 0 ?
      handleSearchUser() :
      setIsResults([]);
  }, [isInputSearch]);

  async function handleSearchUser() {
    setIsLoadingResults(true);
    const token = Cookies.get('token')
    try {
      const res: UserDataType[] = await fetchSearchUser(String(token), isInputSearch).then(res => res.data);
      if (res){
        setIsLoadingResults(false);
        setIsResults(res);
      }
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <Box overflowX="hidden">
      <MainLayout>
        <Box w="100%" minH="100vh">
          <Box p={5}>
            <Input
              onChange={(e) => setIsInputSearch(e.target.value)}
              value={isInputSearch}
              placeholder="Search user"
              w="100%"
              borderRadius={100}
              bg="#3f3f3f"
              borderColor="#04A51E"
              outline="none"
              ring="none"
              _hover={{ ring: "none", outline: "none" }}
              ringColor="#04A51E"></Input>
          </Box>

          {isLoadingResults && (
            <Box px={8} py={5}>
              <SuggestionSkeleton />
              <SuggestionSkeleton />
              <SuggestionSkeleton />
              <SuggestionSkeleton />
              <SuggestionSkeleton />
              <SuggestionSkeleton />
            </Box>
          )}

          {isResults && isResults.length > 0 ? (
            <Box p={5} pt={0}>
              {isResults.map((user) => (
                <Suggestion
                  key={user.id}
                  idObject={user.id}
                  idSubject={String(userData?.id)}
                  following={isFollowings.find(u => u.id == user.id) ? true : false}
                  fullname={user.fullname ? user.fullname : user.username}
                  username={user.username}
                  handleSearch={handleSearchUser}
                  bio={user.bio} />
              ))}
            </Box>
          ) : (
            <HStack w="100%" h="90vh" alignItems="center" justifyContent="center">
              <Box textAlign="center" w="50%">
                <Heading size="md" fontWeight="semibold">Write and search something!</Heading>
                <Text color="#767676">Try searching for something else or check the spelling of what you typed</Text>
              </Box>
            </HStack>
          )}

        </Box>
      </MainLayout>
    </Box>
  )
};

export default SearchPage;