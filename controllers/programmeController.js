import { ProgrammeModel } from "../models/programmeModel.js";

export const getPublishedProgrammes = async (ctx) => {
  try {
    const programmes = await ProgrammeModel.getPublished();
    ctx.response.status = 200;
    ctx.response.body = programmes;
  } catch (error) {
    ctx.response.status = 500;
    ctx.response.body = { error: "Failed to fetch published programmes" };
  }
};

export const getAllProgrammes = async (ctx) => {
  try {
    const programmes = await ProgrammeModel.getAll();
    ctx.response.status = 200;
    ctx.response.body = programmes;
  } catch (error) {
    ctx.response.status = 500;
    ctx.response.body = { error: "Failed to fetch all programmes" };
  }
};