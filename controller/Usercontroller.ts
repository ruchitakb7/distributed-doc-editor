
import { loginUser, registerUser } from "@/services/Userservice";
import { NextResponse } from "next/server";

const handleError = (error: unknown) => {
  return NextResponse.json(
    {
      success: false,
      message: error instanceof Error ? error.message : "Something went wrong",
    },
    {
      status: 400,
    }
  );
};

export const register = async (request: Request) => {
  try {
    const body = await request.json();

    const result = await registerUser(body);

    return NextResponse.json(result, {
      status: 201,
    });
  } catch (error) {
    return handleError(error);
  }
};

export const login = async (request: Request) => {
  try {
    const body = await request.json();

    const result = await loginUser(body);
    const response = NextResponse.json(result, {
      status: 200,
    });

    if (result.success && result.token) {
      response.cookies.set("token", result.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
        maxAge: 60 * 60 * 24 * 7, // 7 days
      });
    }

    return response;
  } catch (error) {
    return handleError(error);
  }
};


