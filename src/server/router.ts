import { router } from "./trpc";
import {
   signUp,
   verifyUser,
   submitForgotPassword,
   verifyChangePass,
} from "./controllers/auth";

export const appRouter = router({
   // auth
   signUp,
   verifyUser,
   submitForgotPassword,
   verifyChangePass,
});

// export type definition of API
export type AppRouter = typeof appRouter;
