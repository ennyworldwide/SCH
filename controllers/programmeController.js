// controllers/programmeController.js
import { ProgrammeModel } from "../models/programmeModel.js";

export const getPublishedProgrammes = async (ctx) => {
  try {
    const programmes = await ProgrammeModel.getPublished();
    ctx.response.status = 200;
    ctx.response.body = programmes;
  } catch (error) {
    console.error("GET Published Error:", error);
    ctx.response.status = 500;
  }
};

export const getAllProgrammes = async (ctx) => {
  try {
    const programmes = await ProgrammeModel.getAll();
    ctx.response.status = 200;
    ctx.response.body = programmes;
  } catch (error) {
    console.error("GET All Error:", error);
    ctx.response.status = 500;
  }
};

export const createProgramme = async (ctx) => {
  try {
    const data = await ctx.request.body.json();
    
    const newProgramme = {
      id: crypto.randomUUID(),
      title: data.title,
      description: data.description,
      level: data.level,
      isPublished: false
    };

    const result = await ProgrammeModel.createOrUpdate(newProgramme);
    ctx.response.status = 201;
    ctx.response.body = result;
  } catch (error) {
    console.error("POST Create Error:", error);
    ctx.response.status = 500;
  }
};

export const togglePublish = async (ctx) => {
  try {
    const id = ctx.params.id;
    const programme = await ProgrammeModel.getById(id);
    if (!programme) {
      ctx.response.status = 404;
      return;
    }
    
    programme.isPublished = !programme.isPublished;
    await ProgrammeModel.createOrUpdate(programme);
    
    ctx.response.status = 200;
    ctx.response.body = programme;
  } catch (error) {
    console.error("PUT Publish Error:", error);
    ctx.response.status = 500;
  }
};

export const deleteProgramme = async (ctx) => {
  try {
    await ProgrammeModel.delete(ctx.params.id);
    ctx.response.status = 204;
  } catch (error) {
    console.error("DELETE Error:", error);
    ctx.response.status = 500;
  }
};