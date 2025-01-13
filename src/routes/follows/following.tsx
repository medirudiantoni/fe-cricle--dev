import Cookies from 'js-cookie';
import Suggestion from '@/components/layouts/suggestion';
import { fetchFollowingUsers } from '@/features/relation/services/follow.service';
import useUserStore from '@/hooks/userStore';
import { useEffect, useState } from 'react';
import { Box } from '@chakra-ui/react';
import SuggestionSkeleton from '@/components/layouts/suggestionSkeleton';

const FollowingPage = () => {
  const [following, setFollowing] = useState<any[] | null>(null);
  const [isLoadingResults, setIsLoadingResults] = useState(false);

  const { userData } = useUserStore();

  useEffect(() => {
    document.title = `Following ${userData ? `| ${userData.username}` : ""}`
  }, [userData]);

  const retrieveFollowingUsers = async () => {
    setIsLoadingResults(true);
    setFollowing(null);
    const token = Cookies.get('token')!;
    try {
      const res = await fetchFollowingUsers(token, userData!.id);
      setFollowing(res.data);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoadingResults(false);
    }
  };

  useEffect(() => {
    retrieveFollowingUsers();
  }, [userData]);

  if (!userData) return <></>;

  return (
    <div>
      {isLoadingResults && (
        <Box p={2}>
          <SuggestionSkeleton />
          <SuggestionSkeleton />
          <SuggestionSkeleton />
          <SuggestionSkeleton />
        </Box>
      )} {/* Indikator loading */}
      {following?.map((item) => (
        <Suggestion
          key={item.id}
          idSubject={userData!.id}
          idObject={item.follower.id}
          following={true}
          fullname={item.follower.username}
          username={item.follower.username}
        />
      ))}
    </div>
  );
};

export default FollowingPage;
