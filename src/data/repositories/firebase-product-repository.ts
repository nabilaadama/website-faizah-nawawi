// // import { Product, ProductVariant, ProductImage } from "@/core/entities/product";
// // import {
// //   ProductRepository,
// //   ProductFilters,
// // } from "@/core/interfaces/repositories/product-repository";
// // import { db } from "@/lib/firebase/firebase-config";
// // import {
// //   collection,
// //   doc,
// //   getDocs,
// //   getDoc,
// //   addDoc,
// //   updateDoc,
// //   deleteDoc,
// //   query,
// //   where,
// //   orderBy,
// //   DocumentData,
// //   FirestoreDataConverter,
// //   QueryDocumentSnapshot,
// //   SnapshotOptions,
// // } from "firebase/firestore";

// // // Firestore converter for Product
// // const productConverter: FirestoreDataConverter<Product> = {
// //   toFirestore(product: Product): DocumentData {
// //     // Convert Date objects to timestamps
// //     return {
// //       ...product,
// //       createdAt: product.createdAt,
// //       updatedAt: product.updatedAt,
// //     };
// //   },
// //   fromFirestore(
// //     snapshot: QueryDocumentSnapshot,
// //     options: SnapshotOptions
// //   ): Product {
// //     const data = snapshot.data(options);

// //     // Convert timestamps back to Date objects
// //     return {
// //       ...data,
// //       id: snapshot.id,
// //       createdAt: data.createdAt.toDate(),
// //       updatedAt: data.updatedAt.toDate(),
// //     } as Product;
// //   },
// // };

// // export class FirebaseProductRepository implements ProductRepository {
// //   private productsCollection = collection(db, "products").withConverter(
// //     productConverter
// //   );
// //   productConverter: any;

// //   async getAllProducts(filters?: ProductFilters): Promise<Product[]> {
// //     let q = query(this.productsCollection, orderBy("createdAt", "desc"));

// //     // Apply filters if provided
// //     if (filters) {
// //       if (filters.category) {
// //         q = query(q, where("category", "==", filters.category));
// //       }

// //       if (filters.featured !== undefined) {
// //         q = query(q, where("featured", "==", filters.featured));
// //       }

// //       // Note: Full-text search may require a separate service like Algolia
// //       // Basic filtering for searchQuery would happen in memory
// //     }

// //     const snapshot = await getDocs(q);
// //     const products = snapshot.docs.map((doc) => doc.data());

// //     // If searchQuery is provided, filter in memory
// //     if (filters?.searchQuery) {
// //       const searchLower = filters.searchQuery.toLowerCase();
// //       return products.filter(
// //         (product) =>
// //           product.name.toLowerCase().includes(searchLower) ||
// //           product.description.toLowerCase().includes(searchLower)
// //       );
// //     }

// //     return products;
// //   }

// //   async getProductById(id: string): Promise<Product | null> {
// //     const docRef = doc(db, "products", id).withConverter(productConverter);
// //     const docSnap = await getDoc(docRef);

// //     if (docSnap.exists()) {
// //       return docSnap.data();
// //     } else {
// //       return null;
// //     }
// //   }

// //   async getProductBySlug(slug: string): Promise<Product | null> {
// //     const q = query(this.productsCollection, where("slug", "==", slug));
// //     const snapshot = await getDocs(q);

// //     if (snapshot.empty) {
// //       return null;
// //     }

// //     return snapshot.docs[0].data();
// //   }

// //   async createProduct(product: Omit<Product, "id">): Promise<Product> {
// //     const docRef = await addDoc(this.productsCollection, product);
// //     const newProduct = { ...product, id: docRef.id } as Product;

// //     return newProduct;
// //   }

// //   async updateProduct(product: Product): Promise<Product> {
// //     const docRef = doc(db, "products", product.id).withConverter(
// //       productConverter
// //     );
// //     await updateDoc(docRef, this.productConverter.toFirestore(product));

// //     return product;
// //   }

// //   async deleteProduct(id: string): Promise<void> {
// //     const docRef = doc(db, "products", id);
// //     await deleteDoc(docRef);
// //   }
// // }

// import {
//   collection,
//   doc,
//   getDocs,
//   getDoc,
//   addDoc,
//   updateDoc,
//   deleteDoc,
//   query,
//   where,
//   orderBy,
//   DocumentData,
//   FirestoreDataConverter,
//   QueryDocumentSnapshot,
//   SnapshotOptions,
//   Timestamp,
// } from "firebase/firestore";
// import { db } from "@/lib/firebase/firebase-config";
// import { Product, ProductVariant, ProductImage } from "@/core/entities/product";
// import { ProductRepository } from "@/core/interfaces/repositories/product-repository";

// // import {
// //   ProductRepository,
// //   ProductFilters,
// // } from "@/core/interfaces/repositories/product-repository";
// // import { db } from "@/lib/firebase/firebase-config";
// // import {
// //   collection,
// //   doc,
// //   getDocs,
// //   getDoc,
// //   addDoc,
// //   updateDoc,
// //   deleteDoc,
// //   query,
// //   where,
// //   orderBy,
// //   DocumentData,
// //   FirestoreDataConverter,
// //   QueryDocumentSnapshot,
// //   SnapshotOptions,
// // } from "firebase/firestore";

