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
} from "@heroui/react";
import Image from "next/image";
import { Button } from "@heroui/react";
import { Cherries, Fire, HeartStraight, User } from "@phosphor-icons/react";
import Indicator from "../pomodoro/Indicator";
import { useUserStore } from "@/store/userState";

export function HeadingBar() {
  const path = usePathname(); // Get the current path for active links
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [authCookie, setAuthCookie] = useState<string | undefined>(undefined);
  const { currentStreak, lives, xp_points } = useUserStore();

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
          <>
            <NavbarItem
              isActive={path === "/flashdecks"}
              onClick={() => delayedSetIsMenuOpen(false)}
            >
              <Link href="/flashdecks">Flashdecks</Link>
            </NavbarItem>
            <NavbarItem
              isActive={path === "/flashmap"}
              onClick={() => delayedSetIsMenuOpen(false)}
            >
              <Link href="/flashmap">Flashmap</Link>
            </NavbarItem>
            <NavbarItem
              isActive={path === "/flashboard"}
              onClick={() => delayedSetIsMenuOpen(false)}
            >
              <Link href="/flashboard">Flashboard</Link>
            </NavbarItem>
            <NavbarItem
              isActive={path === "/pomodoro"}
              onClick={() => delayedSetIsMenuOpen(false)}
            >

              <Link href="/pomodoro"><Indicator /></Link>
            </NavbarItem>

            <NavbarItem className="gap-5 hidden lg:flex">
              <div className="flex justify-center items-center gap-2">
                <p>{currentStreak}</p>
                <Fire size={32} />
              </div>
              <div className="flex justify-center items-center gap-2">
                <p>{lives}</p>
                <HeartStraight size={32} />
              </div>
              <div className="flex justify-center items-center gap-2">
                <p>{xp_points}</p>
                <Cherries size={32} />
              </div>
            </NavbarItem>
            <NavbarItem
              isActive={path === "/profile"}
              onClick={() => delayedSetIsMenuOpen(false)}
            >
              <Link href="/profile"><User className="mx-auto" size={32} /></Link>
            </NavbarItem>
          </>
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
      <NavbarBrand className="hidden lg:block">
        <Link href="/">
          {/* <Logo/> */}
          <Image className="w-28" src={'/assets/logo.png'} width={638} height={205} alt="Flash Kanji Logo" />
        </Link>
      </NavbarBrand>
      <NavbarItem className="flex gap-5 lg:hidden">
        <div className="flex justify-center items-center gap-2">
          <p>{currentStreak}</p>
          <Fire size={32} />
        </div>
        <div className="flex justify-center items-center gap-2">
          <p>{lives}</p>
          <HeartStraight size={32} />
        </div>
        <div className="flex justify-center items-center gap-2">
          <p>{xp_points}</p>
          <Cherries size={32} />
        </div>
      </NavbarItem>

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
