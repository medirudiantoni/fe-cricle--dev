import { Box } from '@chakra-ui/react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Home from './routes/Home';
import StatusPage from './routes/Status';
import NotFound from './routes/404';
import UserProfilePage from './routes/Profile';
import SearchPage from './routes/Search';
import FollowsPage from './routes/follows';
import Register from './routes/auth/register';
import Login from './routes/auth/login';
import ForgotPassword from './routes/auth/forgotPassword';
import ResetPassword from './routes/auth/resetPassword';
import FollowersPage from './routes/follows/followers';
import FollowingPage from './routes/follows/following';
import UsersProfilePage from './routes/Profile/profileUsers';
import ReplyPage from './routes/Status/reply';
import CreateNewThreadPage from './routes/thread/new.thread';
import UpdateThreadPage from './routes/thread/update.thread';
import UpdateReplyPage from './routes/thread/update.reply';
import ProtectionRoute from './routes/auth/protection';
import AuthenticationRoute from './routes/auth/authentication';

function App() {
  const theme = 'dark';
  const toastTheme = theme === 'dark'
    ? {
      style: {
        background: '#333',
        color: '#fff',
      },
    }
    : {
      style: {
        background: '#fff',
        color: '#333',
      },
    };

  return (
    <Box bgColor="#1d1d1d" color="white">
      <BrowserRouter>
        <Routes>
          <Route element={<ProtectionRoute />}>
            <Route index element={<Home />} />
            <Route path='/create' element={<CreateNewThreadPage />} />
            <Route path='/edit/:threadId' element={<UpdateThreadPage />} />
            <Route path='/edit-reply/:replyId' element={<UpdateReplyPage />} />
            <Route path='/' element={<FollowsPage />}>
              <Route path='/followers' element={<FollowersPage />} />
              <Route path='/following' element={<FollowingPage />} />
            </Route>
            <Route path='/status/:idThread' element={<StatusPage />} />
            <Route path='/status/:idThread/reply' element={<StatusPage />} />
            <Route path='/reply/:replyId' element={<ReplyPage />} />
            <Route path='/profile' element={<UserProfilePage />} />
            <Route path='/profile/:userId' element={<UsersProfilePage />} />
            <Route path='/search' element={<SearchPage />} />
          </Route>

          <Route element={<AuthenticationRoute />}>
            <Route path='/register' element={<Register />} />
            <Route path='/login' element={<Login />} />
            <Route path='/forgot-password' element={<ForgotPassword />} />
            <Route path='/reset-password' element={<ResetPassword />} />
          </Route>

          <Route path='/*' element={<NotFound />} />
        </Routes>
      </BrowserRouter>
      <Toaster toastOptions={{
        success: toastTheme,
        error: toastTheme,
        loading: toastTheme,
      }} />
    </Box>
  );
}

export default App;
