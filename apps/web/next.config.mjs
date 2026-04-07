/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: [
    "@workspace/ui",
    "@workspace/ai-safety",
    "@workspace/accessibility",
  ],
}

export default nextConfig
