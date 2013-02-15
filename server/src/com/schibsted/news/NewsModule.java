package com.schibsted.news;

import com.googlecode.utterlyidle.Resources;
import com.googlecode.utterlyidle.modules.Module;
import com.googlecode.utterlyidle.modules.ResourcesModule;

import static com.googlecode.utterlyidle.annotations.AnnotatedBindings.annotatedClass;

public class NewsModule implements ResourcesModule {
    @Override
    public Resources addResources(Resources resources) throws Exception {
        resources.add(annotatedClass(NewsResource.class));
        return resources;
    }
}
