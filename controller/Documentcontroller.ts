import { NextResponse } from "next/server";
import { createDocument, getDocumentsByOwner } from "@/services/Documentservice";

import { authenticateUser } from "@/services/Authentication";

export const create = async (request: Request) => {
  try {
    if (request.method !== "POST") {
      return NextResponse.json(
        { success: false, message: "Method not allowed." },
        { status: 405 }
      );
    }

    const user = await authenticateUser();

    console.log("Authenticated user:", user);

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "Owner is required.",
        },
        { status: 400 }
      );
    }

    const document = await createDocument({
      owner: user.id,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Document created successfully.",
        document,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong.",
      },
      { status: 500 }
    );
  }
};

export const getByOwner = async (request: Request) => {
  try {
    if (request.method !== "GET") {
      return NextResponse.json(
        { success: false, message: "Method not allowed." },
        { status: 405 }
      );
    }

    const user = await authenticateUser();
    console.log(user,'jfjkdf')

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "Authentication required.",
        },
        { status: 401 }
      );
    }

    const documents = await getDocumentsByOwner(user.id);

    return NextResponse.json(
      {
        success: true,
        documents,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Something went wrong.",
      },
      { status: 500 }
    );
  }
};



