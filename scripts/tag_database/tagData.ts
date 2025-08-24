export default interface TagData {
  tagID: number
  name: string
  parentID: number
}

export interface AddTagData {
  name: string
  parentID: number | null
}

export interface UpdateTagData {
  tagID: number
  changedName: string | undefined
  changedParentID: number | null | undefined
}