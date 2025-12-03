import {
  createProductService,
  getProductByBarcodeService,
} from "../services/product.service.js";

export const createProduct = async (req, res) => {
  try {
    console.log(`[Controller] createProduct request body:`, req.body);

    const validatedData = req.validated;
    console.log("[Controller] createProduct validated data:", validatedData);
    
    const newProduct = await createProductService(validatedData);
    return res.status(201).json({
      success: true,
      message: "Ürün başarıyla oluşturuldu",
      product: newProduct,
    });
  } catch (error) {
    console.error(`[Controller] createProduct Error: ${error.message}`);
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const barcodeScan = async (req, res) => {
  try {
    const { barcode, name } = req.validated;
    if (!barcode && !name) {
      return res.status(400).json({
        success: false,
        message: "Barkod veya ürün adı alanı zorunludur!",
      });
    }

    console.log(
      `[Controller] barcodeScan request: barcode=${barcode}, productName=${name}`
    );
    const result = await getProductByBarcodeService(barcode, name);

    if (!result) {
      console.warn(`[Controller] Ürün bulunamadı: ${barcode || name}`);
      return res
        .status(404)
        .json({ success: false, message: "Ürün bulunamadı!" });
    }

    return res.status(200).json({
      success: true,
      message: `Ürün fiyat bilgisi${
        result.cached ? " (cache)" : ""
      } listelendi`,
      product: result.products,
      cached: result.cached,
    });
  } catch (error) {
    console.error(`[Controller] barcodeScan Error: ${error.message}`);
    return res.status(500).json({
      success: false,
      message: "Sunucu hatası!",
      error: error.message,
    });
  }
};
