const os = require("os");

const logMemoryUsage = (logicName) => {
  const usedMemory = process.memoryUsage().heapUsed / 1024 / 1024;
  const maxMemory = 512;
  const percentage = (usedMemory / maxMemory) * 100;

  console.log(
    `[${logicName}] Memory Usage: ${usedMemory.toFixed(2)} MB (${percentage.toFixed(2)}%)`,
  );

  if (percentage > 90) {
    console.warn(
      `[${logicName}] Warning: Memory usage is above 90% of the maximum capacity!`,
    );
  }
};

module.exports = logMemoryUsage;
