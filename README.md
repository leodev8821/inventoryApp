# inventoryApp
Final course Project

# Configurar Nginx
  1. Instala Nginx en tu sistema.

  2. Edita el archivo de configuración de Nginx (generalmente en /etc/nginx/nginx.conf o /etc/nginx/sites-available/default).

  3. Agrega la siguiente configuración:


        server {
            listen 80;
            server_name inventoryapp.net;

            location / {
                proxy_pass http://localhost:3002;
                proxy_set_header Host $host;
                proxy_set_header X-Real-IP $remote_addr;
                proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
                proxy_set_header X-Forwarded-Proto $scheme;
            }
        }

  4. Reinicia Nginx:

  5. sudo systemctl restart nginx

  6. Ahora, puedes acceder a la aplicación en: http://inventoryapp.net
