import { StyleSheet } from 'react-native';
import { configureLayoutAnimationBatch } from 'react-native-reanimated/lib/typescript/core';

export const indexStyle = StyleSheet.create({

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

  contentTextII: {
    fontSize: 18,
  },

  flatListContainer: {
    flex: 1,
  },

  queryContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center"
  },

  emptyContainer: {
    width: 0,
    height: 0,
    padding: 0,
    margin: 0,
    backgroundColor: "#000",
  }
});