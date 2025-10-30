import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ['@prisma/client', 'prisma'],
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb'
    },
    // Optimizaciones para mejor performance
    optimizePackageImports: ['@tanstack/react-query', 'react-icons'],
  },
  // Configuración específica para Prisma en producción
  // output: 'standalone', // Disabled for Vercel deployment
  // Configuración de Turbopack (Next.js 16)
  turbopack: {
    rules: {
      '*.svg': {
        loaders: ['@svgr/webpack'],
        as: '*.js',
      },
    },
  },
  // Configuración de imágenes optimizada
  images: {
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  // Compresión mejorada
  compress: true,
  // Optimización de chunks y configuración de Prisma para Vercel
  webpack: (config, { dev, isServer }) => {
    // Configuración específica para Prisma en Vercel
    if (isServer) {
      // No externalizar @prisma/client para que se bundle correctamente en Vercel
      config.externals = config.externals.filter((external: any) => {
        if (typeof external === 'string') {
          return !external.includes('@prisma/client');
        }
        return true;
      });
    }

    // Asegurar que los archivos .node de Prisma se incluyan correctamente
    config.module.rules.push({
      test: /\.node$/,
      use: 'file-loader',
      options: {
        name: '[name].[ext]',
        outputPath: 'chunks/',
        publicPath: '/_next/static/chunks/',
      },
    });

    if (!dev && !isServer) {
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
          },
          common: {
            name: 'common',
            minChunks: 2,
            chunks: 'all',
            enforce: true,
          },
        },
      };
    }
    return config;
  },
  // Headers para mejor caching
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
      },
      {
        source: '/static/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
