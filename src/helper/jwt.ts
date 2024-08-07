import jwt from "jsonwebtoken";
import { Response } from "express";
import { Userentity } from "../entities/User";

export const createAccessToken = (
  user: Userentity,
  accessTokenSecretKey: string,
  expiration: string
) => {
  console.log("admin entity valid or not ",user);
  
  const token = jwt.sign({ user }, accessTokenSecretKey, {
    expiresIn: expiration,
  });
  return token;
};




export const createRefreshToken = (
  user: Userentity,
  refreshTokenSecretKey: string,
  expiration: string
) => {
  const token= jwt.sign({ user }, refreshTokenSecretKey, { 
    expiresIn: expiration, 
  });
  return token;
};




export const clearAccessTokenFromCookie = (
  cookieName: string,
  res: Response
) => {
  res.cookie(cookieName, {
    httpOnly: false,
    secure: false,
    signed: false,
    maxAge: 0,
  });
};
