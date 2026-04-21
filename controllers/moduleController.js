import { ModuleModel } from "../models/moduleModel.js";

export const getProgrammeModules = async (ctx) => {
  try {
    
    const programmeId = ctx.params.id; 
    
    if (!programmeId) {
      ctx.response.status = 400;
      ctx.response.body = { error: "Programme ID is required" };
      return;
    }

    const modules = await ModuleModel.getByProgrammeId(programmeId);
    ctx.response.status = 200;
    ctx.response.body = modules;
  } catch (error) {
    ctx.response.status = 500;
    ctx.response.body = { error: "Failed to fetch modules" };
  }
};