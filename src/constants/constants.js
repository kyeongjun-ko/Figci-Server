const CONSTANTS = {
  COMPARABLE_VERSION_NUMBER: 2,
  PAGE_NODE_DEPTH: 1,
  FRAME_NODE_DEPTH: 2,
  EXCLUDED_KEYS: {
    id: true,
    name: true,
    type: true,
    scrollBehavior: true,
    blendMode: true,
    children: true,
  },
  BUCKET_NAME: "documents",
};

module.exports = CONSTANTS;
