import { ChevronDown, FileText, GraduationCap, LayoutDashboard, PenBox, StarsIcon } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { ClerkProvider, SignInButton, SignUpButton, SignedIn, SignedOut, UserButton, } from '@clerk/nextjs'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger, } from "@/components/ui/dropdown-menu"
import { Button } from './ui/button'
import { checkUser } from '@/lib/checkUser'

const Header = async () => {
  // inserts the user into the database if not already present
  await checkUser();
  return (
    <>
      {/* Header component */}
      <header className="fixed top-0 w-full border-b bg-background/80 backdrop-blur-md z-50 supports-[backdrop-filter]:bg-background/60">
        {/* Navigation bar */}
        <nav className="container mx-auto px-4 h-16 flex items-center justify-between">
          {/* Logo*/}
          <Link href="/">
            <Image
              src={"/logo.png"}
              alt="Sensai Logo"
              width={200}
              height={60}
              className="h-12 py-1 w-auto object-contain"
            />
          </Link>

          {/* Navigation links and buttons */}
          <div className='flex items-center space-x-2 md:space-x-4'>
            
            <SignedIn>
              {/* Dashboard button */}
              <Link href={"/dashboard"}>
                <Button>
                  <LayoutDashboard />
                  <span className='hidden md:block'>
                    Industry Insights
                  </span>
                </Button>
              </Link>

              {/* Growth Tools dropdown menu */}
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <Button>
                    <StarsIcon className='h-4 w-4' />
                    <span className='hidden md:block'> Growth Tools </span>
                    <ChevronDown className='h-4 w-4' />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem>
                    <Link href="/resume" className="flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      Build Resume
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link
                      href="/ai-cover-letter"
                      className="flex items-center gap-2"
                    >
                      <PenBox className="h-4 w-4" />
                      Cover Letter
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link
                      href="/interview"
                      className="flex items-center gap-2"
                    >
                      <GraduationCap className="h-4 w-4" />
                      Interview Prep
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SignedIn>

              
            {/* Sign In buttons */}
            <SignedOut>
              <SignInButton>
                <Button variant="outline">
                  Sign In
                </Button>
              </SignInButton>
            </SignedOut>
            <SignedIn>
              <UserButton
                appearance={{
                  elements: {
                    avatarBox: "w-10 h-10",
                    userButtonPopoverCard: "shadow-xl",
                    userPreviewMainIdentifier: "font-semibold",
                  },
                }}
                afterSignOutUrl="/" />
            </SignedIn>
          </div>
        </nav>
        <div>
        </div>
      </header>
    </>
  )
}

export default Header