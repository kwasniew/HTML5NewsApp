package com.schibsted.shared;

import com.googlecode.totallylazy.Strings;

import java.io.InputStream;

public class Files {
    private static Files instance = new Files();

    public static String loadTextFileContent(String fileName) {
        return Strings.toString(loadFileAsStream(fileName));
    }

    public static InputStream loadFileAsStream(String fileName) {
        return instance.getClass().getClassLoader().getResourceAsStream(fileName);
    }
}
