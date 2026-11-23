import { NextResponse, type NextRequest } from "next/server";
import { env } from "./config/env";
import { accountDestination } from "./config/auth-routing";
export async function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const cookie = request.headers.get("cookie") ?? "";
  // Tab contexts travel in API headers, not document navigations. Render only
  // the dashboard shell here; AuthBoundary selects the tab and every data API
  // still authenticates and authorizes its HttpOnly session on the server.
  if (/(?:^|;\s*)(?:__Host-)?carer_session_[a-f0-9]{32}=/.test(cookie)) {
    const response = NextResponse.next();
    response.headers.set('Cache-Control', 'no-store, private');
    return response;
  }
  // Sign-in remains available so an existing tab can sign into another account.
  if (["/signin", "/signup", "/admin/signin"].includes(path)) return NextResponse.next();
  let role: string | undefined;
  let profileComplete = false;
  let accountCategory:string|undefined;
  if (/(?:^|;\s*)(?:__Host-)?carer_session=/.test(cookie)) {
    try {
      const result = await fetch(`${env.BACKEND_URL}/api/v1/auth/me`, {
        headers: { cookie },
        cache: "no-store",
        signal: AbortSignal.timeout(5000),
      });
      if (result.ok) {
        const user = (await result.json()).data.user;
        role = user.role;
        accountCategory=user.accountCategory;
        profileComplete = user.profileComplete === true;
      }
    } catch {
      /* Fail closed. */
    }
  }
  const authPage = ["/signin", "/signup", "/admin/signin"].includes(path);
  const destination = accountDestination({
    role: role ?? "CARE_SEEKER",
    profileComplete,
    accountCategory,
  });
  if (authPage && role)
    return NextResponse.redirect(new URL(destination, request.url));
  if (!authPage) {
    const required = path.startsWith("/admin-dashboard")
      ? "ADMIN"
      : path.startsWith("/caregiver-dashboard")
        ? "CAREGIVER"
        : "CARE_SEEKER";
    if (!role)
      return NextResponse.redirect(
        new URL(
          required === "ADMIN" ? "/admin/signin" : "/signin",
          request.url,
        ),
      );
    if (role !== required)
      return NextResponse.redirect(new URL(destination, request.url));
    if (
      role === "CARE_SEEKER" &&
      !profileComplete &&
      path !== "/care-seeker-dashboard/my-profile"
    )
      return NextResponse.redirect(
        new URL("/care-seeker-dashboard/my-profile", request.url),
      );
  }
  if(path==="/care-seeker-dashboard"&&profileComplete&&["CARE_HOME","CARE_AGENCY"].includes(accountCategory??""))return NextResponse.redirect(new URL("/care-seeker-dashboard/organisation",request.url));
  const response = NextResponse.next();
  response.headers.set("Cache-Control", "no-store, private");
  return response;
}
export const config = {
  matcher: [
    "/signin",
    "/signup",
    "/admin/signin",
    "/care-seeker-dashboard/:path*",
    "/dashboard/:path*",
    "/admin-dashboard/:path*",
    "/caregiver-dashboard/:path*",
  ],
};
