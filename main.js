import { Application, send } from "https://deno.land/x/oak/mod.ts";
import router from "./router.js";

const app = new Application();

// 1. Use API routes first
app.use(router.routes());
app.use(router.allowedMethods());

// 2. Serve static files from the "views" folder for everything else
app.use(async (ctx) => {
  await send(ctx, ctx.request.url.pathname, {
    root: `${Deno.cwd()}/views`,
    index: "index.html", // Default to the student homepage
  });
});

const port = 8000;
console.log(`Server is running on http://localhost:${port}`);

await app.listen({ port });