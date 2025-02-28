'use client'
import Link from "next/link"
import { Button, Input } from "@nextui-org/react"
import { BookOpen, GraduationCap, MessengerLogo, Users } from "@phosphor-icons/react"

export default function Footer() {
  return (
    <footer className="bg-slate-50 border-t mt-10">
      <div className="container max-w-[1280px]  mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo and About */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <BookOpen className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold">Flash Kanji</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Learn Japanese kanji characters efficiently with our innovative flashcard system, detailed explanations,
              and practice exercises.
            </p>
            {/* <div className="flex space-x-4">
              <Link href="#" className="text-muted-foreground hover:text-primary">
                <Facebook className="h-5 w-5" />
                <span className="sr-only">Facebook</span>
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-primary">
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-primary">
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-primary">
                <Youtube className="h-5 w-5" />
                <span className="sr-only">YouTube</span>
              </Link>
            </div> */}
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium uppercase tracking-wider">Learn</h3>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="text-sm text-muted-foreground hover:text-primary">
                  JLPT N5 Kanji
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-muted-foreground hover:text-primary">
                  JLPT N4 Kanji
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-muted-foreground hover:text-primary">
                  JLPT N3 Kanji
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-muted-foreground hover:text-primary">
                  JLPT N2 Kanji
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-muted-foreground hover:text-primary">
                  JLPT N1 Kanji
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-muted-foreground hover:text-primary">
                  Kanji by Grade
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium uppercase tracking-wider">Resources</h3>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="text-sm text-muted-foreground hover:text-primary flex items-center gap-2">
                  <GraduationCap className="h-4 w-4" />
                  Study Methods
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-muted-foreground hover:text-primary flex items-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  Kanji Dictionary
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-muted-foreground hover:text-primary flex items-center gap-2">
                  <MessengerLogo className="h-4 w-4" />
                  Community Forum
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-muted-foreground hover:text-primary flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Study Groups
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium uppercase tracking-wider">Stay Updated</h3>
            <p className="text-sm text-muted-foreground">
              Subscribe to our newsletter for tips, new kanji lessons, and updates.
            </p>
            <form className="space-y-2">
              <div className="flex">
                <Input type="email" placeholder="Your email address" className="rounded-r-none" />
                <Button type="submit" className="rounded-l-none">
                  Subscribe
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">We respect your privacy. Unsubscribe at any time.</p>
            </form>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Flash Kanji. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link href="#" className="text-xs text-muted-foreground hover:text-primary">
                Privacy Policy
              </Link>
              <Link href="#" className="text-xs text-muted-foreground hover:text-primary">
                Terms of Service
              </Link>
              <Link href="#" className="text-xs text-muted-foreground hover:text-primary">
                Cookie Policy
              </Link>
              <Link href="#" className="text-xs text-muted-foreground hover:text-primary">
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

