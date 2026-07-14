import { NextResponse } from "next/server";
import { createDocument, getDocumentsByOwner, updateDocument,getDocumentById, shareDocumentService, getSharedDocuments } from "@/services/Documentservice";

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



export const updateDocumentController = async (
  req: Request,
  documentId: string
) => {
  try {
    const { title, content } = await req.json();

    if (title === undefined && content === undefined) {
      return NextResponse.json(
        {
          success: false,
          message: "Nothing to update.",
        },
        { status: 400 }
      );
    }

    const document = await updateDocument({
      documentId,
      title,
      content,
    });

    if (!document) {
      return NextResponse.json(
        {
          success: false,
          message: "Document not found.",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Document updated successfully.",
        document,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating document:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Internal server error.",
      },
      { status: 500 }
    );
  }
};



export const getDocumentByIdController = async (
  request: Request,
  documentId: string
) => {
  try {
    const document = await getDocumentById(documentId);

    if (!document) {
      return NextResponse.json(
        {
          success: false,
          message: "Document not found.",
        },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json(
      {
        success: true,
        document,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong.",
      },
      {
        status: 500,
      }
    );
  }
};


export const shareDocumentController = async (req: Request) => {
  try {
    const { documentId, email, role } = await req.json();

    if (!documentId || !email || !role) {
      return NextResponse.json(
        {
          success: false,
          message: "Document ID, email and role are required.",
        },
        { status: 400 }
      );
    }

      const user = await authenticateUser();

    const result = await shareDocumentService({
      ownerId: user.id,
      ownerName: user.name,
      documentId,
      email,
      role,
    });

    return NextResponse.json(result, {
      status: 200,
    });
  } catch (error: any) {
    console.error("Error sharing document:", error);

    return NextResponse.json(
      {
        success: false,
        message: error.message || "Internal server error.",
      },
      {
        status: error.status || 500,
      }
    );
  }
};


export const getSharedDocumentsController = async (

) => {
  try {
    const documents = await getSharedDocuments();

    return NextResponse.json(
      {
        success: true,
        documents,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error(error);

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
