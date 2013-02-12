package com.example;

import com.googlecode.utterlyidle.BasePath;
import com.googlecode.utterlyidle.RestApplication;

import static com.googlecode.utterlyidle.ApplicationBuilder.application;

public class Main extends RestApplication {
    public Main(BasePath basePath) {
        super(basePath);
    }

    public static void main(String[] args) {
        int port = 8181;
        if(args.length > 0) {
            port = Integer.parseInt(args[0]);
        }
        application().addAnnotated(MainResource.class).start(port);
    }
}