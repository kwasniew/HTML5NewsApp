package com.schibsted;

import com.googlecode.utterlyidle.BasePath;
import com.googlecode.utterlyidle.RestApplication;
import com.googlecode.utterlyidle.ServerConfiguration;
import com.googlecode.utterlyidle.httpserver.RestServer;
import com.googlecode.utterlyidle.modules.Module;
import com.schibsted.news.NewsModule;
import com.schibsted.status.StatusModule;
import java.net.URL;
import java.net.MalformedURLException;

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
    }

    private Module staticFilesModule(Class classpathRelativeTo, String localDir, String urlPath) {
        String name = classpathRelativeTo.getSimpleName() + ".class";
        String urlString = classpathRelativeTo.getResource(name).toString().replace(name, "") + localDir;
        System.out.println(urlString);
        URL url;
        try {
            url = new URL(urlString);
            System.out.println("return url!!!!" + urlString);
            System.out.println("return for path" + urlPath);
            return bindingsModule(bindings(in(url).path(urlPath)));
        } catch (MalformedURLException e) {
            //;
            System.out.println("malformed URL" + urlString);
        }
        System.out.println("return null" + urlString);
        return null;
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
