import { StudentModel } from "../models/studentModel.js";

export const registerInterest = async (ctx) => {
  try {
    const data = await ctx.request.body.json();

    const newInterest = {
      id: crypto.randomUUID(),
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      programmeId: data.programmeId,
      registeredAt: new Date(),
    };

    const result = await StudentModel.registerInterest(newInterest);
    ctx.response.status = 201;
    ctx.response.body = { message: "Interest registered successfully", data: result };
  } catch (error) {
    ctx.response.status = 500;
    ctx.response.body = { error: "Failed to register interest" };
  }
};