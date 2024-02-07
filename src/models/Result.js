const mongoose = require("mongoose");

const { Schema } = mongoose;

const DifferenceSchema = new Schema({
  type: { type: String, require: true },
  nodeId: { type: String, require: true },
  frameId: { type: String, require: true },
  differenceInformation: { type: Object, require: true },
  position: { type: Object, require: true },
});

const ResultSchema = new Schema({
  projectKey: { type: String, require: true },
  beforeVersionId: { type: String, require: true },
  afterVersionId: { type: String, require: true },
  pageId: { type: String, require: true },
  frames: { type: Array, require: true },
  differences: {
    type: Map,
    of: DifferenceSchema,
  },
});

module.exports = mongoose.model("Result", ResultSchema);
