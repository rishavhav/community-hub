import React from "react"
import { useRecoilValue } from "recoil"
import { authViewState } from "../recoil/authViewAtom"
import Login from "../Components/Login"
import ForgotPassword from "../Components/ForgotPassword"

function LoginPage() {
  const authView = useRecoilValue(authViewState)

  return <>{authView === "login" ? <Login /> : <ForgotPassword />}</>
}

export default LoginPage
