import fs from 'fs';
import path from 'path';

const logsDir = path.join(process.cwd(), 'backend', 'logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

const logFile = path.join(logsDir, 'app.log');

export const logger = {
  info: (msg: string) => {
    const entry = `[${new Date().toISOString()}] [INFO] ${msg}\n`;
    console.log(entry.trim());
    fs.appendFileSync(logFile, entry);
  },
  warn: (msg: string) => {
    const entry = `[${new Date().toISOString()}] [WARN] ${msg}\n`;
    console.warn(entry.trim());
    fs.appendFileSync(logFile, entry);
  },
  error: (msg: string, err?: any) => {
    const errorDetails = err ? (err.stack || JSON.stringify(err)) : '';
    const entry = `[${new Date().toISOString()}] [ERROR] ${msg} ${errorDetails}\n`;
    console.error(entry.trim());
    fs.appendFileSync(logFile, entry);
  },
};
