import React, { useEffect, useRef, useState } from "react";
import { Box, Card, CardHeader, CardContent, Typography, IconButton, Tooltip } from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import Viva from "vivagraphjs";

const CARD_WIDTH = 200;
const CARD_HEIGHT = 120;

const nodesData = [
  { id: "1", title: "Node 1", content: "card content area" },
  { id: "2", title: "Node 2", content: "card content area" },
  { id: "3", title: "Node 3", content: "card content area" },
  { id: "4", title: "Node 4", content: "card content area" },
  { id: "5", title: "Node 5", content: "card content area" }
];

const edgesData = [
  { from: "1", to: "2", label: "Connection 1-2" },
  { from: "4", to: "5", label: "Connection 4-5" },
  { from: "1", to: "3", label: "Connection 1-3" }
];

const VivaGraphCmp = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [positions, setPositions] = useState<{ [id: string]: { x: number; y: number } }>({});
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // 1. Create graph
    const graph = Viva.Graph.graph();

    nodesData.forEach(node => graph.addNode(node.id, node));
    edgesData.forEach(edge => graph.addLink(edge.from, edge.to, { label: edge.label }));

    // 2. Create layout and keep a reference
    const layout = Viva.Graph.Layout.forceDirected(graph, {
      springLength: 180,
      springCoeff: 0.0008,
      dragCoeff: 0.02,
      gravity: -1.2
    });

    // 3. Renderer
    const graphics = Viva.Graph.View.webglGraphics();
    const renderer = Viva.Graph.View.renderer(graph, {
      container: containerRef.current,
      graphics,
      renderLinks: true,
      layout
    });

    renderer.run();

    // 4. Track node positions using the layout reference
    let animationFrame: number;
    const updatePositions = () => {
      const newPositions: { [id: string]: { x: number; y: number } } = {};
      graph.forEachNode(node => {
        const pos = layout.getNodePosition(node.id);
        newPositions[node.id] = { x: pos.x + 500, y: pos.y + 300 }; // Centering
      });
      setPositions(newPositions);
      animationFrame = requestAnimationFrame(updatePositions);
    };
    updatePositions();

    // 5. Mouse events for highlight (optional, see previous code for overlay logic)
    graphics.node((node) => {
      const ui = Viva.Graph.View.webglSquare(0); // Invisible node
      ui.nodeId = node.id;
      return ui;
    });

    // These events only work for custom graphics, so overlays will not get mouse events.
    // You can implement highlight logic if needed.

    return () => {
      renderer.dispose();
      cancelAnimationFrame(animationFrame);
    };
  }, []);

  // Highlight logic
  const getConnectedNodeIds = (nodeId: string) => {
    const connected = new Set<string>();
    edgesData.forEach(edge => {
      if (edge.from === nodeId) connected.add(edge.to);
      if (edge.to === nodeId) connected.add(edge.from);
    });
    connected.add(nodeId);
    return connected;
  };
  const highlightedNodeIds = hoveredNodeId ? getConnectedNodeIds(hoveredNodeId) : null;

  return (
    <Box sx={{ position: "relative", width: 1000, height: 600, background: "#fff", border: "1px solid #ddd" }}>
      <div ref={containerRef} style={{ width: 1000, height: 600 }} />
      {nodesData.map(node => {
        const pos = positions[node.id];
        if (!pos) return null;
        const isHighlighted = !highlightedNodeIds || highlightedNodeIds.has(node.id);
        return (
          <div
            key={node.id}
            style={{
              position: "absolute",
              left: pos.x - CARD_WIDTH / 2,
              top: pos.y - CARD_HEIGHT / 2,
              width: CARD_WIDTH,
              height: CARD_HEIGHT,
              pointerEvents: "none",
              opacity: isHighlighted ? 1 : 0.3,
              filter: isHighlighted ? "none" : "blur(2px)",
              transition: "all 0.3s ease"
            }}
          >
            <Card sx={{ width: CARD_WIDTH, height: CARD_HEIGHT }}>
              <CardHeader
                title={node.title}
                subheader="Subheader text"
                action={
                  <Tooltip title="Copy title">
                    <IconButton
                      style={{ pointerEvents: "auto" }}
                      onClick={() => navigator.clipboard.writeText(node.title)}
                    >
                      <ContentCopyIcon />
                    </IconButton>
                  </Tooltip>
                }
              />
              <CardContent>
                <Typography variant="body2" color="text.secondary">
                  {node.content}
                </Typography>
              </CardContent>
            </Card>
          </div>
        );
      })}
      {/* Edge labels as overlays */}
      {edgesData.map(edge => {
        const from = positions[edge.from];
        const to = positions[edge.to];
        if (!from || !to) return null;
        return (
          <div
            key={edge.label}
            style={{
              position: "absolute",
              left: (from.x + to.x) / 2 - 50,
              top: (from.y + to.y) / 2 - 10,
              width: 100,
              textAlign: "center",
              pointerEvents: "none",
              color: "#1976d2",
              fontWeight: 500,
              background: "rgba(255,255,255,0.8)",
              borderRadius: 4,
              fontSize: 14
            }}
          >
            {edge.label}
          </div>
        );
      })}
    </Box>
  );
};

export default VivaGraphCmp;