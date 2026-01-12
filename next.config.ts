import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  cacheComponents: true,
  serverExternalPackages: ['prisma'], // Remove @prisma/client to allow bundling
  experimental: {
    // Habilitar certificados TLS del sistema en Turbopack para evitar errores
    // al solicitar recursos externos (por ejemplo, Google Fonts)
    turbopackUseSystemTlsCerts: true,
    serverActions: {
      bodySizeLimit: '10mb',
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
  webpack: (config, { isServer }) => {
    // Configuración específica para Prisma en Vercel
    if (isServer) {
      // Asegurar que @prisma/client se incluya correctamente en el bundle
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
      use: 'node-loader',
    });

    return config;
  },
};

export default nextConfig;
// Trigger restart
