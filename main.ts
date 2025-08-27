import type { PluginCreator } from "npm:postcss";

type pluginOptions = {
  parentSelector: string;
};

export const postcssNestingWrapper: PluginCreator<pluginOptions> = (
  { parentSelector } = { parentSelector: "" },
) => ({
  postcssPlugin: "postcss-nesting-wrapper",
  Once(root, { rule }) {
    if (root.nodes.length === 0) {
      return;
    }

    const parentRule = rule({ selector: parentSelector.trim() });

    // Separate layer nodes from other nodes
    const childNodes = [...root.nodes];
    const layerNodes = childNodes.filter(
      (node) => node.type === "atrule" && node.name === "layer",
    );
    const nonLayerNodes = childNodes.filter(
      (node) => !(node.type === "atrule" && node.name === "layer"),
    );

    const hasIdenticalSelector = nonLayerNodes.some(
      (node) => node.type === "rule" && node.selector === parentSelector,
    );

    root.removeAll();

    if (hasIdenticalSelector) {
      root.append(...childNodes);
    } else {
      // Add non-layer nodes to the parent rule
      if (nonLayerNodes.length > 0) {
        parentRule.append(...nonLayerNodes);
        root.append(parentRule);
      }

      // Add layer nodes back to root (unwrapped)
      if (layerNodes.length > 0) {
        root.append(...layerNodes);
      }
    }
  },
});

postcssNestingWrapper.postcss = true;
