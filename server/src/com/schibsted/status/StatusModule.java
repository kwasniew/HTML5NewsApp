package com.schibsted.status;

import com.googlecode.utterlyidle.Resources;
import com.googlecode.utterlyidle.modules.ApplicationScopedModule;
import com.googlecode.utterlyidle.modules.ResourcesModule;
import com.googlecode.yadic.Container;
import com.schibsted.shared.Files;

import static com.googlecode.utterlyidle.annotations.AnnotatedBindings.annotatedClass;

public class StatusModule implements ResourcesModule, ApplicationScopedModule {
    @Override
    public Resources addResources(Resources resources) throws Exception {
        resources.add(annotatedClass(StatusResource.class));
        return resources;
    }

    @Override
    public Container addPerApplicationObjects(Container container) throws Exception {
        container.addInstance(LastCommit.class, new LastCommit(Files.loadTextFileContent("git.commit")));
        container.addInstance(BuildVersion.class, new BuildVersion(Files.loadTextFileContent("build.number")));
        return container;
    }
}
