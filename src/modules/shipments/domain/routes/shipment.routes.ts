import { Router } from "express";
import { validateDto } from "@utils/middlewares/validateDto.middleware";
import { ShipmentController } from "../controllers/shipment.controller";
import { ShipmentDto } from "../dtos/shipment.dto";
import { checkRole } from "@utils/middlewares/checkRole.middleware";
import { Role } from "@modules/auth/domain/enums/role.enum";
import { AssignShipmentDto } from "../dtos/assign-shipment.dto";

const router = Router();

router.post("", checkRole([Role.CUSTOMER]), validateDto(ShipmentDto), ShipmentController.createShipment);
router.get("/:trackingCode", checkRole([Role.CUSTOMER, Role.ADMIN, Role.DRIVER]), ShipmentController.getShipment);
router.get("", checkRole([Role.CUSTOMER]), ShipmentController.getShipments);
router.post("/:trackingCode/assign", checkRole([Role.ADMIN]), validateDto(AssignShipmentDto), ShipmentController.assignRoute);
router.put("/:trackingCode/finish", checkRole([Role.DRIVER]), ShipmentController.finishShipment);

export const ShipmentRoutes = router;
