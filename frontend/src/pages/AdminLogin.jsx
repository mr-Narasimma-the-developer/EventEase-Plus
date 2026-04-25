import axios from "axios"
import {useState} from "react"

function AdminLogin(){

const[email,setEmail] = useState("")
const[password,setPassword] = useState("")

const login = async()=>{

const res = await axios.post("/api/auth/admin-login",{
email,
password
})

localStorage.setItem("token",res.data.token)

window.location="/admin"

}

return(

<div>

<h2>Admin Login</h2>

<input
placeholder="email"
onChange={(e)=>setEmail(e.target.value)}
/>

<input
type="password"
placeholder="password"
onChange={(e)=>setPassword(e.target.value)}
/>

<button onClick={login}>Login</button>

</div>

)

}

export default AdminLogin