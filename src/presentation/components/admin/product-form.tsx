"use client";

import { useState, useEffect } from 'react';
import { Product, ProductVariant, ProductImage } from '@/core/entities/product';

interface ProductFormProps {
  initialData?: Product;
  onSubmit: (data: any) => void;
  isSubmitting: boolean;
}

export default function ProductForm({ initialData, onSubmit, isSubmitting }: ProductFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    basePrice: 0,
    category: '',
    featured: false,
    images: [{ url: '', alt: '' }],
    variants: [{ size: '', color: '', price: 0, stock: 0 }]
  });

  // Set initial data if provided
  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        description: initialData.description,
        basePrice: initialData.basePrice,
        category: initialData.category,
        featured: initialData.featured,
        // Map images and variants without their IDs for the form
        images: initialData.images.map(img => ({ url: img.url, alt: img.alt })),
        variants: initialData.variants.map(v => ({
          size: v.size,
          color: v.color,
          price: v.price,
          stock: v.stock
        }))
      });
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' 
        ? (e.target as HTMLInputElement).checked
        : name === 'basePrice' 
          ? parseFloat(value) 
          : value
    }));
  };

  const handleImageChange = (index: number, field: string, value: string) => {
    setFormData(prev => {
      const newImages = [...prev.images];
      newImages[index] = { ...newImages[index], [field]: value };
      return { ...prev, images: newImages };
    });
  };

  const addImage = () => {
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, { url: '', alt: '' }]
    }));
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleVariantChange = (index: number, field: string, value: any) => {
    setFormData(prev => {
      const newVariants = [...prev.variants];
      newVariants[index] = { 
        ...newVariants[index], 
        [field]: field === 'price' || field === 'stock' 
          ? parseFloat(value) 
          : value 
      };
      return { ...prev, variants: newVariants };
    });
  };

  const addVariant = () => {
    setFormData(prev => ({
      ...prev,
      variants: [...prev.variants, { size: '', color: '', price: 0, stock: 0 }]
    }));
  };

  const removeVariant = (index: number) => {
    setFormData(prev => ({
      ...prev,
      variants: prev.variants.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Information */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Product Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Category
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            >
              <option value="">Select Category</option>
              <option value="men">Men</option>
              <option value="women">Women</option>
              <option value="accessories">Accessories</option>
            </select>
          </div>
        </div>
        
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            required
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Base Price ($)
            </label>
            <input
              type="number"
              name="basePrice"
              value={formData.basePrice}
              onChange={handleChange}
              min="0"
              step="0.01"
              required
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            />
          </div>
          
          <div className="flex items-center mt-6">
            <input
              type="checkbox"
              name="featured"
              checked={formData.featured}
              onChange={handleChange}
              className="h-4 w-4 text-blue-600 border-gray-300 rounded"
            />
            <label className="ml-2 block text-sm font-medium text-gray-700">
              Featured Product
            </label>
          </div>
        </div>
      </div>
      
      {/* Product Images */}
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Product Images</h2>
          <button
            type="button"
            onClick={addImage}
            className="text-blue-600 hover:text-blue-800"
          >
            + Add Image
          </button>
        </div>
        
        {formData.images.map((image, index) => (
          <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-4 mb-4 border-b">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Image URL
              </label>
              <input
                type="text"
                value={image.url}
                onChange={(e) => handleImageChange(index, 'url', e.target.value)}
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Alt Text
              </label>
              <div className="flex">
                <input
                  type="text"
                  value={image.alt}
                  onChange={(e) => handleImageChange(index, 'alt', e.target.value)}
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                />
                {index > 0 && (
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="ml-2 text-red-600 hover:text-red-800"
                  >
                    Remove
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Product Variants */}
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Product Variants</h2>
          <button
            type="button"
            onClick={addVariant}
            className="text-blue-600 hover:text-blue-800"
          >
            + Add Variant
          </button>
        </div>
        
        {formData.variants.map((variant, index) => (
          <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-4 pb-4 mb-4 border-b">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Size
              </label>
              <input
                type="text"
                value={variant.size}
                onChange={(e) => handleVariantChange(index, 'size', e.target.value)}
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Color
              </label>
              <input
                type="text"
                value={variant.color}
                onChange={(e) => handleVariantChange(index, 'color', e.target.value)}
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Price ($)
              </label>
              <input
                type="number"
                value={variant.price}
                onChange={(e) => handleVariantChange(index, 'price', e.target.value)}
                min="0"
                step="0.01"
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Stock
              </label>
              <div className="flex">
                <input
                  type="number"
                  value={variant.stock}
                  onChange={(e) => handleVariantChange(index, 'stock', e.target.value)}
                  min="0"
                  step="1"
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                />
                {index > 0 && (
                  <button
                    type="button"
                    onClick={() => removeVariant(index)}
                    className="ml-2 text-red-600 hover:text-red-800"
                  >
                    Remove
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Submit Button */}
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting}
          className={`px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 
            ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {isSubmitting 
            ? 'Saving...' 
            : initialData 
              ? 'Update Product' 
              : 'Create Product'
          }
        </button>
      </div>
    </form>
  );
}
