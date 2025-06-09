// ReactForce2DCmp.tsx
import { useEffect, useRef, useState } from 'react';
import ForceGraph2D, { type ForceGraphMethods } from 'react-force-graph-2d';
import CustomMuiCardNode from "./CostomMuiCardNode";
import html2canvas from 'html2canvas';
import { createRoot } from 'react-dom/client';
import * as d3 from 'd3';

const ReactForce2DCmp = () => {
	const [nodeImages, setNodeImages] = useState<Record<string, HTMLImageElement>>({});
	const graphRef = useRef<ForceGraphMethods | null>(null);

	const nodes = [
		{ id: 'id1', label: 'Node 1', name: 'Primary 1' },
		{ id: 'id2', label: 'Node 2', name: 'Primary 2' },
	];

	// Create images of nodes by rendering React components to canvas
	useEffect(() => {
		const loadNodeImages = async () => {
			const container = document.createElement('div');
			container.style.position = 'absolute';
			container.style.top = '-1000px';
			container.style.left = '-1000px';
			container.style.width = 'auto'; // Allow layout
			container.style.height = 'auto';
			container.style.zIndex = '-1';
			document.body.appendChild(container);

			const images: Record<string, HTMLImageElement> = {};

			for (const node of nodes) {
				const nodeDiv = document.createElement('div');
				nodeDiv.style.width = '400px';
				nodeDiv.style.height = '100px';
				container.appendChild(nodeDiv);

				const root = createRoot(nodeDiv);
				root.render(<CustomMuiCardNode title={node.label} subheader={node.name} />);

				// Wait for layout
				await new Promise(resolve => setTimeout(resolve, 150));

				const canvas = await html2canvas(nodeDiv, {
					backgroundColor: null,
					useCORS: true,
				});

				const img = new Image();
				img.src = canvas.toDataURL();
				images[node.id] = img;

				container.removeChild(nodeDiv);
			}

			document.body.removeChild(container);
			setNodeImages(images);
		};

		loadNodeImages();
	}, []);

	useEffect(() => {
		if (!graphRef.current) return;

		// Add custom collision force to prevent overlaps
		graphRef.current.d3Force('collision', d3.forceCollide((node: any) => {
			const padding = 40;
			const width = node.width || 400;
			const height = node.height || 100;
			const radius = Math.sqrt((width / 2) ** 2 + (height / 2) ** 2);
			return radius + padding;
		}));
	}, [nodeImages]);

	return (
		<div>
			<ForceGraph2D
				ref={graphRef}
				graphData={{
					nodes,
					links: [
						{ source: 'id1', target: 'id2' },
						{ source: 'id2', target: 'id1' },
					],
				}}
				linkDirectionalArrowLength={12}
				linkDirectionalArrowRelPos={() => 0.6}
				linkColor={() => "#999"}
				nodeRelSize={8} // optional size scaler
				cooldownTicks={Infinity}
				onEngineStop={() => {
					if (graphRef.current) {
						graphRef.current.zoomToFit(500, 100); // Smooth zoom with padding & duration
					}
				}}
				nodeCanvasObject={(node: any, ctx, globalScale) => {
					const img = nodeImages[node.id];
					if (img) {
						const width = 200;
						const height = 100;
						ctx.drawImage(img, node.x - width / 2, node.y - height / 2, width, height);
					}
				}}
				nodePointerAreaPaint={(node, color, ctx) => {
					const width = 200;
					const height = 100;
					ctx.fillStyle = color;
					ctx.fillRect(node.x - width / 2, node.y - height / 2, width, height);
				}}
			/>
		</div>
	);
};

export default ReactForce2DCmp;
