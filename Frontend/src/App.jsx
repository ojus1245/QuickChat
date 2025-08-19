import React, { useContext, useEffect } from 'react'
import { Routes,Route,useNavigate } from 'react-router-dom'
import Login from './Pages/Login/Login.jsx'
import Chat from './Pages/Chat/Chat.jsx'
import ProfileUpdate from './Pages/ProfileUpdate/ProfileUpdate.jsx'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from './config/firebase.js'
import { AppContext } from './context/AppContext.jsx'

function App() {
  const  navigate = useNavigate();
  const {loadUserData}=useContext(AppContext)
  useEffect(()=>{
    onAuthStateChanged(auth,async (user)=>{
      if(user){
        navigate('/Chat');
        await loadUserData(user.uid);
      } else {
        navigate('/');
      }
    })
  },[])
  return (
    <>
      <ToastContainer />
      <Routes>
        <Route path="/" element={<Login/>} />
        <Route path="/Chat" element={<Chat/>} />
        <Route path="/Profile" element={<ProfileUpdate/>} />
      </Routes>
    </>
  )
}

export default App
