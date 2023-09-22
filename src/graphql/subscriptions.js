/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateRequest = /* GraphQL */ `
  subscription OnCreateRequest($filter: ModelSubscriptionRequestFilterInput) {
    onCreateRequest(filter: $filter) {
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
export const onUpdateRequest = /* GraphQL */ `
  subscription OnUpdateRequest($filter: ModelSubscriptionRequestFilterInput) {
    onUpdateRequest(filter: $filter) {
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
export const onDeleteRequest = /* GraphQL */ `
  subscription OnDeleteRequest($filter: ModelSubscriptionRequestFilterInput) {
    onDeleteRequest(filter: $filter) {
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
export const onCreateProduct = /* GraphQL */ `
  subscription OnCreateProduct($filter: ModelSubscriptionProductFilterInput) {
    onCreateProduct(filter: $filter) {
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
export const onUpdateProduct = /* GraphQL */ `
  subscription OnUpdateProduct($filter: ModelSubscriptionProductFilterInput) {
    onUpdateProduct(filter: $filter) {
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
export const onDeleteProduct = /* GraphQL */ `
  subscription OnDeleteProduct($filter: ModelSubscriptionProductFilterInput) {
    onDeleteProduct(filter: $filter) {
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
export const onCreateUser = /* GraphQL */ `
  subscription OnCreateUser($filter: ModelSubscriptionUserFilterInput) {
    onCreateUser(filter: $filter) {
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
export const onUpdateUser = /* GraphQL */ `
  subscription OnUpdateUser($filter: ModelSubscriptionUserFilterInput) {
    onUpdateUser(filter: $filter) {
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
export const onDeleteUser = /* GraphQL */ `
  subscription OnDeleteUser($filter: ModelSubscriptionUserFilterInput) {
    onDeleteUser(filter: $filter) {
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
