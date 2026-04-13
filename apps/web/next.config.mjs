/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  transpilePackages: [
    "@workspace/ui",
    "@workspace/ai-safety",
    "@workspace/accessibility",
  ],
}

export default nextConfig
