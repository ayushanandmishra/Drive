import NewPost from './Components/NewPost'
import { useSelector } from "react-redux";
import { BrowserRouter, Navigate, Routes, Route } from "react-router-dom";


import { AllFiles } from './Components/AllFiles'

import DashHeader from './Components/DashHeader/DashHeader'
import HomePage from './Components/NavBar/Navbar'

import LoginForm from "./Components/LoginPage/LoginForm/LoginForm"
import LoginPage from './Components/LoginPage/LoginPage'
import SignUpForm from './Components/SignUp/SignUpForm/SignUpForm'
import SignUpPage from './Components/SignUp/SignUpPage'


import './App.css'

function App() {


  const isAuth=Boolean(useSelector((state)=>state.token));
  return (
    <>

      <BrowserRouter>
      <Routes>

        <Route path='/' element={isAuth?<HomePage/>:<LoginPage/>}/>
        <Route path='/signup' element={isAuth?<HomePage/>:<SignUpPage/>}/>
      </Routes>
     
      </BrowserRouter>
   
   
      {/* <NewPost/>
      <AllFiles/> */}
    </>
  )
}

export default App
