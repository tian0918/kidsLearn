const DB_NAME = "LearningDB";
const DB_VERSION = 1;

let dbInstance = null; // 单例

// 存储科目名称
const SUBJECTS = {
  ENGLISH: "english",
  PINYIN: "pinyin",
  MATH: "math",
};

export function useDB() {
  // 1. 初始化 DB
  const initDB = (dbName = DB_NAME, version = DB_VERSION) => {
    return new Promise((resolve, reject) => {
      if (dbInstance) return resolve(dbInstance);

      const request = indexedDB.open(dbName, version);

      request.onerror = () => reject(request.error);

      request.onsuccess = () => {
        dbInstance = request.result;
        resolve(dbInstance);
      };

      request.onupgradeneeded = (event) => {
        const db = event.target.result;

        // 创建英语对象存储区
        if (!db.objectStoreNames.contains(SUBJECTS.ENGLISH)) {
          const englishStore = db.createObjectStore(SUBJECTS.ENGLISH, {
            keyPath: "id",
            autoIncrement: true,
          });
          englishStore.createIndex("updateTime", "updateTime", { unique: false });
        }

        // 创建拼音对象存储区
        if (!db.objectStoreNames.contains(SUBJECTS.PINYIN)) {
          const pinyinStore = db.createObjectStore(SUBJECTS.PINYIN, {
            keyPath: "id",
            autoIncrement: true,
          });
          pinyinStore.createIndex("updateTime", "updateTime", { unique: false });
        }

        // 创建数学对象存储区
        if (!db.objectStoreNames.contains(SUBJECTS.MATH)) {
          const mathStore = db.createObjectStore(SUBJECTS.MATH, {
            keyPath: "id",
            autoIncrement: true,
          });
          mathStore.createIndex("updateTime", "updateTime", { unique: false });
        }
      };
    });
  };

  // 2. 添加记录（支持不同科目）
  const addRecord = async (subject, record) => {
    const db = await initDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(subject, "readwrite");
      const store = tx.objectStore(subject);
      const req = store.add({ ...record, synced: false });

      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
  };

  // 3. 获取全部记录（支持不同科目）
  const getAllRecords = async (subject) => {
    const db = await initDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(subject, "readonly");
      const store = tx.objectStore(subject);
      const req = store.getAll();

      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
  };

  // 4. 获取错题记录（支持不同科目）
  const getWrongRecords = async (subject) => {
    const db = await initDB();
    return new Promise((resolve, reject) => {
      const index = db.transaction(subject, "readonly")
        .objectStore(subject)
        .index("correct");

      const req = index.getAll(false);

      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
  };

  // 5. 按时间范围查询（支持不同科目）
  const getRecordsByTime = async (subject, start, end) => {
    const db = await initDB();
    return new Promise((resolve, reject) => {
      const index = db.transaction(subject, "readonly")
        .objectStore(subject)
        .index("updateTime");

      const range = IDBKeyRange.bound(start, end);
      const req = index.getAll(range);

      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
  };

  // 6. 删除记录（支持不同科目）
  const deleteRecord = async (subject, id) => {
    const db = await initDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(subject, "readwrite");
      const store = tx.objectStore(subject);
      const req = store.delete(id);

      req.onsuccess = () => resolve(true);
      req.onerror = () => reject(req.error);
    });
  };

  return {
    initDB,
    addRecord,
    getAllRecords,
    getWrongRecords,
    getRecordsByTime,
    deleteRecord,
  };
}



// const DB_NAME = "MathLearningDB";
// const DB_VERSION = 1;
// const STORE_NAME = "records";

// let dbInstance = null; // 单例

// export function useDB() {
//   // 1. 初始化 DB
//   const initDB = (dbName=DB_NAME,version=DB_VERSION) => {
//     return new Promise((resolve, reject) => {
//       if (dbInstance) return resolve(dbInstance);

//       const request = indexedDB.open(DB_NAME, DB_VERSION);

//       request.onerror = () => reject(request.error);

//       request.onsuccess = () => {
//         dbInstance = request.result;
//         resolve(dbInstance);
//       };

//       request.onupgradeneeded = (event) => {
//         const db = event.target.result;

//         if (!db.objectStoreNames.contains(STORE_NAME)) {
//           const store = db.createObjectStore(STORE_NAME, {
//             keyPath: "id",
//             autoIncrement: true,
//           });

//           store.createIndex("updateTime", "updateTime", { unique: false });
//           store.createIndex("correct", "correct", { unique: false });
//           store.createIndex("wrongNode", "wrongNode", { unique: false });
//           store.createIndex('question', "question", { multiEntry: true, unique: false })
//           store.createIndex('answer', "answer", { multiEntry: true, unique: false })
//         }
//       };
//     });
//   };

//   // 2. 添加记录
//   const addRecord = async (record) => {
//     const db = await initDB();
//     return new Promise((resolve, reject) => {
//       const tx = db.transaction(STORE_NAME, "readwrite");
//       const store = tx.objectStore(STORE_NAME);
//       const req = store.add({ ...record, synced: false });

//       req.onsuccess = () => resolve(req.result);
//       req.onerror = () => reject(req.error);
//     });
//   };
//   const getPendingRecords = async () => {
//     const db = await initDB();
//     return new Promise((resolve, reject) => {
//       const tx = db.transaction(STORE_NAME, "readonly");
//       const store = tx.objectStore(STORE_NAME);
//       const req = store.getAll();
//       req.onsuccess = () => {
//         resolve(req.result.filter(r => !r.synced));
//       };
//       req.onerror = () => reject(req.error);
//     });
//   };

//   // 3. 获取全部记录
//   const getAllRecords = async () => {
//     const db = await initDB();
//     return new Promise((resolve, reject) => {
//       const tx = db.transaction(STORE_NAME, "readonly");
//       const store = tx.objectStore(STORE_NAME);
//       const req = store.getAll();

//       req.onsuccess = () => resolve(req.result);
//       req.onerror = () => reject(req.error);
//     });
//   };

//   // 4. 按时间范围查询
//   const getRecordsByTime = async (start, end) => {
//     const db = await initDB();
//     return new Promise((resolve, reject) => {
//       const index = db.transaction(STORE_NAME, "readonly")
//         .objectStore(STORE_NAME)
//         .index("updateTime");

//       const range = IDBKeyRange.bound(start, end);
//       const req = index.getAll(range);

//       req.onsuccess = () => resolve(req.result);
//       req.onerror = () => reject(req.error);
//     });
//   };

//   // 5. 获取错题
//   const getWrongRecords = async () => {
//     const db = await initDB();
//     return new Promise((resolve, reject) => {
//       const index = db.transaction(STORE_NAME, "readonly")
//         .objectStore(STORE_NAME)
//         .index("correct");

//       const req = index.getAll(false);

//       req.onsuccess = () => resolve(req.result);
//       req.onerror = () => reject(req.error);
//     });
//   };

//   // 6. 更新记录
//   // const updateRecord = async (record) => {
//   //   const db = await initDB();
//   //   return new Promise((resolve, reject) => {
//   //     const tx = db.transaction(STORE_NAME, "readwrite");
//   //     const store = tx.objectStore(STORE_NAME);
//   //     const req = store.put(record);

//   //     req.onsuccess = () => resolve(true);
//   //     req.onerror = () => reject(req.error);
//   //   });
//   // };

//   // 7. 删除
//   const deleteRecord = async (id) => {
//     const db = await initDB();
//     return new Promise((resolve, reject) => {
//       const tx = db.transaction(STORE_NAME, "readwrite");
//       const store = tx.objectStore(STORE_NAME);
//       const req = store.delete(id);

//       req.onsuccess = () => resolve(true);
//       req.onerror = () => reject(req.error);
//     });
//   };

//   return {
//     initDB,
//     addRecord,
//     getAllRecords,
//     getRecordsByTime,
//     getWrongRecords,
//     getPendingRecords,
//     deleteRecord,
//   };
// }
