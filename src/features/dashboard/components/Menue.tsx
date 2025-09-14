import { MdKeyboardArrowRight } from "react-icons/md";
import { GiModernCity } from "react-icons/gi";
import { FaLocationDot } from "react-icons/fa6";
import { LiaCitySolid } from "react-icons/lia";
import { useState } from "react";
import { RiCalendarEventLine } from "react-icons/ri";
import { FaChalkboardUser } from "react-icons/fa6";
import { RiUserStarLine } from "react-icons/ri";
import { PiWarehouseBold } from "react-icons/pi"; 
import { GrVirtualMachine } from "react-icons/gr";
import { NavLink } from "react-router-dom";
import { RiSlideshow2Line } from "react-icons/ri";
import { IoTicketOutline } from "react-icons/io5";

const sideData = [
  {
    id: 1,
    title: "Locations",
    submenu: [
      { key: "country", title: "Countries", path: "/dashboard/location/countries", icon: <FaLocationDot /> },
      { key: "region", title: "Regions", path: "/dashboard/location/regions", icon: <LiaCitySolid /> },
      { key: "city", title: "Cities", path: "/dashboard/location/cities", icon: <GiModernCity /> },
    ],
  },
  {
    id: 2,
    title: "Organizer",
    submenu: [
      { key: "organizer", title: "Organizer", path: "/dashboard/organizers", icon: <FaChalkboardUser size={20}/> },
    ],
  },
  {
    id: 3,
    title: "Venue",
    submenu: [
      { key: "facility", title: "Facilities", path: "/dashboard/venue/facilities", icon: <GrVirtualMachine size={20}/> },
      { key: "venue", title: "Venue", path: "/dashboard/venue", icon: <PiWarehouseBold size={20}/>, end: true },
    ],
  },
  {
    id: 4,
    title: "Artist",
    submenu: [
      { key: "artist", title: "Artist", path: "/dashboard/artist", icon: <RiUserStarLine  size={20}/> },
    ],
  },
  {
    id: 5,
    title: "Events",
    submenu: [
      { key: "events", title: "Events", path: "/dashboard/events", icon: <RiCalendarEventLine size={20}/> },
    ],
  },
  {
    id: 6,
    title: "Shows",
    submenu: [
      { key: "shows", title: "Shows", path: "/dashboard/shows", icon: <RiSlideshow2Line size={20}/> },
    ],
  },
  {
    id: 7,
    title: "Ticket-Category",
    submenu: [
      { key: "ticketcategory", title: "Ticket category", path: "/dashboard/ticket-category", icon: <IoTicketOutline size={20}/> },
    ],
  },
];

export default function Menue() {
  const [openId, setOpenId] = useState<number | null>(null);

  const toggleMenu = (id: number) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <div className="w-full mt-9 flex flex-col gap-4">
      {sideData.map((item) => (
        <div key={item.id} className="mb-2">
          {/* Parent menu */}
          <div
            className="flex justify-between items-center cursor-pointer text-white hover:text-blue-600"
            onClick={() => toggleMenu(item.id)}
          >
            <span className="font-medium">{item.title}</span>
            <MdKeyboardArrowRight
              size={23}
              className={`transition-transform duration-300 ${
                openId === item.id ? "rotate-90" : ""
              }`}
            />
          </div>

          {/* Submenu */}
          <div
            className={`overflow-hidden transition-all duration-300 ${
              openId === item.id ? "max-h-screen" : "max-h-0"
            }`}
          >
            <div className="ml-6 mt-2 flex flex-col gap-2">
              {item.submenu.map((sub) => (
                <NavLink
                  key={sub.key}
                  to={sub.path}
                  end={sub.end} // 👈 yahan exact match ke liye handle kiya
                  className={({ isActive }) =>
                    `flex items-center gap-2 p-1 rounded-md transition ${
                      isActive ? "bg-white text-black" : "text-gray-300 hover:text-blue-500"
                    }`
                  }
                >
                  {sub.icon}
                  <span>{sub.title}</span>
                </NavLink>
              ))}
            </div>
          </div>
        </div>
      ))}

      <div className="bg-white p-[1px] mt-2"></div>
    </div>
  );
}
