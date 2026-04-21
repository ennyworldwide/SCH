const kv = await Deno.openKv();

export const ProgrammeModel = {
  async createOrUpdate(programme) {
    const key = ["programmes", programme.id];
    await kv.set(key, programme);
    return programme;
  },

  async getById(id) {
    const result = await kv.get(["programmes", id]);
    return result.value;
  },

  // Fetches all programmes
  async getAll() {
    const programmes = [];
    const entries = kv.list({ prefix: ["programmes"] });
    for await (const entry of entries) {
      programmes.push(entry.value);
    }
    return programmes;
  },

  // Fetches only published programmes
  async getPublished() {
    const allProgrammes = await this.getAll();
    return allProgrammes.filter(p => p.isPublished === true);
  },

  async delete(id) {
    await kv.delete(["programmes", id]);
  }
};