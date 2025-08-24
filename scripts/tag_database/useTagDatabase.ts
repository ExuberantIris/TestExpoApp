import * as SQLite from 'expo-sqlite';
import { useState } from 'react';
import TagData, { AddTagData, UpdateTagData } from './tagData';
import storageDB from '../food_database/database';

export let localTagDB: TagData[] = []

export function useTagDatabase(db: SQLite.SQLiteDatabase, setFunc?: Function) {
  async function fetchTagData() {
    const allRows = await db.getAllAsync('SELECT tagID, name, parentID FROM tag');
    if (allRows == null) {
      return
    } 
    localTagDB = allRows as TagData[]
    if (setFunc) {
      setFunc(localTagDB)
    }
  }

  async function addTagData(addTagDataList: AddTagData[]) {
    for (let tagData of addTagDataList){
      if (tagData.parentID === null) {
        const statement = await db.prepareAsync(`
          INSERT INTO tag (name)
          VALUES ($name)
        `)
        const exec = await statement.executeAsync({$name: tagData.name})
        await statement.finalizeAsync()
      } else {
        const statement = await db.prepareAsync(`
          INSERT INTO tag (name, parentID)
          VALUES ($name, $parentID)
        `)
        const exec = await statement.executeAsync({$name: tagData.name, $parentID: tagData.parentID})
        await statement.finalizeAsync()
      }
    }
    fetchTagData()
  }

  async function updateTagData(updateTagDataList: UpdateTagData[]) {
    for (let updateTag of updateTagDataList) {
      if (updateTag.changedName !== undefined)
        await db.runAsync(`
          UPDATE tag
            SET name = $name
            WHERE tagId = $tagId;
          `
        , {$tagID: updateTag.tagID, $name: updateTag.changedName});

      if (updateTag.changedParentID !== undefined) {
        await db.runAsync(`
          UPDATE tag
            SET parentID = $parentID
            WHERE tagId = $tagID;
          `
        , {$tagID: updateTag.tagID, $parentID: updateTag.changedParentID});
      }
    }

    fetchTagData()
  }

  async function deleteTagData(deleteIDList: number[]) {
    for (let tagID of deleteIDList) {
      await db.runAsync(`
        DELETE FROM tag WHERE tagID = $tagID;
      `, {$tagID: tagID});
      await storageDB.runAsync(`
        UPDATE test
        SET storage = NULL
        WHERE storage = $tagID
      `, {$tagID: tagID})
    }

    fetchTagData()
  }

  return {
    addTagData,
    deleteTagData,
    fetchTagData,
    updateTagData
  }
}
