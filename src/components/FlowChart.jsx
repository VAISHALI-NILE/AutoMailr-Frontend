import React, { useState, useCallback, useEffect } from "react";
import ReactFlow, {
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  ReactFlowProvider,
} from "reactflow";
import "reactflow/dist/style.css";
import "./FlowChart.css";

import WaitDialog from "./WaitDialog";
import ColdEmailModal from "./ColdEmailModel";
import ListSelectionModal from "./ListSelectionModel";
import axios from "axios";
import EmailSenderModal from "./EmailSenderModal";

const initialNodes = [
  {
    id: "1",
    position: { x: 400, y: 50 },
    data: { label: "+ Add Lead Source" },
    type: "default",
  },
  {
    id: "2",
    position: { x: 400, y: 150 },
    data: { label: "Sequence Start" },
    type: "default",
  },
  {
    id: "add-btn",
    position: { x: 400, y: 200 },
    data: { label: "+" },
    type: "default",
  },
];

const initialEdges = [];

const FlowChartComponent = () => {
  const [nodes, setNodes] = useNodesState(initialNodes);
  const [edges, setEdges] = useEdgesState(initialEdges);
  const [showLeadDialog, setShowLeadDialog] = useState(false);
  const [showTaskDialog, setShowTaskDialog] = useState(false);
  const [lastNodeId, setLastNodeId] = useState(2);
  const [showMailDialog, setMailDialog] = useState(false);
  const [showWaitDialog, setWaitDialog] = useState(false);
  const [showListLeads, setListLeads] = useState(false);
  const [leadList, setLeadList] = useState([]);
  const [leadEmail, setLeadEmail] = useState([]);
  const [emailSenderModel, setEmailSenderModel] = useState(false);

  const onNodeClick = useCallback((event, node) => {
    if (node.id === "1") {
      setShowLeadDialog(true);
    } else if (node.id === "add-btn") {
      setShowTaskDialog(true);
    }
  }, []);

  const [savedSequences, setSavedSequences] = useState([]);

  useEffect(() => {
    const fetchSequences = async () => {
      try {
        const response = await axios.get("http://localhost:5000/sequences");
        setSavedSequences(response.data);
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching sequences:", error);
      }
    };

    fetchSequences();
  }, []);

  const handleSelectLeadSource = (source, leads) => {
    console.log("Selected Source:", source);
    console.log("Leads:", leads);

    setNodes((prevNodes) =>
      prevNodes.map((node) =>
        node.id === "1" ? { ...node, data: { label: source } } : node
      )
    );

    setLeadList(source);
    setLeadEmail(leads);
    setShowLeadDialog(false);

    setEdges((prevEdges) => {
      const edgeExists = prevEdges.some(
        (edge) => edge.source === "1" && edge.target === "2"
      );

      if (!edgeExists) {
        return [
          ...prevEdges,
          {
            id: `e1-2`,
            source: "1",
            target: "2",
            animated: true,
            type: "smoothstep",
          },
        ];
      }
      return prevEdges;
    });
  };

  const handleAddTaskNode = (taskType, nodeData = {}) => {
    const newId = (lastNodeId + 1).toString();
    let newTaskNode;

    if (taskType === "email") {
      newTaskNode = {
        id: newId,
        type: "email",
        position: { x: 400, y: nodes[nodes.length - 1].position.y + 50 },
        data: {
          label: `cold Mail-${nodeData.name}`,
          emailSubject: nodeData.subject || "Default Subject",
          emailBody: nodeData.content || "Default Email Body",
        },
      };
    } else if (taskType === "wait") {
      newTaskNode = {
        id: newId,
        type: "wait",
        position: { x: 400, y: nodes[nodes.length - 1].position.y + 50 },
        data: {
          label: `Wait ${nodeData.waitTime || 0} ${nodeData.waitType || null}`,
          waitTime: nodeData.waitTime || 0,
          waitType: nodeData.waitType || "minutes",
        },
      };
    }

    const newAddButtonNode = {
      id: "add-btn",
      position: { x: 400, y: newTaskNode.position.y + 50 },
      data: { label: "+" },
      type: "default",
    };

    setNodes((nds) => [...nds.slice(0, -1), newTaskNode, newAddButtonNode]);
    setEdges((eds) => [
      ...eds,
      {
        id: `e${lastNodeId}-${newId}`,
        source: lastNodeId.toString(),
        target: newId,
        type: "smoothstep",
      },
    ]);
    setLastNodeId(Number(newId));
    setShowTaskDialog(false);
  };
  const loadSequence = (sequenceId) => {
    const sequence = savedSequences.find((seq) => seq._id === sequenceId);
    if (!sequence) return;

    // Ensure each node retains its data structure
    const formattedNodes = sequence.nodes.map((node) => ({
      ...node,
      data: {
        ...node.data,
        label:
          node.type === "email"
            ? `Cold Mail `
            : node.type === "wait"
            ? `Wait ${node.waitTime} ${node.waitType}`
            : node.data?.label || "Unnamed Node",
      },
    }));

    // Set the nodes and edges in state
    setNodes(formattedNodes);
    setEdges(sequence.edges);
    setLeadEmail(sequence.leadList || []);
  };

  const handleSaveSequence = async (
    sequenceName,
    senderEmail,
    senderPassword
  ) => {
    if (
      !sequenceName ||
      !senderEmail ||
      !senderPassword ||
      leadEmail.length === 0
    ) {
      alert("All fields are required, including the lead list!");
      return;
    }

    // Transform nodes into a structured format for MongoDB
    const formattedNodes = nodes.map((node) => ({
      id: node.id,
      type: node.type === "email" ? "email" : "wait",
      position: node.position,
      emailSubject: node.data?.emailSubject || "Default Subject",
      emailBody: node.data?.emailBody || "Default Email Body",
      waitTime: node.type === "wait" ? node.data?.waitTime || 0 : 0,
      waitType: node.type === "wait" ? node.data?.waitType || "minutes" : "",
    }));

    const sequenceData = {
      name: sequenceName,
      senderEmail,
      senderPassword,
      leadList: leadEmail, // List of lead emails
      nodes: formattedNodes, // Transformed nodes
      edges,
    };

    try {
      // Save sequence
      const response = await axios.post(
        "http://localhost:5000/sequences",
        sequenceData
      );
      console.log(response);
      const sequenceId = response.data.sequence._id; // Get the saved sequence ID

      alert(`Sequence saved successfully! ID: ${sequenceId}`);

      // Automatically schedule the sequence after saving
      await handleScheduleSequence(sequenceId);
    } catch (error) {
      console.error(
        "Error saving sequence:",
        error.response?.data || error.message
      );
      alert("Failed to save sequence. Please try again.");
    }

    setEmailSenderModel(false);
  };

  const onNodeContextMenu = (event, node) => {
    event.preventDefault(); // Prevents default right-click menu
    const confirmDelete = window.confirm(`Delete node ${node.id}?`);
    if (confirmDelete) {
      setNodes((nds) => nds.filter((n) => n.id !== node.id));
      setEdges((eds) =>
        eds.filter((edge) => edge.source !== node.id && edge.target !== node.id)
      );
    }
  };

  // Automatically schedules email after saving sequence
  const handleScheduleSequence = async (sequenceId) => {
    try {
      await axios.post("http://localhost:5000/schedule", { sequenceId });
      alert("Sequence scheduled successfully!");
    } catch (error) {
      console.error(
        "Error scheduling sequence:",
        error.response?.data || error.message
      );
      alert("Failed to schedule sequence.");
    }
  };

  return (
    <div className="flowchart-container">
      <div className="top-bar">
        <div className="save-btn">
          <button
            onClick={() => setEmailSenderModel(true)}
            className="save-btn"
          >
            Save Sequence
          </button>
        </div>
        <div className="sequence-dropdown">
          <select
            onChange={(e) => loadSequence(e.target.value)}
            defaultValue=""
          >
            <option value="" disabled>
              Select a sequence
            </option>
            {savedSequences.map((seq) => (
              <option key={seq._id} value={seq._id}>
                {seq.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodeClick={onNodeClick}
        onNodeContextMenu={onNodeContextMenu}
        fitView
      >
        <Controls />
        <Background variant="dots" gap={12} size={1} />
      </ReactFlow>

      {showLeadDialog && (
        <ListSelectionModal
          open={showLeadDialog}
          onClose={() => setShowLeadDialog(false)}
          onInsert={handleSelectLeadSource}
        />
      )}
      {showTaskDialog && (
        <div className="dialog">
          <p>Add Block</p>
          <button onClick={() => setMailDialog(true)}>Cold Mail</button>
          <button onClick={() => setWaitDialog(true)}>Wait/Delay</button>
        </div>
      )}
      {showMailDialog && (
        <ColdEmailModal
          onClose={() => setMailDialog(false)}
          onInsert={handleAddTaskNode}
        />
      )}
      {showWaitDialog && (
        <WaitDialog
          onClose={() => setWaitDialog(false)}
          onSave={handleAddTaskNode}
        />
      )}
      {emailSenderModel && (
        <EmailSenderModal
          open={emailSenderModel}
          handleClose={() => setEmailSenderModel(false)}
          handleSave={handleSaveSequence}
        />
      )}
    </div>
  );
};

const FlowChart = () => {
  return (
    <ReactFlowProvider>
      <FlowChartComponent />
    </ReactFlowProvider>
  );
};

export default FlowChart;
