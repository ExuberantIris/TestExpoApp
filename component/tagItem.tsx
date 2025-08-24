import { Button, StyleSheet, Text, View } from 'react-native';

import { indexStyle } from '@/style/indexStyle';
//import UpdateButton from './updateButton';
import TagData from '@/scripts/tag_database/tagData';

type TagItemProps = {
  tagData: TagData
  onDeletePress: (idList: number[]) => void
}

export default function TagItem({
  tagData,
  onDeletePress
}: TagItemProps) {

  const handleDeleteTodo = () => {
    onDeletePress([tagData.tagID]);
  };

  return (
    <View style={styles.container}>
      <Text style={indexStyle.contentText}>{`${tagData.name}`}</Text>

      <View style={styles.rowContainer}>
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