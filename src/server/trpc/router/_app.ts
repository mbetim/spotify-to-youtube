import { router } from "../trpc";
import { authRouter } from "./auth";
import { exampleRouter } from "./example";
import { spotifyRouter } from "./spotify";

export const appRouter = router({
  example: exampleRouter,
  auth: authRouter,
  spotify: spotifyRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
