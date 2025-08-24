import { NotificationRequestInput, SchedulableTriggerInputTypes, cancelScheduledNotificationAsync, scheduleNotificationAsync } from 'expo-notifications';
import { Alert } from 'react-native';
import DateDiff from './date/dateDiff';
import { AddFoodData } from './food_database/foodData';

export async function setNotification(foodDataList: AddFoodData[]) {
  const foodNotificationIDList = await Promise.all(foodDataList.map(
    async foodData => {
      const reverseExpireDay = new DateDiff(foodData.expireDate, foodData.storeDate)
      let triggerDay: DateDiff = new DateDiff(-3)
      if (Math.abs(reverseExpireDay.getDay()) <= 5) {
        reverseExpireDay.divide(2, true)
        triggerDay = reverseExpireDay
      }

      const triggerDate = triggerDay.getShiftedDate(foodData.expireDate)
      const request: NotificationRequestInput = {
        content: {
          title: `${foodData.name}快要過期了!`,
          body: `還剩${foodData.number}個，${String(Math.abs(triggerDay.getDay()))}天後過期`
        },
        trigger: {
          type: SchedulableTriggerInputTypes.DATE,
          date: triggerDate
        }
      }

      const noteID = await scheduleNotificationAsync(request)
      console.log(`Add notification with noteID ${noteID}`)
      return noteID
    }
  )).catch((error) => { 
    Alert.alert("Error when scheduling notification", error.message)
    return []
  })
  return foodNotificationIDList as string[]
}

export async function setTempNotification() {
  const ringDate = new Date();
  ringDate.setSeconds(ringDate.getSeconds() + 3)
  const request: NotificationRequestInput = {
    content: {
      title: `胎鈄`,
      body: `巴底`
    },
    trigger: {
      type: SchedulableTriggerInputTypes.DATE,
      date: ringDate
    }
  }

  return scheduleNotificationAsync(request)
    .then((noteID) => {
      console.log(`Set notification of noteID ${noteID} success`)
      return noteID
    }).catch((error) => { 
      Alert.alert("Error when scheduling notification", error)
      return ""
  })
}

export async function deleteNotification(noteID: string) {
  await cancelScheduledNotificationAsync(noteID)
    .then(() => {
      console.log(`Delete notification with noteID ${noteID}`)
    }).catch((reject) => {
      console.log(`Failed to delete notification ${noteID}, ${reject.message}`)
    })
}