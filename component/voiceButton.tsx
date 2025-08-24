import { processByVoiceAgent } from '@/scripts/voice_agent/processByVoiceAgent';
import { indexStyle } from '@/style/indexStyle';
import { useRef, useState } from 'react';
import { Button, TextInput, View } from 'react-native';
import TagDropdown from './tagDropdown';

type VoiceButtonProps = {
  addData: Function,
  deleteData: Function
}

export default function VoiceButton({addData, deleteData}: VoiceButtonProps) {
	const textInputRef = useRef<TextInput>(null);
	const [title, setTitle] = useState<string>("");
  const [storage, setStorage] = useState<number>(-1)

	const handleAddFood = () => {
		processByVoiceAgent(title, storage, addData, deleteData)
    //testSth("add 柳橙汁 3 2025/11/25; add 牛排 1 2026/07/01;")
		setTitle("");
		textInputRef?.current?.clear();
    textInputRef?.current?.focus();
	};

	const handleDeleteFood = (id: number) => {
    deleteData(id);
  };

	const handleChangeText = (text: string) => setTitle(text);

  const handleChangeStorage = (text: string) => setStorage(parseInt(text))
	return (
		<View style={indexStyle.headerContainer}>
      <TagDropdown changeStorage={handleChangeStorage}/>
      <TextInput
        ref={textInputRef}
        style={indexStyle.textInput}
        placeholder="在此輸入指令..."
        onChangeText={handleChangeText}
      />
      <Button title="+ Add" onPress={handleAddFood} disabled={!title} />
    </View>
	);
};

