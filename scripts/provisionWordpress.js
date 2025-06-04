const fs = require('fs');
const { execSync } = require('child_process');
const path = require('path');

function randomString(length = 12) {
  return Math.random().toString(36).slice(2, 2 + length);
}

function generateComposeFile({ clientId, port, dbPass, rootPass }) {
  return `
version: '3.8'
services:
  db:
    image: mysql:8
    restart: always
    environment:
      MYSQL_DATABASE: wp_${clientId}
      MYSQL_USER: wpuser_${clientId}
      MYSQL_PASSWORD: ${dbPass}
      MYSQL_ROOT_PASSWORD: ${rootPass}
    volumes:
      - db_${clientId}_data:/var/lib/mysql

  wordpress:
    image: wordpress:6
    restart: always
    depends_on:
      - db
    environment:
      WORDPRESS_DB_HOST: db:3306
      WORDPRESS_DB_NAME: wp_${clientId}
      WORDPRESS_DB_USER: wpuser_${clientId}
      WORDPRESS_DB_PASSWORD: ${dbPass}
      WORDPRESS_TABLE_PREFIX: wp_
      WORDPRESS_CONFIG_EXTRA: |
        define('WP_DEBUG', false);
    ports:
      - "${port}:80"
    volumes:
      - wp_${clientId}_data:/var/www/html

volumes:
  db_${clientId}_data:
  wp_${clientId}_data:
`;
}

function provisionWordpress({ clientId, port }) {
  const dbPass = randomString();
  const rootPass = randomString();
  const composeFile = `docker-compose.${clientId}.yml`;
  const composeContent = generateComposeFile({ clientId, port, dbPass, rootPass });
  fs.writeFileSync(composeFile, composeContent);
  execSync(`docker-compose -f ${composeFile} up -d`);
  return { dbPass, rootPass, port, composeFile };
}

// Example usage:
if (require.main === module) {
  const clientId = process.argv[2] || 'client123';
  const port = process.argv[3] || 8081;
  const result = provisionWordpress({ clientId, port });
  console.log('WordPress provisioned:', result);
  console.log(`Access at: http://localhost:${port}`);
} 