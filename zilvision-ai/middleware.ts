import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/login",
  },
});

// Chat ("/") stays open to everyone. Only image generation and settings
// require the person to be logged in with Google.
export const config = {
  matcher: ["/image/:path*", "/settings/:path*"],
};
