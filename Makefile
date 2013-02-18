build:
	ant run server

run:
	node client/imagebase.js &
	http-server client &

