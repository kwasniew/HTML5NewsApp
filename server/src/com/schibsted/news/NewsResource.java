package com.schibsted.news;

import com.googlecode.totallylazy.Uri;
import com.googlecode.utterlyidle.Redirector;
import com.googlecode.utterlyidle.Response;
import com.googlecode.utterlyidle.annotations.*;
import com.schibsted.shared.Files;

public class NewsResource {

    private Redirector redirector;

    public NewsResource(Redirector redirector) {
        this.redirector = redirector;
    }

    @GET
    @Path("/")
    public String index() {
        return Files.loadTextFileContent("com/schibsted/client/index.html");
    }

    @GET
    @Path("/admin")
    public Response adminIndex() {
        return redirector.seeOther(Uri.uri("admin/index.html"));
    }

    @GET
    @Path("/text")
    public String text() {
        return "plain text works";
    }

    @GET
    @Path("/latest")
    @Produces("application/xml")
    public String latestNews(@QueryParam("sectionId") @DefaultValue("1") Integer sectionId, @QueryParam("limit") @DefaultValue("10") Integer limit){
        return NewsFeed.getLastestNews(sectionId, limit);
    }

}
