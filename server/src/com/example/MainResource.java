package com.example;

import com.googlecode.utterlyidle.annotations.GET;
import com.googlecode.utterlyidle.annotations.Path;

public class MainResource {
    @GET
    @Path("/main3")
    public String hello() {
        return "<h2>com.example.Main3 Resource</h2>";
    }
}
