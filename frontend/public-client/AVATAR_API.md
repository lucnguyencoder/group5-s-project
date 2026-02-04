# Avatar Upload API Documentation

## Overview

This API provides endpoints for managing user avatars using Supabase storage. All endpoints require authentication and appropriate permissions.

## Base URL

```
/api/images
```

## Authentication

All endpoints require a valid JWT token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

## Endpoints

### 1. Upload Avatar

Upload a new avatar image for the authenticated user.

**Endpoint:** `POST /api/images/avatar/upload`

**Content-Type:** `multipart/form-data`

**Parameters:**

- `avatar` (file, required): Image file to upload
  - Supported formats: JPEG, PNG, GIF, WebP
  - Maximum size: 5MB

**Response:**

```json
{
  "success": true,
  "message": "Avatar uploaded successfully",
  "data": {
    "avatar_url": "https://your-supabase-url.supabase.co/storage/v1/object/public/avatars/users/filename.jpg",
    "file_path": "users/filename.jpg"
  }
}
```

**Error Responses:**

```json
{
  "success": false,
  "message": "File size too large. Maximum size is 5MB."
}
```

```json
{
  "success": false,
  "message": "Only image files are allowed!"
}
```

---

### 2. Get Avatar

Retrieve the current avatar URL for the authenticated user.

**Endpoint:** `GET /api/images/avatar`

**Response:**

```json
{
  "success": true,
  "data": {
    "avatar_url": "https://your-supabase-url.supabase.co/storage/v1/object/public/avatars/users/filename.jpg"
  }
}
```

**Response (No Avatar):**

```json
{
  "success": true,
  "data": {
    "avatar_url": null
  }
}
```

---

### 3. Remove Avatar

Remove the current avatar for the authenticated user.

**Endpoint:** `DELETE /api/images/avatar`

**Response:**

```json
{
  "success": true,
  "message": "Avatar removed successfully"
}
```

## Error Codes

| Status Code | Description                                             |
| ----------- | ------------------------------------------------------- |
| 200         | Success                                                 |
| 400         | Bad Request (Invalid file format, size too large, etc.) |
| 401         | Unauthorized (Invalid or missing token)                 |
| 403         | Forbidden (Insufficient permissions)                    |
| 404         | Not Found (User not found)                              |
| 500         | Internal Server Error                                   |

## Permissions Required

The following user types have access to avatar endpoints:

- **Customer** - Full access to all avatar operations
- **Admin** - Full access to all avatar operations
- **Merchant/Store Staff** - Full access to all avatar operations
- **Support Agent** - Full access to all avatar operations

## Usage Examples

### Upload Avatar (JavaScript/Fetch)

```javascript
const formData = new FormData();
formData.append("avatar", fileInput.files[0]);

fetch("/api/images/avatar/upload", {
  method: "POST",
  headers: {
    Authorization: `Bearer ${token}`,
  },
  body: formData,
})
  .then((response) => response.json())
  .then((data) => console.log(data));
```

### Upload Avatar (cURL)

```bash
curl -X POST \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "avatar=@/path/to/image.jpg" \
  http://localhost:3000/api/images/avatar/upload
```

### Get Avatar (JavaScript/Fetch)

```javascript
fetch("/api/images/avatar", {
  headers: {
    Authorization: `Bearer ${token}`,
  },
})
  .then((response) => response.json())
  .then((data) => console.log(data.data.avatar_url));
```

### Remove Avatar (JavaScript/Fetch)

```javascript
fetch("/api/images/avatar", {
  method: "DELETE",
  headers: {
    Authorization: `Bearer ${token}`,
  },
})
  .then((response) => response.json())
  .then((data) => console.log(data.message));
```

## Technical Implementation Details

### File Storage

- Files are stored in Supabase storage bucket named `avatars`
- Files are organized in the `users/` folder within the bucket
- Filenames are generated using crypto.randomBytes to prevent collisions
- Original file extensions are preserved

### Database Updates

- User's `profile_picture` field is updated with the public URL from Supabase
- No additional database tables are required

### File Validation

- Only image files are accepted (MIME type must start with 'image/')
- Maximum file size is 5MB
- Multer is used for handling multipart form data

### Security

- All endpoints require JWT authentication
- Permission middleware ensures users have appropriate access
- File type validation prevents uploading non-image files
- File size limits prevent abuse

## Environment Variables Required

Make sure these Supabase environment variables are set:

```env
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
```

Or alternatively (for backward compatibility):

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```
