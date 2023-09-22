// @ts-check
import { initSchema } from '@aws-amplify/datastore';
import { schema } from './schema';

const ProgramEnum = {
  "PERIOD_CARE": "PERIOD_CARE",
  "FOOT_HEALTH": "FOOT_HEALTH",
  "SKIN_CARE": "SKIN_CARE"
};

const RoleEnum = {
  "CLIENT": "CLIENT",
  "SUPPLIER": "SUPPLIER"
};

const { Request, Product, User } = initSchema(schema);

export {
  Request,
  Product,
  User,
  ProgramEnum,
  RoleEnum
};