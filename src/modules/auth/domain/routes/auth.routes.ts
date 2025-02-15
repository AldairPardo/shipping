import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";
import { validateDto } from "@utils/middlewares/validateDto.middleware";
import { CreateUserDto } from "@modules/users/domain/dtos/user.dto";

const router = Router();

router.post("/register", validateDto(CreateUserDto), AuthController.register);
router.post("/login", AuthController.login);

export const AuthRoutes = router;
