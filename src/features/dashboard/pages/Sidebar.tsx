import { RiMenuUnfold4Fill } from "react-icons/ri";
import Menue from "../components/Menue";
import { TbLogout } from "react-icons/tb";
import { MdOutlineSettings } from "react-icons/md";
import { logout } from "../../../services/operations/auth";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { useNavigate } from "react-router-dom";
import { ImSpinner3 } from "react-icons/im";

interface SidebarProps {
  setActiveSidebar: (value: boolean) => void;
}


export default function Sidebar({ setActiveSidebar }: SidebarProps) {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { loading } = useAppSelector((state) => state.auth);

  function logoutHandler() {
    console.log("Clicked logout");
    dispatch(logout(navigate));
  }

  return (
    <div className="min-w-64 bg-blue-950 h-screen flex flex-col">
      {/* Top section (Logo + close button) */}
      <div className="flex items-center justify-between px-3 py-5">
        <h1 className="text-white font-semibold text-2xl">Ticketing</h1>
        <button onClick={() => setActiveSidebar(false)}>
          <RiMenuUnfold4Fill size={25} className="text-white" />
        </button>
      </div>

      {/* Scrollable middle section */}
      <div className="flex-1 overflow-y-auto px-3">
        <Menue />
      </div>

      {/* Bottom section (Logout + Settings) */}
      <div className="flex flex-col px-4 gap-4 text-white py-4">
        <div className="flex items-center gap-4 hover:text-red-600 hover:bg-gray-700 p-1 rounded-md pl-4">
          <TbLogout size={25} />
          <button className="text-md" onClick={logoutHandler}>
            {loading ? <ImSpinner3 className="animate-spin" /> : "Logout"}
          </button>
        </div>
        <div className="flex items-center gap-4 hover:text-blue-600 hover:bg-gray-700 p-1 rounded-md pl-4">
          <MdOutlineSettings size={23} />
          <button>Settings</button>
        </div>
      </div>
    </div>
  );
}
