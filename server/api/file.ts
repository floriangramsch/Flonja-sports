import formidable, { IncomingForm } from "formidable";
import fs from "fs/promises";
import path from "path";
import { defineEventHandler, readBody, createError } from "h3";

// Der API-Endpunkt
export default defineEventHandler(async (event) => {
  const method = event.node.req.method;

  // Nur POST-Anfragen verarbeiten
  if (method === "POST") {
    const form = new IncomingForm({
      uploadDir: path.resolve(process.cwd(), "public/user"), // Zielverzeichnis
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
      const newFilePath = path.resolve("public/user", newFileName);

      await fs.rename(uploadedFilePath, newFilePath);

      // Datei-URL zurückgeben
      const publicPath = `/user/${path.basename(newFilePath)}`;

      return { message: "Upload erfolgreich", url: publicPath };
    } catch (error) {
      console.error(error);
      return { error: "Fehler beim Verarbeiten der Datei" };
    }
  }

  // Falls der HTTP-Methode nicht POST ist, eine Fehlermeldung
  return createError({ statusCode: 405, message: "Method Not Allowed" });
});
