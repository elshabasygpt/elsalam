/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    output: 'standalone', // Required for Vercel / Docker deployments
    
    // 🚀 Bundle Size Optimizations
    experimental: {
        optimizePackageImports: ['lucide-react', 'date-fns', 'lodash'],
        serverComponentsExternalPackages: ['@prisma/client', 'bcrypt'],
    },
    
    // 🖼️ Advanced Image Optimization for Production
    images: {
        formats: ['image/avif', 'image/webp'], // Serve smaller next-gen formats
        minimumCacheTTL: 31536000, // Cache images for 1 year
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'placehold.co',
            },
            {
                protocol: 'https',
                hostname: 'images.unsplash.com',
            },
            // AWS S3 Bucket Pattern
            {
                protocol: 'https',
                hostname: '*.s3.*.amazonaws.com',
            },
            // Vercel Blob Storage Pattern
            {
                protocol: 'https',
                hostname: '*.public.blob.vercel-storage.com',
            }
        ],
    },
};

module.exports = nextConfig;
