const CONSTANT = require("../constants/constants");

const saveFigmaDataAsNestedStructure = (root) => {
  if (!root || root.type !== "DOCUMENT") {
    return null;
  }

  const queue = [{ node: root, parent: null, depth: 0, currentFrameId: "" }];
  const structure = { pages: {} };

  while (queue.length > 0) {
    const { node, parent, depth, currentFrameId } = queue.shift();

    let newParent = parent;

    if (node.type === "CANVAS" && depth === CONSTANT.PAGE_NODE_DEPTH) {
      const newPage = {
        pageId: node.id,
        name: node.name,
        frames: {},
      };

      structure.pages[newPage.pageId] = newPage;

      newParent = newPage;
    } else if (node.type === "FRAME" && depth === CONSTANT.FRAME_NODE_DEPTH) {
      const newFrame = {
        frameId: node.id,
        name: node.name,
        nodes: {},
        property: {},
      };

      const excludedKeys = [
        "id",
        "name",
        "type",
        "scrollBehavior",
        "blendMode",
        "children",
      ];

      for (const key in node) {
        if (!excludedKeys.includes(key)) {
          newFrame.property[key] = node[key];
        }
      }

      if (parent.frames) {
        parent.frames[newFrame.frameId] = newFrame;
      }

      newParent = newFrame;
    } else if (depth > CONSTANT.FRAME_NODE_DEPTH) {
      const newNode = {
        nodeId: node.id,
        type: node.type,
        frameId: currentFrameId,
        property: {},
      };

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
        parent.nodes[newNode.nodeId] = newNode;
      }
    }

    if (node.children) {
      node.children.forEach((child) => {
        queue.push({
          node: child,
          parent: newParent,
          depth: depth + 1,
          currentFrameId: node.type === "FRAME" ? node.id : currentFrameId,
        });
      });
    }
  }

  return structure;
};

module.exports = saveFigmaDataAsNestedStructure;
