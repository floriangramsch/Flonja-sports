import formidable, { IncomingForm } from "formidable";
// import fs from "fs/promises";
import fs from "fs";
import path from "path";
import { defineEventHandler, readBody, createError } from "h3";

// Der API-Endpunkt
export default defineEventHandler(async (event) => {
  const method = event.node.req.method;

  if (method === "GET") {
    const { fileName } = getQuery(event);
    
    if (typeof fileName !== "string") {
      throw createError({
        statusCode: 400,
        message: "Ungültiger Dateiname",
      });
    }

    const filePath = path.resolve(process.cwd(), "../uploads/user", fileName);

    try {
      await fs.promises.access(filePath);

      const fileStream = fs.createReadStream(filePath);
      return sendStream(event, fileStream);
    } catch (error) {
      console.error(error);
      throw createError({
        statusCode: 404,
        message: `Datei nicht gefunden: ${filePath}`,
      });
    }
  }

  if (method === "POST") {
    const form = new IncomingForm({
      uploadDir: path.resolve("uploads/user"), // Zielverzeichnis
      keepExtensions: true, // Dateiendung beibehalten
    });

    try {
      // Parse die eingehende Anfrage
      const [fields, files] = await new Promise<
        [formidable.Fields, formidable.Files]
      >((resolve, reject) => {
        form.parse(event.node.req, (err, fields, files) => {
          if (err) reject(err);
          else resolve([fields, files]);
        });
      });

      // Prüfe, ob eine Datei hochgeladen wurde
      const file = files.file as formidable.File | formidable.File[]; // "file" muss mit dem FormData-Schlüssel im Frontend übereinstimmen
      if (!file) {
        throw createError({
          statusCode: 400,
          message: "Keine Datei hochgeladen",
        });
      }

      // Pfad zur hochgeladenen Datei
      const uploadedFilePath = Array.isArray(file)
        ? file[0].filepath
        : file.filepath;

      const newFileName = `${fields.name}.jpg`;
      const newFilePath = path.resolve("uploads/user", newFileName);

      fs.rename(uploadedFilePath, newFilePath, () => {});

      // Datei-URL zurückgeben
      const publicPath = `/user/${path.basename(uploadedFilePath)}`;

      return { message: "Upload erfolgreich", url: publicPath };
    } catch (error) {
      console.error(error);
      return { error: "Fehler beim Verarbeiten der Datei" };
    }
  }

  // Falls der HTTP-Methode nicht POST ist, eine Fehlermeldung
  return createError({ statusCode: 405, message: "Method Not Allowed" });
});
