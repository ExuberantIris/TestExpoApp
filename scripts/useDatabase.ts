import * as SQLite from 'expo-sqlite';
import { useEffect, useState } from 'react';
import { dateToString, stringToDate } from './date';
import FoodData from './foodData';

export function useDatabase(db: SQLite.SQLiteDatabase) {
  const [localDB, setLocalDB] = useState<FoodData[]>([])

  async function fetchData() {
    const allRows = await db.getAllAsync('SELECT * FROM test');
    
    if (allRows == null) {
      return
    } 
    setLocalDB(allRows as FoodData[])
  }

  async function addData(foodDataList: FoodData[]) {
    for (let foodData of foodDataList) {
      const storeDateString = dateToString(foodData.storeDate)
      const expireDateString = dateToString(foodData.expireDate)
      await db.runAsync(`
          INSERT INTO test (name, storeDate, expireDate)
          VALUES (?, ?, ?)
      `, foodData.name, storeDateString, expireDateString)
    }

    fetchData()
  }

  async function deleteData(id: number) {
    await db.runAsync(
      'DELETE FROM test WHERE id = ?'
    , id);

    fetchData()
  }

  async function deleteDataByName(name: string) {
    await db.runAsync(
      'DELETE FROM test WHERE name = ?'
    , name);

    fetchData()
  }
  return {
    localDB,
    addData,
    deleteData,
    deleteDataByName
  }
}

//   UPDATE test 
//                 SET name = ?, storeDate = ?, expireDate = ?
//                 WHERE id = ? 