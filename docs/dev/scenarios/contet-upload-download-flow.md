# Content Upload

## Entities

1. Chat-room content
2. Private storage

## Sources

1. Document Picker - DocumentPicker (react-native-document-picker)
2. Image Picker - launchImageLibrary (react-native-image-picker)
3. Thumbnail generation - createThumbnail (react-native-create-thumbnail)
4. Image compressor - Image (react-native-compressor)
5. Predefine Local content path - RNFS (react-native-fs)
6. Thumbnail Upload To Minio/S3 - axios (content as arraybuffer in 'application/octet-stream')
7. Thumbnail Download from Minio/S3 - axios (content as arraybuffer in 'application/octet-stream')
8. Content Upload To Minio/S3 - RNFS.uploadFiles
9. Content Downoad from Minio/S3 - RNFS.downloadFile

## Flow

### Upload Flow (Chat-room content)

1. User selects files from one of the pickers:
   - Media picker returns mapped assets as file objects (`uri`, `type`, `name`, `size`).
   - Document picker returns copied file references from cache.
2. `uploadFiles` builds `filesMetadata` from valid selected files (must have `name` and `size`).
3. App requests upload transaction data and presigned URLs from backend (`getFileContentRoomUploadUrl`).
4. App marks transaction status as `uploading` (`updateContentTransaction`).
5. For each file (in parallel via `Promise.all`), app runs `uploadContentToMinio`:
   - If thumbnails are enabled, `processThumbnail` runs first.
   - Then `processContent` uploads encrypted full content.
   - Finally file status is marked `completed`.
6. Thumbnail path (`processThumbnail`):
   - Generate thumbnail from local source.
   - Read thumbnail into buffer.
   - Encrypt thumbnail with recipients' public keys.
   - Upload encrypted thumbnail with thumbnail presigned URL.
   - Mark file thumbnail status as `thumbnail_uploaded` (or `thumbnail_failed` on error).
7. Content path (`processContent`):
   - Validate local path and required file metadata.
   - Mark file status `file_uploading`.
   - Call stream uploader (`uploadContentWithStream`).
   - Mark file status `file_uploaded` (or `file_failed` on error).
8. Stream uploader internals (`uploadContentWithStream`):
   - Resolve existing native path from `fileCopyUri`/`uri` (supports `file://` and decoded paths).
   - Build encrypted temp path in cache/temp directory.
   - Ensure parent folder exists.
   - Encrypt source file into temp encrypted file via OpenPGP `encryptFile`.
   - Upload encrypted temp file to presigned URL via stream API (`uploadDiskContentInStream`).
   - Delete encrypted temp file in both success and failure paths.
9. When all files are done, app marks transaction as `completed` and returns uploaded metadata.
10. If upload orchestration fails, transaction is still updated to `completed` in current implementation, then error is re-thrown.

### Download Flow (Stream + Decrypt)

1. App calls `downloadContentWithStream` with presigned URL and decrypt credentials.
2. App computes final local destination path:
   - Use provided `contentPathName` when present.
   - Else build room path (`rooms/...`) or private storage path (`users/...`).
3. If decrypted target already exists locally, return immediately.
4. Build encrypted temp download path in cache/temp directory.
5. Ensure parent directories exist for both temp encrypted file and final decrypted destination.
6. Download encrypted file stream from presigned URL into temp file (`downloadDiskContentInStream`).
7. Decrypt temp encrypted file into final destination with OpenPGP `decryptFile`.
8. Always delete temp encrypted file in `finally` block.
9. Return final local content path.

## Core File Content Processing Memory Optimization Solution

**Note:** Thumbnails are generated, encrypted, and uploaded directly entierly, using memory.

The key architectural decision was to completely avoid loading file contents into JavaScript memory.
JavaScript managed only metadata and file paths, while all heavy processing was performed natively and streamed directly from disk using Chunked OpenPGP file-to-file encryption.

As a result, the application was able to reliably encrypt and upload files larger than 2 GB on mobile devices without memory issues. This significantly improved the scalability and stability of the secure storage platform.

## Upload Content Step 1. Chunked OpenPGP file-to-file encryption

This call performs native file-to-file OpenPGP encryption for the main media file.
It

- reads the source file from `sourceFilePath`,
- encrypts it with all recipient public keys,
- writes the encrypted output to `encryptedFilePath` as binary data
  while preserving the original file name in metadata.
  Because encryption runs on file paths in native code, the full file content is not loaded into JavaScript

```ts
await OpenPGP.encryptFile(
  sourceFilePath,
  encryptedFilePath,
  publicKeys.join('\n'),
  undefined,
  {
    isBinary: true,
    fileName: file.name,
  },
);
```

#### Flow

1. Reading source file from disk
2. Encrypting file data (chunked internally in native layer)
3. Writing encrypted file to disk
4. Streaming encrypted file to network

## Upload Content 2. Encrypted file stream upload

Encrypted file streamed directly from disk to the presigned URL (Minio/S3) via HTTP PUT using RNFS.uploadFiles with `binaryStreamOnly: true` and `Content-Type: application/octet-stream`. The file is never loaded into JavaScript memory.

```ts
const upload = RNFS.uploadFiles({
  toUrl: presignedUrl,
  binaryStreamOnly: true,
  method: 'PUT',
  headers: {
    'Content-Type': 'application/octet-stream',
  },
  files: [
    {
      name: fileName,
      filename: fileName,
      filepath: encryptedFilePath,
      filetype: 'application/octet-stream',
    },
  ],
});
```
## Download Content 1. Encrypted file stream download

Encrypted file is streamed directly from the presigned URL (Minio/S3) to a temp file on disk via `RNFS.downloadFile` with `Accept: application/octet-stream`. The file is never loaded into JavaScript memory.

```ts
const download = RNFS.downloadFile({
  fromUrl: presignedUrl,
  toFile: outputPath,
  headers: {
    Accept: 'application/octet-stream',
  },
});

const result = await download.promise;
```

#### Flow

1. HTTP GET request to presigned URL
2. Response body streamed directly to `outputPath` (encrypted temp file on disk)
3. Status code validated — throws if not 2xx

## Download Content 2. Chunked OpenPGP file-to-file decryption

Encrypted temp file is decrypted directly on disk using native OpenPGP `decryptFile`. Input and output are both file paths — no file content is loaded into JavaScript memory. Decryption is chunked internally in the native layer, mirroring the encryption step.

```ts
await OpenPGP.decryptFile(
  encryptedDownloadedPath,
  localContentPath,
  privateKey,
  passphrase || '',
);
```

#### Flow

1. Reading encrypted temp file from disk
2. Decrypting file data (chunked internally in native layer)
3. Writing decrypted output to final local content path
4. Encrypted temp file deleted in `finally` block regardless of success or failure