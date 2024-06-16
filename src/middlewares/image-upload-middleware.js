import { S3Client } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
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
  fileFilter: (req, file, callback) => {
    const extension = path.extname(file.originalname).toLowerCase();

    if (!allowedExtensions.includes(extension)) {
      return callback(new BadRequestError(MESSAGES.S3.WRONG_EXTENSION), false);
    }

    callback(null, true);
  }
});

const uploadToS3 = async (file) => {
  const uploadDirectory = 'profileImages';
  const key = `${uploadDirectory}/${Date.now()}_${file.originalname}`;

  const upload = new Upload({
    client: s3,
    params: {
      Bucket: ENV.AWS_BUCKET_NAME,
      Key: key,
      Body: file.buffer,
      ACL: 'public-read',
    },
  });

  try {
    const data = await upload.done();
    return data.Location;
  } catch (error) {
    throw new InternalServerError(MESSAGES.S3.UPLOADING_FAIL);
  }
};

export { imageUploader, uploadToS3 };
