import { useState, useCallback, useMemo } from "react";
import {
	Box,
	Card,
	CardHeader,
	CardContent,
	Typography,
	IconButton,
	Tooltip
} from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import ReactFlow, {
	type Node,
	type Edge,
	Background,
	Controls,
	useNodesState,
	useEdgesState,
	type Connection,
	addEdge,
	type NodeProps,
	Handle,
	Position,
	getConnectedEdges
} from "reactflow";
import "reactflow/dist/style.css";

const CustomNode = ({
	data,
	id
}: NodeProps<{ title: string; content: string; setHoveredNodeId: (id: string | null) => void }>) => {
	const handleCopy = () => {
		navigator.clipboard.writeText(data.title);
	};

	const handleMouseEnter = () => data.setHoveredNodeId(id);
	const handleMouseLeave = () => data.setHoveredNodeId(null);

	return (
		<div onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
			<Card sx={{ width: 200 }}>
				<CardHeader
					title={data.title}
					subheader="Subheader text"
					action={
						<Tooltip title="Copy title">
							<IconButton onClick={handleCopy}>
								<ContentCopyIcon />
							</IconButton>
						</Tooltip>
					}
				/>
				<CardContent>
					<Typography variant="body2" color="text.secondary">
						{data.content}
					</Typography>
				</CardContent>
			</Card>
			<Handle type="source" position={Position.Bottom} />
			<Handle type="target" position={Position.Top} />
		</div>
	);
};

const nodeTypes = {
	customNode: CustomNode
};

const initialNodes: Array<Node> = [
	{ id: "1", data: { title: "Node 1", content: "card content area" }, position: { x: 100, y: 10 }, type: "customNode" },
	{ id: "2", data: { title: "Node 2", content: "card content area" }, position: { x: 10, y: 200 }, type: "customNode" },
	{ id: "3", data: { title: "Node 3", content: "card content area" }, position: { x: 300, y: 300 }, type: "customNode" },
	{ id: "4", data: { title: "Node 4", content: "card content area" }, position: { x: 500, y: 100 }, type: "customNode" },
	{ id: "5", data: { title: "Node 5", content: "card content area" }, position: { x: 800, y: 300 }, type: "customNode" }
];

const initialEdges: Array<Edge> = [
	{ id: "1-2", source: "1", target: "2", animated: true },
	{ id: "4-5", source: "4", target: "5", animated: true },
	{ id: "1-3", source: "1", target: "3", animated: true }
];

const ReactFlowImpl = () => {
	const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
	const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
	const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);

	const highlightedElements = useMemo(() => {
		if (!hoveredNodeId) return { nodes: [], edges: [] };

		const hoveredNode = nodes.find((n) => n.id === hoveredNodeId);
		if (!hoveredNode) return { nodes: [], edges: [] };

		const connectedEdges = getConnectedEdges([hoveredNode], edges);
		const connectedNodeIds = new Set(
			connectedEdges.flatMap((edge) => [edge.source, edge.target])
		);

		return {
			nodes: nodes.filter((n) => connectedNodeIds.has(n.id)),
			edges: connectedEdges
		};
	}, [hoveredNodeId, nodes, edges]);

	const nodeStyle = (node) => {
		const isHovered = highlightedElements.nodes.length > 0;
		const isHighlighted = highlightedElements.nodes.find((n) => n?.id === node.id);
		return {
			...node.style,
			opacity: !isHovered || isHighlighted ? 1 : 0.3,
			filter: !isHovered || isHighlighted ? "none" : "blur(2px)",
			transition: "all 0.3s ease",
		};
	};

	const edgeStyle = (edge) => {
		const isHovered = highlightedElements.edges.length > 0;
		const isHighlighted = highlightedElements.edges.find((e) => e?.id === edge.id);
		return {
			...edge.style,
			stroke: isHighlighted ? "red" : "#999",
			opacity: !isHovered || isHighlighted ? 1 : 0.2,
			filter: !isHovered || isHighlighted ? "none" : "blur(1.5px)",
			transition: "all 0.3s ease",
		};
	};

	const onConnect = useCallback(
		(connection: Connection) => {
			const edge = {
				...connection,
				animated: true,
				id: `${edges.length + 1}`
			};
			setEdges((prevEdges) => addEdge(edge, prevEdges));
		},
		[edges, setEdges]
	);

	return (
		<Box
			sx={{
				width: "1000px",
				height: "600px",
				backgroundColor: "#ffffff",
				border: "1px solid #ddd"
			}}
		>
			<ReactFlow
				nodes={nodes.map((node) => ({
					...node,
					data: {
						...node.data,
						setHoveredNodeId
					},
					style: nodeStyle(node)
				}))}
				edges={edges.map((edge) => ({
					...edge,
					style: edgeStyle(edge)
				}))}
				onNodesChange={onNodesChange}
				onEdgesChange={onEdgesChange}
				onConnect={onConnect}
				nodeTypes={nodeTypes}
				fitView
			>
				<Background />
				<Controls />
			</ReactFlow>
		</Box>
	);
};

export default ReactFlowImpl;
