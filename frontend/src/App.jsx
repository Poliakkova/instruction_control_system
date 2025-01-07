
import './css/App.css';
import FooterComponent from './components/panels/FooterComponent';
import HeaderComponent from './components/panels/HeaderComponent';

import InstructionComponent from './components/instructions/InstructionComponent';
import CreateInstructionComponent from './components/instructions/CreateInstructionComponent';
import EditInstructionComponent from './components/instructions/EditInstructionComponent';
import ListInstructionsComponent from './components/instructions/ListInstructionsComponent';
import ListArchivedComponent from './components/instructions/ListArchivedComponent';

import LoginComponent from './components/LoginComponent';

import UsersComponent from './components/users/UsersComponent';
import AddUserComponent from './components/users/AddUserComponent';
import EditUserComponent from './components/users/EditUserComponent';
import UserComponent from './components/users/UserComponent';

import StatisticsComponent from './components/StatisticsComponent';

import {BrowserRouter, Routes, Route} from 'react-router-dom';
import {ReactFlowProvider} from '@xyflow/react';
import LoginService from './sevices/LoginService';
import AccessDeniedComponent from './components/AccessDeniedComponent';
import SettingsComponent from './components/users/SettingsComponent';
import ForgotPasswordComponent from './components/ForgotPasswordComponent';
import ResetPasswordComponent from './components/ResetPasswordComponent';


function App() {

  return (
    <>
    <ReactFlowProvider>
      <BrowserRouter>
        <HeaderComponent />
          <Routes>
            <Route path='/instructions' element={LoginService.isAuthenticated() ? <ListInstructionsComponent /> : <LoginComponent />}></Route>
            <Route path='/instructions/archived' element={LoginService.isAuthenticated() ? <ListArchivedComponent /> : <LoginComponent />}></Route>
            <Route path="/instructions/:code" element={LoginService.isAuthenticated() ? <InstructionComponent /> : <LoginComponent />} />
            <Route path='/users/settings/:userLogin' element={LoginService.isAuthenticated() ? <SettingsComponent /> : <LoginComponent />}></Route>

            <Route path='/instructions/new' element={LoginService.isAdmin() || LoginService.isHeadAdmin() ? <CreateInstructionComponent /> : <AccessDeniedComponent />}></Route>
            <Route path='/instructions/edit/:code' element={LoginService.isAdmin() || LoginService.isHeadAdmin ? <EditInstructionComponent /> : <AccessDeniedComponent />}></Route>
            
            <Route path='/login' element={!LoginService.isAuthenticated() ? <LoginComponent /> : <AccessDeniedComponent />}></Route>
            <Route path='/forgot-password' element={!LoginService.isAuthenticated() ? <ForgotPasswordComponent /> : <AccessDeniedComponent />}></Route>
            <Route path='/reset-password' element={!LoginService.isAuthenticated() ? <ResetPasswordComponent /> : <AccessDeniedComponent />}></Route>

            <Route path="/users" element={LoginService.isAdmin() || LoginService.isHeadAdmin() ? <UsersComponent /> : <AccessDeniedComponent />}/>
            <Route path='/users/new' element={LoginService.isAdmin() || LoginService.isHeadAdmin() ? <AddUserComponent /> : <AccessDeniedComponent />}></Route>
            <Route path='/users/edit/:userLogin' element={LoginService.isAdmin() || LoginService.isHeadAdmin() ? <EditUserComponent /> : <AccessDeniedComponent />}></Route>
            <Route path='/users/:userLogin' element={LoginService.isAdmin() || LoginService.isHeadAdmin() ? <UserComponent /> : <AccessDeniedComponent />}></Route>
            <Route path='/statistics' element={LoginService.isAdmin() || LoginService.isHeadAdmin() ? <StatisticsComponent /> : <AccessDeniedComponent />}></Route>
          </Routes>
        <FooterComponent />
      </BrowserRouter>
      </ReactFlowProvider>
    </>
  )
};

export default App;
