
This needs to be run on via the proxy on the Front Office ui docker image.

In that project open nginx/nginx.template

        location /portalSink {
            proxy_pass http://${DOCKER_LOOPBACK_ADDRESS_HOST}:3009/portalSink;
            proxy_cookie_domain pctdemo.wipo.int localhost;
            proxy_ssl_verify off;
            proxy_set_header Host ${host};
            proxy_ssl_name $host;
            proxy_ssl_server_name on;
            proxy_set_header X-Forwarded-Host ${host};
            proxy_set_header X-Forwarded-Port ${server_port};
            proxy_buffer_size          128k;
            proxy_buffers              4 256k;
            proxy_busy_buffers_size    256k;
        }

then run locally (yarn start) That will start the app on port 3009, the docker nginx proxy will them make it available at:
https://localhost/portalSink

Test on https://localhost/portalSink

I am not finished will all of the interfaces this is just for people to see what this looks like.
