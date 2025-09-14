import { useState } from "react";
import { Link } from "react-router-dom";

interface MenuItem {
  key: string;
  title: string;
  path:string;
  icon?: React.ReactNode; // ✅ ReactNode instead of string
}

interface MenueDataProps {
  menuData: MenuItem[];
}

export default function MenueData({ menuData }: MenueDataProps) {
  const [activeKey,setActiveKey]=useState<string | null>(null)
  return (
    <div className="flex flex-col gap-1 mt-5 w-10/12 mx-auto ">
       {menuData.map((e) => (
        <div
          key={e.key}
          className={`flex items-center gap-6  text-white hover:text-blue-600  rounded-sm py-2 px-5 ${activeKey===e.key?("bg-gray-500"):""}`}
        >
          <span className="text-md">{e.icon}</span>
          <Link to={e.path} onClick={()=>setActiveKey(e.key)} type="button" className="flex-1 text-left font-semibold">
            {e.title}
          </Link>
        </div>
      ))}
    </div>
  );
}
