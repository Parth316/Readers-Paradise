import React from 'react';
import './App.css'
import NavBar from "../components/NavBar";
import { BrowserRouter as Router, Routes, Route,Navigate } from "react-router-dom";
import Home from "../components/Home";
import About from "../components/About";
import Services from "../components/Services";
import Login from "../components/Login";
import SignUp from '../components/SignUp';
import Explore from '../components/Explore';

function App() {
  return (
    <>
    <Router>
    <NavBar/>
      <Routes>
        <Route path="/" element={<Navigate to="/home"/>}/>
        <Route path="/home"  element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/services" element={<Services />}/> 
        <Route path="/login" element={<Login/>}/> 
        <Route path="/signup" element={<SignUp/>}/>
        <Route path="/explore" element={<Explore />} />
        
        </Routes>
    </Router>
  </>
  )
}

export default App
