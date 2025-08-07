const SESSION_DURATION = 12 * 60 * 60 * 1000; // 12 hours

export const createSessionCookie = (res: any, otp: string, email: string) => {
  const now = new Date();
  const expires = new Date(now.getTime() + SESSION_DURATION);

  res.setHeader("Set-Cookie", [
    `sessionEmail=${email}; HttpOnly; Path=/; Expires=${expires.toUTCString()}`,
    `otp=${otp}; HttpOnly; Path=/; Max-Age=7200`, // 2 hours
  ]);
};

export const getSessionData = (req: any) => {
  const cookies = req.cookies;
  return {
    email: cookies.sessionEmail,
    otp: cookies.otp,
  };
};
