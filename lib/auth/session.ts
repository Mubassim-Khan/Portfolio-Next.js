import { NextApiRequest, NextApiResponse } from "next";

const SESSION_DURATION = 12 * 60 * 60 * 1000; // 12 hours

export const createSessionCookie = (
  res: NextApiResponse,
  otp: string,
  email: string
) => {
  const now = new Date();
  const expires = new Date(now.getTime() + SESSION_DURATION);

  res.setHeader("Set-Cookie", [
    `sessionEmail=${email}; HttpOnly; Path=/; Expires=${expires.toUTCString()}`,
    `otp=${otp}; HttpOnly; Path=/; Max-Age=7200`, // 2 hours
  ]);
};

export const getSessionData = (req: NextApiRequest) => {
  return {
    email: req.cookies.sessionEmail,
    otp: req.cookies.otp,
  };
};
