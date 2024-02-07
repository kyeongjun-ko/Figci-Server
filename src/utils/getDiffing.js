const isOwnProperty = (object, property) => {
  return Object.prototype.hasOwnProperty.call(object, property);
};

const diffProperties = (
  beforeProperties,
  afterProperties,
  frameId,
  nodeId,
  position,
  diffingResult,
  path,
  depth,
) => {
  if (depth === 0) {
    afterProperties = afterProperties._doc;
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

        diffingResult.frames.add(frameId);
      }
    }
  }
};

const getDiffing = async (beforeFrameList, afterFrameList, diffingResult) => {
  for (const [afterFrameId, afterFrame] of afterFrameList) {
    const beforeFrame = beforeFrameList.get(afterFrameId);

    if (!beforeFrame) {
      diffingResult.frames.add(afterFrameId);

      continue;
    }

    for (const [afterNodeId, afterNode] of afterFrame.nodes) {
      const beforeNode = beforeFrame.nodes.get(afterNodeId);
      const nodePosition = afterNode.property.absoluteRenderBounds;

      if (!beforeNode) {
        diffingResult.differences[afterNodeId] = {
          type: "NEW",
          nodeId: afterNodeId,
          frameId: afterFrameId,
          differenceInformation: {},
          position: nodePosition,
        };

        continue;
      }

      diffProperties(
        beforeNode,
        afterNode,
        afterFrameId,
        afterNodeId,
        nodePosition,
        diffingResult,
        "",
        0,
      );
    }
  }

  diffingResult.frames = Array.from(diffingResult.frames);
};

module.exports = getDiffing;
