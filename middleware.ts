import { authMiddleware } from "@clerk/nextjs";

/* TODO: Dodać lub usunąć do public routes /api/webhook/clerk */
/* TODO: Dodać lub usunąć do ignored routes /api/webhook/clerk */
/* , "/profile/(.*)" */
export default authMiddleware({
    publicRoutes: ["/", "/api/webhook/clerk", "/api/uploadthing", "/profile/(.*)"],
    ignoredRoutes: ["/api/webhook/clerk"]
});

export const config = {
    matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};