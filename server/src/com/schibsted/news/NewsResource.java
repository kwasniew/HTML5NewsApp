package com.schibsted.news;

import com.googlecode.utterlyidle.annotations.GET;
import com.googlecode.utterlyidle.annotations.Path;

public class NewsResource {

    @GET
    @Path("/")
    public String mainPage() {
        return "HTML5 News App";
    }
}
