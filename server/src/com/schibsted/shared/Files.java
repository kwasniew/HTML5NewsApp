package com.schibsted.shared;

import com.googlecode.totallylazy.Strings;

public class Files {
    public static String readFileContent(Class clazz, String relativePath) {
        return Strings.toString(clazz.getResourceAsStream(relativePath));
    }
}
