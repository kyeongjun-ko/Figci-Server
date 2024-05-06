const convertNodesToObject = (frames) => {
  const convertedFrames = {};

  for (const [frameId, frame] of Object.entries(frames)) {
    if (frame.nodes instanceof Map) {
      frame.nodes = Object.fromEntries(frame.nodes);
    }
    convertedFrames[frameId] = frame;
  }

  return convertedFrames;
};
