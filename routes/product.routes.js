import express from "express";
import { barcodeScan, createProduct } from "../controllers/product.controllers.js";
import { validateBarcode, validateProduct } from "../middlewares/validate.product.js";

const router = express.Router();


router.get("/scan",validateBarcode,barcodeScan);
router.post ("/create",validateProduct,createProduct);


export default router ;