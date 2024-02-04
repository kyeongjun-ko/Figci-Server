const mongoose = require("mongoose");

const { Schema } = mongoose;

const NodeSchema = new Schema({
  nodeId: { type: String, require: true },
  type: { type: String, require: true },
  children: { type: Array, require: true },
  property: { type: Object, require: true },
});

const FrameSchema = new Schema({
  frameId: { type: String, require: true },
  name: { type: String, require: true },
  nodes: [NodeSchema],
});

const PageSchema = new Schema({
  pageId: { type: String, require: true },
  name: { type: String, require: true },
  frames: [FrameSchema],
});

const DocumentSchema = new Schema({
  projectKey: { type: String, require: true },
  versionId: { type: String, require: true },
  pages: [PageSchema],
});

module.exports = mongoose.model("Document", DocumentSchema);
