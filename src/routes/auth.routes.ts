import { Router } from "express";
import {
  adminLogin,
  adminRefreshToken,
  adminLogout,
  getAdminMe,
  updateAdminMe,
  changeAdminPassword,
  createAdminUser,
  listAdminUsers,
  deactivateAdminUser,
} from "../controllers/auth.controller";
import { protectAdmin } from "../middlewares/auth.middleware";
import {
  adminLoginSchema,
  changePasswordSchema,
  createAdminSchema,
} from "../schemas/auth.schema";
import { validate } from "../middlewares/validate.middleware";
import { restrictTo } from "../middlewares/role.middleware";

const router = Router();

// Public
router.post("/login", validate(adminLoginSchema), adminLogin);
router.post("/refresh", adminRefreshToken);
router.post("/logout", adminLogout);

// Protected
router.use(protectAdmin);

router.get("/me", getAdminMe);
router.patch("/me", updateAdminMe);
router.patch(
  "/me/password",
  validate(changePasswordSchema),
  changeAdminPassword,
);

// Super admin only
router.use(restrictTo("super_admin"));
router.get("/users", listAdminUsers);
router.post("/users", validate(createAdminSchema), createAdminUser);
router.delete("/users/:id", deactivateAdminUser);

export default router;
