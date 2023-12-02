import { procedure, router } from "./trpc";

export const appRouter = router({
   hello: procedure.query(() => {
      return {
         greeting: `hello bitches`,
      };
   }),
});

// export type definition of API
export type AppRouter = typeof appRouter;
