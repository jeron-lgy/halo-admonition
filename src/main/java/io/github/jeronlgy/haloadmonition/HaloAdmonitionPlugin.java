package io.github.jeronlgy.haloadmonition;

import org.springframework.stereotype.Component;
import run.halo.app.plugin.BasePlugin;
import run.halo.app.plugin.PluginContext;

@Component
public class HaloAdmonitionPlugin extends BasePlugin {

    public HaloAdmonitionPlugin(PluginContext pluginContext) {
        super(pluginContext);
    }
}
