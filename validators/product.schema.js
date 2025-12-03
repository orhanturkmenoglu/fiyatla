import {z} from "zod";

export const productValidationSchema = z.object({
  barcode: z.string().min(8, { message: "Barcode en az 8 karakter olmalı" }),
  name: z.string().min(1, { message: "Ürün adı boş olamaz" }),
  brand: z.string().min(1, { message: "Marka boş olamaz" }),
  imageUrl: z.string().url({ message: "imageUrl geçerli bir URL olmalı" }).optional(),
  description: z.string().max(500, { message: "Açıklama en fazla 500 karakter olabilir" }).optional(),
  prices: z.array(
    z.object({
      market: z.enum(["A101","Migros","Carrefour","Şok","Bim","Metro","Trendyol"]),
      price: z.number({ required_error: "Fiyat zorunludur" }),
      url: z.string().url().optional()
    })
  ).min(1, { message: "En az bir fiyat bilgisi girilmelidir" })
});

export const barcodeValidationSchema = z.object({
  barcode: z.string().min(8, { message: "Barkod en az 8 karakter olmalı" }).optional(),
  name: z.string().min(1, { message: "Ürün adı boş olamaz" }).optional(),
});