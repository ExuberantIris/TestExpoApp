import { setNotificationHandler } from 'expo-notifications';
import { useEffect, useRef, useState } from 'react';
import {
  Button,
  FlatList,
  ListRenderItem,
  StyleSheet,
  Text,
  TextInput,
  View
} from 'react-native';

import { useIsFocused } from '@react-navigation/native';
import FoodItem from '@/component/foodItem';
import VoiceButton from '@/component/voiceButton';
import { takeFullDate } from '@/scripts/date/date';
import DateDiff from '@/scripts/date/dateDiff';
import db, { initDatabase } from '@/scripts/food_database/database';
import tagDB, { initTagDatabase } from '@/scripts/tag_database/tagDatabase';
import FoodData, { AddFoodData } from '@/scripts/food_database/foodData';
import { useDatabase } from '@/scripts/food_database/useDatabase';
import { indexStyle } from '@/style/indexStyle';
import { localTagDB, useTagDatabase } from '@/scripts/tag_database/useTagDatabase';
import TagDropdown from '@/component/tagDropdown';
import TagItem from '@/component/tagItem';

setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export default function Index() {
	const {
    localDB, addData, deleteData, 
    deleteDataByName, fetchData, updateData 
  } = useDatabase(db);
  const {
    fetchTagData
  } = useTagDatabase(tagDB);
  
	const textInputRef = useRef<TextInput>(null);
	const [title, setTitle] = useState<string>("");
  const [storage, setStorage] = useState<number>(-1);
  const [query, setQuery] = useState<number>(-1);
  const [filterDB, setFilterDB] = useState<FoodData[]>([])

	const handleAddFood = () => {
    const OneDay = new DateDiff(1);
    const today = takeFullDate(new Date());
    const tomorrow = OneDay.getShiftedDate(today);
		const foodDataList: AddFoodData[] = [
			{
				name: title,
        number: 3,
				storeDate: today,
				expireDate: tomorrow,
        storage: storage
			}
		]
		addData(foodDataList);
		setTitle("");
		textInputRef?.current?.clear();
    textInputRef?.current?.focus();
	};

	const handleChangeText = (text: string) => setTitle(text);
  const handleChangeStorage = (text: string) => setStorage(parseInt(text))
  const handleChangeTag = (text: string) => setQuery(parseInt(text))

  useEffect(() => {
    const list = []
    for (const foodData of localDB) {
      if (foodData.storage == query || query === -1) {
        list.push(foodData)
      }
    }
    setFilterDB(list)
  }, [query, localDB])

	const renderFoodItem: ListRenderItem<FoodData> = ({ item: foodData}) => {
    return (
      <View>
        <FoodItem
            foodData={foodData}
            onUpdatePress={updateData}
            onDeletePress={deleteData}
        />
      </View>
    )
	}

	useEffect(() => {
		initDatabase(db)
    initTagDatabase(tagDB)
    fetchData()
    fetchTagData()
	}, [])

	return (
		<View style={indexStyle.container}>
			{/* <View style={indexStyle.headerContainer}>
        <TagDropdown 
          changeStorage={handleChangeStorage} 
        />
        <TextInput
          ref={textInputRef}
          style={indexStyle.textInput}
          placeholder="Add a new Todo"
          onChangeText={handleChangeText}
        />
        <Button title="+ Add" onPress={handleAddFood} disabled={!title} />
      </View> */}
      <VoiceButton addData={addData} deleteData={deleteDataByName} />
			<View style={indexStyle.flatListContainer}>
        <View style={indexStyle.queryContainer}>
          <Text style={indexStyle.contentTextII}>搜尋範圍：</Text>
          <TagDropdown changeStorage={handleChangeTag} defaultTag='全部'/> 
        </View>
				<FlatList 
				data = {filterDB}
				renderItem={renderFoodItem}
				keyExtractor = {(item) => item.id.toString()}
				contentContainerStyle={indexStyle.contentContainer}
				ListEmptyComponent={<Text style={indexStyle.contentText}>No Food...</Text>}
				/>
			</View>
		</View>
	);
}