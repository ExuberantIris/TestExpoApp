import FoodData from '@/scripts/food_database/foodData';
import { useState } from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';

import { indexStyle } from '@/style/indexStyle';
import UpdateButton from './updateButton';
import tagDB from '@/scripts/tag_database/tagDatabase';

type FoodItemProps = {
  foodData: FoodData
  onUpdatePress: (id: number, number: number, noteID: string) => void
  onDeletePress: (id: number, noteID: string) => void
}

export default function FoodItem({
  foodData,
  onUpdatePress,
  onDeletePress
}: FoodItemProps) {
  const [updateNum, setUpdateNum] = useState<number>(foodData.number);

  const handleChangeText = (num: number) => {setUpdateNum(num)};

  const handleUpdateTodo = () => {
    onUpdatePress(foodData.id, updateNum, foodData.noteID);
  };

  const handleDeleteTodo = () => {
    onDeletePress(foodData.id, foodData.noteID);
  };

  let storage = "無"
  let otherStorage = tagDB.getFirstSync("SELECT name FROM tag WHERE tagID = ?", foodData.storage) as any
  if (otherStorage !== null) {
    storage = otherStorage.name as string
  }

  return (
    <View style={styles.container}>
      <View>
      <Text style={indexStyle.contentText}>{`${foodData.name}(儲存：${storage}):${foodData.number}`}</Text>
      <Text style={indexStyle.contentTextII}>{`${foodData.expireDate}`}</Text>
      </View>

      <View style={styles.rowContainer}>
        <View style={styles.updateContainer}>
          <UpdateButton defaultNum={foodData.number} onChangeText={handleChangeText}/>
          <Button title="Update" onPress={handleUpdateTodo} color="blue" />
        </View>
        <Button title="Delete" onPress={handleDeleteTodo} color="red" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 16,
  },

  rowContainer: {
    flexDirection: "row",
    gap: 8,
  },

  updateContainer: {
    flexDirection: "row",
    alignSelf: "center",
  },
})