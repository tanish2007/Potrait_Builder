  // server/index.js
  require("dotenv").config();
  const express = require("express");
  const cors = require("cors");
  const multer = require("multer");
  const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
  const { fromSSO } = require("@aws-sdk/credential-providers"); // 👈 new import
  const { DeleteObjectCommand } = require("@aws-sdk/client-s3");

  const app = express();
  const upload = multer(); // for multipart/form-data

  app.use(cors());
  app.use(express.json());

  const { createClient } = require("@supabase/supabase-js");

  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY // Use service key in backend only
  );

  // ✅ SSO-based credential setup
  const s3 = new S3Client({
    region: process.env.AWS_REGION,
    credentials: fromSSO({ profile: "rethink-yearbooks" }), // 👈 uses your SSO profile
  });

  app.post("/upload", upload.single("file"), async (req, res) => {
    try {
      const { teacher, grade, homeRoom, firstName, lastName, imageFolder, fileName, volumeName } = req.body;

      const file = req.file;

    if (!file || !teacher || !grade || !homeRoom) {
    return res.status(400).json({ error: "Missing required fields" });
  }


      const cleanFileName = file.originalname.replace(/\s+/g, "_");
    const key = `${grade}/${teacher}/${homeRoom}/${cleanFileName}`;
  const s3Url = `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;



      const command = new PutObjectCommand({
        Bucket: process.env.S3_BUCKET_NAME,
        Key: key,
      Body: file.stream || file.buffer,
        ContentType: file.mimetype,
      });

      await s3.send(command);
      const { error: dbError } = await supabase
        .from("schoolname_index") // change to your actual table name
        .insert({
          volume_name: volumeName,
          image_folder: imageFolder,
          image_file_name: fileName,
          grade:grade,
          first_name: firstName,
          last_name: lastName,
          home_room: homeRoom,
          teacher_name: teacher,
          picture: s3Url,
        });

      if (dbError) {
        console.error("Supabase insert error:", dbError);
        return res.status(500).json({ error: "Upload succeeded but DB insert failed", details: dbError.message });
      }
      res.json({ success: true, key });
    } catch (error) {
      console.error("Upload error:", error);
      res.status(500).json({ error: "Failed to upload", details: error.message });
    }
  });
  app.post("/upload-to-s3", upload.single("file"), async (req, res) => {
    try {
      const { grade, teacher, homeRoom } = req.body;
      const file = req.file;

      if (!file || !grade || !teacher || !homeRoom) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      const cleanFileName = file.originalname.replace(/\s+/g, "_");
      const key = `${grade}/${teacher}/${homeRoom}/${cleanFileName}`;
      const s3Url = `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;

      const command = new PutObjectCommand({
        Bucket: process.env.S3_BUCKET_NAME,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
      });

      await s3.send(command);
      res.json({ success: true, url: s3Url });
    } catch (error) {
      console.error("Upload to S3 error:", error);
      res.status(500).json({ error: "S3 Upload failed", details: error.message });
    }
  });


  app.post("/delete-student", async (req, res) => {

    console.log("hi")
    try {
      const { studentId, s3Url } = req.body;

      if (!studentId || !s3Url) {
        return res.status(400).json({ error: "Missing studentId or s3Url" });
      }

    //   // Extract S3 Key from the URL
      const s3Key = s3Url.split(`.amazonaws.com/`)[1];

      if (!s3Key) {
        return res.status(400).json({ error: "Invalid S3 URL" });
      }

      // 1. Delete from S3
      const deleteCommand = new DeleteObjectCommand({
        Bucket: process.env.S3_BUCKET_NAME,
        Key: s3Key,
      });

      await s3.send(deleteCommand);

    //  console.log("studentId:", studentId, typeof studentId);


      // 2. Delete from Supabase
  


      const { error: deleteError } = await supabase
        .from("schoolname_index")
        .delete()
        .eq("id", studentId);

      if (deleteError) {
        console.error("Supabase deletion error:", deleteError);
        return res.status(500).json({ error: "Failed to delete student from DB" });
      }

      res.json({ success: true });
    } catch (err) {
      console.error("Delete student error:", err);
      res.status(500).json({ error: "Failed to delete student", details: err.message });
    }
  });
  app.post("/delete-from-s3", async (req, res) => {
  try {
    const { s3Url } = req.body;
    if (!s3Url) return res.status(400).json({ error: "Missing s3Url" });

    const s3Key = s3Url.split(`.amazonaws.com/`)[1];
    if (!s3Key) return res.status(400).json({ error: "Invalid S3 URL" });

    const deleteCommand = new DeleteObjectCommand({
      Bucket: process.env.S3_BUCKET_NAME,
      Key: s3Key,
    }); 

    await s3.send(deleteCommand);
    res.json({ success: true });
  } catch (err) {
    console.error("S3 delete error:", err);
    res.status(500).json({ error: "Failed to delete from S3", details: err.message });
  }
});




  const PORT = 4000;
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });