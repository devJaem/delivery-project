import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import multer from 'multer';
import path from 'path';
import { ENV } from '../constants/env.constant.js';
import { MESSAGES } from '../constants/message.constant.js';
import { BadRequestError, InternalServerError } from '../errors/http.error.js';

const s3 = new S3Client({
  region: ENV.AWS_REGION,
  credentials: {
    accessKeyId: ENV.AWS_ACCESS_KEY_ID,
    secretAccessKey: ENV.AWS_SECRET_KEY,
  },
});

const allowedExtensions = ['.png', '.jpg', '.jpeg', '.bmp'];

const storage = multer.memoryStorage();

const imageUploader = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB
  },
  fileFilter: (req, file, callback) => {
    const extension = path.extname(file.originalname).toLowerCase();

    if (!allowedExtensions.includes(extension)) {
      return callback(
        new BadRequestError(MESSAGES.S3.WRONG_EXTENSION),
        false,
      );
    }
    callback(null, true);
  },
});

const uploadToS3 = async (file) => {
  const uploadDirectory = 'profileImages';
  const key = `${uploadDirectory}/${Date.now()}_${file.originalname}`;

  try {
    const uploadParams = {
      Bucket: ENV.AWS_BUCKET_NAME,
      Key: key,
      Body: file.buffer,
      ACL: 'public-read',
    };

    await s3.send(new PutObjectCommand(uploadParams));
    return `https://${ENV.AWS_BUCKET_NAME}.s3.${ENV.AWS_REGION}.amazonaws.com/${key}`;
  } catch (error) {
    console.error('Error uploading file to S3:', error);
    throw new InternalServerError(MESSAGES.S3.UPLOADING_FAIL);
  }
};

export { imageUploader, uploadToS3 };
