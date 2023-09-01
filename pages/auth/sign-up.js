// AMPLIFY CONFIG
import { Amplify, Auth, API } from "aws-amplify";

// REACT
import { useState } from "react";
import { useRouter } from 'next/router';

export default function SignUp(){
    const router = useRouter()
    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [password, setPassword] = useState("")
    const [username, setUsername] = useState("")
    const [phone, setPhone] = useState("")
    const [company, setCompany] = useState("")
    const [position, setPosition] = useState("")
    const [location, setLocation] = useState("")
    const [confirm, setConfirm] = useState("")

    const formatMobile = (p) =>{
        // add case if user enters with hyphens
        p.replace(/(\d{3})(\d{3})(\d{4})/, "$1-$2-$3")
        return p;
    }
    
    const signUp = async () => {
        try {
            if (firstName === "" || lastName === "") {
            throw new Error("First and last name cannot be empty")
            }
            await Auth.signUp( {username, password })
            console.log("Successfully signed up!")
            confirmSignUp
        } catch(error) {
            console.log(error)
        }
    }

    const cache = (key, data) => {
        const dataString = JSON.stringify(data)
        localStorage.setItem(key, dataString)
    }
    
    const storeUser = async() => {
        const userDetails = {
          first_name: firstName,
          last_name: lastName,
          email: username,
          mobile: formatMobile(phone),
          company: company,
          position: position,
          location: location,
        }
        cache("user", userDetails)
        try {
          await API.graphql({
            query: mutations.createUser,
            variables: {input: userDetails}
          })
          console.log("Added user to database!")
          router.push("/profile")
        } catch(e) {
          console.log(e)
        }
      }
    
    const confirmSignUp = async() => {
        try {
            await Auth.confirmSignUp(username, confirm)
            console.log("User confirmed sign up!")
            
            // setIsConfirmed(!isConfirmed)
            await storeUser()
        } catch(error) {
            console.log(error)
        }
    }
    
    const renderAuthStatus = () => {
        if (authStatus !== "") {
            return (
            <div style={{ fontWeight: "regular", color: "red", textAlign: "center", fontSize: "14px" }}>
                {authStatus}
            </div>
            );
        }
        return null;
    };
    

    return(
        <div>
            <div> 
                <h1> 
                    User Sign-Up 
                </h1> 
            </div>
            <div>
                <div style={{margin: 10}}>
                    <label> First Name </label>
                    <input type="text" onChange={(e) => {setFirstName(e.target.value);}}></input>
                </div>
                <div style={{margin: 10}}>
                    <label> Last Name </label>
                    <input type="text" onChange={(e) => {setLastName(e.target.value);}}></input>
                </div>
                
                <div style={{margin: 10}}>
                    <label> Email </label>
                    <input type="text" onChange={(e) => {setUsername(e.target.value);}}></input>
                </div>
                <div style={{margin: 10}}>
                    <label> Phone </label>
                    <input type="text" onChange={(e) => {setPhone(e.target.value);}}></input>
                </div>
                <div style={{margin: 10}}>
                    <label> Company </label>
                    <input type="text" onChange={(e) => {setCompany(e.target.value);}}></input>
                </div>
                <div style={{margin: 10}}>
                    <label> Position </label>
                    <input type="text" onChange={(e) => {setPosition(e.target.value);}}></input>
                </div>
                <div style={{margin: 10}}>
                    <label> Location </label>
                    <input type="text" onChange={(e) => {setLocation(e.target.value);}}></input>
                </div>
                <div style={{margin: 10}}>
                    <label> Password </label>
                    <input type="text" onChange={(e) => {setPassword(e.target.value);}}></input>
                </div>
                <button onClick={signUp}> Sign Up </button>
                <div style={{margin: 10}}>
                    <label> Confirmation </label>
                    <input type="text" onChange={(e) => {setConfirm(e.target.value);}}></input>
                </div>
                <button onClick={confirmSignUp}> Confirm </button>
            </div>
        </div>
    )
}