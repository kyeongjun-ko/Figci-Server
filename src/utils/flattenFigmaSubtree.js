const isOwnProperty = require("./isOwnProperty");

const CONSTANT = require("../constants/constants");

const flattenFigmaSubtree = (root) => {
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

      for (const key in node) {
        if (!CONSTANT.EXCLUDED_KEYS[key]) {
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

      for (const key in node) {
        if (isOwnProperty(node, key)) {
          if (!CONSTANT.EXCLUDED_KEYS[key]) {
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

module.exports = flattenFigmaSubtree;
