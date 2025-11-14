# S3 Sync - AWS S3 File Manager UI

S3 Sync is a simple and intuitive web-based file manager for Amazon S3 buckets. It allows users to securely authenticate and manage their S3 files with upload and download capabilities through a clean user interface.

## Features

- Secure user authentication using Clerk authentication service.
- Upload files directly to your Amazon S3 bucket.
- Download files from the S3 bucket with ease.
- Basic UI to view and manage S3 files.

## Current Status

- Authentication via Clerk is fully integrated.
- File upload and download functionalities are operational.
- User interface is responsive and user-friendly.
- Currently using a fixed AWS account with S3 bucket (demo/demo access).

## Planned Features

- Integration of a database to securely store individual user IAM access keys.
- Dynamic handling of multiple S3 buckets per user.
- Enhanced file management features such as file deletion, renaming, and folder creation.
- Improved error handling and UI notifications.

## Technology Stack

- Frontend: Next.js with Shadcn-ui for styling and components
- Authentication: Clerk
- Cloud Storage: Amazon S3


