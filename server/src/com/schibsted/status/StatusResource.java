package com.schibsted.status;

import com.googlecode.utterlyidle.annotations.GET;
import com.googlecode.utterlyidle.annotations.Path;

public class StatusResource {

    private GitStatus gitStatus;

    public StatusResource(GitStatus gitStatus) {
        this.gitStatus = gitStatus;
    }

    @GET
    @Path("status/git")
    public String gitStatus() {
        return gitStatus.toString();
    }
}
