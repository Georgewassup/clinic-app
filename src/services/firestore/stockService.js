import { collection, getDocs, getDoc, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';

const COLLECTION = 'stock';

export const stockService = {
  list: async () => {
    const snap = await getDocs(collection(db, COLLECTION));
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  },
  get: async (id) => {
    const snap = await getDoc(doc(db, COLLECTION, id));
    if (!snap.exists()) return null;
    return { id: snap.id, ...snap.data() };
  },
  create: async (data) => {
    const ref = await addDoc(collection(db, COLLECTION), data);
    return { id: ref.id, ...data };
  },
  update: async (id, data) => {
    await updateDoc(doc(db, COLLECTION, id), data);
    return { id, ...data };
  },
  remove: async (id) => {
    await deleteDoc(doc(db, COLLECTION, id));
    return id;
  },
};
