package com.schibsted.news;

import com.googlecode.utterlyidle.HttpHandler;
import com.googlecode.utterlyidle.Request;
import com.googlecode.utterlyidle.Response;
import com.googlecode.utterlyidle.handlers.ClientHttpHandler;

import static com.googlecode.totallylazy.Uri.uri;
import static com.googlecode.utterlyidle.RequestBuilder.get;

/**
 * Contains methods for retrieving data from the SND API.
 */
public class NewsFeed {
    private static String API_BASE_URL = "http://apitestbeta3.medianorge.no:80/news/";

    public static String getLastestNews(Integer sectionId, Integer limit){
        HttpHandler httpClient = new ClientHttpHandler(10000);
        Request request = get(uri(API_BASE_URL + "publication/common/sections/"+sectionId+"/auto?limit="+limit)).build();
        Response response = null;
        try {
            response = httpClient.handle(request);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return response.entity().toString();
    }
}
