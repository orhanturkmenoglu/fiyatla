import { barcodeValidationSchema, productValidationSchema } from "../validation/product.validate.js";

export const validateProduct = (req, res, next) => {
  const { error } = productValidationSchema.validate(req.body, {
    abortEarly: false,
  });

  if (error) {
    const errors = error.details.map((detail) => detail.message);
    return res.status(400).json({
      success: false,
      message: "Validation hatası",
      errors,
    });
  }

  next();
};


export const validateBarcode = (req, res, next) => {
  const { error } = barcodeValidationSchema.validate(req.query);

  if (error) {
    return res.status(400).json({
      success: false,
      message: "Validation hatası",
      errors: error.details.map(d => d.message)
    });
  }

  next();
};
