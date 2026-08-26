package io.github.jeronlgy.haloadmonition;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import org.springframework.stereotype.Component;
import org.thymeleaf.context.ITemplateContext;
import org.thymeleaf.model.IModel;
import org.thymeleaf.model.IModelFactory;
import org.thymeleaf.processor.element.IElementModelStructureHandler;
import reactor.core.publisher.Mono;
import run.halo.app.theme.dialect.TemplateHeadProcessor;

@Component
public class AdmonitionHeadProcessor implements TemplateHeadProcessor {

    private static final String STYLESHEET = loadStylesheet();

    @Override
    public Mono<Void> process(ITemplateContext context, IModel model,
        IElementModelStructureHandler structureHandler) {
        IModelFactory factory = context.getModelFactory();
        model.add(factory.createText(stylesheetTag()));
        return Mono.empty();
    }

    private String stylesheetTag() {
        return """
            <!-- halo-admonition start -->
            <style id="halo-admonition-styles">
            %s
            </style>
            <!-- halo-admonition end -->
            """.formatted(STYLESHEET);
    }

    private static String loadStylesheet() {
        try (var input = AdmonitionHeadProcessor.class
            .getResourceAsStream("/static/admonition.css")) {
            if (input == null) {
                throw new IllegalStateException("Missing bundled admonition stylesheet");
            }
            return new String(input.readAllBytes(), StandardCharsets.UTF_8);
        } catch (IOException error) {
            throw new IllegalStateException("Failed to read bundled admonition stylesheet", error);
        }
    }
}
