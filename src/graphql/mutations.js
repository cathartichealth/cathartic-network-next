/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createRequest = /* GraphQL */ `
  mutation CreateRequest(
    $input: CreateRequestInput!
    $condition: ModelRequestConditionInput
  ) {
    createRequest(input: $input, condition: $condition) {
      id
      productId
      quantity
      userID
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
    }
  }
`;
export const updateRequest = /* GraphQL */ `
  mutation UpdateRequest(
    $input: UpdateRequestInput!
    $condition: ModelRequestConditionInput
  ) {
    updateRequest(input: $input, condition: $condition) {
      id
      productId
      quantity
      userID
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
    }
  }
`;
export const deleteRequest = /* GraphQL */ `
  mutation DeleteRequest(
    $input: DeleteRequestInput!
    $condition: ModelRequestConditionInput
  ) {
    deleteRequest(input: $input, condition: $condition) {
      id
      productId
      quantity
      userID
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
    }
  }
`;
export const createProduct = /* GraphQL */ `
  mutation CreateProduct(
    $input: CreateProductInput!
    $condition: ModelProductConditionInput
  ) {
    createProduct(input: $input, condition: $condition) {
      id
      name
      description
      quantity
      type
      unit
      userID
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
    }
  }
`;

export const updateProduct = /* GraphQL */ `
  mutation UpdateProduct(
    $input: UpdateProductInput!
    $condition: ModelProductConditionInput
  ) {
    updateProduct(input: $input, condition: $condition) {
      id
      name
      description
      quantity
      type
      unit
      userID
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
    }
  }
`;
export const deleteProduct = /* GraphQL */ `
  mutation DeleteProduct(
    $input: DeleteProductInput!
    $condition: ModelProductConditionInput
  ) {
    deleteProduct(input: $input, condition: $condition) {
      id
      name
      description
      quantity
      type
      unit
      userID
      createdAt
      updatedAt
      _deleted
      _version
      _lastChangedAt
    }
  }
`;
export const createUser = /* GraphQL */ `
  mutation CreateUser(
    $input: CreateUserInput!
    $condition: ModelUserConditionInput
  ) {
    createUser(input: $input, condition: $condition) {
      id
      first_name
      last_name
      email
      mobile
      company
      position
      location
      role
      Products {
        nextToken
        startedAt
      }
      Requests {
        nextToken
        startedAt
      }
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
    }
  }
`;
export const updateUser = /* GraphQL */ `
  mutation UpdateUser(
    $input: UpdateUserInput!
    $condition: ModelUserConditionInput
  ) {
    updateUser(input: $input, condition: $condition) {
      id
      first_name
      last_name
      email
      mobile
      company
      position
      location
      role
      Products {
        nextToken
        startedAt
      }
      Requests {
        nextToken
        startedAt
      }
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
    }
  }
`;
export const deleteUser = /* GraphQL */ `
  mutation DeleteUser(
    $input: DeleteUserInput!
    $condition: ModelUserConditionInput
  ) {
    deleteUser(input: $input, condition: $condition) {
      id
      first_name
      last_name
      email
      mobile
      company
      position
      location
      role
      Products {
        nextToken
        startedAt
      }
      Requests {
        nextToken
        startedAt
      }
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
    }
  }
`;
