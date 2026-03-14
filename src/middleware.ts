import { withAuth } from "next-auth/middleware";

export default withAuth;

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/modules/:path*",
    "/quizzes/:path*",
    "/analytics/:path*",
  ],
};
