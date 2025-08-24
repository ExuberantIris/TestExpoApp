export default interface FoodData {
  id: number,
  name: string,
  number: number,
  storeDate: Date,
  expireDate: Date
  storage: number
  noteID: string
}

export interface AddFoodData {
  name: string, 
  number: number,
  storeDate: Date,
  expireDate: Date,
  storage: number
}