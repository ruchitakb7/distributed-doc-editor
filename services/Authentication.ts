import { cookies } from "next/headers";
import jwt, { JwtPayload } from "jsonwebtoken";
import UserModel from "@/models/User";

interface TokenPayload extends JwtPayload {
  id: string;
}


export const authenticateUser = async () => {
  const cookieStore = await cookies();

  const token = cookieStore.get("auth_token")?.value;

  if (!token) {
    throw new Error("Authentication token not found.");
  }

  let decoded: TokenPayload;

  try {
    decoded = jwt.verify(
      token,
      process.env.JWT_SECRET!
    ) as TokenPayload;
  } catch (error) {
    throw new Error("Invalid or expired token.");
  }

  const user = await UserModel.findById(decoded.id).select("-password");

  if (!user) {
    throw new Error("User not found.");
  }

  return user;
};


