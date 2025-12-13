import fs from 'fs';
import path from 'path';

const logFile = path.resolve('server_logs.txt');

export function logAction(userId, action, details = {}) {
  const entry = {
    timestamp: new Date(),
    userId,
    action,
    details
  };
  fs.appendFileSync(logFile, JSON.stringify(entry) + '\n');
}
