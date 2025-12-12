#!/bin/bash
curl -X POST https://naijaconnectcapital.vercel.app/api/admin/create \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Admin User",
    "email": "admin@naijacapital.com",
    "password": "AdminPass123",
    "adminSecretKey": "your-super-secret-admin-key-change-this"
  }'
