package com.schibsted.status;

import com.googlecode.utterlyidle.MediaType;
import com.googlecode.utterlyidle.Response;
import com.googlecode.utterlyidle.ResponseBuilder;
import com.googlecode.utterlyidle.Status;
import com.googlecode.utterlyidle.annotations.GET;
import com.googlecode.utterlyidle.annotations.Path;

public class StatusResource {

    private LastCommit lastCommit;
    private BuildVersion buildVersion;

    public StatusResource(LastCommit lastCommit, BuildVersion buildVersion) {
        this.lastCommit = lastCommit;
        this.buildVersion = buildVersion;
    }

    @GET
    @Path("status/git")
    public Response lastCommit() {
        return ResponseBuilder.response(Status.OK).
                               contentType(MediaType.TEXT_PLAIN).
                               entity(lastCommit.toString()).
                               build();
    }

    @GET
    @Path("status/build")
    public Response buildVersion() {
        return ResponseBuilder.response(Status.OK).
                               contentType(MediaType.TEXT_PLAIN).
                               entity("10").
                               build();
    }
}
