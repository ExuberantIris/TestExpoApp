import { AudioRecorder } from "expo-audio";
import * as FileSystem from 'expo-file-system';
import { Platform } from "react-native";
import { stringToDate } from "../../scripts/date";
import FoodData from "../../scripts/foodData";
const textToCommandURL = "https://script.google.com/macros/s/AKfycbyUuhwzVWgVZX6_wYLzOcKd1TF5SoTB4O-GvLZl-GwnJoY2Ylvcm7gTiI6r2ifqxh4Ixw/exec"

type Command = {
  text: string
}

export async function testSth (audioRecordingRef: any, addData: Function, deleteData: Function) {
  const answer = await speechToText(audioRecordingRef)
  console.log(answer)
}

export async function processByVoiceAgent(audioRecorder: AudioRecorder, addData: Function, deleteData: Function) {
  const answer = await speechToText(audioRecorder)
    .then(text => textToCommand(text))
    .then(command => executeCommand(command, addData, deleteData))
    .catch(error => console.log(error))
}

function processSpeechResult(speech: any) {
  let longWord = ""
  for (const sentence of speech) {
    longWord += sentence.alternatives[0].transcript
  }
  return longWord
}

async function speechToText(audioRecordingRef: any): Promise<string> {
  const recordingUri = audioRecordingRef?.current?.getURI() || '';
  let base64Uri = '';

  base64Uri = await FileSystem.readAsStringAsync(recordingUri, {
    encoding: FileSystem.EncodingType.Base64,
  });
  const uri = {
    uri: base64Uri
  }
  const config = {
    encoding: Platform.OS === 'android' ? 'AMR_WB' : 'LINEAR16',
    sampleRateHertz: Platform.OS === 'android' ? 16000 : 41000,
    languageCode: "cmn-Hant-TW"
  }
  const request = {
    audio: uri,
    config: config
  }

  return window
    .fetch("https://speech.googleapis.com/v1p1beta1/speech:recognize?key=AIzaSyAdvUYZxn31Q8Wswb8S5yPDQ82cmJfXdcE",
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request)
      }
    )
    .then(response => response.json())
    .then(json => processSpeechResult(json))
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
  const commandRoughList = command.split("\n")
  const commandList = []
  for (let roughCommand in commandRoughList) {
    if (roughCommand[roughCommand.length - 1] == ";") {
      roughCommand = roughCommand.substring(0, roughCommand.length - 1)
    }
    const commandSublist = roughCommand.split(" ")
    commandList.push(commandSublist)
  }

  const addDataList: FoodData[] = []
  const deleteDataList: string[] = []
  for (let command in commandList) {
    if (command[0] == "add") {
      addDataList.push({
        id: -1,
        name: command[1],
        storeDate: new Date(),
        expireDate: stringToDate(command[2])
      })
    } else if (command[0] == "delete") {
      deleteDataList.push(command[1])
    } //else ignore
  }

  addData(addDataList)
  deleteData(deleteDataList)
}
