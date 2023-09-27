import { Amplify } from 'aws-amplify';

import { Authenticator, useAuthenticator, useTheme, View, Image } from '@aws-amplify/ui-react';
import { CheckboxField, TextField } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';

import awsExports from '../../src/aws-exports';
Amplify.configure(awsExports);

export default function Auth() {
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
        placeholder: "Enter your email"
      },
      phone_number: {
        order: 4,
        label: "Phone Number",
        placeholder: "Enter your phone number",
      },
      'custom:role': {
        order: 5,
        label: "Role",
        placeholder: "Enter your role — either supplier or client",
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
    <Authenticator formFields={formFields} components={components}>
      {({ signOut, user }) => (
        <main>
          <h1>Hello {user.username}</h1>
          <button onClick={signOut}>Sign out</button>
        </main>
      )}
    </Authenticator>
  )
}