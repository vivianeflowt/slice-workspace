import fs from 'fs';
import path from 'path';

const REPORTS_DIR = path.resolve(__dirname, 'reports');
if (!fs.existsSync(REPORTS_DIR)) {
  fs.mkdirSync(REPORTS_DIR);
}

export class Reports {
  static getPath(reportName: string) {
    return path.join(REPORTS_DIR, `${reportName}.json`);
  }

  static save(reportName: string, data: any) {
    fs.writeFileSync(this.getPath(reportName), JSON.stringify(data, null, 2));
  }

  static append(reportName: string, data: any) {
    const filePath = this.getPath(reportName);
    let arr = [];
    if (fs.existsSync(filePath)) {
      arr = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
      if (!Array.isArray(arr)) arr = [arr];
    }
    const entry = { ...data, timestamp: new Date().toISOString() };
    arr.push(entry);
    fs.writeFileSync(filePath, JSON.stringify(arr, null, 2));
  }

  static read(reportName: string) {
    const filePath = this.getPath(reportName);
    if (!fs.existsSync(filePath)) return null;
    return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  }
}
