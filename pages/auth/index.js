import { Amplify, Auth, API, graphqlOperation } from 'aws-amplify';
import { Authenticator, useAuthenticator } from '@aws-amplify/ui-react';
import { createUser } from '../../src/graphql/mutations'
import { CheckboxField, TextField, useTheme, View, Image } from '@aws-amplify/ui-react';
import { useState, useEffect } from 'react';
import Sidebar from '../../components/sidebar';

import awsExports from '../../src/aws-exports';
import { listUsers } from '@/src/graphql/queries';
Amplify.configure(awsExports);

export default function UserAuth() {
  const [currentUser, setCurrentUser] = useState(null);
  const [role, setRole] = useState('');
  useEffect(() => {
    const fetchUserData = async () => {
        try {
            const user = await Auth.currentAuthenticatedUser();
            setCurrentUser(user);
            console.log(currentUser);
            setRole(user.attributes['custom:role']);
            console.log(role);
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    };
    fetchUserData();
  }, []);

  const checkEmailExsts = async(uemail) => {
    try{
      const response = await API.graphql(graphqlOperation(listUsers, { filter: { email: { eq: uemail } , _deleted : {ne: true}} }));
      console.log(response)
      if (response.data.listUsers.items.length > 0) {
        return true
      } else {
        return false
      }
    } catch (error) {
      console.error('Error fetching email', error)
      return true
    }
    
  }

  const createDBUser = async (formData) => {
    let { username, attributes } = formData;
    console.log("first")
    console.log(formData)
    const emailExists = await checkEmailExsts(username)
    if (emailExists){
      alert("Email already exists")
      return null;
    }
    else{
      let userrole = "SUPPLIER"
      if (attributes['custom:role']===undefined){
        userrole = "CLIENT"
      }

      const userInput = {
        input: {
          first_name: attributes['custom:first_name'],
          last_name: attributes['custom:last_name'],
          email: username,
          mobile: attributes['phone_number'],
          company: attributes['custom:company'],
          position: attributes['custom:company_position'],
          location: attributes['custom:location'],
          role: userrole
        },
      };
      
      console.log("2nd", userInput)
      try {
        const response = await API.graphql(graphqlOperation(createUser, userInput));
        console.log("DBuser has been created")
        console.log(response);
        console.log("success");
        console.log(response.data.createUser.id)
        return response.data.createUser.id;
      } catch (error) {
        console.log("failed");
        console.log(error);
        return null;
      }
    }
  }
  const components = {
    Header() {
  
      return (
        <View textAlign="center">
          <Image
            alt="cathartic logo"
            src="https://www.cathartichealth.org/wp-content/uploads/2022/10/picsvg_download.svg"
            style={{ width: 200, height: 200 }}
          />
        </View>
      );
    },
    SignUp: {
      FormFields() {
        // const [isSupplier, setIsSupplier] = useState(false);

        // const handleCheckboxChange = (event) => {
        //   setIsSupplier(event.target.checked);
        // };
        return (
          <>
            <Authenticator.SignUp.FormFields />

            <CheckboxField
              name="custom:role"
              value="yes"
              label="Check if you are a Supplier"
              size="medium"
              // onChange={handleCheckboxChange}
              // checked={isSupplier}
            />
          </>
        );
      },
    },
  }
  const services = {
    async handleSignUp (formData) {
      let id = await createDBUser(formData)
      console.log(id)
      let { username, password, attributes } = formData
      console.log("HERE")
      console.log(attributes)
      let userrole = "SUPPLIER"
      if (attributes['custom:role']===undefined){
        userrole = "CLIENT"
      }
      attributes = {...attributes, 'custom:dataID': id,'custom:role':userrole }
      console.log("FINAL", attributes)
      return Auth.signUp({
        username,
        password,
        attributes,
        autoSignIn: {
          enabled: true, 
        }
      })
    }
  }

  const formFields = {
    signUp: {
      'custom:first_name': {
        order: 1,
        label: "First Name",
        placeholder: "Enter your first name",
        isRequired: true,
      },
      'custom:last_name': {
        order: 2,
        label: "Last Name",
        placeholder: "Enter your last name",
        isRequired: true,
      },
      email: {
        order: 3,
        placeholder: "Enter your email",
        isRequired: true,
      },
      phone_number: {
        order: 4,
        label: "Phone Number",
        placeholder: "Enter your phone number",
        isRequired: true,
      },
      'custom:company': {
        order: 6,
        label: "Company",
        placeholder: "Enter your company name",
        isRequired: true,
      },
      'custom:company_position': {
        order: 7,
        label: "Position",
        placeholder: "Enter your position",
        isRequired: true,
      },
      'custom:location': {
        order: 8,
        label: "Location",
        placeholder: "Enter your location",
        isRequired: true,
      },
      password: {
        order: 9,
        placeholder: "Enter your password"
      },
      confirm_password: {
        order: 10,
        placeholder: "Please confirm your password"
      }
    }
  }

  return (
    <Authenticator 
      formFields={formFields}
      services={services}
      components = {components}
    >
      {({ signOut, user }) => (
        <main>
          <div className="flex flex-row">
            <div>
              <Sidebar signOutFunction={signOut}/>
            </div>
            <div className="m-5 mt-7 text-3xl">
              <div className="text-purple-800 font-semi">
                Profile Page
              </div>
              <div className="text-sm"> 
                <div>
                  Hello {user.attributes['custom:first_name']} {user.attributes['custom:last_name']}!
                </div>
                <button onClick={signOut}>Sign out</button>
              </div>
            </div>
          </div>
        </main>
      )}
    </Authenticator>
  )
}
