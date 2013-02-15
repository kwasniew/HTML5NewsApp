package com.schibsted.news;

import com.googlecode.utterlyidle.annotations.GET;
import com.googlecode.utterlyidle.annotations.Path;
import com.schibsted.shared.Files;

public class NewsResource {

    @GET
    @Path("/")
    public String mainPage() {
        return Files.readFileContent(this.getClass(), "html/index.html");
    }
}
