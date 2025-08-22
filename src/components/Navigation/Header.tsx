"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
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
import Indicator from "../pomodoro/Indicator";
import { useUserStore } from "@/store/userState";
import { Link } from "@/i18n/navigation";
import { useLocale } from "next-intl";

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
  const locale = useLocale();

  console.log({ path, locale, route: `/${locale}/flashdecks` })

  const navList = (
    <>

      {
        authCookie !== undefined ?
          <>
            <NavbarItem
              isActive={path === `/${locale}/flashdecks`}
              onClick={() => delayedSetIsMenuOpen(false)}
              className="flex justify-center"
            >
              <Link className={`${path === `/${locale}/flashdecks` ? 'grayscale-0 scale-125' : 'grayscale'} hover:scale-125 transform duration-300 block`} href="/flashdecks">
                <img src="/assets/icons/flashdecks.png" className="w-20 h-20 lg:w-10 lg:h-10" width={40} height={40} />
              </Link>
            </NavbarItem>
            <NavbarItem
              isActive={path === `/${locale}/flashmap`}
              onClick={() => delayedSetIsMenuOpen(false)}
              className="flex justify-center"
            >
              <Link className={`${path === `/${locale}/flashmap` ? 'grayscale-0 scale-125' : 'grayscale'} hover:scale-125 transform duration-300 block`} href="/flashmap"><img src="/assets/icons/flashmap.png" className="w-20 h-20 lg:w-10 lg:h-10" width={40} height={40} /></Link>
            </NavbarItem>
            <NavbarItem
              isActive={path === `/${locale}/flashboard`}
              onClick={() => delayedSetIsMenuOpen(false)}
              className="flex justify-center"
            >
              <Link className={`${path === `/${locale}/flashboard` ? 'grayscale-0 scale-125' : 'grayscale'} hover:scale-125 transform duration-300 block`} href="/flashboard"><img src="/assets/icons/flashboard.png" className="w-20 h-20 lg:w-10 lg:h-10" width={40} height={40} /></Link>
            </NavbarItem>
            <NavbarItem
              isActive={path === `/${locale}/pomodoro`}
              onClick={() => delayedSetIsMenuOpen(false)}
              className="flex justify-center"
            >

              <Link className={`${path === `/${locale}/pomodoro` ? 'grayscale-0 scale-125' : 'grayscale'} hover:scale-125 transform duration-300 block`} href="/pomodoro"><Indicator /></Link>
            </NavbarItem>

            <NavbarItem className="gap-3 hidden lg:flex mx-10">
              <div className="flex justify-center items-center gap-0">
                <p className="text-yellow-500 font-bold">{currentStreak === 0 ? 0 : currentStreak - 1}</p>
                <img src="/assets/icons/streak.png" width={35} height={35} />
              </div>
              <div className="flex justify-center items-center gap-0">
                <p className="text-red-500 font-bold">{lives}</p>
                <img src="/assets/icons/heart.png" width={38} height={38} />
              </div>
              <div className="flex justify-center items-center gap-0">
                <p className="text-green-500 font-bold">{Math.floor(xp_points)}</p>
                <img src="/assets/icons/clover.png" width={35} height={35} />
              </div>
            </NavbarItem>
            <NavbarItem
              isActive={path === "/profile"}
              onClick={() => delayedSetIsMenuOpen(false)}
            >
              <Link href="/profile"><Avatar
                src={avatarUrl}
                className="bg-gradient-to-br border-orange-300 dark:border-orange-500 border-2 from-orange-500 to-yellow-400 text-white mx-auto"
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
      className="z-[45] bg-white dark:bg-backdrop"
      isBordered
      isBlurred={false}
      onMenuOpenChange={setIsMenuOpen}
    >
      {/* Navbar Brand */}
      <NavbarBrand className="hidden lg:block">
        <Link href="/">
          {/* <Logo/> */}
          <Image className="w-14" src={'/assets/logo.png'} width={100} height={100} alt="Flash Kanji Logo" />

        </Link>
      </NavbarBrand>

      {authCookie === undefined ?
        <NavbarBrand className="block lg:hidden">
          <Link href="/">
            {/* <Logo/> */}
            <Image className="w-14" src={'/assets/logo.png'} width={100} height={100} alt="Flash Kanji Logo" />

          </Link>
        </NavbarBrand>
        :
        <NavbarItem className="gap-3 flex lg:hidden">
          <div className="flex justify-center items-center gap-0">
            <p className="text-yellow-500 font-bold">{currentStreak === 0 ? 0 : currentStreak - 1}</p>
            <img src="/assets/icons/streak.png" width={35} height={35} />
          </div>
          <div className="flex justify-center items-center gap-0">
            <p className="text-red-500 font-bold">{lives}</p>
            <img src="/assets/icons/heart.png" width={38} height={38} />
          </div>
          <div className="flex justify-center items-center gap-0">
            <p className="text-green-500 font-bold">{Math.floor(xp_points)}</p>
            <img src="/assets/icons/clover.png" width={35} height={35} />
          </div>
        </NavbarItem>
      }



      {/* Navbar Content (Desktop) */}
      <NavbarContent className="hidden sm:flex gap-2" justify="center">
        {navList}
      </NavbarContent>

      {/* Navbar Menu Toggle (Mobile) */}
      <div className="block lg:hidden h-full">
        <NavbarMenuToggle />
      </div>

      {/* Navbar Menu (Mobile) */}
      <NavbarMenu className="bg-white dark:bg-backdrop">
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
