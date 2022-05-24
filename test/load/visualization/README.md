# Attribution

Building on https://github.com/luketn/docker-k6-grafana-influxdb

# Running tests with visualization enabled

Start services:

```sh
docker-compose up -d
```

Run tests, e.g. for staticPages:

```sh
K6_OUT=influxdb=http://localhost:8086/k6 k6 run ../staticPages.js
```

Access the dashboard at [http://localhost:3000/d/k6/k6-load-testing-results](http://localhost:3000/d/k6/k6-load-testing-results)

When you're finished, you can shut down the services and delete the data:

```sh
docker-compose down
```
