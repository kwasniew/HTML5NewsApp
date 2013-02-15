package com.schibsted.news;

import com.googlecode.utterlyidle.MediaType;
import com.googlecode.utterlyidle.Response;
import com.googlecode.utterlyidle.ResponseBuilder;
import com.googlecode.utterlyidle.Status;
import com.googlecode.utterlyidle.annotations.GET;
import com.googlecode.utterlyidle.annotations.Path;

import static com.googlecode.utterlyidle.MediaType.TEXT_HTML;
import static com.googlecode.utterlyidle.Status.OK;
import static com.schibsted.shared.Files.loadTextFileContent;

public class NewsResource {

    @GET
    @Path("/")
    public Response mainPage() {
        return ok("com/schibsted/index.html");
    }

    private Response ok(String fileName) {
        return ResponseBuilder.response(OK).contentType(TEXT_HTML).entity(loadTextFileContent(fileName)).build();
    }

    @GET
    @Path("/text")
    public String text() {
        return "plain text works";
    }
}
