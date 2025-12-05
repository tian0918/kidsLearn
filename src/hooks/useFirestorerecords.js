import { ref, onUnmounted } from "vue";
import { auth, db } from "@/firebase";
import { onAuthStateChanged } from "firebase/auth";
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
  getDocs,
} from "firebase/firestore";
function calculateStreak(records) {
  if (!records.length) return 0;

  const sorted = [...records].sort(
    (a, b) => b.createdAt.toDate() - a.createdAt.toDate()
  );

  let streak = 1;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let prevDate = sorted[0].createdAt.toDate();
  prevDate.setHours(0, 0, 0, 0);

  if (prevDate.getTime() !== today.getTime()) {
    streak = 0;
  }

  for (let i = 1; i < sorted.length; i++) {
    const d = sorted[i].createdAt.toDate();
    d.setHours(0, 0, 0, 0);

    const diff = (prevDate - d) / (1000 * 3600 * 24);

    if (diff === 1) {
      streak++;
      prevDate = d;
    } else {
      break;
    }
  }

  return streak;
}
export function useFirestorerecords() {
  const uid = ref(null);
  const records = ref([]);
  const streak = ref(0);
  const loading = ref(true);
  const unsubscribe = ref(null);

  /** ★ 监听用户登录状态，自动初始化 uid */
  const stopAuthListener = onAuthStateChanged(auth, (user) => {
    if (user) {
      uid.value = user.uid;
    } else {
      uid.value = null;
    }
  });

  const waitForUid = () =>
    new Promise((resolve) => {
      const timer = setInterval(() => {
        if (uid.value) {
          clearInterval(timer);
          resolve(uid.value);
        }
      }, 50);
    });

  /** 保存答题记录 */
  const saveAnswer = async (data) => {
    const _uid = uid.value || (await waitForUid());
    await addDoc(collection(db, "users", _uid, "records"), {
      ...data,
      createdAt: new Date(),
    });
  };

  /** 一次性读取 */
  const loadrecords = async () => {
    const _uid = uid.value || (await waitForUid());

    const qs = await getDocs(
      query(collection(db, "users", _uid, "records"), orderBy("createdAt", "desc"))
    );

    records.value = qs.docs.map((d) => ({ id: d.id, ...d.data() }));
    streak.value = calculateStreak(records.value);
    loading.value = false;

    return records.value;
  };

  /** 实时监听 */
  const listenRecords = async () => {
    const _uid = uid.value || (await waitForUid());

    const qRef = query(
      collection(db, "users", _uid, "records"),
      orderBy("createdAt", "desc")
    );

    unsubscribe.value = onSnapshot(qRef, (snapshot) => {
      records.value = snapshot.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      }));

      streak.value = calculateStreak(records.value);
      loading.value = false;
    });
  };

  /** 清理 */
  onUnmounted(() => {
    if (unsubscribe.value) unsubscribe.value();
    if (stopAuthListener) stopAuthListener();
  });

  return {
    uid,
    records,
    streak,
    loading,
    saveAnswer,
    loadrecords,
    listenRecords,
  };
}