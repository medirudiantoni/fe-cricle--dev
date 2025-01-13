import { Box, Button, HStack, Spinner } from '@chakra-ui/react';
import Cookies from 'js-cookie';
import React, { useState } from 'react'
import UserProfile from '../userProfile'
import { fetchFollowingAction, fetchUnfollowingAction } from '@/features/relation/services/follow.service'
import { getCurrentUser } from '@/features/auth/services/auth-service';
import useUserStore from '@/hooks/userStore';
import { useNavigate } from 'react-router-dom';
import useConfirm from '../dialog/dialog';

interface SuggestionProps {
    image?: string,
    fullname: string,
    username: string,
    idSubject: string,
    idObject: string,
    bio?: string,
    following: boolean,
    handleSearch?: () => void;
};

const Suggestion: React.FC<SuggestionProps> = ({ image, fullname, username, idSubject, idObject, following, bio, handleSearch }) => {
    const navigate = useNavigate();
    const { setUser, setUserData } = useUserStore();
    const { confirmDialog, AlertDialogComponent } = useConfirm();
    const [isLoadingfoll, setIsLoadingfoll] = useState(false);

    async function retrieveCurrentUser() {
        const token = Cookies.get('token');
        try {
            if (token) {
                const currentUser = await getCurrentUser(token);
                setUserData(currentUser.data);
                setUser(currentUser.user);
                setIsLoadingfoll(false);
            } else {
                throw new Error('Invalid token')
            };
        } catch (error) {
            console.log(error)
        }
    };
    const handleFollow = () => {
        setIsLoadingfoll(true);
        const token = Cookies.get('token')!;
        const data = {
            followingId: String(idSubject),
        }
        fetchFollowingAction(token, data, String(idObject))
            .then(() => {
                retrieveCurrentUser();
            })
            .catch(error => console.log(error))
    }
    const handleUnfollow = async (username: string) => {
        const isConfirmUnfollow = await confirmDialog({ title: "Confirm unfollow", text: `Are you sure want to unfollow ${username}?`, trueText: "Confirm", theme: "danger" });
        const token = Cookies.get('token')!;
        const data = {
            followingId: String(idSubject),
        }
        if (isConfirmUnfollow){
            setIsLoadingfoll(true);
            fetchUnfollowingAction(token, data, String(idObject))
                .then(() => {
                    retrieveCurrentUser();
                })
                .catch(error => console.log(error))
        }
    }
    const handleClick = (e: React.MouseEvent<HTMLButtonElement>, username: string) => {
        e.stopPropagation();
        following ? handleUnfollow(username) : handleFollow();
        handleSearch && handleSearch();
    }
    return (
        <HStack onClick={() => navigate(`/profile/${idObject}`)} cursor="pointer" gap={3} alignItems={bio ? "start" : "center"} py={2} px={4} _hover={{ bg: "theme.600" }}>
            {AlertDialogComponent}
            <UserProfile
                userId={idObject}
                image={image}
                fullname={fullname}
                username={username}
                bio={bio}
            />
            <Box w="fit-content">
                {isLoadingfoll ? (
                    <Button
                        disabled
                        borderRadius={100}
                        borderWidth={1}
                        bg="inherit"
                        color="inherit"
                        size="sm"
                        opacity="50%"
                    >
                        <Spinner size="sm" />
                    </Button>
                ) : (
                    <Button
                        onClick={(e) => handleClick(e, username)}
                        borderRadius={100}
                        borderWidth={1}
                        bg="inherit"
                        color="inherit"
                        size="sm"
                        opacity={following ? "50%" : "100%"}
                    >
                        {following ? 'following' : 'follow'}
                    </Button>
                )}
            </Box>
        </HStack >
    )
}

export default Suggestion