import { useState } from 'react';
import { Button, StyleSheet, View, TextInput } from 'react-native';
import { useRef } from 'react';
import { processByVoiceAgent, testSth } from '@/scripts/voice_agent/processByVoiceAgent';
type VoiceButtonProps = {
  addData: Function,
  deleteData: Function
}

export default function VoiceButton({addData, deleteData}: VoiceButtonProps) {
	const textInputRef = useRef<TextInput>(null);
	const [title, setTitle] = useState<string>("");

	const handleAddFood = () => {
		processByVoiceAgent(title, addData, deleteData)
    //testSth("add 柳橙汁 3 2025/11/25; add 牛排 1 2026/07/01;")
		setTitle("");
		textInputRef?.current?.clear();
    textInputRef?.current?.focus();
	};

	const handleDeleteFood = (id: number) => {
    deleteData(id);
  };

	const handleChangeText = (text: string) => setTitle(text);

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
		</View>
	);
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    backgroundColor: '#ecf0f1',
    padding: 1,
  },

  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    gap: 16,
  },

  textInput: {
    borderWidth: 1,
    flex: 1,
    padding: 8,
    borderRadius: 8,
    borderColor: "gray",
  },
});