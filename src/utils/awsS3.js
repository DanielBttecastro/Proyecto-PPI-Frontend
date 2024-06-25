import AWS from "aws-sdk";

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

const s3 = new AWS.S3();

// Función para crear una carpeta en S3

export const createFolderInS3 = async (folderPath) => {
  const params = {
    Bucket: "tdggestiondocumental",
    Key: folderPath + "/", // Agregar "/" al final para indicar que es una carpeta
    Body: "",
  };

  try {
    const data = await s3.putObject(params).promise();
    return data;
  } catch (error) {
    console.error("Error al crear la carpeta en S3:", error);

    throw error;
  }
};

// Función para subir un archivo a S3
export const uploadFileToS3 = async (file, folderName, fileName) => {
  const params = {
    Bucket: "tdggestiondocumental",
    Key: `${folderName}/${fileName}`,
    Body: file,
  };

  try {
    const data = await s3.upload(params).promise();
    return data;
  } catch (error) {
    console.error("Error al subir el archivo a S3:", error);
    throw error;
  }
};
