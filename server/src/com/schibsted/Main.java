package com.schibsted;

import com.googlecode.utterlyidle.BasePath;
import com.googlecode.utterlyidle.RestApplication;
import com.googlecode.utterlyidle.ServerConfiguration;
import com.googlecode.utterlyidle.httpserver.RestServer;
import com.googlecode.utterlyidle.modules.Module;
import com.schibsted.news.NewsModule;
import com.schibsted.status.StatusModule;
import java.net.URL;

import static com.googlecode.totallylazy.URLs.packageUrl;
import static com.googlecode.utterlyidle.dsl.DslBindings.bindings;
import static com.googlecode.utterlyidle.dsl.StaticBindingBuilder.in;
import static com.googlecode.utterlyidle.modules.Modules.bindingsModule;

public class Main extends RestApplication {

    public static final int DEFAULT_PORT = 8181;

    public Main(BasePath basePath) {
        super(basePath);
        add(new NewsModule());
        add(new StatusModule());

        add(staticFilesModule(Main.class, "client/", ""));
        add(staticFilesModule(Main.class, "static/", "admin"));
    }

    private Module staticFilesModule(Class classpathRelativeTo, String localDir, String urlPath) {
        URL url = packageUrl(classpathRelativeTo);
        String newurl = url.toString() + localDir;
        try{
            System.out.println(newurl);
            url = new URL(newurl);
        }catch(Exception e){
            //eat
        }
        return bindingsModule(bindings(in(url).path(urlPath)));
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