// export class FirebaseProductRepository implements ProductRepository {
//   private collectionName = "products";

//   async getAll(): Promise<Product[]> {
//     const querySnapshot = await getDocs(collection(db, this.collectionName));
//     return querySnapshot.docs.map((doc) => ({
//       id: doc.id,
//       ...doc.data(),
//       // createdAt: doc.data().createdAt?.toDate() || new Date(),
//       // updatedAt: doc.data().updatedAt?.toDate() || new Date(),
//       createdAt:
//         doc.data().createdAt?.toDate().toISOString() ||
//         new Date().toISOString(),
//       updatedAt:
//         doc.data().updatedAt?.toDate().toISOString() ||
//         new Date().toISOString(),
//     })) as Product[];
//   }

//   async getById(id: string): Promise<Product | null> {
//     const docRef = doc(db, this.collectionName, id);
//     const docSnap = await getDoc(docRef);

//     if (docSnap.exists()) {
//       return {
//         id: docSnap.id,
//         ...docSnap.data(),
//         createdAt: docSnap.data().createdAt?.toDate() || new Date(),
//         updatedAt: docSnap.data().updatedAt?.toDate() || new Date(),
//       } as Product;
//     }

//     return null;
//   }

//   async create(
//     product: Omit<Product, "id" | "createdAt" | "updatedAt">
//   ): Promise<Product> {
//     const now = Timestamp.now();
//     const docRef = await addDoc(collection(db, this.collectionName), {
//       ...product,
//       createdAt: now,
//       updatedAt: now,
//     });

//     return {
//       id: docRef.id,
//       ...product,
//       createdAt: now.toDate(),
//       updatedAt: now.toDate(),
//     };
//   }

//   async update(id: string, product: Partial<Product>): Promise<Product> {
//     const docRef = doc(db, this.collectionName, id);
//     const updateData = {
//       ...product,
//       updatedAt: Timestamp.now(),
//     };

//     await updateDoc(docRef, updateData);

//     const updatedDoc = await getDoc(docRef);
//     return {
//       id: updatedDoc.id,
//       ...updatedDoc.data(),
//       createdAt: updatedDoc.data()?.createdAt?.toDate() || new Date(),
//       updatedAt: updatedDoc.data()?.updatedAt?.toDate() || new Date(),
//     } as Product;
//   }

//   async delete(id: string): Promise<void> {
//     const docRef = doc(db, this.collectionName, id);
//     await deleteDoc(docRef);
//   }
// }

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
  Timestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase/firebase-config";
import { Product } from "@/core/entities/product";
import { ProductRepository } from "@/core/interfaces/repositories/product-repository";

export class FirebaseProductRepository implements ProductRepository {
  private collectionName = "products";

  // Convert Firestore data to plain objects
  private toProduct(docData: any, id: string): Product {
    return {
      id,
      ...docData,
      createdAt:
        docData.createdAt?.toDate().toISOString() || new Date().toISOString(),
      updatedAt:
        docData.updatedAt?.toDate().toISOString() || new Date().toISOString(),
      // Handle nested objects if needed
      variants:
        docData.variants?.map((v: any) => ({
          ...v,
          createdAt: v.createdAt?.toDate().toISOString(),
          updatedAt: v.updatedAt?.toDate().toISOString(),
        })) || [],
      images:
        docData.images?.map((i: any) => ({
          ...i,
          createdAt: i.createdAt?.toDate().toISOString(),
        })) || [],
    };
  }

  async getAll(): Promise<Product[]> {
    const querySnapshot = await getDocs(collection(db, this.collectionName));
    return querySnapshot.docs.map((doc) => this.toProduct(doc.data(), doc.id));
  }

  async getById(id: string): Promise<Product | null> {
    const docRef = doc(db, this.collectionName, id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) return null;

    return this.toProduct(docSnap.data(), docSnap.id);
  }

  async create(
    product: Omit<Product, "id" | "createdAt" | "updatedAt">
  ): Promise<Product> {
    const now = Timestamp.now();
    const docRef = await addDoc(collection(db, this.collectionName), {
      ...product,
      createdAt: now,
      updatedAt: now,
    });

    return this.toProduct(
      {
        ...product,
        createdAt: now,
        updatedAt: now,
      },
      docRef.id
    );
  }

  async update(id: string, product: Partial<Product>): Promise<Product> {
    const docRef = doc(db, this.collectionName, id);
    const now = Timestamp.now();

    await updateDoc(docRef, {
      ...product,
      updatedAt: now,
    });

    const updatedDoc = await getDoc(docRef);
    return this.toProduct(updatedDoc.data(), updatedDoc.id);
  }

  async delete(id: string): Promise<void> {
    const docRef = doc(db, this.collectionName, id);
    await deleteDoc(docRef);
  }
}