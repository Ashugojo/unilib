"use client"

import {adminSideBarLinks} from "@/constants"
import {cn, getInitials} from "@/lib/utils"
import {Avatar, AvatarFallback} from "@radix-ui/react-avatar"
import {Session} from "next-auth"
import Image from "next/image"
import Link from "next/link"
import {usePathname} from "next/navigation"

const Sidebar = ({session}: {session: Session}) => {
  const pathName = usePathname()

  return (
    <div className="admin-sidebar">
      <div>
        <div className="admin-sidebar-logo">
          <Image
            src="/icons/admin/logo.svg"
            alt="logo.svg"
            height={37}
            width={37}
          />

          <h1 className="admin-sidebar-logo-title">BookWise</h1>
        </div>

        <div className="mt-10 flex flex-col gap-5">
          {adminSideBarLinks.map((link) => {
            const isSelected =
              (link.route !== "/admin" &&
                pathName.includes(link.route) &&
                link.route.length > 1) ||
              pathName === link.route

            return (
              <Link href={link.route} key={link.route}>
                <div
                  className={cn(
                    "admin-sidebar-link",
                    isSelected && "bg-blue-900 shadow-sm"
                  )}
                >
                  <div className="relative size-5">
                    <Image
                      src={link.img}
                      alt="icon"
                      fill
                      className={`${
                        isSelected ? "brightness-0 invert" : ""
                      } object-contain`}
                    />
                  </div>

                  <p
                    className={cn(
                      isSelected
                        ? "text-white admin-sidebar-link-label "
                        : "text-dark-100 admin-sidebar-link-label"
                    )}
                  >
                    {link.text}
                  </p>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
      <div className="admin-sidebar-user items-center justify-center">
        <Avatar>
          <AvatarFallback className="bg-amber-100 flex my-3 -mx-0.1 items-center justify-center rounded-full w-10 h-10 text-sm font-medium">
            {getInitials(session?.user?.name || "IN")}
          </AvatarFallback>
        </Avatar>

        <div className="mx-1 my-4 flex flex-col max-md:hidden">
          <p className="font-semibold text-dark-200 text-sm">
            {session?.user?.name}
          </p>
          <p className="text-light-500 text-xs">{session?.user?.email}</p>
        </div>
      </div>
    </div>
  )
}

export default Sidebar
