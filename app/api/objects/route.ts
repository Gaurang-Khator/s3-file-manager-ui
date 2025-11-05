import { NextResponse, NextRequest } from "next/server";
import { S3Client, ListObjectsV2Command } from '@aws-sdk/client-s3';

const client = new S3Client({
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY as string,
        secretAccessKey: process.env.AWS_SECRET_KEY as string,
    },
    region: 'ap-south-1',
});

export async function GET(request: NextRequest) {
    const prefix = request.nextUrl.searchParams.get('prefix') ?? undefined;
    const command = new ListObjectsV2Command({
        Bucket: 's3-filemanager-ui',
        Delimiter: '/',
        Prefix: prefix,
    });
    const result = await client.send(command);
    // console.log(result);

    const rootFiles = result.Contents?.map(e => ({
        Key: e.Key,
        Size: e.Size,
        lastModified: e.LastModified,
    }));

    const rootFolders = result.CommonPrefixes?.map(e => e.Prefix);

    return NextResponse.json({
        files: rootFiles,
        folders: rootFolders,
    });
}