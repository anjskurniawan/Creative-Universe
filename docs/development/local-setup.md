# Local Development Setup

> Status: Current
> Last verified: 2026-08-13

This guide describes the verified local repository structure. Environment values are intentionally not recorded here.

## Prerequisites

- PHP 8.2 or later
- Composer 2
- Node.js compatible with Next.js 16.2.9
- npm
- A database configured through apps/backend/.env

## Install

Run composer install with apps/backend as its working directory, npm install with apps/frontend as its prefix, and npm run prepare:storage.

Create environment files from apps/backend/.env.example and apps/frontend/.env.example. Generate the Laravel key and run only migrations that are approved for the target database. Never commit environment files.

## Run

Run php apps/backend/artisan serve and npm run dev:frontend in separate terminals. With Laragon, use the configured local domain and NEXT_PUBLIC_API_URL.

Use [commands and validation](../operations/commands-and-validation.md) before reporting work complete.
