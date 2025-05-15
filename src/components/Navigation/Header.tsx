"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Cookies from 'js-cookie';

import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenuToggle,
  NavbarMenu,
} from "@nextui-org/navbar";
import Image from "next/image";
import { Button } from "@nextui-org/react";
import { User } from "@phosphor-icons/react";

export function HeadingBar() {
  const path = usePathname(); // Get the current path for active links
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [authCookie, setAuthCookie] = useState<string | undefined>(undefined);

  useEffect(() => {
    const cookie = Cookies.get('sb-access-token');
    setAuthCookie(cookie);
  }, []);

  const delayedSetIsMenuOpen = (val: boolean) => {
    setTimeout(() => {
      setIsMenuOpen(val);
    }, 500);
  };

  const navList = (
    <>
      {
        authCookie !== undefined ?
          <NavbarItem
            isActive={path === "/profile"}
            onClick={() => delayedSetIsMenuOpen(false)}
          >
            <Link href="/profile"><User className="mx-auto" size={32} /></Link>
          </NavbarItem>
          :
          <NavbarItem
            onClick={() => delayedSetIsMenuOpen(false)}
          >
            <Link href="/login"><Button>Log In</Button></Link>
          </NavbarItem>
      }

    </>
  );

  return (
    <Navbar
      isMenuOpen={isMenuOpen}
      className="z-[45]"
      isBordered
      isBlurred={false}
      onMenuOpenChange={setIsMenuOpen}
    >
      {/* Navbar Brand */}
      <NavbarBrand>
        <Link href="/">
          {/* <Logo/> */}
          <Image className="w-28" src={'/logo.png'} width={638} height={205} alt="Flash Kanji Logo" />
        </Link>
      </NavbarBrand>

      {/* Navbar Content (Desktop) */}
      <NavbarContent className="hidden sm:flex gap-6" justify="center">
        {navList}
      </NavbarContent>

      {/* Navbar Menu Toggle (Mobile) */}
      <div className="block lg:hidden h-full">
        <NavbarMenuToggle />
      </div>

      {/* Navbar Menu (Mobile) */}
      <NavbarMenu>
        <div className="container flex flex-col gap-6 mx-auto">
          <div className="text-gray-700 gap-6 flex flex-col text-center">
            {navList}
          </div>
        </div>
      </NavbarMenu>
    </Navbar>
  );
}

export default HeadingBar;
