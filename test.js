import fsPromise from "fs/promises";
import path from "path";
const rootPath = process.cwd();
const targetDir = path.join(rootPath, "uploads/documents/test");

const createFile = async () => {
  try {
    try {
      await fsPromise.access(targetDir);
    } catch (err) {
      console.log("Creating directory");
      await fsPromise.mkdir(targetDir);
      console.log("Directory created");
    }
    const filePath = path.join(targetDir, "test.pdf");
    await fsPromise.writeFile(filePath, "This is a test file");
  } catch (err) {
    console.log(err);
  }
};

createFile();
