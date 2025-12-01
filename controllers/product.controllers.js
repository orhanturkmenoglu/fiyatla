import Product from "../models/product.model.js";

export const createProduct = async (req, res) => {
  const { barcode, name, brand, imageUrl, comparison } = req.body;

  try {
    if (!barcode || !name || !comparison) {
      return res
        .status(400)
        .json({ error: "Barcode, name ve comparison alanları zorunlu!" });
    }

    // Eğer aynı barkod varsa hata döner
    const existingProduct = await Product.findOne({ barcode });
    if (existingProduct) {
      return res
        .status(400)
        .json({ success: false, message: "Bu barkod zaten mevcut!" });
    }

    // Ürünü oluştur
    const newProduct = await Product.create({
      barcode,
      name,
      brand,
      imageUrl,
      comparison, // doğru alan
    });

    return res.status(201).json({ message: "Ürün oluşturuldu", product: newProduct });
  } catch (error) {
    console.error("Product Controller Error:", error);
    return res.status(500).json({ error: error.message });
  }
};
