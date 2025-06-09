import React, { useEffect, useRef, useState } from "react";
import { Box, Card, CardHeader, CardContent, Typography, IconButton, Tooltip } from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { DataSet, Network } from "vis-network/standalone/esm/vis-network";

const CARD_WIDTH = 200;
const CARD_HEIGHT = 120;

const nodesData = [
  { id: 1, label: "Node 1", title: "Node 1", content: "card content area" },
  { id: 2, label: "Node 2", title: "Node 2", content: "card content area" },
  { id: 3, label: "Node 3", title: "Node 3", content: "card content area" },
  { id: 4, label: "Node 4", title: "Node 4", content: "card content area" },
  { id: 5, label: "Node 5", title: "Node 5", content: "card content area" }
];

const edgesData = [
  { from: 1, to: 2 },
  { from: 4, to: 5 },
  { from: 1, to: 3 }
];

const VisNetworkCmp = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [positions, setPositions] = useState<{ [id: string]: { x: number; y: number } }>({});
  const [hoveredNodeId, setHoveredNodeId] = useState<number | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const nodes = new DataSet(nodesData);
    const edges = new DataSet(edgesData);

    const network = new Network(containerRef.current, { nodes, edges }, {
      physics: { enabled: true, stabilization: false },
      nodes: {
        shape: "box",
        widthConstraint: CARD_WIDTH,
        heightConstraint: CARD_HEIGHT,
        color: "rgba(0,0,0,0)",
        borderWidth: 0,
        label: ""
      },
      edges: {
        color: "#90caf9",
        width: 3,
        arrows: { to: { enabled: true, scaleFactor: 0.7 } }
      },
      interaction: { hover: true, dragNodes: true, selectable: true }
    });

    // Update positions on stabilization and drag events
    const updatePositions = () => {
      const newPositions: { [id: string]: { x: number; y: number } } = {};
      nodesData.forEach(node => {
        const pos = network.getPositions([node.id])[node.id];
        if (pos) newPositions[node.id] = pos;
      });
      setPositions(newPositions);
    };

    network.on("afterDrawing", updatePositions);
    network.on("dragEnd", updatePositions);
    network.on("stabilized", updatePositions);
    network.on("zoom", updatePositions);
    network.on("startStabilizing", updatePositions);

    // Highlight logic
    network.on("hoverNode", params => setHoveredNodeId(params.node));
    network.on("blurNode", () => setHoveredNodeId(null));

    // Initial positions
    setTimeout(updatePositions, 500);

    return () => {
      network.destroy();
    };
  }, []);

  // Highlight connected nodes
  const getConnectedNodeIds = (nodeId: number) => {
    const connected = new Set<number>();
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
    </Box>
  );
};

export default VisNetworkCmp;