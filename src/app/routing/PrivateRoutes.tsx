import {FC, lazy, Suspense, useEffect} from 'react';
import {Navigate, Route, Routes, useNavigate} from 'react-router-dom';
import {MasterLayout} from '../../_metronic/layout/MasterLayout';
import TopBarProgress from 'react-topbar-progress-indicator';
import {MenuTestPage} from '../pages/MenuTestPage';
import {getCSSVariableValue} from '../../_metronic/assets/ts/_utils';
import {WithChildren} from '../../_metronic/helpers';
import Role from '../pages/roleManagement/roles';
import Users from '../pages/roleManagement/users';
import ConstructionPage from '../modules/errors/underConstruction';
import Prizes from '../pages/BussinesSettings/lead';
import Chats from '../pages/chat/chat';
import { useAuth } from '../modules/auth';

const PrivateRoutes = () => {
  const ProfilePage = lazy(() => import('../modules/profile/ProfilePage'));
  const WizardsPage = lazy(() => import('../modules/wizards/WizardsPage'));
  const AccountPage = lazy(() => import('../modules/accounts/AccountPage'));
  const WidgetsPage = lazy(() => import('../modules/widgets/WidgetsPage'));
  const ChatPage = lazy(() => import('../modules/apps/chat/ChatPage'));
  const navigate = useNavigate();
  const {currentUser} = useAuth(); 

  useEffect(() => {
    // Add event listener for 'keydown' event
    window.addEventListener('keydown', handleEscKey);

    // Cleanup function to remove the event listener
    return () => {
      window.removeEventListener('keydown', handleEscKey);
    };
  }, []);

  const handleEscKey = (event) => {
    if (event.key === 'Escape') {
      event.preventDefault();
      navigate(-1); // Example using react-router-dom
    } else if (event.altKey && event.key === 'a') {
      navigate('/campaign/form');
    }
  };

  return (
    <Routes>
      <Route element={<MasterLayout />}>
        {/* Redirect to Dashboard after success login/registartion */}
        <Route path='auth/*' element={<Navigate to='/prizePage' />} />
        {/* Pages */}
        <Route path='dashboard' element={<Prizes />} />
       
        <Route path='menu-test' element={<MenuTestPage />} />
        {/* Lazy Modules */}
        <Route
          path='crafted/pages/profile/*'
          element={
            <SuspensedView>
              <ProfilePage />
            </SuspensedView>
          }
        />
        <Route
          path='crafted/pages/wizards/*'
          element={
            <SuspensedView>
              <WizardsPage />
            </SuspensedView>
          }
        />
        <Route
          path='roles'
          element={
            <SuspensedView>
              <Role />
            </SuspensedView>
          }
        />
        <Route
          path='users'
          element={
            <SuspensedView>
              <Users />
            </SuspensedView>
          }
        />
        <Route
          path='construction'
          element={
            <SuspensedView>
              <ConstructionPage />
            </SuspensedView>
          }
        />
        <Route
          path='crafted/widgets/*'
          element={
            <SuspensedView>
              <WidgetsPage />
            </SuspensedView>
          }
        />
        <Route
          path='crafted/account/*'
          element={
            <SuspensedView>
              <AccountPage />
            </SuspensedView>
          }
        />
        <Route
          path='apps/chat/*'
          element={
            <SuspensedView>
              <ChatPage />
            </SuspensedView>
          }
        />

      
        <Route
          path='prizePage'
          element={
            <SuspensedView>
              <Prizes />
            </SuspensedView>
          }
        />
        <Route
          path='chatPage'
          element={
            <SuspensedView>
              <Chats />
            </SuspensedView>
          }
        />
        <Route
          path='role'
          element={
            <SuspensedView>
              <Role />
            </SuspensedView>
          }
        />
        {/* Page Not Found */}
        <Route path='*' element={<Navigate to='/error/404' />} />
      </Route>
    </Routes>
  )
}

const SuspensedView: FC<WithChildren> = ({children}) => {
  const baseColor = getCSSVariableValue('--bs-primary')
  TopBarProgress.config({
    barColors: {
      '0': baseColor,
    },
    barThickness: 1,
    shadowBlur: 5,
  })
  return <Suspense fallback={<TopBarProgress />}>{children}</Suspense>
}

export {PrivateRoutes}
