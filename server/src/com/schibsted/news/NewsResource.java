package com.schibsted.news;

import com.googlecode.utterlyidle.annotations.*;
import com.schibsted.news.NewsFeed;
import com.schibsted.shared.Files;
import static com.googlecode.totallylazy.Uri.uri;
import static com.googlecode.utterlyidle.RequestBuilder.get;

public class NewsResource {

    @GET
    @Path("/")
    public String mainPage() {
        return Files.loadTextFileContent("com/schibsted/index.html");
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
