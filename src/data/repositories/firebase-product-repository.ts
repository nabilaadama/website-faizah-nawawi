import { Product, ProductVariant, ProductImage } from "@/core/entities/product";
import {
  ProductRepository,
  ProductFilters,
} from "@/core/interfaces/repositories/product-repository";
import { db } from "@/lib/firebase/firebase-config";
import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  DocumentData,
  FirestoreDataConverter,
  QueryDocumentSnapshot,
  SnapshotOptions,
} from "firebase/firestore";

// Firestore converter for Product
const productConverter: FirestoreDataConverter<Product> = {
  toFirestore(product: Product): DocumentData {
    // Convert Date objects to timestamps
    return {
      ...product,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    };
  },
  fromFirestore(
    snapshot: QueryDocumentSnapshot,
    options: SnapshotOptions
  ): Product {
    const data = snapshot.data(options);

    // Convert timestamps back to Date objects
    return {
      ...data,
      id: snapshot.id,
      createdAt: data.createdAt.toDate(),
      updatedAt: data.updatedAt.toDate(),
    } as Product;
  },
};

export class FirebaseProductRepository implements ProductRepository {
  private productsCollection = collection(db, "products").withConverter(
    productConverter
  );
  productConverter: any;

  async getAllProducts(filters?: ProductFilters): Promise<Product[]> {
    let q = query(this.productsCollection, orderBy("createdAt", "desc"));

    // Apply filters if provided
    if (filters) {
      if (filters.category) {
        q = query(q, where("category", "==", filters.category));
      }

      if (filters.featured !== undefined) {
        q = query(q, where("featured", "==", filters.featured));
      }

      // Note: Full-text search may require a separate service like Algolia
      // Basic filtering for searchQuery would happen in memory
    }

    const snapshot = await getDocs(q);
    const products = snapshot.docs.map((doc) => doc.data());

    // If searchQuery is provided, filter in memory
    if (filters?.searchQuery) {
      const searchLower = filters.searchQuery.toLowerCase();
      return products.filter(
        (product) =>
          product.name.toLowerCase().includes(searchLower) ||
          product.description.toLowerCase().includes(searchLower)
      );
    }

    return products;
  }

  async getProductById(id: string): Promise<Product | null> {
    const docRef = doc(db, "products", id).withConverter(productConverter);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      return null;
    }
  }

  async getProductBySlug(slug: string): Promise<Product | null> {
    const q = query(this.productsCollection, where("slug", "==", slug));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      return null;
    }

    return snapshot.docs[0].data();
  }

  async createProduct(product: Omit<Product, "id">): Promise<Product> {
    const docRef = await addDoc(this.productsCollection, product);
    const newProduct = { ...product, id: docRef.id } as Product;

    return newProduct;
  }

  async updateProduct(product: Product): Promise<Product> {
    const docRef = doc(db, "products", product.id).withConverter(
      productConverter
    );
    await updateDoc(docRef, this.productConverter.toFirestore(product));

    return product;
  }

  async deleteProduct(id: string): Promise<void> {
    const docRef = doc(db, "products", id);
    await deleteDoc(docRef);
  }
}
