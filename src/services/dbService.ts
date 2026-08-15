import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  collection, 
  query, 
  where, 
  getDocs, 
  deleteDoc, 
  orderBy,
  increment 
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { UserProfile, EbookProject } from '../types';
import { User as FirebaseUser } from 'firebase/auth';

const ADMIN_EMAIL = 'professorjoel65@gmail.com';

/**
 * Gets or creates user profile document in Firestore
 */
export async function syncUserProfile(firebaseUser: FirebaseUser): Promise<UserProfile> {
  const userRef = doc(db, 'users', firebaseUser.uid);
  const snap = await getDoc(userRef);

  const now = new Date().toISOString();
  const isAdminEmail = firebaseUser.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase();

  if (snap.exists()) {
    const existing = snap.data() as UserProfile;
    const updated: Partial<UserProfile> = {
      lastLoginAt: now,
      email: firebaseUser.email || existing.email,
      displayName: firebaseUser.displayName || existing.displayName || '',
    };

    // Auto promote admin if matching admin email
    if (isAdminEmail && existing.role !== 'admin') {
      updated.role = 'admin';
    }

    await updateDoc(userRef, updated);
    return { ...existing, ...updated };
  } else {
    const planExpiresAt = isAdminEmail
      ? new Date(Date.now() + 3650 * 24 * 60 * 60 * 1000).toISOString()
      : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();

    // Create new user profile
    const newProfile: UserProfile = {
      uid: firebaseUser.uid,
      email: firebaseUser.email || '',
      displayName: firebaseUser.displayName || '',
      role: isAdminEmail ? 'admin' : 'user',
      status: 'active',
      planType: isAdminEmail ? 'premium' : 'test',
      maxEbooksQuota: isAdminEmail ? 9999 : 1, // Default 1 ebook for test users
      maxChapters: isAdminEmail ? 25 : 2,      // Default 2 chapters for test users
      maxWordsPerChapter: isAdminEmail ? 5000 : 500, // Default 500 words per chapter for test users
      canExport: isAdminEmail ? true : false,  // Default export restriction for test users
      ebooksCount: 0,
      createdAt: now,
      lastLoginAt: now,
      planExpiresAt: planExpiresAt,
    };

    await setDoc(userRef, newProfile);
    return newProfile;
  }
}

/**
 * Get user profile by UID
 */
export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  try {
    const userRef = doc(db, 'users', uid);
    const snap = await getDoc(userRef);
    if (snap.exists()) {
      return snap.data() as UserProfile;
    }
    return null;
  } catch (err) {
    console.error('Error fetching user profile:', err);
    return null;
  }
}

/**
 * Save or update ebook in Firestore
 */
export async function saveEbook(project: EbookProject): Promise<void> {
  if (!project.id) throw new Error('ID do projeto não fornecido.');
  if (!project.userId) throw new Error('ID do usuário não fornecido.');

  const ebookRef = doc(db, 'ebooks', project.id);
  const snap = await getDoc(ebookRef);
  const isNew = !snap.exists();

  const dataToSave = {
    ...project,
    updatedAt: new Date().toISOString(),
  };

  await setDoc(ebookRef, dataToSave, { merge: true });

  if (isNew) {
    // Increment user's ebook count & set last generation timestamp
    const userRef = doc(db, 'users', project.userId);
    await updateDoc(userRef, {
      ebooksCount: increment(1),
      lastEbookGeneratedAt: new Date().toISOString()
    }).catch(err => console.warn('User ebook count increment warning:', err));
  }
}

/**
 * Fetch ebooks for a specific user
 */
export async function getUserEbooks(userId: string): Promise<EbookProject[]> {
  try {
    const q = query(
      collection(db, 'ebooks'), 
      where('userId', '==', userId)
    );
    const snap = await getDocs(q);
    const ebooks: EbookProject[] = [];
    snap.forEach((docSnap) => {
      ebooks.push(docSnap.data() as EbookProject);
    });
    // Sort in memory by updatedAt desc
    return ebooks.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  } catch (err) {
    console.error('Error fetching user ebooks:', err);
    return [];
  }
}

/**
 * Fetch all ebooks (for Admin)
 */
export async function getAllEbooks(): Promise<EbookProject[]> {
  try {
    const snap = await getDocs(collection(db, 'ebooks'));
    const ebooks: EbookProject[] = [];
    snap.forEach((docSnap) => {
      ebooks.push(docSnap.data() as EbookProject);
    });
    return ebooks.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  } catch (err) {
    console.error('Error fetching all ebooks for admin:', err);
    return [];
  }
}

/**
 * Delete an ebook
 */
export async function deleteEbook(ebookId: string, userId: string): Promise<void> {
  const ebookRef = doc(db, 'ebooks', ebookId);
  await deleteDoc(ebookRef);

  // Decrement user count
  const userRef = doc(db, 'users', userId);
  await updateDoc(userRef, {
    ebooksCount: increment(-1)
  }).catch(err => console.warn('User ebook count decrement warning:', err));
}

/**
 * Fetch all users (for Admin)
 */
export async function getAllUsers(): Promise<UserProfile[]> {
  try {
    const snap = await getDocs(collection(db, 'users'));
    const users: UserProfile[] = [];
    snap.forEach((docSnap) => {
      users.push(docSnap.data() as UserProfile);
    });
    return users.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  } catch (err) {
    console.error('Error fetching all users for admin:', err);
    return [];
  }
}

/**
 * Update user status or quota (for Admin)
 */
export async function updateUserAdminSettings(
  targetUid: string, 
  updates: Partial<Pick<UserProfile, 'status' | 'maxEbooksQuota' | 'maxChapters' | 'maxWordsPerChapter' | 'role' | 'canExport' | 'planType' | 'planExpiresAt'>>
): Promise<void> {
  const userRef = doc(db, 'users', targetUid);
  await updateDoc(userRef, updates);
}
