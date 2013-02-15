package com.schibsted.status;

public class BuildVersion {
    private String version;

    public BuildVersion(String version) {
        this.version = version;
    }

    @Override
    public String toString() {
        return version;
    }
}
