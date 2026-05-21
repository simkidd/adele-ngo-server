"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeProgramFromCenter = exports.assignProgramToCenter = exports.toggleProgramActive = exports.updateProgram = exports.getProgram = exports.listPrograms = exports.createProgram = void 0;
const apiResponse_1 = require("../utils/apiResponse");
const helpers_1 = require("../utils/helpers");
const program_model_1 = require("../models/program.model");
const apiError_1 = require("../utils/apiError");
const center_model_1 = require("../models/center.model");
const createProgram = async (req, res) => {
    const { title } = req.body;
    const slug = (0, helpers_1.slugify)(title);
    const program = await program_model_1.Program.create({
        ...req.body,
        slug,
        createdBy: req.user._id,
    });
    (0, apiResponse_1.sendSuccess)(res, program, "Program created", 201);
};
exports.createProgram = createProgram;
const listPrograms = async (req, res) => {
    const { category, active } = req.query;
    const filter = {};
    if (category)
        filter.category = category;
    if (active !== undefined)
        filter.isActive = active === "true";
    const programs = await program_model_1.Program.find(filter)
        .populate("createdBy", "fullName")
        .sort("category title");
    (0, apiResponse_1.sendSuccess)(res, programs);
};
exports.listPrograms = listPrograms;
const getProgram = async (req, res) => {
    const { id, slug } = req.params;
    const conditions = [{ _id: id }, { slug }];
    const program = await program_model_1.Program.findOne({
        $or: conditions,
    });
    if (!program)
        throw new apiError_1.ApiError("Program not found.", 404);
    (0, apiResponse_1.sendSuccess)(res, program);
};
exports.getProgram = getProgram;
const updateProgram = async (req, res) => {
    const program = await program_model_1.Program.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    });
    if (!program)
        throw new apiError_1.ApiError("Program not found.", 404);
    (0, apiResponse_1.sendSuccess)(res, program, "Program updated");
};
exports.updateProgram = updateProgram;
const toggleProgramActive = async (req, res) => {
    const program = await program_model_1.Program.findById(req.params.id);
    if (!program)
        throw new apiError_1.ApiError("Program not found.", 404);
    program.isActive = !program.isActive;
    await program.save();
    (0, apiResponse_1.sendSuccess)(res, program, `Program ${program.isActive ? "activated" : "deactivated"}`);
};
exports.toggleProgramActive = toggleProgramActive;
// Assign program to center
const assignProgramToCenter = async (req, res) => {
    const { centerId } = req.body;
    const center = await center_model_1.Center.findById(centerId);
    if (!center)
        throw new apiError_1.ApiError("Center not found.", 404);
    const program = await program_model_1.Program.findById(req.params.id);
    if (!program)
        throw new apiError_1.ApiError("Program not found.", 404);
    if (!center.programs.includes(program._id)) {
        center.programs.push(program._id);
        await center.save();
    }
    (0, apiResponse_1.sendSuccess)(res, null, `Program assigned to ${center.name}`);
};
exports.assignProgramToCenter = assignProgramToCenter;
// Remove program from center
const removeProgramFromCenter = async (req, res) => {
    const { centerId } = req.body;
    const center = await center_model_1.Center.findById(centerId);
    if (!center)
        throw new apiError_1.ApiError("Center not found.", 404);
    center.programs = center.programs.filter((p) => p.toString() !== req.params.id);
    await center.save();
    (0, apiResponse_1.sendSuccess)(res, null, "Program removed from center");
};
exports.removeProgramFromCenter = removeProgramFromCenter;
//# sourceMappingURL=program.controller.js.map