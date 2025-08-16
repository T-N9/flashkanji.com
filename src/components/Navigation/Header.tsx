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
  Avatar,
} from "@heroui/react";
import Image from "next/image";
import { Button } from "@heroui/react";
import { Clover, Fire, HeartStraight, User } from "@phosphor-icons/react";
import Indicator from "../pomodoro/Indicator";
import { useUserStore } from "@/store/userState";

export function HeadingBar() {
  const path = usePathname(); // Get the current path for active links
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [authCookie, setAuthCookie] = useState<string | undefined>(undefined);
  const { currentStreak, lives, xp_points, avatarUrl } = useUserStore();

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

            <NavbarItem className="gap-3 hidden lg:flex">
              <div className="flex justify-center items-center gap-1">
                <p>{currentStreak === 0 ? 0 : currentStreak - 1}</p>
                <Fire weight="fill" size={32} color="orange" />
              </div>
              <div className="flex justify-center items-center gap-1">
                <p>{lives}</p>
                <HeartStraight weight="fill" size={32} color="red" />
              </div>
              <div className="flex justify-center items-center gap-1">
                <p>{Math.floor(xp_points)}</p>
                <Clover weight="fill" size={32} color="green" />
              </div>
            </NavbarItem>
            <NavbarItem
              isActive={path === "/profile"}
              onClick={() => delayedSetIsMenuOpen(false)}
            >
              <Link href="/profile"><Avatar
                src={avatarUrl}
                className="bg-gradient-to-br from-orange-500 to-yellow-400 text-white mx-auto"
              /></Link>
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
      className="z-[45] bg-white dark:bg-slate-900"
      isBordered
      isBlurred={false}
      onMenuOpenChange={setIsMenuOpen}
    >
      {/* Navbar Brand */}
      <NavbarBrand className="hidden lg:block">
        <Link href="/">
          {/* <Logo/> */}
          <Image className="w-28 dark:hidden" src={'/assets/logo.png'} width={638} height={205} alt="Flash Kanji Logo" />
          <Image className="w-28 hidden dark:block" src={'/assets/logo-white.png'} width={638} height={205} alt="Flash Kanji Logo" />
        </Link>
      </NavbarBrand>
      {authCookie === undefined ?
        <NavbarBrand className="block lg:hidden">
          <Link href="/">
            {/* <Logo/> */}
            <Image className="w-28 dark:hidden" src={'/assets/logo.png'} width={638} height={205} alt="Flash Kanji Logo" />
            <Image className="w-28 hidden dark:block" src={'/assets/logo-white.png'} width={638} height={205} alt="Flash Kanji Logo" />
          </Link>
        </NavbarBrand>
        :
        <NavbarItem className="gap-3 flex lg:hidden">
          <div className="flex justify-center items-center gap-1">
            <p>{currentStreak === 0 ? 0 : currentStreak - 1}</p>
            <Fire weight="fill" size={32} color="orange" />
          </div>
          <div className="flex justify-center items-center gap-1">
            <p>{lives}</p>
            <HeartStraight weight="fill" size={32} color="red" />
          </div>
          <div className="flex justify-center items-center gap-1">
            <p>{Math.floor(xp_points)}</p>
            <Clover weight="fill" size={32} color="green" />
          </div>
        </NavbarItem>
      }



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
          <div className="text-gray-700 dark:text-gray-300 gap-6 flex flex-col text-center">
            {navList}
          </div>
        </div>
      </NavbarMenu>
    </Navbar>
  );
}

export default HeadingBar;
