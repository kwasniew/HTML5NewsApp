package com.schibsted.status;

public class GitStatus {
    private String status;

    public GitStatus(String status) {
        this.status = status;
    }

    @Override
    public String toString() {
        return status.toString().isEmpty() ? "no git status available" : status.toString();
    }
}
