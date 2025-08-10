import FoodData from '@/scripts/foodData';
import { 
	View, 
	FlatList, 
	StyleSheet, 
	Text, 
	StatusBar, 
	ListRenderItem, 
	TextInput, 
	Button 
} from 'react-native';

import db, { initDatabase } from '@/scripts/database';
import FoodItem from '@/component/foodItem';
import { useDatabase} from '@/scripts/useDatabase';
import { useState, useRef, useEffect } from 'react';
import VoiceButton from '@/component/voiceButton';

const data: FoodData[] = [
	{
		id: 1,
		name: "Gyuniku",
		storeDate: new Date(2025, 8, 9),
		expireDate: new Date(2025, 10, 10)
	},
	{
		id: 2,
		name: "GuuBaBun",
		storeDate: new Date(2025, 8, 9),
		expireDate: new Date(2025, 12, 10)
	},

]


export default function Index() {
	const {localDB, addData, deleteData, deleteDataByName} = useDatabase(db);
	const textInputRef = useRef<TextInput>(null);
	const [title, setTitle] = useState<string>("");
	const [secondTitle, setSecondTitle] = useState<string>("");

	const handleAddFood = () => {
		const foodDataList: FoodData[] = [
			{
				id: -1,
				name: title,
				storeDate: new Date(),
				expireDate: new Date(2025, 12, 12)
			}
		]
		addData(foodDataList);
		setTitle("");
		textInputRef?.current?.clear();
    textInputRef?.current?.focus();
	};

	const handleDeleteFood = (id: number) => {
    deleteData(id);
  };

	const handleChangeText = (text: string) => setTitle(text);

	const renderFoodItem: ListRenderItem<FoodData> = ({ item: foodData}) => {
		return (
			<View>
				<FoodItem
						foodData={foodData}
						onDeletePress={handleDeleteFood}
				/>
			</View>
		)
	}

	useEffect(() => {
		initDatabase(db)
	}, [])

	return (
		<View style={styles.container}>
			<View style={styles.headerContainer}>
        <TextInput
          ref={textInputRef}
          style={styles.textInput}
          placeholder="Add a new Todo"
          onChangeText={handleChangeText}
        />
        <Button title="+ Add" onPress={handleAddFood} disabled={!title} />
      </View>
      <VoiceButton addData={addData} deleteData={deleteDataByName}/>
			<View style={styles.container}>
				<FlatList 
				data = {localDB}
				renderItem={renderFoodItem}
				keyExtractor = {(item) => item.id.toString()}
				contentContainerStyle={styles.contentContainer}
				ListEmptyComponent={<Text>No todos...</Text>}
				/>
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
    flex: 1,
  },

  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    gap: 16,
  },

  header: {
    fontWeight: "bold",
    fontSize: 36,
    verticalAlign: "bottom",
  },

  contentContainer: {
    padding: 16,
    gap: 16,
    backgroundColor: "#fff",
  },
});