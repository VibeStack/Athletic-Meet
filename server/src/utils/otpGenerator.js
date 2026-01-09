export const otpGenerator = () => {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  return Number(otp);
};
