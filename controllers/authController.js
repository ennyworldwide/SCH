export const login = async (ctx) => {
  try {
    const data = await ctx.request.body.json();
    
    // Lecturer Login
    if (data.username === "lecturer" && data.password === "staff123") {
      await ctx.cookies.set("admin_session", "true", { httpOnly: true });
      ctx.response.status = 200;
      ctx.response.body = { message: "Login successful", role: "lecturer" };
    } 
    // Student Login
    else if (data.username === "student" && data.password === "student123") {
      await ctx.cookies.set("student_session", "true", { httpOnly: true });
      ctx.response.status = 200;
      ctx.response.body = { message: "Login successful", role: "student" };
    } 
    // Invalid
    else {
      ctx.response.status = 401;
      ctx.response.body = { error: "Invalid credentials" };
    }
  } catch (error) {
    ctx.response.status = 500;
  }
};

export const logout = async (ctx) => {
  await ctx.cookies.delete("admin_session");
  await ctx.cookies.delete("student_session");
  ctx.response.status = 200;
  ctx.response.body = { message: "Logged out" };
};