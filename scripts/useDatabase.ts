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
      const statement = await db.prepareAsync(`
        INSERT INTO test (name, number, storeDate, expireDate)
        VALUES ($name, $number, $storeDate, $expireDate)
          ON CONFLICT (name) DO UPDATE SET number = number + $number
      `)
      await statement.executeAsync({$name: foodData.name, $number: foodData.number, $storeDate: storeDateString, $expireDate: expireDateString})
      await statement.finalizeAsync()
    }
    fetchData()
  }

  async function deleteData(id: number) {
    await db.runAsync(
      'DELETE FROM test WHERE id = ?'
    , id);

    fetchData()
  }

  type DeleteData = {
    name: string,
    number: number | "all"
  }
  async function deleteDataByName(deleteDataList: DeleteData[]) {
    for (let dataOfDeletion of deleteDataList) {
      console.log(dataOfDeletion)
      if (dataOfDeletion.number === "all") {
        await db.runAsync(
          'DELETE FROM test WHERE name = ?'
        , dataOfDeletion.name);
      } else {
        await db.runAsync(`
          DELETE FROM test 
            WHERE name = $name AND number <= $number;
          `
        , {$name: dataOfDeletion.name, $number: dataOfDeletion.number as number});
        await db.runAsync(`
          UPDATE test
            SET number = number - $number
            WHERE name = $name;
          `
        , {$name: dataOfDeletion.name, $number: dataOfDeletion.number as number});
      }
    }

    fetchData()
  }
  return {
    localDB,
    addData,
    deleteData,
    deleteDataByName,
    fetchData
  }
}

//   UPDATE test 
//                 SET name = ?, storeDate = ?, expireDate = ?
//                 WHERE id = ? 