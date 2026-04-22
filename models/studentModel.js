// models/studentModel.js
const kv = await Deno.openKv();

export const StudentModel = {
  async registerInterest(interest) {
    const key = ["interests", interest.programmeId, interest.email];
    await kv.set(key, interest);
    return interest;
  },

  async getInterestsByProgramme(programmeId) {
    const interests = [];
    const entries = kv.list({ prefix: ["interests", programmeId] });
    for await (const entry of entries) {
      interests.push(entry.value);
    }
    return interests;
  },

  //Fetch all students across all programmes
  async getAllInterests() {
    const interests = [];
    const entries = kv.list({ prefix: ["interests"] });
    for await (const entry of entries) {
      interests.push(entry.value);
    }
    return interests;
  },

  async removeInterest(programmeId, email) {
    await kv.delete(["interests", programmeId, email]);
  }
};