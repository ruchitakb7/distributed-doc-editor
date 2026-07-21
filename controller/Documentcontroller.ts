import { NextResponse } from "next/server";
import { createDocument, getDocumentsByOwner, updateDocument,getDocumentById, getTrashedDocumentsService, getRecentDocumentsService,
  shareDocumentService, getSharedDocuments , toggleDocumentTrashStatus, permanentlyDeleteDocumentService } from "@/services/Documentservice";

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

export const getByOwner = async (request: Request,page:number,limit:number,search:string) => {
  try {
    if (request.method !== "GET") {
      return NextResponse.json(
        { success: false, message: "Method not allowed." },
        { status: 405 }
      );
    }

    const user = await authenticateUser();

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "Authentication required.",
        },
        { status: 401 }
      );
    }

    const documents = await getDocumentsByOwner(user.id,page,limit,search);

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


export const getSharedDocumentsController = async (request:Request,page:number,limit:number,search:string

) => {
  try {
    const documents = await getSharedDocuments(page,limit,search);

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

export const toggleDocumentTrashController = async (
  request: Request,
  documentId: string
) => {
  try {
    const user = await authenticateUser();

    const document = await toggleDocumentTrashStatus(
      documentId,
      user._id.toString()
    );

    return NextResponse.json({
      success: true,
      message: document.isDeleted
        ? "Document moved to Trash successfully."
        : "Document restored successfully.",
      document,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Something went wrong",
      },
      {
        status:
          error.message === "Document not found"
            ? 404
            : error.message === "Only owner can perform this action"
            ? 403
            : 500,
      }
    );
  }
};



export const getTrashedDocumentsController = async (request:Request,page:number,limit:number,search:string) => {
  try {
    const documents = await getTrashedDocumentsService(page,limit,search);

    return NextResponse.json(
      {
        success: true,
        message: "Trashed documents fetched successfully.",
        documents: documents,
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Failed to fetch trashed documents.",
      },
      { status: 500 }
    );
  }
};


export const permanentlyDeleteDocumentController = async (
  { params }: { params: Promise<{ documentId: string }> }
) => {
  try {
    const { documentId } = await params;

    await permanentlyDeleteDocumentService(documentId);

    return NextResponse.json(
      {
        success: true,
        message: "Document permanently deleted successfully.",
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Failed to permanently delete document.",
      },
      { status: 500 }
    );
  }
};


export const getRecentDocumentsController = async (request: Request) => {
  try {
    if (request.method !== "GET") {
      return NextResponse.json(
        {
          success: false,
          message: "Method not allowed.",
        },
        { status: 405 }
      );
    }

    const user = await authenticateUser();

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized.",
        },
        { status: 401 }
      );
    }

    const documents = await getRecentDocumentsService(user.id);

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
        message: "Something went wrong.",
      },
      { status: 500 }
    );
  }
};