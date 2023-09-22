import { Amplify, Auth, API } from 'aws-amplify';
import { Authenticator, useAuthenticator } from '@aws-amplify/ui-react';
import { CheckboxField, TextField } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';

import awsExports from '../../src/aws-exports';
Amplify.configure(awsExports);

import * as mutations from '../../amplify/';


export default function Auth() {
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
    <Authenticator 
      formFields={formFields}
      services={{
        async validateCustomSignUp(formData) {
          let first_name = 'custom' + ':' + 'first_name'
          let last_name = 'custom' + ':' + 'last_name'
          let role = 'custom' + ':' + 'role'
          let company = 'custom' + ':' + 'company'
          let company_position = 'custom' + ':' + 'company_position'

          if 
        },
      }}
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