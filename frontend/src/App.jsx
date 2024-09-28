
import './css/App.css'
import FooterComponent from './components/FooterComponent'
import HeaderComponent from './components/HeaderComponent'
import InstructionComponent from './components/InstructionComponent'
import CreateInstructionComponent from './components/CreateInstructionComponent'
import ListInstructionsComponent from './components/ListInstructionsComponent'
import LoginComponent from './components/LoginComponent'
import UsersComponent from './components/UsersComponent'
import AddUserComponent from './components/AddUserComponent'
import {BrowserRouter, Routes, Route} from 'react-router-dom'

function App() {

  return (
    <>
      <BrowserRouter>
        <HeaderComponent />
          <Routes>
            <Route path='/instructions' element={<ListInstructionsComponent />}></Route>
            <Route path='/instructions/instruction' element={<InstructionComponent />}></Route>
            <Route path='/instructions/new' element={<CreateInstructionComponent />}></Route>
            <Route path='/login' element={<LoginComponent />}></Route>
            <Route path='/users' element={<UsersComponent />}></Route>
            <Route path='/users/new' element={<AddUserComponent />}></Route>
          </Routes>
        <FooterComponent />
      </BrowserRouter>
    </>
  )
}

export default App
