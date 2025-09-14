import { RiMenuUnfold3Line } from "react-icons/ri";
import { FaUser } from "react-icons/fa";

interface NavbarProps {
  activeSidebar: boolean;
  setActiveSidebar: (value: boolean) => void;
}

export default function Navbar({
  activeSidebar,
  setActiveSidebar,
}: NavbarProps) {
  return (
    <div className="w-full bg-white border border-b-2 border-gray-200 py-1">
      <div className="flex justify-between px-4 items-center">
        {/* Sidebar Toggle Button */}

        <button
          onClick={() => setActiveSidebar(true)}
          className={`
    transition-opacity duration-300
    ${
      activeSidebar
        ? "invisible pointer-events-none"
        : "visible pointer-events-auto"
    }
  `}
        >
          <RiMenuUnfold3Line size={25} className="text-black" />
        </button>

        {/* User Icon */}
        <div className="border-2 border-gray-400 rounded-full p-3">
          <FaUser size={20} className="text-gray-400" />
        </div>
      </div>
    </div>
  );
}
