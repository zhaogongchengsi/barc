import fs from 'fs';

const filePath = '/path/to/file'; // 替换为您要检查的文件路径

const fileExists = fs.existsSync(filePath);

if (fileExists) {
	console.log('文件存在');
} else {
	console.log('文件不存在');
}