import { AudioRecorder } from "expo-audio";
import * as FileSystem from 'expo-file-system';
import { Platform } from "react-native";
import { stringToDate } from "../../scripts/date";
import FoodData from "../../scripts/foodData";
const textToCommandURL = "https://script.google.com/macros/s/AKfycbyUuhwzVWgVZX6_wYLzOcKd1TF5SoTB4O-GvLZl-GwnJoY2Ylvcm7gTiI6r2ifqxh4Ixw/exec"

type Command = {
  text: string
}

export async function testSth (text: string, addData?: Function, deleteData?: Function) {
  const commandRoughList = text.split(";")
  const commandList = []
  for (let roughCommand of commandRoughList) {
    if (roughCommand[roughCommand.length - 1] == ";") {
      roughCommand = roughCommand.substring(0, roughCommand.length - 1)
    }
    const commandSublist = roughCommand.split(" ")
    const filteredSublist = commandSublist.filter(word => word !== "" && word !== " ")
    if (filteredSublist.length > 0) {
      commandList.push(filteredSublist)
    }
  }
  console.log(commandRoughList, commandList)
  const addDataList: FoodData[] = []
  const deleteDataList: string[] = []
  for (let command of commandList) {
    if (command[0] == "add") {
      let today = new Date()
      today.setHours(today.getHours() + 8)
      addDataList.push({
        id: -1,
        name: command[1],
        number: parseInt(command[2]),
        storeDate: today,
        expireDate: stringToDate(command[3])
      })
    } else if (command[0] == "delete") {
      deleteDataList.push(command[1])
    } //else ignore
  }
}

export async function processByVoiceAgent(text: string, addData: Function, deleteData: Function) {
  const answer = textToCommand(text)
    .then(command => {
      console.log(command);
      return executeCommand(command, addData, deleteData);
    })
    .catch(error => console.log(error))
}

function textToCommand(text: string): Promise<string> {
  return window
    .fetch(textToCommandURL, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: text
      }),
    })
    .then(response => response.json())
    .then(json => json.content)
}

function executeCommand(command: string, addData: Function, deleteData: Function) {
  const commandRoughList = command.split(";")
  const commandList = []
  for (let roughCommand of commandRoughList) {
    if (roughCommand[roughCommand.length - 1] == ";") {
      roughCommand = roughCommand.substring(0, roughCommand.length - 1)
    }
    const commandSublist = roughCommand.split(" ")
    const filteredSublist = commandSublist.filter(word => word !== "" && word !== " ")
    if (filteredSublist.length > 0) {
      commandList.push(filteredSublist)
    }
  }

  const addDataList: FoodData[] = []
  const deleteDataList: object[] = []
  for (let command of commandList) {
    if (command[0] == "add") {
      let today = new Date()
      today.setHours(today.getHours() + 8)
      addDataList.push({
        id: -1,
        name: command[1],
        number: parseInt(command[2]),
        storeDate: today,
        expireDate: stringToDate(command[3])
      })
    } else if (command[0] == "delete") {
      deleteDataList.push({
        name: command[1],
        number: command[2] === "all" ? "all" : parseInt(command[2])
      })
    } //else ignore
  }

  addData(addDataList)
  deleteData(deleteDataList)
}
