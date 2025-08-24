import { StyleSheet } from 'react-native';

export const tagStyle = StyleSheet.create({

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

  textInput: {
    borderWidth: 1,
    flex: 1,
    padding: 8,
    borderRadius: 8,
    borderColor: "gray",
    fontSize: 24,
  },

  header: {
    fontWeight: "bold",
    fontSize: 36,
    verticalAlign: "bottom",
  },

  contentContainer: {
    padding: 24,
    gap: 24,
    backgroundColor: "#fff",
    fontSize: 24,
  },

  contentText: {
    fontSize: 24,
  },

  flatListContainer: {
    flex: 1,
  }
});