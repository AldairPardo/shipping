import { Router } from "express";
import { validateDto } from "@utils/middlewares/validateDto.middleware";
import { ShipmentController } from "../controllers/shipment.controller";
import { CreateShipmentDto } from "../dtos/shipment.dto";
import { checkRole } from "@utils/middlewares/checkRole.middleware";
import { Role } from "@modules/auth/domain/enums/role.enum";

const router = Router();

router.post("", checkRole([Role.CUSTOMER]), validateDto(CreateShipmentDto), ShipmentController.createShipment);
router.get("/:trackingCode", checkRole([Role.CUSTOMER, Role.ADMIN]), ShipmentController.getShipment);

export const ShipmentRoutes = router;
