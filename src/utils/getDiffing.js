const isOwnProperty = require("./isOwnProperty");

const diffProperties = (
  beforeProperties,
  afterProperties,
  frameId,
  frame,
  nodeId,
  position,
  diffingResult,
  path,
  depth,
) => {
  if (depth === 0 && process.env.NODE_ENV !== "test") {
    if (afterProperties && afterProperties._doc) {
      afterProperties = afterProperties._doc;
    }
  }

  for (const property in afterProperties) {
    if (isOwnProperty(afterProperties, property)) {
      const beforeValue = beforeProperties?.[property];
      const afterValue = afterProperties[property];

      if (typeof afterValue === "object") {
        diffProperties(
          beforeValue,
          afterValue,
          frameId,
          frame,
          nodeId,
          position,
          diffingResult,
          `${path}.${property}`,
          depth + 1,
        );

        continue;
      }

      if (beforeValue !== afterValue) {
        if (!diffingResult.differences[nodeId]) {
          diffingResult.differences[nodeId] = {
            type: "MODIFIED",
            nodeId,
            frameId,
            differenceInformation: {},
            position,
          };
        }

        const propertyRoute = `${path}.${property}`.slice(10);

        diffingResult.differences[nodeId].differenceInformation[propertyRoute] =
          `${beforeValue} => ${afterValue}`;

        diffingResult.frames[frameId] = frame;
      }
    }
  }
};

const getDiffing = async (beforeFrameList, afterFrameList, diffingResult) => {
  for (const [afterFrameId, afterFrame] of afterFrameList) {
    const beforeFrame = beforeFrameList.get(afterFrameId);

    if (!beforeFrame) {
      diffingResult.frames[afterFrameId] = afterFrame;

      continue;
    }

    for (const [afterNodeId, afterNode] of afterFrame.nodes) {
      const beforeNode = beforeFrame.nodes.get(afterNodeId);

      if (!afterNode.property) {
        continue;
      }

      const nodePosition = afterNode.property.absoluteBoundingBox;

      if (!beforeNode) {
        diffingResult.differences[afterNodeId] = {
          type: "NEW",
          nodeId: afterNodeId,
          frameId: afterFrameId,
          differenceInformation: {},
          position: nodePosition,
        };

        diffingResult.frames[afterFrameId] = afterFrame;

        continue;
      }

      diffProperties(
        beforeNode,
        afterNode,
        afterFrameId,
        afterFrame,
        afterNodeId,
        nodePosition,
        diffingResult,
        "",
        0,
      );
    }
  }
};

module.exports = getDiffing;
