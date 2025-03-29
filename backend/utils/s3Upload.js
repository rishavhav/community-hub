import AWS from "aws-sdk"
import { v4 as uuidv4 } from "uuid" // ✅ correct import

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
})

export const uploadBase64Image = async (base64Data, folder) => {
  const buffer = Buffer.from(base64Data.replace(/^data:image\/\w+;base64,/, ""), "base64")
  const contentType = base64Data.match(/data:(image\/\w+);base64/)?.[1] || "image/jpeg"
  const fileExtension = contentType.split("/")[1]
  const key = `${folder}/${uuidv4()}.${fileExtension}`

  const uploadParams = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: key,
    Body: buffer,
    ContentEncoding: "base64",
    ContentType: contentType,
  }

  const result = await s3.upload(uploadParams).promise()
  return result.Location
}
