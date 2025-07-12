import {Outlet} from "react-router-dom";
import NavBar from "../components/NavBar.jsx";

export default function Layout(props) {
    return <div className="">
        <NavBar/>
        <div className="outlet"><Outlet/></div>
    </div>
}