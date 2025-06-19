"use client";

import { useState, useEffect, FormEvent, ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import { addDoc, collection, getDocs, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/firebase-config";
import slugify from "@/lib/utils/slugify";
import { ProductImage } from "@/core/entities/product";

// Type untuk form input
interface FormData {
  name: string;
  description: string;
  basePrice: number;
  stock: number;
  categoryId: string;
  featured: boolean;
  available: boolean;
}

interface ImageData {
  url: string;
  isPrimary: boolean;
  alt: string;
}

interface ProductVariantForm {
  size: string;
  color: string;
  price: number;
  stock: number;
}

const AVAILABLE_IMAGES = [
  "/images/gamis-pernikahan.jpg",
  "/images/laut-kaftan.jpg",
  "/images/ombak-tunic.jpg",
  "/images/pelaut-blouse.jpg",
  "/images/phinisi-gown.jpg",
  "/images/sailor-dress.jpg",
];

export default function AddProductPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    name: "",
    description: "",
    basePrice: 0,
    stock: 0,
    categoryId: "",
    featured: false,
    available: true,
  });

  const [selectedImages, setSelectedImages] = useState<ImageData[]>([]);
  const [customImageUrl, setCustomImageUrl] = useState<string>("");
  const [variants, setVariants] = useState<ProductVariantForm[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categories, setCategories] = useState<{ id: string; name: string }[]>(
    []
  );
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Fetch categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "categories"));
        const categoriesData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          name: doc.data().name,
        }));
        setCategories(categoriesData);

        // Set default category if available
        if (categoriesData.length > 0) {
          setFormData((prev) => ({
            ...prev,
            categoryId: categoriesData[0].id,
          }));
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
        setError("Gagal mengambil data kategori");
      }
    };

    fetchCategories();
  }, []);

  // Handle form input changes
  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target as HTMLInputElement;

    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? (e.target as HTMLInputElement).checked
          : type === "number"
          ? parseFloat(value) || 0
          : value,
    }));
  };

  // Handle image selection from available options
  const handleImageSelect = (imageUrl: string) => {
    const isAlreadySelected = selectedImages.some(
      (img) => img.url === imageUrl
    );

    if (isAlreadySelected) {
      // Remove the image if already selected
      setSelectedImages((prev) => prev.filter((img) => img.url !== imageUrl));
    } else {
      // Add the image
      const newImage: ImageData = {
        url: imageUrl,
        isPrimary: selectedImages.length === 0, // First image is primary by default
        alt: imageUrl.split("/").pop()?.split(".")[0] || "product image", // Use filename as alt
      };

      setSelectedImages((prev) => [...prev, newImage]);
    }
  };

  // Add custom image URL
  const addCustomImage = () => {
    if (!customImageUrl) return;

    const isAlreadySelected = selectedImages.some(
      (img) => img.url === customImageUrl
    );

    if (!isAlreadySelected) {
      const newImage: ImageData = {
        url: customImageUrl,
        isPrimary: selectedImages.length === 0,
        alt: customImageUrl.split("/").pop()?.split(".")[0] || "product image",
      };

      setSelectedImages((prev) => [...prev, newImage]);
      setCustomImageUrl(""); // Reset input
    } else {
      setError("Gambar ini sudah dipilih");
      setTimeout(() => setError(null), 3000);
    }
  };

  // Set image as primary
  const setImageAsPrimary = (index: number) => {
    setSelectedImages((prev) =>
      prev.map((img, i) => ({
        ...img,
        isPrimary: i === index,
      }))
    );
  };

  // Remove image
  const removeImage = (index: number) => {
    setSelectedImages((prev) => {
      const newImages = [...prev];

      // If removing the primary image, set a new primary if possible
      if (newImages[index].isPrimary && newImages.length > 1) {
        const newPrimaryIndex = index === 0 ? 1 : 0;
        newImages[newPrimaryIndex].isPrimary = true;
      }

      // Remove the image
      newImages.splice(index, 1);
      return newImages;
    });
  };

  // Handle alt text change
  const handleAltChange = (index: number, value: string) => {
    setSelectedImages((prev) =>
      prev.map((img, i) => (i === index ? { ...img, alt: value } : img))
    );
  };

  // Add variant
  const addVariant = () => {
    setVariants((prev) => [
      ...prev,
      { size: "", color: "", price: formData.basePrice, stock: formData.stock },
    ]);
  };

  // Update variant
  const updateVariant = (
    index: number,
    field: keyof ProductVariantForm,
    value: string | number
  ) => {
    setVariants((prev) =>
      prev.map((variant, i) =>
        i === index ? { ...variant, [field]: value } : variant
      )
    );
  };

  // Remove variant
  const removeVariant = (index: number) => {
    setVariants((prev) => prev.filter((_, i) => i !== index));
  };

  // Save product variants
  const saveVariants = async (productId: string) => {
    const variantPromises = variants.map(async (variant) => {
      const variantData = {
        productId,
        size: variant.size,
        color: variant.color,
        price: variant.price,
        stock: variant.stock,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      await addDoc(collection(db, "productVariants"), variantData);
    });

    return Promise.all(variantPromises);
  };

  // Handle form submission
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      // Validation
      if (!formData.name || !formData.description || formData.basePrice <= 0) {
        throw new Error("Nama, deskripsi dan harga dasar wajib diisi");
      }

      if (selectedImages.length === 0) {
        throw new Error("Silakan pilih minimal satu gambar produk");
      }

      // Create slug from name
      const slug = slugify(formData.name);

      // Find category name if categoryId exists
      const selectedCategory = categories.find(
        (c) => c.id === formData.categoryId
      );
      const categoryName = selectedCategory?.name || "";

      // Prepare image data for Firestore
      const images: ProductImage[] = selectedImages.map((img) => ({
        url: img.url,
        alt: img.alt,
        isPrimary: img.isPrimary,
        createdAt: new Date(),
      }));

      // Create product document
      const productData = {
        name: formData.name,
        slug,
        description: formData.description,
        basePrice: formData.basePrice,
        stock: formData.stock,
        categoryId: formData.categoryId,
        categoryName,
        featured: formData.featured,
        available: formData.available,
        images: images,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // Add to Firestore
      const docRef = await addDoc(collection(db, "products"), productData);
      const productId = docRef.id;

      // Save variants if any
      if (variants.length > 0) {
        await saveVariants(productId);
      }

      setSuccess("Produk berhasil ditambahkan!");

      // Reset form after success
      setFormData({
        name: "",
        description: "",
        basePrice: 0,
        stock: 0,
        categoryId: categories[0]?.id || "",
        featured: false,
        available: true,
      });

      setSelectedImages([]);
      setVariants([]);

      // Redirect to product list after short delay
      setTimeout(() => {
        router.push("/admin/products");
      }, 2000);
    } catch (error: any) {
      console.error("Error adding product:", error);
      setError(error.message || "Gagal menambahkan produk");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white shadow-md rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-6">Tambah Produk Baru</h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Basic Info */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nama Produk*
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Kategori*
                </label>
                <select
                  name="categoryId"
                  value={formData.categoryId}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  required
                >
                  {categories.length === 0 ? (
                    <option value="">Tidak ada kategori</option>
                  ) : (
                    categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))
                  )}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Harga Dasar (Rp)*
                </label>
                <input
                  type="number"
                  name="basePrice"
                  value={formData.basePrice}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  min="0"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Stok*
                </label>
                <input
                  type="number"
                  name="stock"
                  value={formData.stock}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  min="0"
                  required
                />
              </div>

              <div className="flex space-x-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="featured"
                    name="featured"
                    checked={formData.featured}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-indigo-600 border-gray-300 rounded"
                  />
                  <label
                    htmlFor="featured"
                    className="ml-2 text-sm text-gray-700"
                  >
                    Produk Unggulan
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="available"
                    name="available"
                    checked={formData.available}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-indigo-600 border-gray-300 rounded"
                  />
                  <label
                    htmlFor="available"
                    className="ml-2 text-sm text-gray-700"
                  >
                    Tersedia
                  </label>
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Deskripsi Produk*
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={9}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                required
              />
            </div>
          </div>

          {/* Image Selection */}
          <div className="mt-8">
            <h2 className="text-lg font-semibold mb-4">Gambar Produk*</h2>

            {/* Available Images */}
            <div className="mb-6">
              <h3 className="text-md font-medium mb-2">
                Pilih dari gambar tersedia:
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {AVAILABLE_IMAGES.map((imageUrl, index) => {
                  const isSelected = selectedImages.some(
                    (img) => img.url === imageUrl
                  );
                  return (
                    <div
                      key={index}
                      onClick={() => handleImageSelect(imageUrl)}
                      className={`relative cursor-pointer border rounded-lg overflow-hidden ${
                        isSelected ? "ring-2 ring-indigo-500" : ""
                      }`}
                    >
                      <img
                        src={imageUrl}
                        alt={`Product ${index + 1}`}
                        className="w-full h-24 object-cover"
                      />
                      {isSelected && (
                        <div className="absolute top-1 right-1 bg-indigo-500 rounded-full p-1">
                          <svg
                            className="w-4 h-4 text-white"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            ></path>
                          </svg>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Custom Image URL */}
            <div className="mb-6">
              <h3 className="text-md font-medium mb-2">
                Atau tambahkan URL gambar kustom:
              </h3>
              <div className="flex">
                <input
                  type="text"
                  value={customImageUrl}
                  onChange={(e) => setCustomImageUrl(e.target.value)}
                  placeholder="https://example.com/image.jpg"
                  className="flex-grow border border-gray-300 rounded-l-md px-3 py-2"
                />
                <button
                  type="button"
                  onClick={addCustomImage}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-r-md"
                >
                  Tambah
                </button>
              </div>
            </div>

            {/* Selected Images */}
            {selectedImages.length > 0 && (
              <div>
                <h3 className="text-md font-medium mb-2">
                  Gambar yang dipilih:
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {selectedImages.map((img, index) => (
                    <div
                      key={index}
                      className={`relative border rounded-lg overflow-hidden p-2 ${
                        img.isPrimary ? "ring-2 ring-indigo-500" : ""
                      }`}
                    >
                      <img
                        src={img.url}
                        alt="Preview"
                        className="w-full h-40 object-cover rounded"
                      />

                      <div className="mt-2">
                        <input
                          type="text"
                          placeholder="Alt text"
                          value={img.alt}
                          onChange={(e) =>
                            handleAltChange(index, e.target.value)
                          }
                          className="w-full text-sm border border-gray-300 rounded px-2 py-1"
                        />
                      </div>

                      <div className="flex justify-between mt-2">
                        <button
                          type="button"
                          onClick={() => setImageAsPrimary(index)}
                          disabled={img.isPrimary}
                          className={`text-xs px-2 py-1 rounded ${
                            img.isPrimary
                              ? "bg-indigo-100 text-indigo-700"
                              : "bg-gray-200 hover:bg-indigo-100"
                          }`}
                        >
                          {img.isPrimary ? "Utama" : "Set Utama"}
                        </button>

                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="text-xs bg-red-100 text-red-700 hover:bg-red-200 px-2 py-1 rounded"
                        >
                          Hapus
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Variants */}
          <div className="mt-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">
                Varian Produk (Opsional)
              </h2>
              <button
                type="button"
                onClick={addVariant}
                className="bg-indigo-100 text-indigo-700 hover:bg-indigo-200 px-3 py-1 rounded-md text-sm"
              >
                + Tambah Varian
              </button>
            </div>

            {variants.length > 0 && (
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                        Ukuran
                      </th>
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                        Warna
                      </th>
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                        Harga (Rp)
                      </th>
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                        Stok
                      </th>
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                        Aksi
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {variants.map((variant, index) => (
                      <tr key={index} className="border-t">
                        <td className="px-4 py-2">
                          <input
                            type="text"
                            value={variant.size}
                            onChange={(e) =>
                              updateVariant(index, "size", e.target.value)
                            }
                            className="w-full border border-gray-300 rounded-md px-2 py-1"
                            placeholder="S / M / L"
                          />
                        </td>
                        <td className="px-4 py-2">
                          <input
                            type="text"
                            value={variant.color}
                            onChange={(e) =>
                              updateVariant(index, "color", e.target.value)
                            }
                            className="w-full border border-gray-300 rounded-md px-2 py-1"
                            placeholder="Merah / Hijau"
                          />
                        </td>
                        <td className="px-4 py-2">
                          <input
                            type="number"
                            value={variant.price}
                            onChange={(e) =>
                              updateVariant(
                                index,
                                "price",
                                parseFloat(e.target.value) || 0
                              )
                            }
                            className="w-full border border-gray-300 rounded-md px-2 py-1"
                            min="0"
                          />
                        </td>
                        <td className="px-4 py-2">
                          <input
                            type="number"
                            value={variant.stock}
                            onChange={(e) =>
                              updateVariant(
                                index,
                                "stock",
                                parseInt(e.target.value) || 0
                              )
                            }
                            className="w-full border border-gray-300 rounded-md px-2 py-1"
                            min="0"
                          />
                        </td>
                        <td className="px-4 py-2">
                          <button
                            type="button"
                            onClick={() => removeVariant(index)}
                            className="text-xs bg-red-100 text-red-700 hover:bg-red-200 px-2 py-1 rounded"
                          >
                            Hapus
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Submit Buttons */}
          <div className="mt-8 flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => router.back()}
              className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-md"
              disabled={isSubmitting}
            >
              Batal
            </button>
            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Menyimpan..." : "Simpan Produk"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
