import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { createAccessToken } from "./jwt";
import { Adminentity } from "../entities/Admin";

interface CustomRequest extends Request {
  user?: Adminentity;
}

export const verifyUser = (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {

  const doctorAccessToken = req.cookies.doctorAccessToken;
  const doctorRefreshToken = req.cookies.doctorRefreshToken;

  if (!doctorRefreshToken) {
    return res
      .status(401)
      .json({ status: false, message: "invalid refresh token" });
  }

  jwt.verify(
    doctorAccessToken,
    process.env.ACCESS_SECRET_KEY || "",
    (err: jwt.VerifyErrors | null, decoded: any) => {
      if (err) {
        if (
          (err.name === "TokenExpiredError" ||
            err.name === "JsonWebTokenError") &&
            doctorRefreshToken
        ) {
          jwt.verify(
            doctorRefreshToken,
            process.env.ACCESS_SECRET_KEY || "",
            (errRefresh: jwt.VerifyErrors | null, decodedRefresh: any) => {
              if (errRefresh) {
                return res
                  .status(401)
                  .json({ status: false, message: "invalid refresh token" });
              }
              const user = decodedRefresh.user;

              const newAccessToken = createAccessToken(
                user,
                process.env.ACCESS_SECRET_KEY || "",
                "15m"
              );
              res.cookie("doctorAccessToken", newAccessToken, {
                maxAge: 14400000,
                httpOnly: true,
                secure: true,
                sameSite: "strict",
              });
              req.user = user;
              next();
            }
          );
        } else {
          return res.status(401).json({
            status: false,
            message: "Unauthorized - No token Provided",
          });
        }
      } else {
        const decodedUser = decoded.user as Adminentity;
        req.user = decodedUser;
        next();
      }
    }
  );
};