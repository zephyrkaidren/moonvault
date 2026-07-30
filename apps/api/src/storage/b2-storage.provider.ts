import { Injectable } from '@nestjs/common';
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
  ListObjectVersionsCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { StorageProvider, UploadResult } from './storage-provider.interface';

const URL_TTL_SECONDS = 6 * 60 * 60; // 6 hours
const REGEN_BUFFER_MS = 30 * 60 * 1000; // regenerate 30 min before actual expiry

interface CachedUrl {
  url: string;
  expiresAt: number;
}

@Injectable()
export class B2StorageProvider implements StorageProvider {
  private client: S3Client;
  private bucket: string;
  private urlCache = new Map<string, CachedUrl>();

  constructor() {
    this.bucket = process.env.STORAGE_BUCKET_NAME!;
    this.client = new S3Client({
      endpoint: process.env.STORAGE_ENDPOINT,
      region: process.env.STORAGE_REGION,
      credentials: {
        accessKeyId: process.env.STORAGE_ACCESS_KEY_ID!,
        secretAccessKey: process.env.STORAGE_SECRET_ACCESS_KEY!,
      },
    });
  }

  async upload(
    buffer: Buffer,
    key: string,
    mimeType: string,
  ): Promise<UploadResult> {
    await this.client.send(
      new PutObjectCommand({
        Bucket: this.bucket,
        Key: key,
        Body: buffer,
        ContentType: mimeType,
        // Object keys already include a UUID and are never overwritten,
        // so it's safe to tell browsers/CDNs this content never changes.
        CacheControl: 'public, max-age=18000, immutable',
      }),
    );
    return { key, sizeBytes: buffer.length };
  }

  async download(key: string): Promise<Buffer> {
    const response = await this.client.send(
      new GetObjectCommand({ Bucket: this.bucket, Key: key }),
    );
    const chunks: Buffer[] = [];
    for await (const chunk of response.Body as AsyncIterable<Uint8Array>) {
      chunks.push(Buffer.from(chunk));
    }
    return Buffer.concat(chunks);
  }

  async getReadStreamUrl(key: string): Promise<string> {
    const cached = this.urlCache.get(key);
    const now = Date.now();

    if (cached && now < cached.expiresAt - REGEN_BUFFER_MS) {
      return cached.url;
    }

    const command = new GetObjectCommand({ Bucket: this.bucket, Key: key });
    const url = await getSignedUrl(this.client, command, {
      expiresIn: URL_TTL_SECONDS,
    });

    this.urlCache.set(key, {
      url,
      expiresAt: now + URL_TTL_SECONDS * 1000,
    });

    return url;
  }

  async delete(key: string): Promise<void> {
    this.urlCache.delete(key);

    const versions = await this.client.send(
      new ListObjectVersionsCommand({ Bucket: this.bucket, Prefix: key }),
    );

    const toDelete = [
      ...(versions.Versions ?? []),
      ...(versions.DeleteMarkers ?? []),
    ].filter((v) => v.Key === key);

    await Promise.all(
      toDelete.map((v) =>
        this.client.send(
          new DeleteObjectCommand({
            Bucket: this.bucket,
            Key: key,
            VersionId: v.VersionId,
          }),
        ),
      ),
    );
  }
}
