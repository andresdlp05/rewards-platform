import { Document } from 'mongoose';

export interface User {
  id?: string;
  username: string;
  email: string;
  points: number;
  level: number;
  achievements: any[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface UserDocument extends Document, Omit<User, 'id'> {
  _id: any;
}