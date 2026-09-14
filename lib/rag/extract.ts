import mammoth from "mammoth";
import { PDFParse } from "pdf-parse";

export async function extractPages(file: File): Promise<string[]> {
  const buffer = Buffer.from(await file.arrayBuffer());
  const ext = file.name.split(".").pop()?.toLowerCase();

  if (ext === "pdf") {
    const parser = new PDFParse({ data: buffer });
    const result = await parser.getText();
    await parser.destroy();
    return result.pages.map((p) => p.text);
  }

  if (ext === "docx") {
    const result = await mammoth.extractRawText({ buffer });
    return [result.value]; // .docx no tiene un concepto claro de "página"
  }

  if (ext === "txt") {
    return [buffer.toString("utf-8")];
  }

  throw new Error(`Tipo de archivo no soportado: .${ext}`);
}