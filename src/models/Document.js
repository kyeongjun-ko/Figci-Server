const mongoose = require("mongoose");

const { Schema } = mongoose;

const NodeSchema = new Schema({
  nodeId: { type: String, require: true },
  type: { type: String, require: true },
  frameId: { type: String, require: true },
  property: { type: Object, require: true },
});

const FrameSchema = new Schema({
  frameId: { type: String, require: true },
  name: { type: String, require: true },
  property: { type: Object, require: true },
  nodes: {
    type: Map,
    of: NodeSchema,
  },
});

const PageSchema = new Schema({
  pageId: { type: String, require: true },
  name: { type: String, require: true },
  frames: {
    type: Map,
    of: FrameSchema,
  },
});

const DocumentSchema = new Schema({
  projectKey: { type: String, require: true },
  versionId: { type: String, require: true },
  pages: {
    type: Map,
    of: PageSchema,
  },
});

module.exports = mongoose.model("Document", DocumentSchema);
