import Joi from "joi";

export const productValidationSchema = Joi.object({
   barcode: Joi.string().min(8).required().messages({
    "string.base": "Barcode metin olmalı",
    "string.empty": "Barcode boş olamaz",
    "string.min": "Barcode en az 8 karakter olmalı",
    "any.required": "Barcode alanı zorunludur"
  }),
  name: Joi.string().required().messages({
    "string.base": "Ürün adı metin olmalı",
    "string.empty": "Ürün adı boş olamaz",
    "any.required": "Ürün adı alanı zorunludur"
  }),
  brand: Joi.string().required().messages({
    "string.base": "Marka metin olmalı",
    "string.empty": "Marka boş olamaz",
    "any.required": "Marka alanı zorunludur"
  }),
  imageUrl: Joi.string().uri().optional().messages({
    "string.uri": "imageUrl geçerli bir URL olmalı"
  }),
  description: Joi.string().max(500).optional().messages({
    "string.max": "Açıklama en fazla 500 karakter olabilir"
  }),
  prices: Joi.array().items(
    Joi.object({
      market: Joi.string().valid("A101", "Migros", "Carrefour", "Şok", "Bim", "Metro", "Trendyol").required(),
      price: Joi.number().required(),
      url: Joi.string().uri().optional()
    })
  ).min(1).required().messages({
    "array.min": "En az bir fiyat bilgisi girilmelidir",
    "any.required": "Prices alanı zorunludur"
  })
})


export const barcodeValidationSchema = Joi.object({
  barcode: Joi.string().min(8).required().messages({
    "string.base": "Barkod metin olmalı",
    "string.empty": "Barkod boş olamaz",
    "string.min": "Barkod en az 8 karakter olmalı",
    "any.required": "Barkod alanı zorunludur"
  })
});