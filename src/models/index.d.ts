import { ModelInit, MutableModel, __modelMeta__, ManagedIdentifier } from "@aws-amplify/datastore";
// @ts-ignore
import { LazyLoading, LazyLoadingDisabled, AsyncCollection } from "@aws-amplify/datastore";

export enum StatusEnum {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  DENIED = "DENIED"
}

export enum ProgramEnum {
  PERIOD_CARE = "PERIOD_CARE",
  FOOT_HEALTH = "FOOT_HEALTH",
  SKIN_CARE = "SKIN_CARE"
}

export enum RoleEnum {
  CLIENT = "CLIENT",
  SUPPLIER = "SUPPLIER"
}



type EagerRequest = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Request, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly quantity?: number | null;
  readonly clientID: string;
  readonly productID: string;
  readonly supplierID?: string | null;
  readonly status?: StatusEnum | keyof typeof StatusEnum | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyRequest = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Request, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly quantity?: number | null;
  readonly clientID: string;
  readonly productID: string;
  readonly supplierID?: string | null;
  readonly status?: StatusEnum | keyof typeof StatusEnum | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type Request = LazyLoading extends LazyLoadingDisabled ? EagerRequest : LazyRequest

export declare const Request: (new (init: ModelInit<Request>) => Request) & {
  copyOf(source: Request, mutator: (draft: MutableModel<Request>) => MutableModel<Request> | void): Request;
}

type EagerProduct = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Product, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly name?: string | null;
  readonly description?: string | null;
  readonly quantity?: number | null;
  readonly type?: ProgramEnum | keyof typeof ProgramEnum | null;
  readonly unit?: string | null;
  readonly userID: string;
  readonly Requests?: (Request | null)[] | null;
  readonly imageKey?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyProduct = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Product, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly name?: string | null;
  readonly description?: string | null;
  readonly quantity?: number | null;
  readonly type?: ProgramEnum | keyof typeof ProgramEnum | null;
  readonly unit?: string | null;
  readonly userID: string;
  readonly Requests: AsyncCollection<Request>;
  readonly imageKey?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type Product = LazyLoading extends LazyLoadingDisabled ? EagerProduct : LazyProduct

export declare const Product: (new (init: ModelInit<Product>) => Product) & {
  copyOf(source: Product, mutator: (draft: MutableModel<Product>) => MutableModel<Product> | void): Product;
}

type EagerUser = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<User, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly first_name?: string | null;
  readonly last_name?: string | null;
  readonly email?: string | null;
  readonly mobile?: string | null;
  readonly company?: string | null;
  readonly position?: string | null;
  readonly location?: string | null;
  readonly role?: RoleEnum | keyof typeof RoleEnum | null;
  readonly Products?: (Product | null)[] | null;
  readonly Requests?: (Request | null)[] | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyUser = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<User, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly first_name?: string | null;
  readonly last_name?: string | null;
  readonly email?: string | null;
  readonly mobile?: string | null;
  readonly company?: string | null;
  readonly position?: string | null;
  readonly location?: string | null;
  readonly role?: RoleEnum | keyof typeof RoleEnum | null;
  readonly Products: AsyncCollection<Product>;
  readonly Requests: AsyncCollection<Request>;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type User = LazyLoading extends LazyLoadingDisabled ? EagerUser : LazyUser

export declare const User: (new (init: ModelInit<User>) => User) & {
  copyOf(source: User, mutator: (draft: MutableModel<User>) => MutableModel<User> | void): User;
}