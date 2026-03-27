import {
  abortMultipartUpload,
  completeMultipartUpload,
  getPresignedUrl,
  initMultipartUpload,
  UploadedPart,
} from './upload-by-chunks';

export async function uploadVideoEncryptedStreamOptimized(
  file: File,
  encryptionKey: string,
): Promise<void> {
  const CHUNK_SIZE = 5 * 1024 * 1024;
  const {uploadId} = await initMultipartUpload(file.name);
  const parts: UploadedPart[] = [];

  const stream = file.stream();
  const reader = stream.getReader();
  const writer = stream.getWriter();

  let buffer = new Uint8Array(CHUNK_SIZE);
  let bufferOffset = 0;
  let partNumber = 1;

  try {
    const publicKey = await openpgp.readKey({armoredKey: encryptionKey});

    // 2. Создание encryptor ОДИН раз для всего файла
    const encryptor = await openpgp.createMessage({
      binary: true,
      format: 'binary',
    });

    const encrypted = await openpgp.encrypt({
      message: encryptor,
      encryptionKeys: publicKey,
      format: 'binary',
    });

    while (true) {
      const {done, value} = await reader.read();

      if (done) {
        // Processing the remainder
        if (bufferOffset > 0) {
          await processAndUploadChunk(
            buffer.slice(0, bufferOffset),
            encryptionKey,
            uploadId,
            partNumber,
            parts,
          );
        }
        break;
      }

      bufferOffset = await processChunkData(
        value,
        buffer,
        bufferOffset,
        CHUNK_SIZE,
        encryptionKey,
        uploadId,
        partNumber,
        parts,
      );

      if (bufferOffset === 0) {
        // Buffer sent, starting a new one
        buffer = new Uint8Array(CHUNK_SIZE);
        partNumber++;
      }
    }

    await completeMultipartUpload(uploadId, parts);
  } catch (error) {
    await abortMultipartUpload(uploadId);
    throw error;
  } finally {
    reader.releaseLock();
  }
}

async function processChunkData(
  newData: Uint8Array,
  buffer: Uint8Array,
  bufferOffset: number,
  chunkSize: number,
  encryptionKey: string,
  uploadId: string,
  partNumber: number,
  parts: UploadedPart[],
): Promise<number> {
  const remaining = chunkSize - bufferOffset;

  if (newData.length <= remaining) {
    // All newData fits into the buffer
    buffer.set(newData, bufferOffset);
    const newOffset = bufferOffset + newData.length;

    if (newOffset === chunkSize) {
      // Buffer filled - encrypting and uploading
      await processAndUploadChunk(
        buffer,
        encryptionKey,
        uploadId,
        partNumber,
        parts,
      );
      return 0; // Buffer sent, starting a new one
    }

    return newOffset;
  } else {
    // newData does not fit entirely
    const firstPart = newData.slice(0, remaining);
    const secondPart = newData.slice(remaining);

    // Filling the remaining space in the buffer
    buffer.set(firstPart, bufferOffset);

    // Encrypting and uploading the filled buffer
    await processAndUploadChunk(
      buffer,
      encryptionKey,
      uploadId,
      partNumber,
      parts,
    );

    // Starting a new buffer with the second part
    buffer.set(secondPart, 0);

    return secondPart.length;
  }
}

async function processAndUploadChunk(
  chunkData: Uint8Array,
  encryptionKey: string,
  uploadId: string,
  partNumber: number,
  parts: UploadedPart[],
): Promise<void> {
  // Encrypting the chunk
  const encryptedData = chunkData; //await encryptChunk(chunkData, encryptionKey);

  // Getting pre-signed URL
  const {url: presignedUrl} = await getPresignedUrl(uploadId, partNumber);

  // Sending encrypted data
  const etag = ''; //await uploadChunkStream(presignedUrl, encryptedData);
  console.log(presignedUrl, encryptedData);
  // Saving metadata
  parts.push({
    PartNumber: partNumber,
    ETag: etag,
  });
}
