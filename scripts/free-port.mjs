/**
 * Giải phóng cổng (Windows). Usage: node scripts/free-port.mjs 3001
 */
import { execSync } from 'node:child_process';
import { platform } from 'node:os';

const port = process.argv[2] || '3001';

if (platform() !== 'win32') {
  console.log(`free-port: chỉ hỗ trợ Windows. Dừng process thủ công trên cổng ${port}.`);
  process.exit(0);
}

try {
  const out = execSync(`netstat -ano | findstr :${port} | findstr LISTENING`, {
    encoding: 'utf8',
  });
  const pids = new Set();
  out
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .forEach((line) => {
      const pid = line.split(/\s+/).pop();
      if (pid && /^\d+$/.test(pid)) pids.add(pid);
    });

  if (!pids.size) {
    console.log(`Cổng ${port} đã trống.`);
    process.exit(0);
  }

  for (const pid of pids) {
    try {
      execSync(`taskkill /PID ${pid} /F`, { stdio: 'ignore' });
      console.log(`Đã dừng PID ${pid} (cổng ${port})`);
    } catch {
      console.warn(`Không dừng được PID ${pid}`);
    }
  }
} catch {
  console.log(`Cổng ${port} đã trống.`);
}
