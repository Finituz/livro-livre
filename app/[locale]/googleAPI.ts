import { getSession } from "next-auth/react";

export const setDataMapIfExistsInCloud = async (
  name: string,
  identifierCode: string,
) => {
  const session: any = await getSession();

  if (!session) return;

  const query = `name = '${name}' and fullText contains '${identifierCode}'`;
  console.log("searching for ", name);
  try {
    const response = await fetch(
      `https://www.googleapis.com/drive/v3/files?q=` +
        encodeURIComponent(query),
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
        },
      },
    );
    if (response.ok) {
      const body = await response.json();

      if (body.files.length > 0) {
        const dataMapBlob: Blob = await downloadFile(body.files[0].id, name);
        const dataMap = JSON.parse(await dataMapBlob.text());

        localStorage.setItem("dataMap", JSON.stringify(dataMap));

        console.log(name, "saved as dataMap!");
      } else console.log(name, " not found in cloud! Continue..");
    } else console.log(response.status);
  } catch (error) {
    console.error(`Error: ${name} not found!: `, error);
  }
};

export const uploadFile = async (
  file: FormDataEntryValue | FormData,
  parents?: Array<string>,
  isUpdate?: { fileId: string },
): Promise<any> => {
  if (!file) return;

  const session = await getSession();

  const name: string = file["name" as keyof typeof file];

  let updateFileQuery: string = ""; // define query to update a file
  let method = isUpdate ? "PATCH" : "POST";

  const metadata = {
    name,
    parents,
  };

  const body = new FormData();
  body.append(
    "metadata",
    new Blob([JSON.stringify(metadata)], {
      type: "application/json",
    }),
  );
  body.append("file", file);

  console.log("Body Data: ", body);

  if (isUpdate?.fileId) {
    updateFileQuery = `/${isUpdate.fileId}`;
  }

  try {
    const response = await fetch(
      `https://www.googleapis.com/upload/drive/v3/files${updateFileQuery}?uploadType=multipart`,
      {
        method,
        body: body,
        headers: {
          Authorization: `Bearer ${(session as any).accessToken}`,
        },
      },
    );

    console.log(`Response upload file ${name}: `, response);
    return response;
  } catch (error) {
    console.error(`Error uploading file ${name}: `, error);
    return error;
  }
};

export const createFolder = async (
  folderName: string,
  setSendNotification: Function,
  parents?: Array<string>,
) => {
  const session: any = await getSession();
  if (!folderName || !session) return;
  const metadata = {
    name: folderName,
    parents: parents,
    mimeType: "application/vnd.google-apps.folder",
  };

  const body = new FormData();
  body.append(
    "metadata",
    new Blob([JSON.stringify(metadata)], {
      type: "application/json",
    }),
  );

  try {
    const response = await fetch(
      `https://www.googleapis.com/upload/drive/v3/files`,
      {
        method: "POST",
        body: body,
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
        },
      },
    );

    const data = await response.json();
    if (response.ok) {
      console.log(`Folder created with ID: ${data.id}`);
      console.log(response);
      setSendNotification({
        title: `📁 Folder ${folderName} created!`,
        content: "Uploaded to user's google drive.",
        author: "from upload system",
      });

      return data.id;
    } else {
      console.log(`Error: ${data.error}`);
      setSendNotification({
        title: `📁 Folder ${folderName} could no be created!`,
        content: "Could not upload folder to user's google drive.",
        author: "from upload system",
      });
    }
  } catch (error) {
    console.error("Error: creating folder:", error);
  }
};

export const downloadFile = async (
  fileId: string,
  name?: string,
): Promise<any> => {
  const session = await getSession();

  if (!fileId || !session) return;

  try {
    const response = await fetch(
      `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${(session as any).accessToken}`,
        },
      },
    );
    if (response.ok) {
      console.log(`Response upload file ${name}: `, response);

      return response;
    } else return response;
  } catch (error) {
    console.error(`Error uploading file ${name}: `, error);
    return error;
  }
};

export const deleteFile = async (
  fileId: string,
  name?: string,
): Promise<any> => {
  const session = await getSession();

  if (!fileId || !session) return;

  try {
    const response = await fetch(
      `https://www.googleapis.com/drive/v3/files/${fileId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${(session as any).accessToken}`,
        },
      },
    );

    console.log(`Response delete file ${name}: `, response);

    if (response.ok) {
      return response;
    }
  } catch (error) {
    console.error(`Error deleting file ${name}: `, error);
    return error;
  }
};
