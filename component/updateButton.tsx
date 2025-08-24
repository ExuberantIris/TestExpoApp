import { useRef, useState } from 'react';
import { Button, StyleSheet, TextInput, View } from 'react-native';


type UpdateButtonProps = {
  defaultNum: number,
  onChangeText: (num: number) => void
}

export default function UpdateButton({
  defaultNum,
  onChangeText
}: UpdateButtonProps) {
  const textInputRef = useRef<TextInput>(null);
  const [updateNum, setUpdateNum] = useState<number>(defaultNum);

  const handleChangeText = (text: string) => {
		if (text === "") {
			text = "0"
		}

		const isInt = (string: string) => /^[0-9]*$/.test(string);
		const correspondNum = parseInt(text)
		let number = correspondNum
		if (number < 0) {
			number = 0
		} else if (isNaN(number)) {
			if (isNaN(updateNum)) {
				number = defaultNum
			} else {
				number = updateNum
			}
		}

    setUpdateNum(number)
    onChangeText(number)
  };

  const updateNumber = (changeNum: number) => {
		let newNum = Math.max(0, updateNum + changeNum)
		setUpdateNum(newNum)
		onChangeText(newNum)
		textInputRef?.current?.setNativeProps({ text: String(newNum)})
  }

  return (
    <View style={styles.textInputContainer}>
      <View>
        <TextInput
          ref={textInputRef}
          style={styles.textInput}
          value={String(updateNum)}
          keyboardType='number-pad'
          onChangeText={handleChangeText}
        />
      </View>
      <Button title="-1" onPress={() => {updateNumber(-1)}} color="rgba(72, 164, 150, 1)" />
      <Button title="-2" onPress={() => {updateNumber(-2)}} color="rgba(50, 115, 105, 1)" />
    </View>
  );
}

const styles = StyleSheet.create({
  textInputContainer: {
    borderColor: "gray",
    flexDirection: "row",
    paddingHorizontal: 8,
  },

  textInput: {
    borderWidth: 1,
    flex: 1,
    paddingHorizontal: 12,
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
    fontSize: 24,
    borderColor: "gray",
  },
})