import React from "react";
import { GoogleLogin, googleLogout } from "@react-oauth/google";
import type { CredentialResponse } from "@react-oauth/google";
// You might need to install jwt-decode for easy access to user info from the credential
// npm install jwt-decode
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

interface UserProfile {
  name: string;
  email: string;
  picture: string;
}

const GoogleAuth = () => {
  const [profile, setProfile] = React.useState<UserProfile | null>(null);

  const navigate = useNavigate();

  const onSuccess = (credentialResponse: CredentialResponse) => {
    if (credentialResponse.credential) {
      const decoded: UserProfile = jwtDecode(credentialResponse.credential);
      setProfile(decoded);
      console.log("Login Success:", decoded);
      const userData = {
        ...decoded,
        role: "user",
      };
      localStorage.setItem("UserData", JSON.stringify(userData));
    }

    localStorage.setItem("token", credentialResponse.credential || "");
    navigate("/");
  };

  const onError = () => {
    console.log("Login Failed");
  };

  return (
    <div>
      <GoogleLogin onSuccess={onSuccess} onError={onError} />
    </div>
  );
};

export default GoogleAuth;
