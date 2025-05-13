"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";

import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenuToggle,
  NavbarMenu,
} from "@nextui-org/navbar";
import { Logo } from "../common/Logo";
import Image from "next/image";
import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from "@nextui-org/react";
import { User } from "@phosphor-icons/react";

export function HeadingBar() {
  const path = usePathname(); // Get the current path for active links
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const delayedSetIsMenuOpen = (val: boolean) => {
    setTimeout(() => {
      setIsMenuOpen(val);
    }, 500);
  };

  const navList = (
    <>
      {/* <NavbarItem
        isActive={path === "/"}
        onClick={() => delayedSetIsMenuOpen(false)}
      >
        <Link href="/">Home</Link>
      </NavbarItem> */}

      {/* <NavbarItem
        isActive={path === "/kanji"}
        onClick={() => delayedSetIsMenuOpen(false)}
      >
        <Link href="/kanji">Kanji</Link>
      </NavbarItem> */}
      {/* <Dropdown>
        <DropdownTrigger>
          <Button variant="bordered">Kanji</Button>
        </DropdownTrigger>
        <DropdownMenu aria-label="Static Actions">
          <DropdownItem key="cards" onClick={() => delayedSetIsMenuOpen(false)}>
            <Link href={'/study/kanji/cards'}>
              Flash Cards
            </Link>
          </DropdownItem>
          <DropdownItem key="repetition" onClick={() => delayedSetIsMenuOpen(false)}><Link href={'/study/kanji/repetition'}>Flash Repetition</Link> </DropdownItem>
        </DropdownMenu>
      </Dropdown>


      <NavbarItem
        isActive={path === "/quiz"}
        onClick={() => delayedSetIsMenuOpen(false)}
      >
        <Link href="/quiz">Quiz</Link>
      </NavbarItem>

      <Dropdown>
        <DropdownTrigger>
          <Button variant="bordered">Jukugo</Button>
        </DropdownTrigger>
        <DropdownMenu aria-label="Static Actions">
          <DropdownItem key="cards" onClick={() => delayedSetIsMenuOpen(false)}><Link href={'/study/jukugo/cards'}>Flash Cards</Link></DropdownItem>
          <DropdownItem key="repetition" onClick={() => delayedSetIsMenuOpen(false)}><Link href={'/study/jukugo/repetition'}>Flash Repetition</Link> </DropdownItem>
        </DropdownMenu>
      </Dropdown> */}

      <NavbarItem
        isActive={path === "/profile"}
        onClick={() => delayedSetIsMenuOpen(false)}
      >
        <Link href="/profile"><User className="mx-auto" size={32} /></Link>
      </NavbarItem>
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
