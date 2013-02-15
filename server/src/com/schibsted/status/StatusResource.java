package com.schibsted.status;

import com.googlecode.utterlyidle.MediaType;
import com.googlecode.utterlyidle.Response;
import com.googlecode.utterlyidle.ResponseBuilder;
import com.googlecode.utterlyidle.Status;
import com.googlecode.utterlyidle.annotations.GET;
import com.googlecode.utterlyidle.annotations.Path;

public class StatusResource {

    private GitStatus gitStatus;

    public StatusResource(GitStatus gitStatus) {
        this.gitStatus = gitStatus;
    }

    @GET
    @Path("status/git")
    public Response gitStatus() {
        return ResponseBuilder.response(Status.OK).
                               contentType(MediaType.TEXT_PLAIN).
                               entity(gitStatus.toString()).
                               build();
    }
}
