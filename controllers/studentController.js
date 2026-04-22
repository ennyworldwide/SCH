// controllers/studentController.js
import { StudentModel } from "../models/studentModel.js";
import { ProgrammeModel } from "../models/programmeModel.js";

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
    console.error("Register Error:", error);
    ctx.response.status = 500;
  }
};

// NEW: Export the mailing list as a CSV
export const exportMailingList = async (ctx) => {
  try {
    const interests = await StudentModel.getAllInterests();
    const programmes = await ProgrammeModel.getAll();

    // Create a dictionary to quickly look up programme titles by their ID
    const programmeMap = {};
    programmes.forEach(p => {
        programmeMap[p.id] = p.title;
    });

    // 1. Build the CSV Header row
    let csv = "First Name,Last Name,Email,Programme Title,Registration Date\n";

    // 2. Build the CSV Data rows
    interests.forEach(interest => {
      const progTitle = programmeMap[interest.programmeId] || "Unknown Programme";
      const date = new Date(interest.registeredAt).toLocaleDateString();
      
      // Wrap text in quotes to safely handle any names/titles that contain commas
      csv += `"${interest.firstName}","${interest.lastName}","${interest.email}","${progTitle}","${date}"\n`;
    });

    // 3. Set the headers so the browser triggers a file download
    ctx.response.status = 200;
    ctx.response.headers.set("Content-Type", "text/csv");
    ctx.response.headers.set("Content-Disposition", `attachment; filename="student_mailing_list.csv"`);
    
    // 4. Send the CSV string
    ctx.response.body = csv;
    
  } catch (error) {
    console.error("Export Error:", error);
    ctx.response.status = 500;
    ctx.response.body = { error: "Failed to generate export file" };
  }
};