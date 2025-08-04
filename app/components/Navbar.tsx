import Link from "next/link";
import React from "react";

const menus = [
  { name: "Home", path: "/" },
  { name: "Players", path: "/pages/players" },
];

const Navbar = () => {
  return (
    <div className="min-h-[40px] text-white w-full flex justify-center items-start">
      <li className="flex gap-5">
        {menus.map((menu, idx) => {
          return (
            <ul key={idx} className="border-b-2 border-transparent hover:border-white">
              <Link href={menu.path}>{menu.name}</Link>
            </ul>
          );
        })}
      </li>
    </div>
  );
};

export default Navbar;
