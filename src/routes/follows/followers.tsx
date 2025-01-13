import Cookies from 'js-cookie';
import Suggestion from '@/components/layouts/suggestion';
import { fetchFollowerUsers } from '@/features/relation/services/follow.service';
import useUserStore from '@/hooks/userStore';
import { useEffect, useState } from 'react';
import { Box } from '@chakra-ui/react';
import SuggestionSkeleton from '@/components/layouts/suggestionSkeleton';

const FollowersPage = () => {
    const [followers, setFollowers] = useState<any[] | null>(null);
    const [isLoadingResults, setIsLoadingResults] = useState(false);

    const { userData } = useUserStore();

    useEffect(() => {
        document.title = `Followers ${userData ? `| ${userData.username}` : ""}`
    }, [userData]);

    useEffect(() => {
        retrieveFollowerUsers();
    }, [userData]);

    function retrieveFollowerUsers() {
        setIsLoadingResults(true);
        setFollowers(null);
        const token = Cookies.get('token')!;
        fetchFollowerUsers(token, userData!.id)
            .then(res => {
                setFollowers(res.data);
            })
            .catch(error => console.log(error))
            .finally(() => setIsLoadingResults(false))
    };

    if (!userData) return <></>
    else
        return (
            <div>
                {isLoadingResults && (
                    <Box p={2}>
                        <SuggestionSkeleton />
                        <SuggestionSkeleton />
                        <SuggestionSkeleton />
                        <SuggestionSkeleton />
                    </Box>
                )}
                {followers?.map(item => (
                    <Suggestion
                        key={item.id}
                        idSubject={userData!.id}
                        idObject={item.following.id}
                        image={item.following.image}
                        following={item.following.follower.find((item: any) => item.followingId === userData?.id) ? true : false}
                        fullname={item.following.username} username={item.following.username}
                    />
                ))
                }
            </div>
        )
};

export default FollowersPage