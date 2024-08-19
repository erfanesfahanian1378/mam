// const { exec } = require("child_process");
// const util = require("util");
// const execPromise = util.promisify(exec);
//
// const totalGroups = 40;
// let completedGroups = 0;
//
// const checkCompletion = () => {
//   if (completedGroups === totalGroups) {
//     console.log("All processes completed. Closing terminal.");
//     process.exit(0); // Close terminal when all processes are done
//   }
// };
//
// const runGroupScript = async (i) => {
//   const groupScript = `node process_group_${i}.js > process_group_${i}.log 2>&1`;
//
//   try {
//     const { stdout, stderr } = await execPromise(groupScript);
//     if (stderr) {
//       console.error(`stderr: ${stderr}`);
//     }
//     console.log(`stdout: ${stdout}`);
//     // socket.emit("Finished a process");
//   } catch (error) {
//     console.error(`Error executing ${groupScript}: ${error}`);
//   } finally {
//     completedGroups++;
//     checkCompletion();
//   }
// };
//
// const master = () => {
//   const promises = [];
//   for (let i = 0; i < totalGroups; i++) {
//     promises.push(runGroupScript(i));
//   }
//   return promises;
// };
//
// // const master = () => {
// //   for (let i = 0; i < totalGroups; i++) {
// //     const groupScript = `node process_group_${i}.js > process_group_${i}.log 2>&1`;
// //     const process = exec(groupScript, (error, stdout, stderr) => {
// //       if (error) {
// //         console.error(`Error executing ${groupScript}: ${error}`);
// //         completedGroups++; // Increment even on error to avoid hanging
// //         checkCompletion();
// //         return;
// //       }
// //       if (stderr) {
// //         console.error(`stderr: ${stderr}`);
// //       }
// //       console.log(`stdout: ${stdout}`);
// //     });
//
// //     process.on("exit", (code) => {
// //       console.log(`Process for group ${i} exited with code ${code}`);
// //       completedGroups++;
// //       checkCompletion();
// //     });
// //   }
// // };
//
// module.exports = { master };







const { exec } = require("child_process");
const util = require("util");
const execPromise = util.promisify(exec);
const WebSocket = require("ws");

const totalGroups = 40;
let completedGroups = 0;

// const wss = new WebSocket.Server({ port: 8090 }); // WebSocket server on port 8080
const wss = new WebSocket.Server({ host: '0.0.0.0', port: 8090 });
wss.on('connection', ws => {
  console.log("vaslim");
  ws.send(JSON.stringify({ completed: completedGroups, total: totalGroups }));
});

const broadcastProgress = () => {
  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify({ completed: completedGroups, total: totalGroups }));
    }
  });
};

const checkCompletion = () => {
  if (completedGroups === totalGroups) {
    console.log("All processes completed. Closing terminal.");
    process.exit(0); // Close terminal when all processes are done
  }
};

const runGroupScript = async (i) => {
  const groupScript = `node process_group_${i}.js > process_group_${i}.log 2>&1`;

  try {
    const { stdout, stderr } = await execPromise(groupScript);
    if (stderr) {
      console.error(`stderr: ${stderr}`);
    }
    console.log(`stdout: ${stdout}`);
  } catch (error) {
    console.error(`Error executing ${groupScript}: ${error}`);
  } finally {
    completedGroups++;
    broadcastProgress();
    checkCompletion();
  }
};

const master = () => {
  const promises = [];
  for (let i = 0; i < totalGroups; i++) {
    promises.push(runGroupScript(i));
  }
  return promises;
};

module.exports = { master };



//
// const { exec } = require("child_process");
// const util = require("util");
// const WebSocket = require("ws");
//
// const totalGroups = 40;
// let completedGroups = 0;
// let processList = []; // To store references to the child processes
// let isCancelled = false; // Flag to check if the process is cancelled
//
// // Initialize WebSocket server on port 8080
// const wss = new WebSocket.Server({ port: 8090 });
//
// wss.on('connection', ws => {
//   // Send initial progress when a new client connects
//   ws.send(JSON.stringify({ completed: completedGroups, total: totalGroups }));
//
//   // Listen for cancel message from the client
//   ws.on('message', message => {
//     if (message === 'cancel') {
//       cancelAllProcesses(); // Trigger the cancellation function
//     }
//   });
// });
//
// // Function to broadcast progress to all connected clients
// const broadcastProgress = () => {
//   wss.clients.forEach(client => {
//     if (client.readyState === WebSocket.OPEN) {
//       client.send(JSON.stringify({ completed: completedGroups, total: totalGroups }));
//     }
//   });
// };
//
// // Function to check if all processes are completed or if cancellation was triggered
// const checkCompletion = () => {
//   if (completedGroups === totalGroups || isCancelled) {
//     console.log("All processes completed or cancelled. Exiting.");
//     process.exit(0); // Close the application when all processes are done or cancelled
//   }
// };
//
// // Function to run individual group scripts and manage their execution
// const runGroupScript = async (i) => {
//   if (isCancelled) return; // Skip running if cancelled
//
//   return new Promise((resolve, reject) => {
//     const groupScript = `node process_group_${i}.js > process_group_${i}.log 2>&1`;
//     const process = exec(groupScript);
//
//     processList.push(process); // Store the process reference in the list
//
//     process.on('close', (code) => {
//       completedGroups++;
//       broadcastProgress(); // Update progress
//       resolve(); // Resolve the promise when the process closes
//       checkCompletion();
//     });
//
//     process.on('error', (error) => {
//       reject(error); // Reject the promise on error
//     });
//   });
// };
//
// // Main function to start all processes
// const master = () => {
//   let promises = []; // Initialize the promises array
//
//   for (let i = 0; i < totalGroups; i++) {
//     promises.push(runGroupScript(i)); // Add each process' promise to the array
//   }
//
//   return Promise.all(promises); // Wait for all processes to complete
// };
//
// // Function to cancel all running processes
// const cancelAllProcesses = () => {
//   isCancelled = true;
//   processList.forEach(proc => {
//     proc.kill(); // Kill each running process
//   });
//   broadcastProgress(); // Optionally notify the client that processes have been cancelled
// };
//
// // Start the master process when this script is executed directly
// if (require.main === module) {
//   master().catch(err => console.error(err));
// }
//
// module.exports = { master, cancelAllProcesses };
