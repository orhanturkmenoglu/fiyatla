import express from "express";
import { barcodeScan, createProduct } from "../controllers/product.controllers.js";
import { validate } from "../middlewares/validate.js";
import { barcodeValidationSchema ,productValidationSchema} from "../validators/product.schema.js";

const router = express.Router();


router.get("/scan",validate(barcodeValidationSchema,"query"),barcodeScan);
router.post ("/create",validate(productValidationSchema,"body"),createProduct);


export default router ;