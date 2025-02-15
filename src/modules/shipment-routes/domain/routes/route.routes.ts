import { Router } from "express";
import { validateDto } from "@utils/middlewares/validateDto.middleware";
import { checkRole } from "@utils/middlewares/checkRole.middleware";
import { Role } from "@modules/auth/domain/enums/role.enum";
import { RouteDto } from "../dtos/route.dto";
import { RouteController } from "../controllers/route.controller";

const router = Router();

router.post("", checkRole([Role.ADMIN]), validateDto(RouteDto), RouteController.createRoute);
router.get("/:id", checkRole([Role.ADMIN]), RouteController.getRoute);
router.put("/:id/assign-driver", checkRole([Role.ADMIN]), RouteController.assignDriver);

export const RouteRoutes = router;
