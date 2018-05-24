#!/bin/bash
SERVER=$(cd `dirname $0`;pwd)
NUM=019
PORT=22$NUM
INITED=`ls | grep node_modules`
case "$INITED" in
  node_modules)
    echo "node_modules is exist"
  ;;
  *)
  cnpm install
  ;;
esac
FLAVOR=$1
case "$FLAVOR" in
  prod)
    PORT=20$NUM
    ;;
  test)
    PORT=22$NUM
    ;;
  sandbox)
    PORT=23$NUM
    ;;
  dev)
    PORT=21$NUM
    ;;
  *)
    echo "Usage: {prod|test|sandbox|dev}"
    ;;
esac
JIMI_ENV=$FLAVOR npm run deploy
CONF=/etc/nginx/conf.d/$PORT.conf
echo "server{" > $CONF
echo "    listen $PORT;" >> $CONF
echo "    server_name localhost;" >> $CONF
echo "    location / {" >> $CONF
echo "        root $SERVER/dist;" >> $CONF
echo "        index index.html;" >> $CONF
echo "    }" >> $CONF
echo "}" >> $CONF
