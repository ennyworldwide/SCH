const kv = await Deno.openKv();

export const ModuleModel = {
  async createOrUpdate(moduleData) {
    const key = ["modules", moduleData.id];
    await kv.set(key, moduleData);
    return moduleData;
  },

  async getByProgrammeId(programmeId) {
    const modules = [];
    const entries = kv.list({ prefix: ["modules"] });
    for await (const entry of entries) {
      
        // Check if this module belongs to the requested programme
      if (entry.value.programmeIds && entry.value.programmeIds.includes(programmeId)) {
        modules.push(entry.value);
      }
    }
    return modules;
  }
};