import { scheduleNotificationAsync, SchedulableTriggerInputTypes, NotificationRequestInput } from 'expo-notifications';
import { Alert } from 'react-native';
import FoodData from './foodData';
import { dateToString } from './date';

async function setNotification(foodDataList: FoodData[]) {
  const foodNotificationIDList = await Promise.all(foodDataList.map(
    async foodData => {
      const triggerBeforeDate = 3
      const triggerDate = new Date(foodData.expireDate.getTime())
      triggerDate.setDate(triggerDate.getDate() - triggerBeforeDate)

      const today = new Date();
      const timeDiffMs = foodData.expireDate.valueOf() - today.valueOf();
      let timeDiff: string | number = Math.floor(timeDiffMs / (1000*60*60*24))
      if (timeDiff <= 0) {
        timeDiff = "不到一"
      }
      const request: NotificationRequestInput = {
        content: {
          title: `${foodData.name}快要過期了!`,
          body: `還剩${foodData.number}個，${timeDiff}天後過期`
        },
        trigger: {
          type: SchedulableTriggerInputTypes.DATE,
          date: triggerDate
        }
      }
      const noteID = scheduleNotificationAsync(request)
      return noteID
    }
  )).catch((error) => { 
    Alert.alert("Error when scheduling notification", error)
    return []
  })
  return foodNotificationIDList as string[]
}