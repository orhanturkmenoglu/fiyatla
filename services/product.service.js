import Product from "../models/product.model.js";
import redisClient from "../config/redis.client.js";

/**
 * Barkod veya ürün adı ile ürün sorgulama
 * @param {string} barcode
 * @param {string} name
 * @returns {object|null} product + cached flag
 */
export const getProductByBarcodeService = async (barcode, name) => {
  try {
    console.log(`[Service] Ürün araması başlıyor: barcode=${barcode}, name=${name}`);

    // 1️⃣ Cache kontrol
    let cachedProduct = null;
    if (barcode) {
      const cacheData = await redisClient.get(`product:${barcode}`);
      if (cacheData) cachedProduct = JSON.parse(cacheData);
    } else if (name) {
      const cacheData = await redisClient.get(`productName:${name}`);
      if (cacheData) cachedProduct = JSON.parse(cacheData);
    }

    if (cachedProduct) {
      console.log(
        `[Service] Cache bulundu: ${barcode || name} | lowestPrice: ${cachedProduct.lowestPrice} | highestPrice: ${cachedProduct.highestPrice}`
      );
      return { products: cachedProduct, cached: true };
    }

    console.log(`[Service] Cache yok, DB’den çekiliyor: ${barcode || name}`);

    // 2️⃣ DB’den çek
    let query = {};
    if (barcode) query = { barcode };
    else if (name) query = { name: { $regex: name, $options: "i" } };

    const products = await Product.find(query);

    if (!products || products.length === 0) {
      console.warn(`[Service] DB’de ürün bulunamadı: ${barcode || name}`);
      return null;
    }

    // 3️⃣ lowestPrice ve highestPrice hesapla
    const productsWithPrices = products.map((p) => {
      const prices = p.prices || [];
      const lowestPrice = prices.length ? Math.min(...prices.map(pr => pr.price)) : null;
      const highestPrice = prices.length ? Math.max(...prices.map(pr => pr.price)) : null;
      return { ...p.toObject(), lowestPrice, highestPrice };
    });

    // 4️⃣ Redis’e kaydet (TTL 1 saat)
    const cacheKey = barcode ? `product:${barcode}` : `productName:${name}`;
    await redisClient.setEx(cacheKey, 3600, JSON.stringify(productsWithPrices));

    console.log(`[Service] Ürün DB’den çekildi ve cache’e kaydedildi: ${barcode || name}`);

    return { products: productsWithPrices, cached: false };
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
    if (
      !barcode ||
      !name ||
      !prices ||
      !Array.isArray(prices) ||
      prices.length === 0
    ) {
      throw new Error(
        "Zorunlu alanlar (barcode, name, prices) doldurulmalıdır!"
      );
    }

    // 2️⃣ DB’de mevcut mu kontrol
    const existingProduct = await Product.findOne({ barcode });
    if (existingProduct) {
      throw new Error(`Bu barkod zaten mevcut: ${barcode}`);
    }

    // 3️⃣ Ürünü oluştur
    const newProduct = await Product.create({
      barcode,
      name,
      brand,
      imageUrl,
      prices,
    });
    console.log(`[Service] Ürün başarıyla oluşturuldu: ${barcode}`);

    return newProduct;
  } catch (error) {
    console.error(`[Service] createProductService Error: ${error.message}`);
    throw error;
  }
};
