import asyncHandler from "../middlewares/asyncHandler.js";
import * as userService from "../services/userService.js";

export const getUserById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const user = await userService.getUserById(id);
  res.status(200).json({ user });
});
