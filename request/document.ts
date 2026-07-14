export const createDocument = async () => {
  const response = await fetch("/api/document", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({}),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to create document.");
  }

  return data;
};

export const fetchDocumentsByOwner = async () => {
  const response = await fetch("/api/document", {
    method: "GET",
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch documents.");
  }

  return data;
};


export const getMyDocuments = async () => {
  try {
    const response = await fetch("/api/document", {
      method: "GET",
      credentials: "include",
    });

    const data = await response.json();

    return data;
  } catch (error) {
    console.error("Error fetching documents:", error);
    throw error;
  }
};


export const getDocumentById = async (documentId: string) => {
  try {
    const response = await fetch(`/api/document/${documentId}`, {
      method: "GET",
      credentials: "include",
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to fetch document.");
    }

    return data;
  } catch (error) {
    console.error("Error fetching document:", error);
    throw error;
  }
};


export const updateDocument = async (
  documentId: string,
  payload: {
    title?: string;
    content?: string;
  }
) => {
  try {
    const response = await fetch(`/api/document/${documentId}`, {
      method: "PATCH",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to update document.");
    }

    return data;
  } catch (error) {
    console.error("Error updating document:", error);
    throw error;
  }
};



export const shareDocument = async ({
  documentId,
  email,
  role,
}: {
  documentId: string;
  email: string;
  role: "viewer" | "editor";
}) => {
  const response = await fetch("/api/document/share", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      documentId,
      email,
      role,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message);
  }

  return data;
};


export const getSharedDocuments = async () => {
  try {
    const response = await fetch("/api/document/share", {
      method: "GET",
      credentials: "include",
    });

    const data = await response.json();

    return data;
  } catch (error) {
    console.error("Error fetching documents:", error);
    throw error;
  }
};
