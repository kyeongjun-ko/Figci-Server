const CONSTANT = require("../constants/constants");

const saveFigmaDataAsNestedStructure = async (
  node,
  parent = null,
  depth = 0,
  currentFrameId = "",
) => {
  if (depth === 0 && node.type === "DOCUMENT") {
    parent = { pages: [] };
  }

  if (node.children) {
    node.children.forEach((child) => {
      saveFigmaDataAsNestedStructure(child, parent, depth + 1);
    });
  }

  if (node.type === "CANVAS" && depth === CONSTANT.PAGE_NODE_DEPTH) {
    const newPage = { pageId: node.id, name: node.name, frames: [] };

    if (parent.pages) {
      parent.pages.push(newPage);
    }

    node.children.forEach((child) =>
      saveFigmaDataAsNestedStructure(child, newPage, depth + 1),
    );
  } else if (node.type === "FRAME" && depth === CONSTANT.FRAME_NODE_DEPTH) {
    const newFrame = { frameId: node.id, name: node.name, nodes: [] };

    if (parent.frames) {
      parent.frames.push(newFrame);
    }

    node.children.forEach((child) =>
      saveFigmaDataAsNestedStructure(child, newFrame, depth + 1),
    );
  } else if (depth > CONSTANT.FRAME_NODE_DEPTH) {
    const newNode = {
      nodeId: node.id,
      type: node.type,
      frameId: currentFrameId,
    };
    newNode.property = {};

    const excludedKeys = [
      "id",
      "name",
      "type",
      "scrollBehavior",
      "blendMode",
      "children",
    ];

    for (const key in node) {
      if (Object.prototype.hasOwnProperty.call(node, key)) {
        if (!excludedKeys.includes(key)) {
          newNode.property[key] = node[key];
        }
      }
    }

    if (parent.nodes) {
      parent.nodes.push(newNode);
    }
  }

  return parent;
};

module.exports = saveFigmaDataAsNestedStructure;
