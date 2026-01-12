import { authMiddleware } from "@clerk/nextjs";

export default authMiddleware({
    publicRoutes: ["/", "/api/webhook/clerk", "/api/uploadthing", "/profile/(.*)", "/tags", "/tags/(.*)"],
    ignoredRoutes: ["/api/webhook/clerk"]
});

export const config = {
    matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};