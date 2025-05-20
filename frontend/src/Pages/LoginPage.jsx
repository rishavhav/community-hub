import React from "react"
import { useRecoilValue } from "recoil"
import { authViewState } from "../recoil/authViewAtom"
import Login from "../components/Login.jsx"
import ForgotPassword from "../components/ForgotPassword.jsx"

function LoginPage() {
  const authView = useRecoilValue(authViewState)

  return <>{authView === "login" ? <Login /> : <ForgotPassword />}</>
}

export default LoginPage
