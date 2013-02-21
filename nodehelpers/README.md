client
======

# localhost

Use http-proxy npm module to start local server
```
$ http-proxy
```

# API proxy

```
$ node corsproxy.js
```

or if you changing this script
```
$ nodemon corsproxy.js
```

# See how slow network/server works

```
$ node slowserver.js
```
And edit expire: 0.0001 (for development) to
`expire: 2` ()