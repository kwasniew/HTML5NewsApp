#!/bin/bash

usage="$(basename $0) [-h] -- script to stop application
where:
    -h  display this help message
    -p  port number, if not specified script will stop all passbook applications
"
portNumber=0
while getopts 'hp:' option; do
  case "$option" in
    h) echo "$usage"
       exit
       ;;
    p) portNumber=$OPTARG
       ;;
    ?) printf "illegal option: '%s'\n" "$OPTARG" >&2
       echo "$usage" >&2
       exit 1
       ;;
  esac
done

portGrep=" "
if [ $portNumber != 0 ]; then
  echo stopping application at port $portNumber
  portGrep=$portNumber
else
  echo stopping all applications
fi
echo $portGrep
ps -ef | grep STOP_APP_PATTERN | grep "$portGrep" | grep -v bash | grep -v grep | awk '{print $2}' | xargs kill