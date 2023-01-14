import { IChoice } from "./choice";

export interface IAnswerStore {
  [key: string]: IChoice[] // key is the question ID
}
