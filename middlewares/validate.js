import { ZodError } from "zod";

export const validate = (schema, source = "body") => {
  return (req, res, next) => {
    try {
      console.log(`[Validate] Validating from source: ${source}`);
      console.log("[Validate] Incoming data:", req[source]);

      req.validated = schema.parse(req[source]);
      console.log("[Validate] Validation passed:", req.validated);
      next();
    } catch (err) {
      if (err instanceof ZodError) {
        // flatten() kullanarak hataları al
        const flattened = err.flatten();
        const fieldErrors = flattened.fieldErrors;
        const messages = Object.values(fieldErrors)
          .flat()
          .filter(Boolean);

        console.log("[Validate] ZodError messages:", messages.join(", "));

        return res.status(400).json({
          success: false,
          error: messages.join(", "),
        });
      }

      console.error("[Validate] Unknown error in middleware:", err);
      return res.status(500).json({
        success: false,
        error: "Validation middleware error",
      });
    }
  };
};
