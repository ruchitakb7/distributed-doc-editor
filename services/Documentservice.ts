import DocumentModel from "@/models/Document";

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
  role: "Owner" | "Editor" | "Viewer";
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

  if (collaborators !== undefined) {
    updateData.collaborators = collaborators;
  }

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