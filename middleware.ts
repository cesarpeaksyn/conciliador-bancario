import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Rutas públicas que no requieren autenticación
  const publicPaths = ["/login", "/api/auth"];
  const isPublicPath = publicPaths.some(path => pathname.startsWith(path));
  
  // Si es una ruta pública, permitir acceso
  if (isPublicPath) {
    return NextResponse.next();
  }
  
  // Para rutas protegidas, verificar la cookie de sesión
  const token = request.cookies.get("authjs.session-token") || 
                request.cookies.get("__Secure-authjs.session-token");
  
  const isOnDashboard = pathname.startsWith("/dashboard") || 
                        pathname.startsWith("/conciliaciones");
  
  // Si intenta acceder a dashboard sin token, redirigir a login
  if (isOnDashboard && !token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};

