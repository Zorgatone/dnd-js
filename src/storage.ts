export const DB_VERSION = 2;

export function openDb(name: string, version?: number) {
  return new Promise<IDBDatabase>((resolve, reject) => {
    const request = indexedDB.open(name, version);

    request.onerror = (event) => {
      console.error("error", event);

      reject(new Error("Could not open DB", { cause: event }));
    };

    request.onupgradeneeded = (event) => {
      console.log("upgrade", event);

      const db = request.result;

      const objectStore = db.createObjectStore("settings", {
        keyPath: "label",
      });

      objectStore.transaction.oncomplete = (event) => {
        console.log("object store created", event);

        const settingsObjectStore = db
          .transaction("settings", "readwrite")
          .objectStore("settings");

        settingsObjectStore.add({
          label: "setting.dbVersion",
          value: DB_VERSION,
        });
      };
    };

    request.onsuccess = (event) => {
      console.log("success", event);

      resolve(request.result);
    };
  });
}

async function openAndTestDb() {
  const db = await openDb("test", DB_VERSION);

  console.log("result:", db);

  const transaction = db.transaction(["settings"], "readwrite");

  transaction.oncomplete = (event) => {
    console.log("transaction complete", event);
  };

  transaction.onerror = (event) => {
    console.error("transaction error!", event);
  };

  const settingsObjectStore = transaction.objectStore("settings");
  const request = settingsObjectStore.get("setting.dbVersion");

  request.onerror = (event) => {
    console.error("read error!", event);
  };

  request.onsuccess = (event) => {
    console.log("read complete", event);

    console.log("result", request.result);
  };

  db.close();
}

export function testStorage() {
  openAndTestDb().catch(console.error);
}
