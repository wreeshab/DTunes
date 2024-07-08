import React, { useContext, useState } from "react";
import { FaBell } from "react-icons/fa6";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import NotificationsPage from "./NotificationsPage";

const Navbar = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [showNotifications, setShowNotifications] = useState(false);
  return (
    <div className="w-full flex justify-between items-center font-semibold ">
      <div className="flex items-center gap-2 ">
        <h1 className="text-xl lg:text-2xl font-bold">
          Welcome back! {user.name}
        </h1>
        {/* <p className='lg:flex items-center justify-center w-20 hidden h-10 bg-black rounded-full text-white font-bold cursor-pointer'>Music </p>
           <p className='lg:flex items-center justify-center w-20 hidden h-10 bg-black rounded-full text-white font-bold cursor-pointer'>Artists </p>
            <p className='lg:flex items-center justify-center w-20 hidden h-10 bg-black rounded-full text-white font-bold cursor-pointer'>Users </p> */}
      </div>
      <div className="flex items-center gap-4">
        <FaBell
          className="text-2xl cursor-pointer"
          onClick={() => setShowNotifications(true)}
        />
        <p
          className="w-10 h-10 bg-purple-500 rounded-full flex justify-center items-center text-black font-bold cursor-pointer"
          onClick={() => navigate("/dashboard/profile")}
        >
          {user.name[0].toUpperCase()}
        </p>
      </div>
      {showNotifications && (
        <NotificationsPage setShowNotifications={setShowNotifications} />
      )}
    </div>
  );
};

export default Navbar;
