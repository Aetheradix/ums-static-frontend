import 'primereact/resources/primereact.min.css';
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import { Tree } from 'primereact/tree';
import { useEffect, useState } from 'react';
import { ToastService } from 'services';
import { Button } from 'shared/components/buttons';
import { DropDownList, TextBox } from 'shared/components/forms';
import { FormCard, FormPage, FormPopup } from 'shared/new-components';
import { learningUrls } from '../../urls';

const BCA_NODES = [
  {
    key: '0',
    label: 'BCA Semester 1',
    icon: 'pi pi-folder',
    expanded: true,
    children: [
      {
        key: '0-0',
        label: 'Module 1 : Programming Basics',
        icon: 'pi pi-file',
      },
      { key: '0-1', label: 'Module 2 : DBMS', icon: 'pi pi-file' },
      { key: '0-2', label: 'Module 3 : Networking', icon: 'pi pi-file' },
    ],
  },
];

const BBA_NODES = [
  {
    key: '0',
    label: 'BBA Semester 1',
    icon: 'pi pi-folder',
    expanded: true,
    children: [
      { key: '0-0', label: 'Module 1 : Finance', icon: 'pi pi-file' },
      { key: '0-1', label: 'Module 2 : Operations', icon: 'pi pi-file' },
      { key: '0-2', label: 'Module 3 : Management', icon: 'pi pi-file' },
    ],
  },
];

export default function CourseStructureMapping() {
  const [selectedCourse, setSelectedCourse] = useState<any>(null);
  const [nodes, setNodes] = useState<any[]>([]);
  const [popup, setPopup] = useState<{
    visible: boolean;
    mode: 'add' | 'edit';
    targetKey?: string;
    label?: string;
  }>({ visible: false, mode: 'add' });

  useEffect(() => {
    if (selectedCourse === 'BBA_SEM1') {
      setNodes(JSON.parse(JSON.stringify(BBA_NODES))); // Deep copy for editability
    } else if (selectedCourse === 'BCA_SEM1') {
      setNodes(JSON.parse(JSON.stringify(BCA_NODES)));
    } else {
      setNodes([]);
    }
  }, [selectedCourse]);

  const handleSave = () => {
    ToastService.success('Course structure saved successfully');
  };

  const nodeTemplate = (node: any) => {
    return (
      <div className="flex items-center justify-between w-full pr-4 group">
        <span>{node.label}</span>
        <div className="opacity-0 group-hover:opacity-100 flex gap-2 transition-opacity ml-4">
          <button
            className="text-blue-500 hover:text-blue-700 p-1"
            onClick={e => {
              e.stopPropagation();
              setPopup({
                visible: true,
                mode: 'edit',
                targetKey: node.key,
                label: node.label,
              });
            }}
            title="Edit Node"
          >
            <i className="pi pi-pencil text-sm" />
          </button>
          <button
            className="text-green-500 hover:text-green-700 p-1"
            onClick={e => {
              e.stopPropagation();
              setPopup({
                visible: true,
                mode: 'add',
                targetKey: node.key,
                label: '',
              });
            }}
            title="Add Child Node"
          >
            <i className="pi pi-plus text-sm" />
          </button>
          <button
            className="text-red-500 hover:text-red-700 p-1"
            onClick={e => {
              e.stopPropagation();
              // Recursive delete logic
              const deleteNode = (nodesList: any[]) => {
                return nodesList
                  .filter(n => n.key !== node.key)
                  .map(n => {
                    if (n.children) {
                      n.children = deleteNode(n.children);
                    }
                    return n;
                  });
              };
              setNodes(deleteNode([...nodes]));
              ToastService.success('Node deleted');
            }}
            title="Delete Node"
          >
            <i className="pi pi-trash text-sm" />
          </button>
        </div>
      </div>
    );
  };

  const handlePopupSave = () => {
    if (!popup.label) {
      ToastService.error('Label is required');
      return;
    }

    const newNodes = [...nodes];

    const updateNodes = (nodesList: any[]) => {
      for (let i = 0; i < nodesList.length; i++) {
        if (nodesList[i].key === popup.targetKey) {
          if (popup.mode === 'edit') {
            nodesList[i].label = popup.label;
          } else {
            if (!nodesList[i].children) nodesList[i].children = [];
            nodesList[i].children.push({
              key: popup.targetKey + '-' + nodesList[i].children.length,
              label: popup.label,
              icon: 'pi pi-file',
              expanded: true,
            });
            nodesList[i].expanded = true;
          }
          return true;
        }
        if (nodesList[i].children && updateNodes(nodesList[i].children)) {
          return true;
        }
      }
      return false;
    };
    updateNodes(newNodes);
    setNodes(newNodes);
    setPopup({ visible: false, mode: 'add' });
    ToastService.success(
      `Node ${popup.mode === 'edit' ? 'updated' : 'added'} successfully`
    );
  };

  return (
    <FormPage
      title="Course Structure Mapping"
      description="Map modules and topics to a specific course."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Learning Management System', to: learningUrls.portal },
        { label: 'Edit Node' },
      ]}
    >
      <div className="flex flex-col gap-4">
        <FormCard title="Select Course">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-1">
              <DropDownList
                label="Course"
                textField="label"
                data={[
                  { label: 'BCA Semester 1', value: 'BCA_SEM1' },
                  { label: 'BBA Semester 1', value: 'BBA_SEM1' },
                ]}
                value={selectedCourse}
                onChange={val => setSelectedCourse(val)}
                required
              />
            </div>
          </div>
        </FormCard>

        {selectedCourse && nodes.length > 0 && (
          <FormCard title="Structure Preview (Drag & Drop)" className="flex-1">
            <div className="mb-2 text-sm text-gray-500 flex justify-between items-center">
              <span>
                Hover over a node to add, edit, or delete items. You can drag
                and drop nodes to reorder.
              </span>
              <Button
                label="Add Root Node"
                size="small"
                variant="outlined"
                icon="plus"
                onClick={() => {
                  const newKey = nodes.length.toString();
                  setNodes([
                    ...nodes,
                    {
                      key: newKey,
                      label: 'New Root Node',
                      icon: 'pi pi-folder',
                      children: [],
                      expanded: true,
                    },
                  ]);
                }}
              />
            </div>
            <div className="p-4 border rounded bg-white">
              <Tree
                value={nodes}
                dragdropScope="demo"
                onDragDrop={e => setNodes(e.value)}
                nodeTemplate={nodeTemplate}
                className="w-full border-none p-0"
              />
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <Button
                label="Save Structure"
                variant="primary"
                onClick={handleSave}
              />
            </div>
          </FormCard>
        )}
      </div>

      <FormPopup
        visible={popup.visible}
        onHide={() => setPopup({ visible: false, mode: 'add' })}
        title={popup.mode === 'edit' ? 'Edit Node' : 'Add Child Node'}
        size="default"
      >
        <div className="flex flex-col gap-4">
          <TextBox
            label="Node Name"
            value={popup.label || ''}
            onChange={val => setPopup({ ...popup, label: val })}
            required
          />
        </div>
        <div className="flex justify-end gap-2 mt-4">
          <Button
            label="Cancel"
            variant="outlined"
            onClick={() => setPopup({ visible: false, mode: 'add' })}
          />
          <Button label="Save" variant="primary" onClick={handlePopupSave} />
        </div>
      </FormPopup>
    </FormPage>
  );
}
