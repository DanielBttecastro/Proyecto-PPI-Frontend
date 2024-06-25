// pages/api/download-and-clean-bucket.js
const AWS = require("aws-sdk");
const archiver = require("archiver");
const { Readable } = require("stream");

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

module.exports = async (req, res) => {
  if (req.method !== "GET") {
    res.status(405).json({ message: "Method not allowed" });
    return;
  }

  try {
    const bucketName = "tdggestiondocumental";
    const folderToClean = "PPI/Tecnica/S1/";
    const archive = archiver("zip");

    res.setHeader("Content-Type", "application/zip");
    res.setHeader("Content-Disposition", "attachment; filename=backup.zip");
    archive.pipe(res);

    let continuationToken;
    let data;
    do {
      const params = {
        Bucket: bucketName,
        ContinuationToken: continuationToken,
      };

      data = await s3.listObjectsV2(params).promise();

      for (const file of data.Contents) {
        const params = { Bucket: bucketName, Key: file.Key };
        const fileData = await s3.getObject(params).promise();
        archive.append(
          fileData.Body instanceof Readable
            ? fileData.Body
            : fileData.Body.buffer(),
          { name: file.Key }
        );
      }

      continuationToken = data.NextContinuationToken;
    } while (continuationToken);

    // Limpiar la carpeta especificada en el bucket
    const objectsToDelete = data.Contents.filter((obj) =>
      obj.Key.startsWith(folderToClean)
    ).map((obj) => ({ Key: obj.Key }));
    if (objectsToDelete.length > 0) {
      await s3
        .deleteObjects({
          Bucket: bucketName,
          Delete: { Objects: objectsToDelete },
        })
        .promise();
    }

    // Volver a crear la carpeta en el bucket
    await s3
      .upload({
        Bucket: bucketName,
        Key: folderToClean,
        Body: "",
      })
      .promise();

    archive.finalize();
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
