
import React, { useEffect } from 'react';

import { useDispatch, useSelector } from 'react-redux';

import StoreProvider from './store/StoreProvider';

import HomeView from './views/Home';
import ChatView from './views/Chat';
import WelcomeView from './views/Welcome';
import SettingsView from './views/Settings';

import Navbar from './components/Navbar';
import LoadingView from './components/shared/LoadingView';

import { listenToAuthChanges } from './actions/auth';

import {
  HashRouter as Router,
  Routes,
  Route,
  Navigate,
  Outlet
} from 'react-router-dom';


function AuthRoute({children}) {
  const user = useSelector(({auth}) => auth.user)
  
  return user ? children : <Navigate to="/" />
}


const ContentWrapper = ({children}) => <div className='content-wrapper'>{children}</div>

function ChatApp() {
  const dispatch = useDispatch();
  const isChecking = useSelector(({auth}) => auth.isChecking)

  useEffect(() => {
    dispatch(listenToAuthChanges());
  }, [dispatch])

  if (isChecking) {
    return <LoadingView />
  }

  return (
    <Router>
      <Navbar />
      <ContentWrapper>
        <Routes>
          <Route
             path="/" 
             exact
             element={<WelcomeView />}
          />
          <Route 
            path="/home"
            element={
              <AuthRoute>
                <HomeView /> 
              </AuthRoute >
            }
          /> 
          <Route 
            path="/chat/:id"
            element={
              <AuthRoute>
                <ChatView /> 
              </AuthRoute >
            }
          /> 
          <Route 
            path="/settings"
            element={
              <AuthRoute>
                <SettingsView /> 
              </AuthRoute >
            }
          /> 
        </Routes>
      </ContentWrapper>
    </Router>
  )
}

export default function App() {
  return (
    <StoreProvider>
      <ChatApp />
    </StoreProvider>
  )
}
