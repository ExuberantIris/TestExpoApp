import { stringToDate, takeFullDate } from "../date/date";
import { AddFoodData } from "../food_database/foodData";
const textToCommandURL = "https://script.google.com/macros/s/AKfycbyUuhwzVWgVZX6_wYLzOcKd1TF5SoTB4O-GvLZl-GwnJoY2Ylvcm7gTiI6r2ifqxh4Ixw/exec"

type Command = {
  text: string
}

export async function processByVoiceAgent(text: string, storage: number, addData: Function, deleteData: Function) {
  const answer = textToCommand(text)
    .then(command => {
      console.log(command);
      return executeCommand(command, storage, addData, deleteData);
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

function executeCommand(command: string, storage: number, addData: Function, deleteData: Function) {
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

  const addDataList: AddFoodData[] = []
  const deleteDataList: object[] = []
  for (let command of commandList) {
    if (command[0] == "add") {
      let today = takeFullDate(new Date())
      today.setHours(today.getHours())
      addDataList.push({
        name: command[1],
        number: parseInt(command[2]),
        storeDate: today,
        expireDate: stringToDate(command[3]),
        storage: storage
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
