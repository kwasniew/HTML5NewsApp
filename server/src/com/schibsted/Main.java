package com.schibsted;

import com.googlecode.utterlyidle.BasePath;
import com.googlecode.utterlyidle.RestApplication;
import com.googlecode.utterlyidle.ServerConfiguration;
import com.googlecode.utterlyidle.httpserver.RestServer;import com.schibsted.news.NewsModule;

public class Main extends RestApplication {

    public static final int DEFAULT_PORT = 8181;

    public Main(BasePath basePath) {
        super(basePath);
        add(new NewsModule());
    }

    public static void main(String[] args) throws Exception {
        int port = readPort(args);

        new RestServer(new Main(BasePath.basePath("")),
                       ServerConfiguration.defaultConfiguration().port(port));
    }

    private static int readPort(String[] args) {
        int port = DEFAULT_PORT;
        if(args.length > 0) {
            port = Integer.parseInt(args[0]);
        }
        return port;
    }
}
