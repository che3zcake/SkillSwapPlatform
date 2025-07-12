import { useState } from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css'
import Layout from "./pages/Layout.jsx";
import Signup from "./pages/Signup.jsx";
import Login from "./pages/Login.jsx";
import Profile from "./pages/Profile.jsx";
import Swap from "./pages/Swap.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import ErrorNotFound from "./pages/ErrorNotFound.jsx";
import CreateProfile from "./pages/CreateProfile.jsx";

function App() {
  // const [count, setCount] = useState(0)

  return (
      <>
        <BrowserRouter>
            <Routes>
                {/*<Route path={"/landing"} element={<Landing/>}/>*/}
                <Route path={"/"} element={<Layout/>}>
                    <Route path={'/'} element={<Dashboard/>}/>
                    <Route path={"/signup"} element={<Signup/>}/>
                    <Route path={"/login"} element={<Login/>}/>
                    <Route path={'/create-profile'} element={<CreateProfile/>}/>
                    <Route path={'/profile'} element={<Profile/>}/>
                    <Route path={'/swap'} element={<Swap/>}/>
                    <Route path="*" element={<ErrorNotFound/>} />
                </Route>
            </Routes>
        </BrowserRouter>
      </>
  )
}

export default App
