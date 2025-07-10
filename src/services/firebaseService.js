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
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../config/firebase';

// Products CRUD operations
export const getProducts = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'products'));
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error getting products:', error);
    throw error;
  }
};

export const getProduct = async (id) => {
  try {
    const docRef = doc(db, 'products', id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error getting product:', error);
    throw error;
  }
};

export const addProduct = async (productData) => {
  try {
    const docRef = await addDoc(collection(db, 'products'), {
      ...productData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return docRef.id;
  } catch (error) {
    console.error('Error adding product:', error);
    throw error;
  }
};

export const updateProduct = async (id, productData) => {
  try {
    const docRef = doc(db, 'products', id);
    await updateDoc(docRef, {
      ...productData,
      updatedAt: serverTimestamp()
    });
    return true;
  } catch (error) {
    console.error('Error updating product:', error);
    throw error;
  }
};

export const deleteProduct = async (id) => {
  try {
    await deleteDoc(doc(db, 'products', id));
    return true;
  } catch (error) {
    console.error('Error deleting product:', error);
    throw error;
  }
};

// Categories CRUD operations
export const getCategories = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'categories'));
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error getting categories:', error);
    throw error;
  }
};

export const addCategory = async (categoryData) => {
  try {
    const docRef = await addDoc(collection(db, 'categories'), {
      ...categoryData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return docRef.id;
  } catch (error) {
    console.error('Error adding category:', error);
    throw error;
  }
};

export const updateCategory = async (id, categoryData) => {
  try {
    const docRef = doc(db, 'categories', id);
    await updateDoc(docRef, {
      ...categoryData,
      updatedAt: serverTimestamp()
    });
    return true;
  } catch (error) {
    console.error('Error updating category:', error);
    throw error;
  }
};

export const deleteCategory = async (id) => {
  try {
    await deleteDoc(doc(db, 'categories', id));
    return true;
  } catch (error) {
    console.error('Error deleting category:', error);
    throw error;
  }
};

// Orders CRUD operations
export const getOrders = async () => {
  try {
    const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error getting orders:', error);
    throw error;
  }
};

export const getOrder = async (id) => {
  try {
    const docRef = doc(db, 'orders', id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error getting order:', error);
    throw error;
  }
};

export const updateOrderStatus = async (id, status) => {
  try {
    const docRef = doc(db, 'orders', id);
    await updateDoc(docRef, {
      status,
      updatedAt: serverTimestamp()
    });
    return true;
  } catch (error) {
    console.error('Error updating order status:', error);
    throw error;
  }
};

// Analytics
export const getAnalytics = async () => {
  try {
    const ordersSnapshot = await getDocs(collection(db, 'orders'));
    const orders = ordersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    
    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((sum, order) => sum + (order.total || 0), 0);
    const pendingOrders = orders.filter(order => order.status === 'pending').length;
    const completedOrders = orders.filter(order => order.status === 'completed').length;
    
    return {
      totalOrders,
      totalRevenue,
      pendingOrders,
      completedOrders
    };
  } catch (error) {
    console.error('Error getting analytics:', error);
    throw error;
  }
}; 