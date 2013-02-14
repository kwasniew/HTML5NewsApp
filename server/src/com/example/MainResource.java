package com.example;

import com.googlecode.utterlyidle.annotations.GET;
import com.googlecode.utterlyidle.annotations.Path;

public class MainResource {
    @GET
    @Path("/main2")
    public String hello() {
        return "<h2>com.example.Main2 Resource</h2>";
    }
}
