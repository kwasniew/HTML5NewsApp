package com.schibsted.status;

public class LastCommit {
    private String message;

    public LastCommit(String message) {
        this.message = message;
    }

    @Override
    public String toString() {
        return message.toString().isEmpty() ? "no git message available" : message.toString();
    }
}
