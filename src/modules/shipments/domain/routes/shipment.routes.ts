import { Router } from "express";
import { validateDto } from "@utils/middlewares/validateDto.middleware";
import { ShipmentController } from "../controllers/shipment.controller";
import { ShipmentDto } from "../dtos/shipment.dto";
import { checkRole } from "@utils/middlewares/checkRole.middleware";
import { Role } from "@modules/auth/domain/enums/role.enum";

const router = Router();

router.post("", checkRole([Role.CUSTOMER]), validateDto(ShipmentDto), ShipmentController.createShipment);
router.get("/:trackingCode", checkRole([Role.CUSTOMER, Role.ADMIN]), ShipmentController.getShipment);
router.get("", checkRole([Role.CUSTOMER]), ShipmentController.getShipments);

export const ShipmentRoutes = router;
