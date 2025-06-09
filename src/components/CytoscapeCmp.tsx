import React, { useRef, useEffect, useState } from "react";
import CytoscapeComponent from "react-cytoscapejs";
import {
	Card,
	CardHeader,
	CardContent,
	Typography,
	IconButton,
	Tooltip,
	Box
} from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";

// Node and edge data, similar to your ReactFlowImpl
const elements = [
	{ data: { id: "1", title: "Node 1", content: "card content area" } },
	{ data: { id: "2", title: "Node 2", content: "card content area" } },
	{ data: { id: "3", title: "Node 3", content: "card content area" } },
	{ data: { id: "4", title: "Node 4", content: "card content area" } },
	{ data: { id: "5", title: "Node 5", content: "card content area" } },
	{ data: { source: "1", target: "2", id: "1-2" } },
	{ data: { source: "4", target: "5", id: "4-5" } },
	{ data: { source: "1", target: "3", id: "1-3" } }
];

const stylesheet = [
	{
		selector: "node",
		style: {
			"background-opacity": 0,
			"border-width": 0,
			"label": "",
			"width": 200,
			"height": 120,
			"shape": "roundrectangle"
		}
	},
	{
		selector: "edge",
		style: {
			"width": 3,
			"line-color": "#90caf9",
			"target-arrow-color": "#90caf9",
			"target-arrow-shape": "triangle"
		}
	}
];

const CARD_WIDTH = 200;
const CARD_HEIGHT = 120;

const CytoscapeCmp = () => {
	const cyRef = useRef<any>(null);
	const [positions, setPositions] = useState<{ [id: string]: { x: number; y: number } }>({});
	const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);

	// Update card positions on Cytoscape render
	useEffect(() => {
		const updatePositions = () => {
			if (cyRef.current) {
				const newPositions: { [id: string]: { x: number; y: number } } = {};
				cyRef.current.nodes().forEach((node: any) => {
					const pos = node.renderedPosition();
					newPositions[node.id()] = pos;
				});
				setPositions(newPositions);
			}
		};
		if (cyRef.current) {
			cyRef.current.on("render zoom pan", updatePositions);
			updatePositions();
		}
		return () => {
			if (cyRef.current) {
				cyRef.current.removeListener("render zoom pan", updatePositions);
			}
		};
	}, []);

	// Highlight logic
	const getConnectedNodeIds = (nodeId: string) => {
		const connectedIds = new Set<string>();
		elements.forEach(el => {
			if (el.data.source === nodeId) connectedIds.add(el.data.target);
			if (el.data.target === nodeId) connectedIds.add(el.data.source);
		});
		connectedIds.add(nodeId);
		return connectedIds;
	};

	const highlightedNodeIds = hoveredNodeId ? getConnectedNodeIds(hoveredNodeId) : null;

	return (
		<Box sx={{ position: "relative", width: 1000, height: 600, background: "#fff", border: "1px solid #ddd" }}>
			<CytoscapeComponent
				elements={elements}
				style={{ width: 1000, height: 600 }}
				cy={cy => (cyRef.current = cy)}
				stylesheet={stylesheet}
				layout={{ name: "cose" }}
			/>
			{elements
				.filter(el => el.data && el.data.id)
				.map(el => {
					const id = el.data.id;
					const pos = positions[id];
					if (!pos) return null;
					const isHighlighted = !highlightedNodeIds || highlightedNodeIds.has(id);
					return (
						<div
							key={id}
							style={{
								position: "absolute",
								left: pos.x - CARD_WIDTH / 2,
								top: pos.y - CARD_HEIGHT / 2,
								width: CARD_WIDTH,
								height: CARD_HEIGHT,
								pointerEvents: "none", // Let mouse events pass through
								opacity: isHighlighted ? 1 : 0.3,
								filter: isHighlighted ? "none" : "blur(2px)",
								transition: "all 0.3s ease"
							}}
						>
							<Card sx={{ width: CARD_WIDTH, height: CARD_HEIGHT }}>
								<CardHeader
									title={el.data.title}
									subheader="Subheader text"
									action={
										<Tooltip title="Copy title">
											<IconButton
												style={{ pointerEvents: "auto" }} // Only button is clickable
												onClick={() => navigator.clipboard.writeText(el.data.title)}
											>
												<ContentCopyIcon />
											</IconButton>
										</Tooltip>
									}
								/>
								<CardContent>
									<Typography variant="body2" color="text.secondary">
										{el.data.content}
									</Typography>
								</CardContent>
							</Card>
						</div>
					);
				})}
		</Box>
	);
};

export default CytoscapeCmp;