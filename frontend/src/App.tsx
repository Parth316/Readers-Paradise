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
import Index from '../admin/components/Index';
import AddBook from '../admin/components/AddBook';
import ListBooks from '../admin/components/ListBooks';
import ForgotPassword from '../components/ForgotPassword';
import EmptyCart from '../components/EmptyCart';
// App Component which contains navigation bar and routes
function App() {
  return (
    <>
    <Router>
    <NavBar/>
      <Routes>
        <Route path="/" element={<Navigate to="/admin"/>}/>
        <Route path='/admin' element={<Index/>}/>
        <Route path="/home"  element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/services" element={<Services />}/> 
        <Route path="/login" element={<Login/>}/> 
        <Route path="/signup" element={<SignUp/>}/>
        <Route path="/explore" element={<Explore />} />
        <Route path="/addBooks" element={<AddBook/>}/>
        <Route path="/listBooks" element={<ListBooks/>}/>
        <Route path="/forgotPassword" element={<ForgotPassword/>}/>
        <Route path="/cart/empty" element={<EmptyCart />} />
        </Routes>
    </Router>
  </>
  )
}

export default App
