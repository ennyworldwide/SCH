export const requireAdmin = async (ctx, next) => {
  
    // Check if the secure cookie exists
  const isLoggedIn = await ctx.cookies.get("admin_session");
  
  if (isLoggedIn === "true") {
    await next(); // Cookie found! Allow them to proceed to the route.
  } else {
    ctx.response.status = 401;
    ctx.response.body = { error: "Unauthorized access. Please log in." };
  }
};