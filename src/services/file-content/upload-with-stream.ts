import OpenPGP from 'react-native-fast-openpgp';

export interface UploadedPart {
  PartNumber: number;
  ETag: string;
}

export async function uploadVideoEncryptedStreamOptimized(
  file: File,
  encryptionKey: string,
  publicKey: string,
  uploadUrl: {uploadId: string; presignedUrl: string},
): Promise<void> {
  const CHUNK_SIZE = 5 * 1024 * 1024;
  //   const {uploadId} = await initMultipartUpload(file.name);
  const parts: UploadedPart[] = [];

  const stream = file.stream();
  const reader = stream.getReader();
  //   const writer = stream.getWriter();

  let buffer = new Uint8Array(CHUNK_SIZE);
  let bufferOffset = 0;
  let partNumber = 1;

  try {
    while (true) {
      const {done, value} = await reader.read();

      if (done) {
        // Processing the remainder
        if (bufferOffset > 0) {
          await processAndUploadChunk(
            buffer.slice(0, bufferOffset),
            encryptionKey,
            uploadUrl.uploadId,
            partNumber,
            parts,
            uploadUrl.presignedUrl,
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
        uploadUrl.uploadId,
        partNumber,
        parts,
        uploadUrl.presignedUrl,
      );

      if (bufferOffset === 0) {
        // Buffer sent, starting a new one
        buffer = new Uint8Array(CHUNK_SIZE);
        partNumber++;
      }
    }

    // await completeMultipartUpload(uploadUrl.uploadId, parts);
  } catch (error) {
    // await abortMultipartUpload(uploadUrl.uploadId);
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
  presignedUrl: string,
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
        presignedUrl,
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
      presignedUrl,
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
  presignedUrl: string,
): Promise<void> {
  // Encrypting the chunk
  const encryptedData = chunkData; //await encryptChunk(chunkData, encryptionKey);

  // Sending encrypted data
  const etag = ''; //await uploadChunkStream(presignedUrl, encryptedData);
  console.log(presignedUrl, encryptedData);
  // Saving metadata
  parts.push({
    PartNumber: partNumber,
    ETag: etag,
  });
}
