import React from 'react'
import './Login.css'
import assets from '../../assets/assets'
import { useState } from 'react'
import { signup,login,resetPass } from '../../config/firebase'
const Login = () => {
  const [currentstate,setCurrentstate] =useState('Sign Up');
  const [userName,setUserName]= useState('');
  const [email,setEmail]= useState('');
  const [password,setPassword]= useState('');
  const handleSubmit = async (e) => {
    e.preventDefault();
    if(currentstate === 'Sign Up'){
      await signup(userName,email,password);
    } else {
      // Handle login logic here
      login(email,password);
    }
  };
  return (
    <>
    <div className='login'>

    <img src={assets.logo_big} alt="" className="logo" />

    <form  onSubmit={handleSubmit} className="login-form">
      <h2>{currentstate}</h2>
      {currentstate ==="Sign Up"? (
        <input 
          type="text" 
          value={userName}
          onChange={(e)=>{setUserName(e.target.value)}} 
          placeholder='username' 
          className="form-input" 
          autoComplete="username"
          required
        />
      ) : null}
      <input 
        type="email" 
        value={email}
        placeholder='Email' 
        onChange={(e)=>{setEmail(e.target.value)}} 
        className="form-input"
        autoComplete="email"
        required
      />
      <input 
        type="password" 
        value={password}
        placeholder='password' 
        onChange={(e)=>{setPassword(e.target.value)}} 
        className="form-input"
        autoComplete={currentstate === 'Sign Up' ? "new-password" : "current-password"}
        required
      />
      <button type='submit'>{currentstate==='Sign Up'?"Register":"Login"}</button>
      <div className="login-term">
        {currentstate==='Sign Up'?<input type="checkbox" name="" id="" />:null}
        <p>{currentstate==="Sign Up"?"Agree to our terms" :null}</p>
      </div>
      <div className="forgot-password">
        <p>{currentstate==='Sign Up' ? "Already have an account ?": "Dont have an account ?"}   <span onClick={()=>(currentstate=='Sign Up'?setCurrentstate('Login'):setCurrentstate('Sign Up'))}>click here</span></p>
        {currentstate=="Login"? <p> Forgot password?  <span onClick={()=>(resetPass(email))}>reset here</span></p>:null}
      </div>
    </form>
    </div>
    </>
  )
}

export default Login
