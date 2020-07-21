Widget based on [Create react App](https://create-react-app.dev/)

`npm run build` creates a 'build' directory with a production build of your app.

#### ADA App Input Data Parameters
(name: type - description; requirements; default value; other info)
1.  **s3AccessKeyId**: string - Amazon S3 Access Key ID; required; no default value
2.  **s3SecretAccessKey**: string - Amazon S3 Secret Access Key; required; no default value  
    *Warning: S3 Access key ID & Amazon S3 Secret access key have to belong to a user with specific and restricted permissions!*
3.  **bucketName**: string - Name of S3 Bucket to use for uploading; required; no default value
4.  **maxFileSize**: number - maximum file size in Mb; not required; default value: 10 Mb
5.  **maxFileSizeMsg**: string - message to show when the user is trying to upload a file bigger than maxFileSize; not required; has a default: “Maximum file size, Mb:”
6.  **allowedFileExtensions**: string - allowed file extensions; not required; no default values; format: odt, pdf, slx (comma plus space)
7.  **allowedFileExtensionsMsg**: string - message to show when the user is trying to upload a file with forbidden extension; not required; no default value
8.  **uploadPath**: string - path to upload files in S3 Bucket; not required; default value: chatter_token; format: ‘path/{variable}/anotherPath/etc’, multiple levels are possible, do not place ‘/’ on both ends of a string.
9.  **s3UrlExpire**: number - in seconds, for which the generated presigned URL is valid. For example, 86400 (24 hours). This value is an integer. The minimum value you can set is 1, and the maximum is 604800 (seven days); not required; default value: 86400
