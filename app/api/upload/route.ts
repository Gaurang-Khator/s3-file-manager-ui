import { NextResponse, NextRequest } from "next/server";
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const client = new S3Client({
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY as string,
        secretAccessKey: process.env.AWS_SECRET_KEY as string,
    },
    region: 'ap-south-1',
});

export async function GET(request: NextRequest) {
    try {
        const key = request.nextUrl.searchParams.get('key');

        if (!key) {
            return NextResponse.json(
                { error: 'Key parameter is required' },
                { status: 400 }
            );
        }

        const command = new PutObjectCommand({
            Bucket: 's3-filemanager-ui',
            Key: key,
        });

        const url = await getSignedUrl(client, command, { expiresIn: 3600 });
        return NextResponse.json({ url });
        
    } catch (error) {
        console.error('Error generating presigned URL:', error);
        return NextResponse.json(
            { error: 'Failed to generate upload URL' },
            { status: 500 }
        );
    }
}