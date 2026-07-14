const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const MODULES_PATH = path.join(process.cwd(), 'frontend/modules');

// 需要清理的模块列表（从01到15）
const moduleDirs = [];
for (let i = 1; i <= 15; i++) {
  const num = String(i).padStart(2, '0');
  const dir = path.join(MODULES_PATH, `${num}-*`);
  if (fs.existsSync(dir.replace('*', ''))) {
    const matches = require('glob').sync(dir);
    moduleDirs.push(...matches);
  }
}

// 清理重复文件
function cleanDuplicateFiles(modulePath) {
  const files = fs.readdirSync(modulePath);
  const subDirs = files.filter(f => {
    const fullPath = path.join(modulePath, f);
    return fs.statSync(fullPath).isDirectory();
  });

  subDirs.forEach(subDir => {
    const subDirPath = path.join(modulePath, subDir);
    // 检查子目录中是否有同名文件
    const subFiles = fs.readdirSync(subDirPath);
    
    subFiles.forEach(file => {
      const rootFile = path.join(modulePath, file);
      const subFile = path.join(subDirPath, file);
      
      if (fs.existsSync(rootFile)) {
        // 比较文件大小和修改时间，决定保留哪个
        const rootStat = fs.statSync(rootFile);
        const subStat = fs.statSync(subFile);
        
        // 保留子目录中的文件（更可能是最新版本），删除根目录的
        if (subStat.mtime >= rootStat.mtime) {
          console.log(`删除根目录文件: ${rootFile}`);
          fs.unlinkSync(rootFile);
        } else {
          console.log(`删除子目录文件: ${subFile}`);
          fs.unlinkSync(subFile);
        }
      }
    });
  });
}

// 执行清理
moduleDirs.forEach(dir => {
  if (fs.existsSync(dir)) {
    console.log(`清理模块: ${dir}`);
    cleanDuplicateFiles(dir);
  }
});

console.log('清理完成！');