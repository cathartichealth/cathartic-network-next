import { Amplify, Auth, API, graphqlOperation } from 'aws-amplify';
import { Authenticator, useAuthenticator } from '@aws-amplify/ui-react';
import { createUser } from '../../src/graphql/mutations'
import { CheckboxField, TextField, useTheme, View, Image } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';

import awsExports from '../../src/aws-exports';
Amplify.configure(awsExports);



export default function UserAuth() {
  const createDBUser = async (formData) => {
    console.log(formData);
    let { username, attributes } = formData;
    console.log(attributes)
    const userInput = {
      input: {
        first_name: attributes['custom:first_name'],
        last_name: attributes['custom:last_name'],
        email: username,
        mobile: attributes['phone_number'],
        company: attributes['custom:company'],
        position: attributes['custom:company_position'],
        location: attributes['custom:location'],
        role: attributes['custom:role'] == "yes" ? "CLIENT" : "SUPPLIER"
      },
    };
    
    console.log(userInput)
    const response = await API.graphql(graphqlOperation(createUser, userInput))
    .then((response) => {
      console.log("success")
    })
    .catch((response) => {
      console.log("failed")
      console.log(response)
      console.log("")
    })
  }
  const components = {
    Header() {
      const { tokens } = useTheme();
  
      return (
        <View textAlign="center" padding={tokens.space.medium}>
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
        return (
          <>
            <Authenticator.SignUp.FormFields />

            <CheckboxField
              name="custom:role"
              value="yes"
              label="Check if you are a Supplier"
              size= "medium"
            />
          </>
        );
      },
    },
  }
  const services = {
    async handleSignUp (formData) {
      createDBUser(formData)
      let { username, password, attributes } = formData
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
          <h1>Hello {user.username}</h1>
          <button onClick={signOut}>Sign out</button>
        </main>
      )}
    </Authenticator>
  )
}