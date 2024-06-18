import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import multer from 'multer';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
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

const defaultAllowedExtensions = ['.png', '.jpg', '.jpeg', '.bmp'];
const defaultFileSizeLimit = 10 * 1024 * 1024; // 10MB

const createImageUploader = ({ 
  fileSizeLimit = defaultFileSizeLimit,
  allowedExtensions = defaultAllowedExtensions 
}) => {
  const storage = multer.memoryStorage();

  return multer({
    storage,
    limits: { fileSize: fileSizeLimit },
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
};

const uploadToS3 = async (file, directory) => {
  const extension = path.extname(file.originalname).toLowerCase();
  const key = `${directory}/${uuidv4()}${extension}`;

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
    throw new InternalServerError(MESSAGES.S3.UPLOADING_FAIL);
  }
};

const imageUploadMiddleware = (fieldName, directory) => (req, res, next) => {
  const upload = createImageUploader({}).single(fieldName);
  
  upload(req, res, async (err) => {
    if (err) {
      return next(err);
    }

    if (req.file) {
      try {
        const imageUrl = await uploadToS3(req.file, directory);
        req.body[fieldName] = imageUrl; // 업로드된 이미지 URL을 요청 본문에 추가
      } catch (uploadError) {
        return next(uploadError);
      }
    }
    next();
  });
};

export { imageUploadMiddleware };