// CustomBidirectionalEdge.tsx
import { BaseEdge, getBezierPath } from 'reactflow';

import type { EdgeProps } from 'reactflow';

type CustomBidirectionalEdgeData = {
	fromTo?: string;
	toFrom?: string;
};

const CustomBidirectionalEdge = ({
	id,
	sourceX,
	sourceY,
	targetX,
	targetY,
	data,
}: EdgeProps<CustomBidirectionalEdgeData>) => {
	const [edgePath, labelX, labelY] = getBezierPath({
		sourceX,
		sourceY,
		targetX,
		targetY,
	});

	return (
		<>
			<BaseEdge id={id} path={edgePath} />
			<foreignObject
				width={100}
				height={40}
				x={labelX - 50}
				y={labelY - 30}
				requiredExtensions="http://www.w3.org/1999/xhtml"
				style={{ overflow: 'visible' }}
			>
				<div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
					<div style={{ fontSize: 10, padding: '2px 4px', borderRadius: 4 }}>
						{data?.fromTo}
					</div>
					<div style={{ fontSize: 10, padding: '2px 4px', borderRadius: 4 }}>
						{data?.toFrom}
					</div>
				</div>
			</foreignObject>
		</>
	);
}

export default CustomBidirectionalEdge;