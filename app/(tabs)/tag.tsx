import { setNotificationHandler } from 'expo-notifications';
import { useEffect, useRef, useState } from 'react';
import {
  Button,
  FlatList,
  ListRenderItem,
  Text,
  TextInput,
  View
} from 'react-native';

import TagItem from '@/component/tagItem';
import tagDB, { initTagDatabase } from '@/scripts/tag_database/tagDatabase';
import TagData from '@/scripts/tag_database/tagData';
import { localTagDB, useTagDatabase } from '@/scripts/tag_database/useTagDatabase';
import { indexStyle } from '@/style/indexStyle';

setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export default function Index() {
	const textInputRef = useRef<TextInput>(null);
	const [title, setTitle] = useState<string>("");
  const [localTagDatabase, setLocalTagDatabase] = useState<TagData[]>([])
  const {
    addTagData, fetchTagData, deleteTagData
  } = useTagDatabase(tagDB, setLocalTagDatabase);

	const handleAddTag = () => {
    addTagData([{
      name: title,
      parentID: null
    }])
		setTitle("");
		textInputRef?.current?.clear();
    textInputRef?.current?.focus();
	};

	const handleChangeText = (text: string) => setTitle(text);

	const renderFoodItem: ListRenderItem<TagData> = ({ item: tagData}) => {
    return (
			<View>
				<TagItem
          tagData={tagData}
          onDeletePress={deleteTagData}
				/>
			</View>
		)
	}

	useEffect(() => {
    initTagDatabase(tagDB)
    fetchTagData()
    setLocalTagDatabase(localTagDB)
  }, [])

	return (
		<View style={indexStyle.container}>
			<View style={indexStyle.headerContainer}>
        <TextInput
          ref={textInputRef}
          style={indexStyle.textInput}
          placeholder="輸入新的標籤"
          onChangeText={handleChangeText}
        />
        <Button title="+ Add" onPress={handleAddTag} disabled={!title} />
      </View>
			<View style={indexStyle.flatListContainer}>
				<FlatList 
				data = {localTagDatabase}
				renderItem={renderFoodItem}
				keyExtractor = {(item) => item.tagID.toString()}
				contentContainerStyle={indexStyle.contentContainer}
				ListEmptyComponent={<Text style={indexStyle.contentText}>No Todo...</Text>}
				/>
			</View>
		</View>
	);
}