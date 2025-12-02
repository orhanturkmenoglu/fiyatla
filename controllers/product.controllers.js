import { createProductService, getProductByBarcodeService } from "../services/product.service.js"

export const createProduct = async (req, res) => {
  try {
    console.log(`[Controller] createProduct request body:`, req.body);
    const newProduct = await createProductService(req.body);
    return res.status(201).json({
      success: true,
      message: "Ürün başarıyla oluşturuldu",
      product: newProduct
    });
  } catch (error) {
    console.error(`[Controller] createProduct Error: ${error.message}`);
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const barcodeScan = async (req, res) => {
  try {
    const { barcode } = req.query;
    if (!barcode) {
      return res.status(400).json({ success: false, message: "Barkod alanı zorunludur!" });
    }

    console.log(`[Controller] barcodeScan request: ${barcode}`);
    const result = await getProductByBarcodeService(barcode);

    if (!result) {
      console.warn(`[Controller] Ürün bulunamadı: ${barcode}`);
      return res.status(404).json({ success: false, message: "Ürün bulunamadı!" });
    }

    return res.status(200).json({
      success: true,
      message: `Ürün fiyat bilgisi${result.cached ? " (cache)" : ""} listelendi`,
      product: result.product,
      cached: result.cached
    });
  } catch (error) {
    console.error(`[Controller] barcodeScan Error: ${error.message}`);
    return res.status(500).json({ success: false, message: "Sunucu hatası!", error: error.message });
  }
};
