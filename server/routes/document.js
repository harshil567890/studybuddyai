const express = require("express");
const router = express.Router();
const { auth } = require("../middleware/auth");
const {
  uploadDocument,
  getUserDocuments,
  getDocumentById,
  deleteDocument,
  renameDocument,
  getDocumentText,
} = require("../controllers/documentController");

router.post("/upload", auth, uploadDocument);
router.get("/my-documents", auth, getUserDocuments);
router.get("/:id", auth, getDocumentById);
router.get("/:id/text", auth, getDocumentText);
router.put("/:id/rename", auth, renameDocument);
router.delete("/:id", auth, deleteDocument);

module.exports = router;
