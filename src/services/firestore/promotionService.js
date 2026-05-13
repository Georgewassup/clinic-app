import { collection, getDocs, addDoc, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase';

const COLLECTION = 'promotions';

export const promotionService = {
  list: async () => {
    const snap = await getDocs(collection(db, COLLECTION));
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
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
