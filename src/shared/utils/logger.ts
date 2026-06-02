/**
 * logger.ts
 *
 * Ghi log vào file logs/app.log khi chạy trong môi trường Node.js (test)
 * và ghi ra console khi chạy trong thiết bị di động (React Native).
 */

export const logMessage = (
  level: 'INFO' | 'WARN' | 'ERROR',
  message: string,
  data?: any
): void => {
  const timestamp = new Date().toISOString();
  const logString = `[${timestamp}] [${level}] ${message} ${data ? JSON.stringify(data) : ''}\n`;
  
  // Console log mặc định
  if (level === 'ERROR') {
    console.error(logString);
  } else if (level === 'WARN') {
    console.warn(logString);
  } else {
    console.log(logString);
  }

  // Nếu đang chạy trong môi trường test (Node.js), ghi thêm vào file logs/app.log
  try {
    if (typeof process !== 'undefined' && process.env && (process.env.NODE_ENV === 'test' || (global as any).jest)) {
      const req = typeof require === 'function' ? require : null;
      if (req) {
        const fsName = 'fs';
        const pathName = 'path';
        const fs = req(fsName);
        const path = req(pathName);
        const logDir = path.resolve(__dirname, '../../../../logs');
        if (!fs.existsSync(logDir)) {
          fs.mkdirSync(logDir, { recursive: true });
        }
        fs.appendFileSync(path.join(logDir, 'app.log'), logString, 'utf8');
      }
    }
  } catch {
    // Bỏ qua lỗi ghi file trong môi trường production/runtime React Native
  }
};

export default logMessage;
