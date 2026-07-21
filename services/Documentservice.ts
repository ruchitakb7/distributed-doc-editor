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
  owner: string,
  page: number,
  limit: number,
  search: string
) => {
  const skip = (page - 1) * limit;


  const query: any = {
    owner,
    isDeleted: false,
  };

  if (search.trim()) {
    query.title = {
      $regex: search,
      $options: "i",
    };
  }

  const totalDocuments = await DocumentModel.countDocuments({
    owner,
    isDeleted: false,
  });

  const documents = await DocumentModel.find(query)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  return {
    documents,
    currentPage: page,
    totalPages: Math.ceil(totalDocuments / limit),
    totalDocuments,
  };
};


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
    (item: any) => item.user.toString() === collaborator._id.toString()
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



export const getSharedDocuments = async (page: number,
  limit: number,
  search: string) => {
  const user = await authenticateUser();

  const skip = (page - 1) * limit;


  const query: any = {
    "collaborators.user": user._id,
    isDeleted: false,
  };

  if (search.trim()) {
    query.title = {
      $regex: search,
      $options: "i",
    };
  }


  const documents = await DocumentModel.find(query)
    .populate("owner", "name email")
    .sort({ updatedAt: -1 })
    .skip(skip)
    .limit(limit)

  const totalDocuments = await DocumentModel.countDocuments(query)

  return {
    documents,
    currentPage: page,
    totalPages: Math.ceil(totalDocuments / limit),
    totalDocuments,
  };
};

export const toggleDocumentTrashStatus = async (
  documentId: string,
  userId: string
) => {
  const document = await DocumentModel.findById(documentId);

  if (!document) {
    throw new Error("Document not found");
  }

  if (document.owner.toString() !== userId) {
    throw new Error("Only owner can perform this action");
  }

  document.isDeleted = !document.isDeleted;
  document.deletedAt = document.isDeleted ? new Date() : null;

  await document.save();

  return document;
};


export const getTrashedDocumentsService = async (page: number, limit: number, search: string) => {

  const user = await authenticateUser();

  const skip = (page - 1) * limit

  const query: any = {
    owner: user._id,
    isDeleted: true,
  }

  if (search.trim()) {
    query.title = {
      $regex: search,
      $options: "i",
    };
  }

  const documents = await DocumentModel.find(query)
    .sort({ updatedAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean();

  const totalDocuments = await DocumentModel.countDocuments(query)

  return {
    documents: documents,
    currentPage: page,
    totalPages: Math.ceil(totalDocuments / limit),
    totalDocuments,

  };
};

export const permanentlyDeleteDocumentService = async (
  documentId: string
) => {
  const user = await authenticateUser();

  const document = await DocumentModel.findOne({
    _id: documentId,
    owner: user._id,
    isDeleted: true,
  });

  if (!document) {
    throw new Error("Document not found.");
  }

  await DocumentModel.findByIdAndDelete(documentId);

  return;
};


export const getRecentDocumentsService = async (userId: string) => {
  const twoDaysAgo = new Date();
  twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

  const documents = await DocumentModel.find({
    isDeleted: false,
    updatedAt: { $gte: twoDaysAgo },
    $or: [
      { owner: userId },
      { "collaborators.user": userId },
    ],
  })
    .populate("owner", "name email")
    .sort({ updatedAt: -1 })
    .limit(6);

  return documents;
};