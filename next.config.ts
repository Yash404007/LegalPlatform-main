/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
      remotePatterns: [
          {"hostname": "picsum.photos"},
          {"hostname" : "i.ytimg.com"},
          {"hostname" : `${process.env.AWS_BUCKET_NAME}.s3.ap-south-1.amazonaws.com`},
          {"hostname" : "yt3.ggpht.com"},
          {"hostname" : "api.dicebear.com"}
      ],
  }
};

export default nextConfig;