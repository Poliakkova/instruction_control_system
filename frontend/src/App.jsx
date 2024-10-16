
import './css/App.css'
import FooterComponent from './components/FooterComponent'
import HeaderComponent from './components/HeaderComponent'
import InstructionComponent from './components/InstructionComponent'
import CreateInstructionComponent from './components/CreateInstructionComponent'
import EditInstructionComponent from './components/EditInstructionComponent'
import ListInstructionsComponent from './components/ListInstructionsComponent'
import ListArchivedComponent from './components/ListArchivedComponent'
import LoginComponent from './components/LoginComponent'
import UsersComponent from './components/UsersComponent'
import AddUserComponent from './components/AddUserComponent'
import EditUserComponent from './components/EditUserComponent'
import UserComponent from './components/UserComponent'
import StatisticsComponent from './components/StatisticsComponent'
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import {ReactFlowProvider} from '@xyflow/react';


function App() {

  return (
    <>
    <ReactFlowProvider>
      <BrowserRouter>
        <HeaderComponent />
          <Routes>
            <Route path='/instructions' element={<ListInstructionsComponent />}></Route>
            <Route path='/instructions/archived' element={<ListArchivedComponent />}></Route>
            <Route path="/instructions/:code" element={<InstructionComponent />} />
            <Route path='/instructions/new' element={<CreateInstructionComponent />}></Route>
            <Route path='/instructions/edit/:code' element={<EditInstructionComponent />}></Route>
            <Route path='/login' element={<LoginComponent />}></Route>
            <Route path='/users' element={<UsersComponent />}></Route>
            <Route path='/users/new' element={<AddUserComponent />}></Route>
            <Route path='/users/edit/:userLogin' element={<EditUserComponent />}></Route>
            <Route path='/users/:userLogin' element={<UserComponent />}></Route>
            <Route path='/statistics' element={<StatisticsComponent />}></Route>
          </Routes>
        <FooterComponent />
      </BrowserRouter>
      </ReactFlowProvider>
    </>
  )
}

export default App
