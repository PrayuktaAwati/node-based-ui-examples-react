import ReactFlow, { Background, Controls } from 'reactflow';
import 'reactflow/dist/style.css';
import CustomBidirectionalEdge from './CustomBidirectionalEdge';

const nodeStyle = {
  border: '1px solid #ccc',
  padding: 10,
  borderRadius: 6,
//   background: '#fff',
};

const nodes = [
  { id: 'A', position: { x: 100, y: 100 }, data: { label: 'Node A' }, type: 'default', style: nodeStyle },
  { id: 'B', position: { x: 400, y: 100 }, data: { label: 'Node B' }, type: 'default', style: nodeStyle },
];

const edges = [
  {
    id: 'A-B',
    source: 'A',
    target: 'B',
    type: 'customBidirectional',
    data: {
      fromTo: 'A → B',
      toFrom: 'B → A',
    },
  },
];

const edgeTypes = {
  customBidirectional: CustomBidirectionalEdge,
};

export default function BidirectionalFlow() {
  return (
    <div style={{ width: '1000px', height: '800px' }}>
      <ReactFlow nodes={nodes} edges={edges} edgeTypes={edgeTypes}>
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
}
