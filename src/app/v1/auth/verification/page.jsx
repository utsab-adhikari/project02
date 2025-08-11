import React from "react";
import SendVerificationPage from "./VerificationPage";

export const metadata = {
  title: "Email Verification | Kalamkunja",
  description:
    "Verify your Email account to read, write, and engage with insightful articles from across disciplines.",
  alternates: {
    canonical: "https://Kalamkunja.com/v1/verification",
  },
};

const EmailVerificationPage = () => {
  return <SendVerificationPage />;
};

export default EmailVerificationPage;
