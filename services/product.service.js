import Product from "../models/product.model.js";
import redisClient from "../config/redis.client.js";

/**
 * Barkod ile ürün sorgulama
 * @param {string} barcode 
 * @returns {object|null} product + cached flag
 */
export const getProductByBarcodeService = async (barcode) => {
  try {
    console.log(`[Service] Barkod araması başlıyor: ${barcode}`);

    // 1️⃣ Cache kontrol
    const cached = await redisClient.get(`product:${barcode}`);
    if (cached) {
      const cachedProduct = JSON.parse(cached);
      console.log(`[Service] Cache bulundu: ${barcode} | lowestPrice: ${cachedProduct.lowestPrice}`);
      return { product: cachedProduct, cached: true };
    }

    console.log(`[Service] Cache yok, DB’den çekiliyor: ${barcode}`);

    // 2️⃣ DB’den çek
    const product = await Product.findOne({ barcode });
    if (!product) {
      console.warn(`[Service] DB’de ürün bulunamadı: ${barcode}`);
      return null;
    }

    // 4️⃣ Redis’e kaydet (TTL 1 saat)
    await redisClient.setEx(`product:${barcode}`, 3600, JSON.stringify(product));
    console.log(`[Service] Cache’e kaydedildi: ${barcode}`);

    return { product,cached: false };
  } catch (error) {
    console.error(`[Service] getProductByBarcodeService Error: ${error.message}`);
    throw error;
  }
};

/**
 * Yeni ürün oluşturma
 * @param {object} productData
 * @returns {object} created product
 */
export const createProductService = async (productData) => {
  try {
    const { barcode, name, brand, imageUrl, prices } = productData;
    console.log(`[Service] Yeni ürün oluşturuluyor: ${barcode}`);

    // 1️⃣ Zorunlu alan kontrolü
    if (!barcode || !name || !prices || !Array.isArray(prices) || prices.length === 0) {
      throw new Error("Zorunlu alanlar (barcode, name, prices) doldurulmalıdır!");
    }

    // 2️⃣ DB’de mevcut mu kontrol
    const existingProduct = await Product.findOne({ barcode });
    if (existingProduct) {
      throw new Error(`Bu barkod zaten mevcut: ${barcode}`);
    }

    // 3️⃣ Ürünü oluştur
    const newProduct = await Product.create({ barcode, name, brand, imageUrl, prices });
    console.log(`[Service] Ürün başarıyla oluşturuldu: ${barcode}`);

    return newProduct;
  } catch (error) {
    console.error(`[Service] createProductService Error: ${error.message}`);
    throw error;
  }
};
