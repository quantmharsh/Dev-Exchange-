import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getOrCreateDB } from './models/server/dbSetup'
import getOrCreateStorage from './models/server/storageSetup'

 
// This function can be marked `async` if using `await` inside
// Herre we are calling our functions to create db and  create storage
// This middleware runs when we go to any page . except the ones which are mentioned below (matcher)
export async function middleware(request: NextRequest) {
  await Promise.all([
    getOrCreateDB() ,
    getOrCreateStorage()
  ])
  return NextResponse.next()
}
 
// See "Matching Paths" below to learn more
export const config = {
    // Match all  the request paths eccept the  paths that are mentioned here
    matcher: [
        "/((?!api|_next/static|_next/image|favicon.ico).*)",
      ],
}