
import { loginUser, registerUser, resetPasswordService} from "@/services/Userservice";
import { NextResponse } from "next/server";
import { sendOtp } from "@/services/Userservice";
import { verifyOtpService } from "@/services/Otpservice";


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
      response.cookies.set("auth_token", result.token, {
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




export const sendOtpController = async (
  request: Request
) => {
  try {
    const { email, type } = await request.json();

  

    if (!email || !type) {
      return NextResponse.json(
        {
          success: false,
          message: "Email and type are required.",
        },
        {
          status: 400,
        }
      );
    }

    const response = await sendOtp({
      email,
      type,
    });

    return NextResponse.json(response, {
      status: 200,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: error.message,
      },
      {
        status: error.status || 500,
      }
    );
  }
};




export const verifyOtpController = async (request: Request) => {
  try {
    const body = await request.json();

    const result = await verifyOtpService(body);

    return NextResponse.json(result, {
      status: result.success ? 200 : 400,
    });
  } catch (error) {
    console.error("Verify OTP Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Internal server error.",
      },
      {
        status: 500,
      }
    );
  }
};


export const resetPasswordController = async (request: Request) => {
  try {
    const body = await request.json();

    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        {
          success: false,
          message: "Email and password are required.",
        },
        { status: 400 }
      );
    }

    const result = await resetPasswordService({
      email,
      password,
    });

    return NextResponse.json(result, {
      status: result.success ? 200 : 400,
    });
  } catch (error) {
    console.error("Reset Password Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Internal server error.",
      },
      { status: 500 }
    );
  }
};