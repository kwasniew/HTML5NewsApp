#!/bin/bash

usage="$(basename $0) [-hvp] -- script to run application
where:
    -h  display this help message
    -v  application build version (required)
    -p  port (required)
"
version="false"
port="false"

while getopts 'hv:p:' option; do
  case "$option" in
    h) echo "$usage"
       exit
       ;;
    v) version=$OPTARG
       ;;
    p) port=$OPTARG
       ;;
    ?) printf "illegal option: '%s'\n" "$OPTARG" >&2
       echo "$usage" >&2
       exit 1
       ;;
  esac
done

if [ "$port" == "false" ]; then
  echo option -p required
fi

if [ "$version" == "false" ]; then
  echo option -v required
fi

if [ "$version" == "false" ] || [ "$port" == "false" ]; then
  echo "$usage"
  exit 1;
fi

cd $version && nohup java -Xmx500m -Xms500m  -cp $(echo *.jar | tr ' ' ':') MAIN_APP_CLASS $port > log.out 2> log.err < /dev/null &

echo currently running version:
ls -l | grep current
