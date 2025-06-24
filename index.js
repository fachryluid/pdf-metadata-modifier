import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { PDFDocument } from 'pdf-lib';
import inquirer from 'inquirer';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const filesDir = path.join(__dirname, 'files');
const outputDir = path.join(__dirname, 'outputs');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

async function listPDFFiles() {
  const allFiles = fs.readdirSync(filesDir);
  return allFiles.filter(f => f.toLowerCase().endsWith('.pdf'));
}

function parseDateFromFilename(filename) {
  const match = filename.match(/^(\d{4}-\d{2}-\d{2} \d{2}\.\d{2}\.\d{2}) (.+)\.pdf$/i);
  if (!match) return null;

  const [_, dateStr, cleanName] = match;
  const date = new Date(dateStr.replace(' ', 'T').replaceAll('.', ':'));
  return { date, cleanName: cleanName + '.pdf' };
}

async function editSingleFile(pdfFiles) {
  const { selectedFile } = await inquirer.prompt([
    {
      type: 'list',
      name: 'selectedFile',
      message: '📄 Pilih file PDF yang ingin diubah metadatanya:',
      choices: pdfFiles
    }
  ]);

  const { creationStr } = await inquirer.prompt([
    {
      type: 'input',
      name: 'creationStr',
      message: '🕒 Masukkan tanggal *Created At* (format: YYYY-MM-DD HH:mm:ss):',
      validate: (val) => /\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}/.test(val) ? true : 'Format tidak valid'
    }
  ]);

  const { modifiedStr } = await inquirer.prompt([
    {
      type: 'input',
      name: 'modifiedStr',
      message: '🕒 Masukkan tanggal *Updated At* (tekan Enter jika sama seperti Created At):',
      validate: (val) => {
        return (
          val.trim() === '' || /\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}/.test(val)
        ) ? true : 'Format tidak valid';
      }
    }
  ]);

  const creationDate = new Date(creationStr.replace(' ', 'T'));
  const modificationDate = modifiedStr.trim() === ''
    ? creationDate
    : new Date(modifiedStr.replace(' ', 'T'));

  await processFile(selectedFile, creationDate, modificationDate, selectedFile);
  console.log(`✅ File diproses: ${selectedFile}`);
}

async function editMultipleFiles(pdfFiles) {
  for (const file of pdfFiles) {
    const parsed = parseDateFromFilename(file);
    if (!parsed) {
      console.warn(`⚠️ Lewatkan file (format salah): ${file}`);
      continue;
    }

    const { date, cleanName } = parsed;
    await processFile(file, date, date, cleanName);
    console.log(`✅ File diproses: ${file} → ${cleanName}`);
  }
}

async function processFile(inputFile, createdDate, modifiedDate, outputName) {
  const inputPath = path.join(filesDir, inputFile);
  const existingPdfBytes = fs.readFileSync(inputPath);
  const pdfDoc = await PDFDocument.load(existingPdfBytes);

  pdfDoc.setTitle('');
  pdfDoc.setAuthor('');
  pdfDoc.setSubject('');
  pdfDoc.setKeywords(['']);
  pdfDoc.setProducer('');
  pdfDoc.setCreator('');
  pdfDoc.setCreationDate(createdDate);
  pdfDoc.setModificationDate(modifiedDate);

  const modifiedPdfBytes = await pdfDoc.save();
  const outputPath = path.join(outputDir, outputName);
  fs.writeFileSync(outputPath, modifiedPdfBytes);
}

async function main() {
  while (true) {
    const pdfFiles = await listPDFFiles();
    if (pdfFiles.length === 0) {
      console.log('❌ Tidak ada file PDF di folder "files".');
      return;
    }

    const { mode } = await inquirer.prompt([
      {
        type: 'list',
        name: 'mode',
        message: '🔧 Pilih mode operasi:',
        choices: [
          { name: '📝 Edit metadata satu file', value: 'single' },
          { name: '📂 Edit metadata banyak file sekaligus (nama file diawali tanggal)', value: 'multiple' },
          { name: '❌ Keluar dari program', value: 'exit' },
        ]
      }
    ]);

    if (mode === 'exit') {
      console.log('👋 Keluar dari program.');
      break;
    } else if (mode === 'single') {
      await editSingleFile(pdfFiles);
    } else if (mode === 'multiple') {
      await editMultipleFiles(pdfFiles);
    }

    console.log('\n➡️ Kembali ke menu utama...\n');
  }
}

main();