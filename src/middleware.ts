import NextAuth from "next-auth"
import authConfig from "./auth.config"
import { NextResponse } from "next/server"

export const runtime = 'nodejs'

const { auth } = NextAuth(authConfig)

export default auth((req) => {
  const { nextUrl } = req
  const isLoggedIn = !!req.auth
  const userRole = req.auth?.user?.role as string | undefined

  const isAuthPage = nextUrl.pathname.startsWith("/login") || nextUrl.pathname.startsWith("/register")
  const isPublicPage = nextUrl.pathname === "/"

  if (isAuthPage) {
    if (isLoggedIn) {
      return NextResponse.redirect(new URL("/dashboard", nextUrl))
    }
    return NextResponse.next()
  }

  if (!isLoggedIn && !isPublicPage) {
    return NextResponse.redirect(new URL("/login", nextUrl))
  }

  // Protect routes - KETUA can edit all, STAFF can edit transaksi/persembahan
  const ketuaOnlyRoutes = ["/anggaran/tambah", "/anggaran/edit", "/pengguna"]
  const staffEditRoutes = ["/transaksi/tambah", "/transaksi/edit", "/persembahan/tambah", "/persembahan/edit"]
  
  const isKetuaOnlyRoute = ketuaOnlyRoutes.some(route => nextUrl.pathname.startsWith(route))
  const isStaffEditRoute = staffEditRoutes.some(route => nextUrl.pathname.startsWith(route))
  
  if (isKetuaOnlyRoute && userRole !== "KETUA") {
    return NextResponse.redirect(new URL("/dashboard", nextUrl))
  }
  
  if (isStaffEditRoute && userRole !== "KETUA" && userRole !== "STAFF") {
    return NextResponse.redirect(new URL("/dashboard", nextUrl))
  }

  return NextResponse.next()
})

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
