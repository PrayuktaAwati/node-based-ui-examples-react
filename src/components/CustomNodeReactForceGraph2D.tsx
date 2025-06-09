import React from "react";
import type { FC } from "react";

export type CustomGraphNode = {
	id: string;
	name: string;
	icon: string;
	isGateway?: boolean;
	isListedDevice?: boolean;
	copyMacId: (id: string) => void;
};

const CustomNodeReactForceGraph2D: FC<{ node: CustomGraphNode }> = ({ node }) => {
	return (
		<div
			style={{
				background: "white",
				border: "1px solid #ccc",
				padding: "6px 12px",
				borderRadius: 8,
				textAlign: "center",
				cursor: "pointer",
				boxShadow: "0 0 8px rgba(0,0,0,0.1)",
			}}
			onClick={() => node.copyMacId(node.id)}
		>
			<img src={node.icon} alt={node.name} style={{ width: 24, height: 24 }} />
			<div>{node.name}</div>
		</div>
	);
};

export default CustomNodeReactForceGraph2D;
