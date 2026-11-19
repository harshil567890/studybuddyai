const Document = require("../models/Document");
const { extractTextFromPDF } = require("../utils/pdfParser");
const { chunkText } = require("../utils/textChunker");
const fs = require("fs");
const path = require("path");

exports.uploadDocument = async (req, res) => {
  try {
    const file = req.files?.file;
    const { title } = req.body;

    if (!file) {
      return res.status(400).json({ success: false, message: "No file uploaded" });
    }

    const fileName = file.name;
    const fileSize = file.size;
    const ext = path.extname(fileName).toLowerCase();

    // Create uploads folder if not exists
    const uploadsDir = path.join(__dirname, "../../uploads");
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    const savedFilePath = path.join(uploadsDir, `${Date.now()}-${fileName}`);
    await file.mv(savedFilePath);

    let extractedText = "";
    if (ext === ".pdf") {
      const pdfData = await extractTextFromPDF(savedFilePath);
      extractedText = pdfData.text;
    } else {
      // Text file
      extractedText = fs.readFileSync(savedFilePath, "utf8");
    }

    const chunks = chunkText(extractedText);

    const newDoc = await Document.create({
      userId: req.user.id,
      title: title || fileName.replace(/\.[^/.]+$/, ""),
      fileName,
      fileSize,
      fileType: ext.replace(".", ""),
      filePath: savedFilePath,
      extractedText,
      chunks: chunks.map((c) => ({
        content: c.content,
        chunkIndex: c.chunkIndex,
        pageNumber: c.pageNumber || 0,
      })),
      status: "ready",
    });

    return res.status(201).json({
      success: true,
      data: newDoc,
      message: "Document uploaded and parsed successfully",
    });
  } catch (error) {
    console.error("Document upload error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.getUserDocuments = async (req, res) => {
  try {
    const docs = await Document.find({ userId: req.user.id })
      .select("-extractedText -chunks")
      .sort({ createdAt: -1 });

    return res.status(200).json({ success: true, data: docs });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.getDocumentById = async (req, res) => {
  try {
    const { id } = req.params;
    const doc = await Document.findOne({ _id: id, userId: req.user.id });

    if (!doc) {
      return res.status(404).json({ success: false, message: "Document not found" });
    }

    return res.status(200).json({ success: true, data: doc });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteDocument = async (req, res) => {
  try {
    const { id } = req.params;
    const doc = await Document.findOneAndDelete({ _id: id, userId: req.user.id });

    if (!doc) {
      return res.status(404).json({ success: false, message: "Document not found" });
    }

    if (doc.filePath && fs.existsSync(doc.filePath)) {
      try {
        fs.unlinkSync(doc.filePath);
      } catch (e) {}
    }

    return res.status(200).json({ success: true, message: "Document deleted" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.renameDocument = async (req, res) => {
  try {
    const { id } = req.params;
    const { title } = req.body;
    if (!title) {
      return res.status(400).json({ success: false, message: "Title is required" });
    }

    const doc = await Document.findOneAndUpdate(
      { _id: id, userId: req.user.id },
      { title: title.trim() },
      { new: true }
    );

    if (!doc) {
      return res.status(404).json({ success: false, message: "Document not found" });
    }

    return res.status(200).json({ success: true, data: doc, message: "Document renamed" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.getDocumentText = async (req, res) => {
  try {
    const { id } = req.params;
    const doc = await Document.findOne({ _id: id, userId: req.user.id });

    if (!doc) {
      return res.status(404).json({ success: false, message: "Document not found" });
    }

    return res.status(200).json({
      success: true,
      data: {
        title: doc.title,
        extractedText: doc.extractedText || "No text could be extracted from this file.",
        summary: doc.summary,
        chunksCount: doc.chunks?.length || 0,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

