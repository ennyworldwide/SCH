 export const login = async (ctx) => {
  try {
    const data = await ctx.request.body.json();
    
    // Hardcoded credentials for demonstration (admin / secure123)
    if (data.username === "admin" && data.password === "secure123") {
     
        // Set an HTTP-only cookie to track the session securely
      await ctx.cookies.set("admin_session", "true", { httpOnly: true });
      ctx.response.status = 200;
      ctx.response.body = { message: "Login successful" };
    } else {
      ctx.response.status = 401;
      ctx.response.body = { error: "Invalid credentials" };
    }
  } catch (error) {
    ctx.response.status = 500;
  }
};

export const logout = async (ctx) => {
  await ctx.cookies.delete("admin_session");
  ctx.response.status = 200;
  ctx.response.body = { message: "Logged out" };
};