import DocumentModel from "@/models/Document";
import User from "@/models/User";
import { EMAIL_ACTION } from "@/constant/emailAction";
import { sendEmail } from "../services/Emailservice";
import { authenticateUser } from "./Authentication";

interface ShareDocumentParams {
  ownerId: string;
  ownerName: string;
  documentId: string;
  email: string;
  role: "viewer" | "editor";
}

interface CreateDocumentPayload {
  title?: string;
  owner: string;
}

export const createDocument = async ({
  owner,
}: CreateDocumentPayload) => {
  const document = await DocumentModel.create({
    title: "Untitled Document",
    owner,
  });

  return document;
};



export const getDocumentsByOwner = async (
  owner: string
) => {
  const documents = await DocumentModel.find({
    owner,
  }).sort({ createdAt: -1 });

  return documents;
};


interface Collaborator {
  user: string;
  role: "editor" | "viewer";
}

interface UpdateDocumentPayload {
  documentId: string;
  title?: string;
  content?: string;
  collaborators?: Collaborator[];
}

export const updateDocument = async ({
  documentId,
  title,
  content,
  collaborators,
}: UpdateDocumentPayload) => {
  const updateData: Record<string, any> = {};

  if (title !== undefined) {
    updateData.title = title;
  }

  if (content !== undefined) {
    updateData.content = content;
  }

//   if (collaborators !== undefined) {
//     updateData.collaborators = collaborators;
//   }

  const document = await DocumentModel.findByIdAndUpdate(
    documentId,
    updateData,
    {
      new: true,
      runValidators: true,
    }
  );

  return document;
};


export const getDocumentById = async (documentId: string) => {
  const document = await DocumentModel.findById(documentId)
    .populate("owner", "name email")
    .populate("collaborators.user", "name email");

  return document;
};



export const shareDocumentService = async ({
  ownerId,
  documentId,
  email,
  role,
}: ShareDocumentParams) => {
  const normalizedRole =
    role.toLowerCase() === "editor" ? "editor" : "viewer";

  // Find document and populate owner details
  const document = await DocumentModel.findById(documentId).populate(
    "owner",
    "name email"
  );

  if (!document) {
    throw {
      status: 404,
      message: "Document not found.",
    };
  }

  // Only owner can share
  if (document.owner._id.toString() !== ownerId) {
    throw {
      status: 403,
      message: "You are not authorized to share this document.",
    };
  }

  // Find recipient by email
  const collaborator = await User.findOne({
    email: email.trim().toLowerCase(),
  });

  if (!collaborator) {
    throw {
      status: 404,
      message: "No user found with this email.",
    };
  }

  // Prevent sharing with yourself
  if (collaborator._id.toString() === ownerId) {
    throw {
      status: 400,
      message: "You already own this document.",
    };
  }

  // Check if already a collaborator
  const alreadyCollaborator = document.collaborators.some(
    (item:any) => item.user.toString() === collaborator._id.toString()
  );

  if (alreadyCollaborator) {
    throw {
      status: 400,
      message: "User already has access to this document.",
    };
  }

  // Add collaborator
  document.collaborators.push({
    user: collaborator._id,
    role: normalizedRole,
    addedAt: new Date(),
  });

  // Normalize any existing collaborator roles to lowercase to avoid
  // Mongoose enum validation errors for legacy uppercase values.
  document.collaborators = document.collaborators.map((c: any) => ({
    ...c,
    role: typeof c.role === "string" ? c.role.toLowerCase() : c.role,
  }));

  await document.save();

  // Send email notification
  await sendEmail({
    to: collaborator.email,
    action: EMAIL_ACTION.SHARE_DOCUMENT,
    data: {
      userName: collaborator.name,
      ownerName: (document.owner as any).name,
      documentTitle: document.title,
      role,
    },
  });

  return {
    success: true,
    message: "Document shared successfully.",
  };
};



export const getSharedDocuments = async () => {
  const user = await authenticateUser();

  const documents = await DocumentModel.find({
    "collaborators.user": user._id,
  })
    .populate("owner", "name email")
    .sort({ updatedAt: -1 });

  return documents;
};