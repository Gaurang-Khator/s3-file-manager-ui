# S3-Sync – AWS S3 File Manager UI

S3-Sync is a secure, web-based file manager that lets authenticated users upload, preview, download, and delete objects in AWS S3 through a clean Next.js UI. It is designed as a portfolio-ready full-stack project showcasing credential-less S3 access using presigned URLs, role-based isolation, and modern React patterns.

---

## 🚀 Features

- **Authenticated access** via Clerk, with each user isolated to their own logical folder/prefix inside a shared S3 bucket
- **Upload, list, preview, download, and delete files** using presigned URLs, without exposing AWS access keys in the browser
- **Responsive UI** built with Next.js, Tailwind CSS, and shadcn/ui components for a dashboard-like experience
- **Optimistic UI updates** with background refetch to keep the file list feeling instant while staying consistent with S3
- **Guardrails** for file size limits and extension checks, with clear error messages for invalid operations

---

## 🛠️ Tech Stack

- **Frontend:** Next.js (App Router), React, TypeScript, Tailwind CSS, shadcn/ui
- **Auth:** Clerk for user authentication and session management
- **Storage:** AWS S3 for object storage with per-user prefixes
- **Backend:** Next.js API routes using AWS SDK v3 to generate presigned URLs
- **Deployment:** Vercel (frontend) + AWS S3 (storage)

---

## 🏗️ Architecture

1. Users sign in with **Clerk**, which issues a session token and user ID available in server components and API routes
2. On file actions (upload, download, delete), the client calls a **protected API route** that validates the user and generates a short-lived presigned URL scoped to that user's S3 prefix
3. The client then performs the actual upload/download/delete **directly against S3** using the presigned URL, so AWS credentials never reach the browser
4. Folder-like behavior is modeled using **key prefixes** (e.g., `userId/path/to/file.ext`) rather than real folders, keeping the design compatible with S3's object model
```
Browser → Next.js App → Clerk Auth → API Route → AWS S3
                               
```

---

## 💡 Most Challenging Problem Solved

The most challenging problem recently solved in this project was **designing secure, multi-tenant S3 access without exposing AWS credentials in the browser**. The core of the solution uses Clerk for authentication and Next.js API routes that generate tightly scoped presigned URLs, ensuring each user can interact only with objects under their own S3 key prefix. 

Getting this right required reworking the folder model, IAM policies, and validation logic to avoid cross-tenant access and to handle edge cases like expired URLs or malformed keys safely. Another key challenge was **making the UI feel instant despite S3's eventual consistency**, which was addressed using optimistic updates plus background refetch so the list stays responsive but converges to the true S3 state. 

End-to-end error handling and logging were then added so issues such as oversized uploads, permission errors, and network failures surfaced as clear, actionable messages instead of silent bugs.

---

## 🚦 Getting Started

### Prerequisites

- Node.js and npm or pnpm installed
- An AWS account with permission to create and use an S3 bucket
- A Clerk application configured with allowed redirect URLs for your dev environment

### Environment Variables

Create a `.env.local` file in the project root:
```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
S3_BUCKET_NAME=your-bucket-name
```

### Installation
```bash
# Clone the repository
git clone https://github.com/Gaurang-Khator/s3-file-manager-ui.git
cd s3-file-manager-ui

# Install dependencies
npm install
# or
pnpm install

# Run the development server
npm run dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📖 Usage

1. **Sign up or sign in** with Clerk to access the dashboard
2. Use the **upload control** to select files and send them to your personal S3 prefix
3. **Browse your file list**, preview supported file types, download files, or delete them when no longer needed
4. Errors (size limits, invalid extensions, permission issues) appear as toast or inline messages to guide you

---

## 🎯 Key Technical Decisions

- **Presigned URLs** instead of direct AWS SDK calls from the browser, eliminating the need to ship AWS keys to the client
- **Per-user prefixes** in a single bucket to keep costs low while achieving strong logical isolation between tenants
- **Optimistic updates** with stale-while-revalidate style refetch to balance responsiveness with S3 consistency constraints
- **Centralized schema validation** and guards in API routes to prevent path traversal and cross-user access

---

## ⚠️ Limitations and Future Work

- Large file uploads are currently constrained by the single-request presigned URL approach; **multipart uploads** could improve reliability for big files
- There is no full **audit log** yet for who accessed or deleted which file; integrating CloudTrail or a custom logging table would improve traceability
- Planned enhancements include **bulk operations**, folder bookmarking, richer search/filtering, and support for more preview formats

---

## 📂 Repository

**GitHub:** [https://github.com/Gaurang-Khator/s3-file-manager-ui](https://github.com/Gaurang-Khator/s3-file-manager-ui)

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/Gaurang-Khator/s3-file-manager-ui/issues).

---

## 👤 Author

**Gaurang Khator**
- GitHub: [@Gaurang-Khator](https://github.com/Gaurang-Khator)

---

*Built with ❤️ using Next.js, AWS S3, and Clerk*
