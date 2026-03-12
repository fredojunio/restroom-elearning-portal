export { default } from "next-auth/middleware";

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/modules/:path*",
    "/quizzes/:path*",
    "/analytics/:path*",
  ],
};
