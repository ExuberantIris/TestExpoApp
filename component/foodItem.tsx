import { View, Text, StyleSheet, Button } from 'react-native'
import FoodData from '@/scripts/foodData'
import { useState } from 'react';

type FoodItemProps = {
  foodData: FoodData
  onDeletePress: (id: number) => void
}

export default function FoodItem({
  foodData,
  onDeletePress
}: FoodItemProps) {

  const handleDeleteTodo = () => {
    onDeletePress(foodData.id);
  };

  // useEffect(() => {
  //   setTitle(todo.title);
  // }, [editable]);

  return (
    <View style={styles.container}>
      <Text>{`${foodData.name}:${foodData.number}, ${foodData.expireDate}`}</Text>

      <View style={styles.rowContainer}>
        <Button title="Delete" onPress={handleDeleteTodo} color="red" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  textInput: {
    borderWidth: 1,
    flex: 1,
    padding: 8,
    borderRadius: 8,
    borderColor: "gray",
  },

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
});