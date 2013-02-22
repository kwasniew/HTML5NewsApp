build:
	ant -buildfile client/build.xml

buildall:
	ant -buildfile client/build.xml && ant -buildfile server/build.xml
