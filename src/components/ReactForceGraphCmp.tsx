import ForceGraph2D from 'react-force-graph-2d';

const GRAPH_DATA = {
	nodes: [
		{ id: 'id1', label: 'Node 1', name: 'Primary 1' },
		{ id: 'id2', label: 'Node 2', name: 'Primary 2' },
	],
	links: [
		{ source: 'id1', target: 'id2' },
		{ source: 'id2', target: 'id1' },
	],
};

interface GraphNode {
	id: string;
	label: string;
	name: string;
	x?: number;
	y?: number;
}

type DrawCardNode = (
	node: GraphNode,
	ctx: CanvasRenderingContext2D,
	globalScale: number
) => void;

const drawCardNode: DrawCardNode = (node, ctx, globalScale) => {
	const fontSize = 12 / globalScale;
	const icon = '👤'; // Or any emoji/symbol
	const cardWidth = 50;
	const cardHeight = 20;

	// Draw card background
	ctx.fillStyle = '#ffffff';
	ctx.strokeStyle = '#000';
	ctx.lineWidth = 1;
	ctx.beginPath();
	ctx.rect(node.x! - cardWidth / 2, node.y! - cardHeight / 2, cardWidth, cardHeight);
	ctx.fill();
	ctx.stroke();

	// Icon
	ctx.font = `${fontSize * 1.5}px Sans-Serif`;
	ctx.textAlign = 'left';
	ctx.textBaseline = 'middle';
	ctx.fillStyle = '#333';
	ctx.fillText(icon, node.x! - cardWidth / 2 + 8, node.y! - 10);

	// Primary text (name)
	ctx.font = `${fontSize}px Sans-Serif`;
	ctx.fillStyle = '#000';
	ctx.fillText(node.name, node.x! - cardWidth / 2 + 30, node.y! - 10);

	// Secondary text (label)
	ctx.fillStyle = '#666';
	ctx.fillText(node.label, node.x! - cardWidth / 2 + 30, node.y! + 10);
};

const ReactForceGraphCmp = () => {
	return (
		<ForceGraph2D
			graphData={GRAPH_DATA}
			nodeCanvasObject={drawCardNode}
			nodePointerAreaPaint={(node, color, ctx) => {
				const cardWidth = 50;
				const cardHeight = 20;
				ctx.fillStyle = color;
				ctx.fillRect(node.x - cardWidth / 2, node.y - cardHeight / 2, cardWidth, cardHeight);
			}}
			linkColor={() => 'white'} // <-- Edge color set to white here
		/>
	);
};

export default ReactForceGraphCmp;
