import { router } from "./trpc";
import { signUp, verifyUser } from "./controllers/auth";

export const appRouter = router({ signUp, verifyUser });

// export type definition of API
export type AppRouter = typeof appRouter;
