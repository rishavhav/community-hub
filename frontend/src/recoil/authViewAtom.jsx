import { atom } from "recoil"

export const authViewState = atom({
  key: "authViewState",
  default: "login",
})
