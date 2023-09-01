// AMPLIFY CONFIG
import { Amplify, Auth, API } from "aws-amplify";

// REACT
import { useState } from "react";
import { useRouter } from 'next/router';

export default function SignIn(){
    const router = useRouter()
    const [userEmail, setUserEmail] = useState("");
    const [userPassword, setUserPassword] = useState("");
    const [authStatus, setAuthStatus] = useState("");

    const userAuthentication = async () => {
        try {
            await Auth.signIn(userEmail, userPassword)
            .then(() => {
                console.log("user signed in");
                storeUser();
                setAuthStatus("");
            })
        } catch (e) {
            console.log("error signing in", e);
            setAuthStatus("user not found");
        }
    };

    const formatMobile = (p) =>{
        // add case if user enters with hyphens
        p.replace(/(\d{3})(\d{3})(\d{4})/, "$1-$2-$3")
        return p;
    }

    const cache = (key, data) => {
        const dataString = JSON.stringify(data)
        localStorage.setItem(key, dataString)
    }

    const storeUser = async () => {
        console.log("storing user")
        try{
            await Auth.currentAuthenticatedUser()
            .then(async (awsData) => {
                const email = awsData.attributes.email
                console.log(email)
                await API.graphql({
                    query: queries.getUserViaEmail,
                    variables: {
                        email: email
                    }
                })
                .then((queryResult) => {
                    console.log("no malformed data")
                    if(queryResult.data.listUsers.items){
                        console.log("some valid data")
                        console.log(queryResult.data.listUsers.items)
                        let foundUser = findUser(email, queryResult.data.listUsers.items)
                        if(!foundUser){
                            console.log("Couldn't store user info!")
                            // display some error on screen
                        }
                        else{
                            console.log("navigating to profile page")
                            router.push("/profile")
                        }
                    }
                    else{
                        console.log(queryResult.errors)
                    }
                })
                .catch((queryResult) => {
                    console.log("some malformed data // couldn't fetch user")
                })
            })
        }
        catch (e) {
            console.log(e)
        }
    }

    const findUser = (email, userList) => {
        for(let idx in userList){
            let cUser = userList[idx]
            if (!cUser) continue
            
            if(cUser["email"] === email){
                console.log("we have a match")
                const userDetails = {
                    first_name: cUser["first_name"],
                    last_name: cUser["last_name"],
                    email: email,
                    mobile: formatMobile(cUser["mobile"]),
                    company: cUser["company"],
                    position: cUser["position"],
                    location: cUser["location"],
                }
                console.log(userDetails)
                cache("user", userDetails)
                return true
            }
        }
    }
    
    const renderAuthStatus = () => {
        if (authStatus === "user not found") {
            return (
            <div style={{ fontWeight: "regular", color: "red", textAlign: "center", fontSize: "14px" }}>
                Incorrect email or password. Please try again
            </div>
            );
        }
        return null;
    };
    return(
        <div>
            <div> 
                <h1> 
                    User Sign-In 
                </h1> 
            </div>
            <div>
                <div style={{margin: 10}}>
                    <label> Email </label>
                    <input type="text" onChange={(e) => {setUserEmail(e.target.value);}}></input>
                </div>
                <div style={{margin: 10}}>
                    <label> Password </label>
                    <input type="text" onChange={(e) => {setUserPassword(e.target.value);}}></input>
                </div>
                <button onClick={userAuthentication}> Sign In </button>
            </div>
        </div>
    )
}