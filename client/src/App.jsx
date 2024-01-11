import NewPost from './Components/NewPost'
import { AllFiles } from './Components/AllFiles'

import DashHeader from './Components/DashHeader/DashHeader'
import Navbar from './Components/NavBar/NavBarAlt'
import LoginForm from "./Components/LoginPage/LoginForm/LoginForm"
import LoginPage from './Components/LoginPage/LoginPage'
import SignUpForm from './Components/SignUp/SignUpForm/SignUpForm'
import SignUpPage from './Components/SignUp/SignUpPage'
import { BrowserRouter } from 'react-router-dom'

import './App.css'

function App() {


  return (
    <>

      <BrowserRouter>
      <SignUpPage/>
      
      </BrowserRouter>
   
   
      {/* <NewPost/>
      <AllFiles/> */}
    </>
  )
}

export default App
