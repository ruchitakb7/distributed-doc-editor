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