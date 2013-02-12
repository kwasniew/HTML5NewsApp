#!/bin/bash
usage="$(basename $0) [-hp:] -- script to rollback running application to previously running version
where:
    -h  display this help message
    -p  port number on which to start the application. The port number must be specified explicitely! 
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

if [ "$portNumber" == 0 ]; then
  echo Option -p required
  echo "$usage" 
  exit 0
fi

./stop.sh

ln -s $(readlink current) temp
rm current
ln -s $(readlink previous) current
rm previous
ln -s $(readlink temp) previous
rm temp
echo starting application at port $portNumber
./start.sh -p $portNumber -v current
