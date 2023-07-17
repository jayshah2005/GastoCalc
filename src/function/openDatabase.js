import * as SQLite from 'expo-sqlite';

function openDatabase (dbName) {

    if (Platform.OS === "web") {
      return {
        transaction: () => {
          return {
            executeSql: () => {},
          };
        },
      };
    };
  
    const db = SQLite.openDatabase(dbName);
    
    return db;
  };

  export { openDatabase };