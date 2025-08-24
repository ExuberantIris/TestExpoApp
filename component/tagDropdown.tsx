import React, { useState, useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import tagDB from '@/scripts/tag_database/tagDatabase';
import { localTagDB, useTagDatabase } from '@/scripts/tag_database/useTagDatabase';

type TapDropdownProps = {
  changeStorage: Function
  defaultTag?: string
}
 
export default function TagDropdown({changeStorage, defaultTag="無"}: TapDropdownProps) {
  const [value, setValue] = useState(null);
  const { fetchTagData } = useTagDatabase(tagDB)

  let data = localTagDB.map((tagData) => {
    return {label: tagData.name, value: tagData.tagID}
  })
  data.unshift({label: defaultTag, value: -1})

  useEffect(() => {
    fetchTagData()
	}, [])

  return (
    <Dropdown
      style={styles.dropdown}
      placeholderStyle={styles.placeholderStyle}
      selectedTextStyle={styles.selectedTextStyle}
      inputSearchStyle={styles.inputSearchStyle}
      iconStyle={styles.iconStyle}
      data={data}
      search
      maxHeight={300}
      labelField="label"
      valueField="value"
      placeholder="存儲地點"
      searchPlaceholder="搜尋"
      value={value}
      onChange={item => {
        setValue(item.value);
        changeStorage(item.value);
      }}
    />
  );
};


const styles = StyleSheet.create({
  dropdown: {
    margin: 16,
    height: 50,
    width: 200,
    borderBottomColor: 'gray',
    borderBottomWidth: 0.5,
  },
  icon: {
    marginRight: 5,
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 16,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
});