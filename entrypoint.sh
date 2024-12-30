#!/bin/sh

set -e

echo "Running Prisma migrations..."
npx prisma db push

echo "Starting the app with PM2..."
pm2-runtime ecosystem.config.cjs