import * as SQLite from 'expo-sqlite';
import { useState } from 'react';
import { dateToString } from '../date/date';
import { deleteNotification, setNotification } from '../notification';
import FoodData, { AddFoodData } from './foodData';

export function useDatabase(db: SQLite.SQLiteDatabase) {
  const [localDB, setLocalDB] = useState<FoodData[]>([])
  async function fetchData() {
    const allRows = await db.getAllAsync('SELECT * FROM test');
    
    if (allRows == null) {
      return
    } 
    setLocalDB(allRows as FoodData[])
  }

  async function addData(foodDataList: AddFoodData[]) {
    for (let foodData of foodDataList) {
      const storeDateString = dateToString(foodData.storeDate)
      const expireDateString = dateToString(foodData.expireDate)
      
      const fakeFoodDataList = [foodData]
      const noteIDList = await setNotification(fakeFoodDataList)
      const noteID = noteIDList[0]
      const statement = await db.prepareAsync(`
        INSERT INTO test (name, number, storeDate, expireDate, noteID, storage)
        VALUES ($name, $number, $storeDate, $expireDate, $noteID, $storage)
          ON CONFLICT (name) DO UPDATE SET number = number + $number
      `)
      console.log({$name: foodData.name, $number: foodData.number, $storeDate: storeDateString, $expireDate: expireDateString, $noteID: noteID, $storage: foodData.storage})
      await statement.executeAsync({$name: foodData.name, $number: foodData.number, $storeDate: storeDateString, $expireDate: expireDateString, $noteID: noteID, $storage: foodData.storage})
      console.log(foodData)
      await statement.finalizeAsync()
    }
    fetchData()
  }

  async function updateData(id: number, number: number, noteID: string) {
    console.log(number)
    if (number <= 0 ){
      deleteNotification(noteID)
      await db.runAsync(
        'DELETE FROM test WHERE id = ?'
      , id);
    } else {
      await db.runAsync(`
        UPDATE test
          SET number = $number
          WHERE id = $id;
        `
      , {$id: id, $number: number});
    }

    fetchData()
  }

  async function deleteData(id: number, noteID: string) {
    await deleteNotification(noteID)
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
      const itemOfNum = await db.getFirstAsync(`
        SELECT number FROM test
        WHERE name = ? 
      `, dataOfDeletion.name).catch(() => {
        throw Error( `Cannot fetch number of ${dataOfDeletion.name}`)
      }) //@ts-ignore
      const num = itemOfNum.number as number
      console.log(dataOfDeletion.number, num)
      if (dataOfDeletion.number === "all" || 
          dataOfDeletion.number as number >= num
      ){
        const noteID = await db.getFirstAsync(`
          SELECT noteID FROM test
          WHERE name = ? 
        `, dataOfDeletion.name).catch(() => {
          throw Error( `Cannot fetch noteID of ${dataOfDeletion.name}`)
        }) as string //@ts-ignore
        deleteNotification(noteID.noteID)
  
        await db.runAsync(
          'DELETE FROM test WHERE name = ?'
        , dataOfDeletion.name);
      } else {
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
    fetchData,
    updateData
  }
}
