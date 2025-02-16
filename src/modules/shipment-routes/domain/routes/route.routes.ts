import { Router } from "express";
import { validateDto } from "@utils/middlewares/validateDto.middleware";
import { checkRole } from "@utils/middlewares/checkRole.middleware";
import { Role } from "@modules/auth/domain/enums/role.enum";
import { RouteDto } from "../dtos/route.dto";
import { RouteController } from "../controllers/route.controller";
import { RouteTrackingDto } from "../dtos/route-tracking.dto";

const router = Router();

router.post("", checkRole([Role.ADMIN]), validateDto(RouteDto), RouteController.createRoute);
router.get("/:id", checkRole([Role.ADMIN]), RouteController.getRoute);
router.put("/:id/assign-driver", checkRole([Role.ADMIN]), RouteController.assignDriver);
router.put("/:id/add-tracking", checkRole([Role.DRIVER]), validateDto(RouteTrackingDto), RouteController.addTracking);
router.put("/:id/finish", checkRole([Role.DRIVER]), RouteController.finishRoute);

export const RouteRoutes = router;
